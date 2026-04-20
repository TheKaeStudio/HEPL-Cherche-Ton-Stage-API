import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(Object.assign(new Error("Seules les images sont autorisées"), { statusCode: 400 }), false);
    }
};

export const uploadMiddleware = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});
