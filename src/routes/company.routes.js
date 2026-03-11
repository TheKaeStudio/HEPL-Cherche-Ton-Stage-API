import express from "express";
import {
    createCompany,
    deleteCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
} from "../controllers/company.controller.js";

const companyRouter = express.Router();

companyRouter.get("/", getAllCompanies);
companyRouter.get("/:id", getCompanyById);
companyRouter.post("/create", createCompany);
companyRouter.put("/update/:id", updateCompany);
companyRouter.delete("/delete/:id", deleteCompany);

export default companyRouter;
