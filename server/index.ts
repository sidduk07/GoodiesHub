import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const httpServer = createServer(app);

const isProduction = process.env.NODE_ENV === "production";

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Trust proxy for Render/Railway
if (isProduction) {
  app.set("trust proxy", 1);
}

// Security headers (relaxed for development)
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: isProduction
    ? process.env.ALLOWED_ORIGINS?.split(",") || true
    : true,
  credentials: true,
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// ============================================
// STATIC FILES & PARSING
// ============================================

// Serve uploaded files
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Serve attached assets (existing images)
app.use("/attached_assets", express.static(path.resolve(process.cwd(), "attached_assets")));

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// ============================================
// HEALTH CHECK (for Render)
// ============================================
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// LOGGING
// ============================================
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      log(`${req.method} ${reqPath} ${res.statusCode} (${duration}ms)`);
    }
  });

  next();
});

// ============================================
// ROUTES & SERVER
// ============================================
(async () => {
  // Apply auth rate limiter before routes
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    if (!isProduction) {
      console.error(err);
    }
  });

  // Setup Vite in development, static files in production
  if (isProduction) {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  const port = parseInt(process.env.PORT || "3001", 10);
  const host = isProduction ? "0.0.0.0" : "localhost";

  httpServer.listen(port, host, () => {
    log(`🚀 Server running in ${isProduction ? "production" : "development"} mode`);
    log(`📡 Listening on http://${host}:${port}`);
  });
})();
