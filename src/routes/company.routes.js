import express from "express";
import {
    createCompany,
    deleteCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
} from "../controllers/company.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import p from "../../config/permissions.js";
import { canUpdateCompany } from "../middlewares/canUpdateCompany.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";

const companyRouter = express.Router();

companyRouter.get("/", getCompanies);
companyRouter.get("/:id", getCompanyById);
companyRouter.post(
    "/create",
    authenticate,
    authorize(p.COMPANY_CREATE),
    createCompany,
);
companyRouter.put("/update/:id", canUpdateCompany, updateCompany);
companyRouter.delete(
    "/delete/:id",
    authenticate,
    authorize(p.COMPANY_DELETE),
    deleteCompany,
);

export default companyRouter;
