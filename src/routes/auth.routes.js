/**
 * Routes d'authentification — /api/auth
 *
 * POST /sign-up   — Inscription
 * POST /sign-in   — Connexion → retourne token + user
 * GET  /activate/:token — Activation du compte par email
 */
import express from "express";
import { signUp, signIn, activateAccount } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);

authRouter.get("/activate/:token", activateAccount);

export default authRouter;
