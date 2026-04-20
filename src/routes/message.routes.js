import express from "express";
import { getInbox, getMessageById, markAsRead, sendMessage } from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.get("/", authenticate, getInbox);
messageRouter.get("/:id", authenticate, getMessageById);
messageRouter.post("/send", authenticate, sendMessage);
messageRouter.put("/:id/read", authenticate, markAsRead);

export default messageRouter;
