import "dotenv/config";
import express from "express";

import connectDB from "./config/db.js";

import userRouter from "./src/routes/user.routes.js";
import companyRouter from "./src/routes/company.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";

const app = express();

const PORT = process.env.PORT || 5500;

app.listen(PORT, async () => {
    console.log(`Server launched on port ${PORT}`);
    
    await connectDB();
});

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/company", companyRouter);

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
