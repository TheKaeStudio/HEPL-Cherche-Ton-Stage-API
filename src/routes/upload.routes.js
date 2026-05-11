/**
 * Routes upload — /api/upload
 *
 * POST /image — Upload d'une image (authentification requise ou token limité)
 */
import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import { canUploadImage } from "../middlewares/canUploadImage.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const uploadRouter = express.Router();

uploadRouter.post("/image", canUploadImage, uploadMiddleware.single("file"), uploadImage);

export default uploadRouter;
