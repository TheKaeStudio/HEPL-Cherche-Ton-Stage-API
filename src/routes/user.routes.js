import express from "express";
import { getUsers, getUser, updateUser, updateMe, deleteUser } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import p from "../../config/permissions.js";
import { authorize } from "../middlewares/permission.middleware.js";

const userRouter = express.Router();

userRouter.get("/", authenticate, authorize(p.USER_READ), getUsers);
userRouter.put("/me", authenticate, updateMe);
userRouter.get("/:id", authenticate, authorize(p.USER_READ), getUser);
userRouter.put("/update/:id", authenticate, authorize(p.USER_UPDATE), updateUser);
userRouter.delete("/delete/:id", authenticate, authorize(p.USER_DELETE), deleteUser);

export default userRouter;
