import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import userRouter from "./src/routes/user.routes.js";
import companyRouter from "./src/routes/company.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import internshipRouter from "./src/routes/internship.routes.js";
import messageRouter from "./src/routes/message.routes.js";
import notificationRouter from "./src/routes/notification.routes.js";
import logRouter from "./src/routes/log.routes.js";
import uploadRouter from "./src/routes/upload.routes.js";
import groupRouter from "./src/routes/group.routes.js";
import sectorRouter from "./src/routes/sector.routes.js";

import errorMiddleware from "./src/middlewares/error.middleware.js";
import { requestLogger } from "./src/middlewares/requestLogger.middleware.js";

const app = express();

/* -------------------- MIDDLEWARES -------------------- */

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://hepl-cherche-ton-stage-api-pug9.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }),
);

app.use(express.json());
app.use(requestLogger);
app.use("/uploads", express.static("uploads"));

/* -------------------- ROUTES -------------------- */

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/company", companyRouter);
app.use("/api/internships", internshipRouter);
app.use("/api/messages", messageRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/logs", logRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/groups", groupRouter);
app.use("/api/sectors", sectorRouter);

/* -------------------- HEALTH CHECK -------------------- */

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

/* -------------------- ERROR HANDLING -------------------- */

app.use(errorMiddleware);

app.use((req, res) => {
    res.status(404).json({ message: "Route introuvable" });
});

/* -------------------- VERCEL HANDLER -------------------- */

export default async function handler(req, res) {
    await connectDB();
    return app(req, res);
}
