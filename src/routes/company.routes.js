import express from "express";
import {
    createCompany,
    deleteCompany,
    getAccessToCompany,
    getCompanies,
    getCompanyById,
    giveAccessToCompany,
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

companyRouter.post(
    "/:id/give-access",
    authenticate,
    authorize(p.COMPANY_GIVE_ACCESS),
    giveAccessToCompany,
);

companyRouter.get("/get-access/:key", getAccessToCompany);

export default companyRouter;
