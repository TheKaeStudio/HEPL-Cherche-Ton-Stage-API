/**
 * Routes utilisateurs — /api/users
 *
 * GET    /              — Liste (USER_READ)
 * PUT    /me            — Modifie son propre profil
 * GET    /:id           — Détail (USER_READ)
 * PUT    /update/:id    — Modifie un utilisateur (USER_UPDATE)
 * DELETE /delete/:id    — Supprime (USER_DELETE)
 */
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
