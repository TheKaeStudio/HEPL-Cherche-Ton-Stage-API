import express from "express";
import { getSectors, createSector, updateSector, deleteSector } from "../controllers/sector.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import p from "../../config/permissions.js";
import { authorize } from "../middlewares/permission.middleware.js";

const sectorRouter = express.Router();

sectorRouter.get("/", getSectors);
sectorRouter.post("/", authenticate, authorize(p.SECTOR_CREATE), createSector);
sectorRouter.put("/:id", authenticate, authorize(p.SECTOR_UPDATE), updateSector);
sectorRouter.delete("/:id", authenticate, authorize(p.SECTOR_DELETE), deleteSector);

export default sectorRouter;
