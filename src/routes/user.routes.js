import express from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import p from "../../config/permissions.js";
import { authorize } from "../middlewares/permission.middleware.js";

const userRouter = express.Router();

userRouter.get("/", authenticate, authorize(p.USER_READ), getUsers);
userRouter.get("/:id", authenticate, authorize(p.USER_READ), getUser);

export default userRouter;
