import crypto from "crypto";
import jwt from "jsonwebtoken";
import companyRepo from "../repositories/company.repository.js";

const parsePage = (query, defaultLimit = 20) => {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(100, parseInt(query.limit) || defaultLimit);
    const skip  = (page - 1) * limit;
    return { page, limit, skip };
};
import userRepo from "../repositories/user.repository.js";
import { createNotification } from "../utils/createNotification.js";
import dbLog from "../utils/dbLogger.js";

const isEducator = (user) => ["teacher", "manager", "admin"].includes(user?.role);
const isLimitedFor = (user, companyId) =>
    user?.role === "limited" && user?.companyId === companyId?.toString();

const formatCompany = (company, user = null) => {
    const educator   = isEducator(user);
    const limitedOwn = isLimitedFor(user, company._id);
    const canSeePrivateContacts = educator || limitedOwn;
    const canSeeTeacherInfo     = educator || limitedOwn;
    const canSeeTeacherNotes    = educator;

    let contacts = company.contacts?.length
        ? company.contacts
        : company.contact
          ? [company.contact]
          : [];

    if (!canSeePrivateContacts) {
        contacts = contacts.filter((c) => c.visibility !== "private");
    }

    const obj = company.toObject();
    const result = {
        ...obj,
        contacts,
        contact: contacts[0] ?? undefined,
        customValues: obj.customValues ? Object.fromEntries(obj.customValues) : {},
    };

    if (!canSeeTeacherInfo)  delete result.teacherInfo;
    if (!canSeeTeacherNotes) delete result.teacherNotes;

    return result;
};

/**
 * GET /api/company
 * Liste toutes les entreprises. Supporte la pagination via ?page=&limit= et la recherche via ?search=.
 */
export const getCompanies = async (req, res, next) => {
    try {
        const search = req.query.search?.trim() || undefined;
        if (req.query.page) {
            const { page, limit, skip } = parsePage(req.query);
            const { companies, total }  = await companyRepo.findPaginated(skip, limit, search);
            return res.status(200).json({
                success: true,
                companies: companies.map((c) => formatCompany(c, req.user)),
                total,
                hasMore: skip + companies.length < total,
                page,
                limit,
            });
        }
        const companies = await companyRepo.findAll(search);
        return res.status(200).json({ success: true, companies: companies.map((c) => formatCompany(c, req.user)) });
    } catch (err) {
        return next(err);
    }
};

/**
 * GET /api/company/meta
 * Retourne les valeurs distinctes de domains et tags pour l'autocomplétion.
 */
export const getCompanyMeta = async (req, res, next) => {
    try {
        const meta = await companyRepo.findMeta();
        return res.status(200).json({ success: true, ...meta });
    } catch (err) {
        return next(err);
    }
};

/**
 * GET /api/company/:id
 * Retourne le détail d'une entreprise.
 * @param {{ params: { id: string } }} req
 */
export const getCompanyById = async (req, res, next) => {
    try {
        const company = await companyRepo.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                success: false,
                error: "Cette entreprise n'existe pas...",
            });
        }
        return res.status(200).json({ success: true, company: formatCompany(company, req.user) });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/company/create
 * Crée une entreprise. Notifie tous les utilisateurs vérifiés.
 * @requires COMPANY_CREATE
 */
export const createCompany = async (req, res, next) => {
    const {
        name,
        description,
        logo,
        sector,
        domains,
        tags,
        customValues,
        size,
        address,
        website,
        phone,
        contacts,
        contact,
        teacherInfo,
        teacherNotes,
    } = req.body;

    try {
        const contactList = contacts?.length
            ? contacts
            : contact
              ? [contact]
              : [];

        const company = await companyRepo.create({
            name,
            description,
            logo,
            sector,
            domains: Array.isArray(domains) ? domains.filter(Boolean) : [],
            tags:    Array.isArray(tags)    ? tags.filter(Boolean)    : [],
            customValues: customValues && typeof customValues === "object" ? customValues : {},
            size,
            address,
            website,
            phone,
            contacts: contactList,
            contact: contactList[0] ?? undefined,
            teacherInfo:  teacherInfo  || undefined,
            teacherNotes: teacherNotes || undefined,
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

/**
 * PUT /api/company/update/:id
 * Modifie une entreprise. Accessible par admin/manager ou via token limité (role=limited + companyId).
 * @param {{ params: { id: string } }} req
 */
export const updateCompany = async (req, res, next) => {
    const {
        name,
        description,
        logo,
        sector,
        domains,
        tags,
        customValues,
        size,
        address,
        website,
        phone,
        contacts,
        contact,
        teacherInfo,
        teacherNotes,
    } = req.body;

    const isLimited = req.user?.role === "limited";

    try {
        const contactList = contacts?.length
            ? contacts
            : contact
              ? [contact]
              : [];

        const company = await companyRepo.updateById(req.params.id, {
            name,
            description,
            logo,
            sector,
            domains: Array.isArray(domains) ? domains.filter(Boolean) : [],
            tags:    Array.isArray(tags)    ? tags.filter(Boolean)    : [],
            customValues: customValues && typeof customValues === "object" ? customValues : {},
            size,
            address,
            website,
            phone,
            contacts: contactList,
            contact: contactList[0] ?? undefined,
            teacherInfo:  teacherInfo  || undefined,
            ...(isLimited ? {} : { teacherNotes: teacherNotes || undefined }),
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

/**
 * DELETE /api/company/delete/:id
 * Supprime une entreprise.
 * @requires COMPANY_DELETE
 * @param {{ params: { id: string } }} req
 */
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

/**
 * GET /api/company/get-access/:key
 * Échange une clé d'invitation contre un JWT limité (role=limited, companyId).
 * Vérifie que la clé n'est pas expirée (INVITE_EXPIRE_DAYS).
 * @param {{ params: { key: string } }} req
 * @returns {{ token: string }}
 */
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

        //await companyRepo.consumeInvite(company);

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

/**
 * POST /api/company/:id/give-access
 * Génère une clé d'invitation unique pour permettre à l'entreprise de modifier sa fiche.
 * @requires COMPANY_GIVE_ACCESS
 * @param {{ params: { id: string } }} req
 * @returns {{ key: string }}
 */
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
