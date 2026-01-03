import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// ============================================
// PASSWORD UTILITIES
// ============================================
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(
    supplied: string,
    stored: string
): Promise<boolean> {
    const [hashedPassword, salt] = stored.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

// ============================================
// SESSION TYPES
// ============================================
declare module "express-session" {
    interface SessionData {
        userId?: string;
    }
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (!req.session?.userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
        req.session.destroy(() => { });
        res.status(401).json({ message: "User not found" });
        return;
    }

    // Attach user to request
    (req as any).user = user;
    next();
}

export async function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (!req.session?.userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
        req.session.destroy(() => { });
        res.status(401).json({ message: "User not found" });
        return;
    }

    if (user.role !== "admin") {
        res.status(403).json({ message: "Admin access required" });
        return;
    }

    // Attach user to request
    (req as any).user = user;
    next();
}

// ============================================
// OPTIONAL AUTH (for public routes that benefit from user context)
// ============================================
export async function optionalAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (req.session?.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
            (req as any).user = user;
        }
    }
    next();
}
