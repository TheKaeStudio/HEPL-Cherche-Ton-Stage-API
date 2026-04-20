import express from "express";
import { getLogs } from "../controllers/log.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";
import p from "../../config/permissions.js";

const logRouter = express.Router();

logRouter.get("/", authenticate, authorize(p.LOG_READ), getLogs);

export default logRouter;
