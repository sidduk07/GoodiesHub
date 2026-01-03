import type { Express, Request, Response } from "express";
import { type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { hashPassword, comparePasswords, requireAuth, requireAdmin, optionalAuth } from "./auth";
import { uploadRouter } from "./upload";
import { notifyUsersAboutNewSwag } from "./email";
import { insertUserSchema, insertSwagSchema, updateSwagSchema, swagStatusEnum } from "@shared/schema";
import { z } from "zod";

// Create memory store for sessions
const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============================================
  // SESSION MIDDLEWARE
  // ============================================
  const isProduction = process.env.NODE_ENV === "production";
  const isLocalhost = !process.env.REPL_SLUG; // Not on Replit = localhost

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "swag-compass-secret-key-change-in-prod",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        // Only use secure cookies on actual HTTPS (not localhost)
        secure: isProduction && !isLocalhost,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        sameSite: "lax", // Prevent CSRF
      },
    })
  );

  // ============================================
  // UPLOAD ROUTES
  // ============================================
  app.use("/api/upload", requireAuth, uploadRouter);

  // ============================================
  // AUTH ROUTES
  // ============================================

  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
        return;
      }

      const { username, email, password } = parsed.data;

      // Check if user exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        res.status(409).json({ message: "Email already registered" });
        return;
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        res.status(409).json({ message: "Username already taken" });
        return;
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      // Set session
      req.session.userId = user.id;

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailNotifications: user.emailNotifications,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return;
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const valid = await comparePasswords(password, user.password);
      if (!valid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Set session
      req.session.userId = user.id;

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailNotifications: user.emailNotifications,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Logout failed" });
        return;
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailNotifications: user.emailNotifications,
    });
  });

  // ============================================
  // USER PREFERENCES ROUTES
  // ============================================

  app.get("/api/user/preferences", requireAuth, (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({
      emailNotifications: user.emailNotifications,
    });
  });

  app.put("/api/user/preferences", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { emailNotifications } = req.body;

      if (typeof emailNotifications !== "boolean") {
        res.status(400).json({ message: "emailNotifications must be a boolean" });
        return;
      }

      const updated = await storage.updateUserPreferences(user.id, emailNotifications);
      if (!updated) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({
        emailNotifications: updated.emailNotifications,
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // ============================================
  // PUBLIC SWAG ROUTES
  // ============================================

  // List published swag
  app.get("/api/swag", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getPublishedSwagItems();
      res.json(items);
    } catch (error) {
      console.error("Get swag error:", error);
      res.status(500).json({ message: "Failed to fetch swag items" });
    }
  });

  // Get single swag item (public for published, owner for pending)
  app.get("/api/swag/:id", optionalAuth, async (req: Request, res: Response) => {
    try {
      const item = await storage.getSwagItem(req.params.id);
      if (!item) {
        res.status(404).json({ message: "Swag item not found" });
        return;
      }

      const user = (req as any).user;

      // Only published items are public
      // Pending/rejected items only visible to owner or admin
      if (item.status !== "published") {
        if (!user) {
          res.status(404).json({ message: "Swag item not found" });
          return;
        }
        if (user.role !== "admin" && item.submittedBy !== user.id) {
          res.status(404).json({ message: "Swag item not found" });
          return;
        }
      }

      res.json(item);
    } catch (error) {
      console.error("Get swag item error:", error);
      res.status(500).json({ message: "Failed to fetch swag item" });
    }
  });

  // ============================================
  // AUTHENTICATED SWAG ROUTES
  // ============================================

  // Submit new swag
  app.post("/api/swag", requireAuth, async (req: Request, res: Response) => {
    try {
      const parsed = insertSwagSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
        return;
      }

      const user = (req as any).user;
      const item = await storage.createSwagItem(parsed.data, user.id);

      res.status(201).json(item);
    } catch (error) {
      console.error("Create swag error:", error);
      res.status(500).json({ message: "Failed to create swag item" });
    }
  });

  // Get user's submissions
  app.get("/api/swag/my-submissions", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const items = await storage.getSwagItemsByUser(user.id);
      res.json(items);
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // ============================================
  // ADMIN ROUTES
  // ============================================

  // Get all swag (admin)
  app.get("/api/admin/swag", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const items = await storage.getAllSwagItems();
      res.json(items);
    } catch (error) {
      console.error("Admin get swag error:", error);
      res.status(500).json({ message: "Failed to fetch swag items" });
    }
  });

  // Get swag by status (admin)
  app.get("/api/admin/swag/status/:status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const status = swagStatusEnum.safeParse(req.params.status);
      if (!status.success) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }

      const items = await storage.getSwagItemsByStatus(status.data);
      res.json(items);
    } catch (error) {
      console.error("Admin get swag by status error:", error);
      res.status(500).json({ message: "Failed to fetch swag items" });
    }
  });

  // Approve swag (admin)
  app.put("/api/admin/swag/:id/approve", requireAdmin, async (req: Request, res: Response) => {
    try {
      const admin = (req as any).user;
      const item = await storage.approveSwagItem(req.params.id, admin.id);

      if (!item) {
        res.status(404).json({ message: "Swag item not found" });
        return;
      }

      // Send email notifications to subscribed users
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      await notifyUsersAboutNewSwag(item, baseUrl);

      res.json(item);
    } catch (error) {
      console.error("Approve swag error:", error);
      res.status(500).json({ message: "Failed to approve swag item" });
    }
  });

  // Reject swag (admin)
  app.put("/api/admin/swag/:id/reject", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { reason } = req.body;

      if (!reason || typeof reason !== "string") {
        res.status(400).json({ message: "Rejection reason is required" });
        return;
      }

      const item = await storage.rejectSwagItem(req.params.id, reason);

      if (!item) {
        res.status(404).json({ message: "Swag item not found" });
        return;
      }

      res.json(item);
    } catch (error) {
      console.error("Reject swag error:", error);
      res.status(500).json({ message: "Failed to reject swag item" });
    }
  });

  // Edit swag (admin)
  app.put("/api/admin/swag/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const parsed = updateSwagSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
        return;
      }

      const item = await storage.updateSwagItem(req.params.id, parsed.data);

      if (!item) {
        res.status(404).json({ message: "Swag item not found" });
        return;
      }

      res.json(item);
    } catch (error) {
      console.error("Update swag error:", error);
      res.status(500).json({ message: "Failed to update swag item" });
    }
  });

  // Delete swag (admin)
  app.delete("/api/admin/swag/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteSwagItem(req.params.id);

      if (!deleted) {
        res.status(404).json({ message: "Swag item not found" });
        return;
      }

      res.json({ message: "Swag item deleted" });
    } catch (error) {
      console.error("Delete swag error:", error);
      res.status(500).json({ message: "Failed to delete swag item" });
    }
  });

  return httpServer;
}
