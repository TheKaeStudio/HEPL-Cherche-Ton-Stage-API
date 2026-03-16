import express from "express";
import { signUp, signIn, activateAccount } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
//authRouter.delete("/sign-out", signOut);

authRouter.get("/activate/:token", activateAccount);

export default authRouter;
