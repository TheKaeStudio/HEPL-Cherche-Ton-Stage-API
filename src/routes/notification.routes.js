/**
 * Routes notifications — /api/notifications
 *
 * GET /           — Toutes mes notifications
 * PUT /read-all   — Tout marquer comme lu
 * PUT /:id/read   — Marquer une notification comme lue
 */
import express from "express";
import { getNotifications, markAllAsRead, markAsRead } from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authenticate, getNotifications);
notificationRouter.put("/read-all", authenticate, markAllAsRead);
notificationRouter.put("/:id/read", authenticate, markAsRead);

export default notificationRouter;
