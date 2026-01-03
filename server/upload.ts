import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { Request, Response, Router } from "express";

// ============================================
// UPLOAD CONFIGURATION
// ============================================
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueId = randomUUID();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
    },
});

// File filter for images
const imageFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (JPEG, PNG, GIF, WebP)"));
    }
};

// Create multer instance
export const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// ============================================
// UPLOAD ROUTES
// ============================================
export const uploadRouter = Router();

// Single image upload
uploadRouter.post("/single", upload.single("image"), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
    });
});

// Multiple images upload (for gallery)
uploadRouter.post("/multiple", upload.array("images", 10), (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
    }

    const uploadedFiles = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
    }));

    res.json({ files: uploadedFiles });
});
