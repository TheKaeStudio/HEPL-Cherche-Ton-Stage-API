import express from "express";
import { getGroups } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import p from "../../config/permissions.js";
import { authorize } from "../middlewares/permission.middleware.js";

const groupRouter = express.Router();

groupRouter.get("/", authenticate, authorize(p.USER_READ), getGroups);

export default groupRouter;
