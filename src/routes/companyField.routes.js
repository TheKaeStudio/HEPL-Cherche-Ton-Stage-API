/**
 * Routes champs formulaire entreprise — /api/company-fields
 *
 * GET    /          — Liste (public)
 * POST   /          — Crée (COMPANY_CREATE)
 * PUT    /:id       — Modifie (COMPANY_CREATE)
 * DELETE /:id       — Supprime (COMPANY_CREATE)
 */
import express from "express";
import { getFields, createField, updateField, deleteField } from "../controllers/companyField.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";
import p from "../../config/permissions.js";

const companyFieldRouter = express.Router();

companyFieldRouter.get("/", getFields);
companyFieldRouter.post("/",    authenticate, authorize(p.COMPANY_CREATE), createField);
companyFieldRouter.put("/:id",  authenticate, authorize(p.COMPANY_CREATE), updateField);
companyFieldRouter.delete("/:id", authenticate, authorize(p.COMPANY_CREATE), deleteField);

export default companyFieldRouter;
