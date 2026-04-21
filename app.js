import "dotenv/config";
import express from "express";

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

const PORT = process.env.PORT || 5500;

app.listen(PORT, async () => {
    console.log(`Server launched on port ${PORT}`);
    
    await connectDB();
});

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

// General Error Middleware
app.use(errorMiddleware);

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ message: "Route introuvable" });
});

// Middleware 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Erreur serveur" });
});
