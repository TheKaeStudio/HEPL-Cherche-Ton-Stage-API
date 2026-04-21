import express from "express";
import { getGroups, createGroup, updateGroup, deleteGroup } from "../controllers/group.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import p from "../../config/permissions.js";
import { authorize } from "../middlewares/permission.middleware.js";

const groupRouter = express.Router();

groupRouter.get("/", getGroups);
groupRouter.post("/", authenticate, authorize(p.GROUP_CREATE), createGroup);
groupRouter.put("/:id", authenticate, authorize(p.GROUP_UPDATE), updateGroup);
groupRouter.delete("/:id", authenticate, authorize(p.GROUP_DELETE), deleteGroup);

export default groupRouter;
