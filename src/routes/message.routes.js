/**
 * Routes messages — /api/messages
 *
 * GET  /         — Boîte de réception
 * GET  /:id      — Lire un message
 * POST /send     — Envoyer un message
 * PUT  /:id/read — Marquer comme lu
 */
import express from "express";
import { getInbox, getMessageById, markAsRead, sendMessage } from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.get("/", authenticate, getInbox);
messageRouter.get("/:id", authenticate, getMessageById);
messageRouter.post("/send", authenticate, sendMessage);
messageRouter.put("/:id/read", authenticate, markAsRead);

export default messageRouter;
