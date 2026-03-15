import companyModel from "../models/company.model.js";
import Company from "../models/company.model.js";

export const getCompanies = async (req, res, next) => {
    let companies;

    try {
        companies = await Company.find();
    } catch (err) {
        return console.log(err);
    }

    if (!companies) {
        return res.status(404).json({ message: "Aucune entreprise trouvée!" });
    }

    return res.status(200).json({ companies });
};

export const getCompanyById = async (req, res, next) => {
    const companyId = req.params.id;

    let company;

    try {
        company = await Company.findOne({ id: companyId });
    } catch (err) {
        return console.log(err);
    }

    if (!company) {
        return res.status(404).json({ message: "Cet entreprise n'existe pas..." });
    }

    return res.status(200).json({ company });
};

export const createCompany = async (req, res, next) => {
    const { id, name, description } = req.body;

    let existingCompany;

    try {
        existingCompany = await Company.findOne({ id });
    } catch (err) {
        return console.log(err);
    }

    if (existingCompany) {
        return res
            .status(400)
            .json({ message: "Cet identifiant d'entreprise existe déjà!" });
    }

    const company = new Company({
        id,
        name,
        description,
    });

    try {
        await company.save();
    } catch (err) {
        return console.log(err);
    }

    return res.status(201).json({ company });
};

export const updateCompany = async (req, res, next) => {
    const { name, description } = req.body;

    const companyId = req.params.id;

    let company;

    try {
        company = await Company.findOneAndUpdate(
            { id: companyId },
            {
                name,
                description,
            },
            { returnDocument: "after", runValidators: true },
        );
    } catch (err) {
        return console.log(err);
    }

    if (!company) {
        return res.status(500).json({ message: "Impossible de modifier la fiche d'entreprise..." });
    }

    return res.status(200).json({ company });
};

export const deleteCompany = async (req, res, next) => {
    const companyId = req.params.id;

    let company;

    try {
        company = await Company.findOneAndDelete({ id: companyId });
    } catch (err) {
        console.log(err);
    }

    if (!company) {
        return res.status(400).json({ message: "Suppression impossible" });
    }

    return res.status(200).json({ message: "Supprimé avec succès" });
};
