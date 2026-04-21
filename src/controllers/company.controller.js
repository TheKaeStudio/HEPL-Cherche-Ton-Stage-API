import crypto from "crypto";
import jwt from "jsonwebtoken";
import companyRepo from "../repositories/company.repository.js";
import userRepo from "../repositories/user.repository.js";
import { createNotification } from "../utils/createNotification.js";
import dbLog from "../utils/dbLogger.js";

const formatCompany = (company) => {
    const contacts = company.contact?.length
        ? company.contacts
        : company.contact
          ? [company.contact]
          : [];

    return {
        ...company.toObject(),
        contacts: contacts,
        contact: contacts[0] ?? undefined,
    };
};

export const getCompanies = async (req, res, next) => {
    try {
        const companies = await companyRepo.findAll();
        return res.status(200).json({
            success: true,
            companies: companies.map(formatCompany),
        });
    } catch (err) {
        return next(err);
    }
};

export const getCompanyById = async (req, res, next) => {
    try {
        const company = await companyRepo.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: "Cette entreprise n'existe pas...",
            });
        }
        return res.status(200).json({ success: true, company });
    } catch (err) {
        return next(err);
    }
};

export const createCompany = async (req, res, next) => {
    const {
        name,
        description,
        logo,
        sector,
        size,
        offresObservation,
        offres3e,
        address,
        website,
        phone,
        contacts,
        contact,
    } = req.body;

    try {
        const contacts = contacts?.length
            ? contacts
            : contact
              ? [contact]
              : [];

        const company = await companyRepo.create({
            name,
            description,
            logo,
            sector,
            size,
            offresObservation,
            offres3e,
            address,
            website,
            phone,
            contacts: contacts,
            contact: contacts[0] ?? undefined,
        });

        const users = await userRepo.findVerifiedIds();
        for (const user of users) {
            createNotification(user._id, "new_company", "Company", company._id);
        }

        dbLog({
            action: "COMPANY_CREATED",
            message: `Entreprise créée: ${name}`,
            userId: req.user._id,
            ip: req.ip,
            meta: { companyId: company._id, name },
        });

        return res.status(201).json({ success: true, company });
    } catch (err) {
        return next(err);
    }
};

export const updateCompany = async (req, res, next) => {
    const {
        name,
        description,
        logo,
        sector,
        size,
        offresObservation,
        offres3e,
        address,
        website,
        phone,
        contacts,
        contact,
    } = req.body;

    try {
        const contacts = contacts?.length
            ? contacts
            : contact
              ? [contact]
              : [];

        const company = await companyRepo.updateById(req.params.id, {
            name,
            description,
            logo,
            sector,
            size,
            offresObservation,
            offres3e,
            address,
            website,
            phone,
            contacts: contacts,
            contact: contacts[0] ?? undefined,
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                error: "Impossible de modifier la fiche d'entreprise...",
            });
        }

        dbLog({
            action: "COMPANY_UPDATED",
            message: `Entreprise modifiée: ${req.params.id}`,
            userId: req.user?._id ?? null,
            ip: req.ip,
            meta: { companyId: req.params.id },
        });

        return res.status(200).json({ success: true, company });
    } catch (err) {
        return next(err);
    }
};

export const deleteCompany = async (req, res, next) => {
    try {
        const company = await companyRepo.deleteById(req.params.id);

        if (!company) {
            return res
                .status(404)
                .json({ success: false, error: "Entreprise introuvable" });
        }

        dbLog({
            level: "warn",
            action: "COMPANY_DELETED",
            message: `Entreprise supprimée: ${company.name}`,
            userId: req.user._id,
            ip: req.ip,
            meta: { companyId: req.params.id, name: company.name },
        });

        return res
            .status(200)
            .json({ success: true, message: "Supprimé avec succès" });
    } catch (err) {
        return next(err);
    }
};

export const getAccessToCompany = async (req, res, next) => {
    try {
        const company = await companyRepo.findByInviteKey(req.params.key);

        if (!company)
            return res.status(404).json({ error: "Lien invalide ou expiré." });
        if (company.invite.used)
            return res.status(410).json({ error: "Lien invalide ou expiré." });

        const age = Date.now() - new Date(company.invite.createdAt).getTime();
        const ageLimit =
            Number(process.env.INVITE_EXPIRE_DAYS) * 24 * 60 * 60 * 1000;
        if (age > ageLimit)
            return res.status(410).json({ error: "Lien invalide ou expiré." });

        await companyRepo.consumeInvite(company);

        const token = jwt.sign(
            { role: "limited", companyId: company._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIMITED_EXPIRES_IN },
        );

        dbLog({
            action: "COMPANY_ACCESS_USED",
            message: `Lien d'accès utilisé: ${company._id}`,
            ip: req.ip,
            meta: { companyId: company._id },
        });

        return res.status(200).json({ token });
    } catch (err) {
        return next(err);
    }
};

export const giveAccessToCompany = async (req, res, next) => {
    try {
        const key = crypto.randomBytes(20).toString("hex");
        const company = await companyRepo.setInviteKey(req.params.id, key);

        if (!company) {
            return res
                .status(404)
                .json({ success: false, error: "Entreprise introuvable" });
        }

        dbLog({
            action: "COMPANY_ACCESS_GIVEN",
            message: `Lien d'accès généré pour: ${req.params.id}`,
            userId: req.user._id,
            ip: req.ip,
            meta: { companyId: req.params.id },
        });

        return res.status(200).json({ success: true, key });
    } catch (err) {
        return next(err);
    }
};
