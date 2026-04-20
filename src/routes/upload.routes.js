import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const uploadRouter = express.Router();

uploadRouter.post("/image", authenticate, uploadMiddleware.single("file"), uploadImage);

export default uploadRouter;
