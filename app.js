import "dotenv/config";
import express from "express";
import cors from "cors";
import dns from "dns";

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
import { sendActivationEmail } from "./src/utils/sendActivationEmail.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

sendActivationEmail("dradarkx@gmail.com", "Oui").catch((err) =>
    console.error("EMAIL FAIL:", err),
);

dns.setDefaultResultOrder("ipv4first");

const app = express();

const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    }),
);

app.use(express.json());
app.use(requestLogger);
app.use("/uploads", express.static("uploads"));

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

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use(errorMiddleware);

app.use((req, res) => {
    res.status(404).json({ message: "Route introuvable" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
});

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5500;

        app.listen(PORT, () => {
            console.log(`Server launched on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();

export default app;
