import "dotenv/config";
import express from "express";

import { connectDB } from "./config/db.js";

import userRouter from "./src/routes/user.routes.js";
import companyRouter from "./src/routes/company.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server launched on port ${PORT}`);
    });
});

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ message: "Route introuvable" });
});

// Middleware 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Erreur serveur interne" });
});
