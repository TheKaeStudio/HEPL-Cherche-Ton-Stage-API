import internshipRepo from "../repositories/internship.repository.js";
import userRepo from "../repositories/user.repository.js";
import { createNotification } from "../utils/createNotification.js";
import dbLog from "../utils/dbLogger.js";

const parsePage = (query, defaultLimit = 20) => {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(100, parseInt(query.limit) || defaultLimit);
    const skip  = (page - 1) * limit;
    return { page, limit, skip };
};

/**
 * GET /api/internships
 * Liste les stages selon le rôle : admin/manager → tous, teacher → les siens, student → les siens.
 * Supporte la pagination via ?page=&limit=.
 */
export const getInternships = async (req, res, next) => {
    const user = req.user;
    let filter = {};

    if (user.role === "student") filter = { students: user._id };
    else if (user.role === "teacher") filter = { assignedTeacher: user._id };

    try {
        if (req.query.page) {
            const { page, limit, skip }    = parsePage(req.query);
            const { internships, total }   = await internshipRepo.findAllPaginated(filter, skip, limit);
            return res.status(200).json({
                success: true,
                internships,
                total,
                hasMore: skip + internships.length < total,
                page,
                limit,
            });
        }
        const internships = await internshipRepo.findAll(filter);
        return res.status(200).json({ success: true, internships });
    } catch (err) {
        return next(err);
    }
};

/**
 * GET /api/internships/:id
 * Retourne le détail d'un stage. Vérifie les droits d'accès pour student/teacher.
 * @param {{ params: { id: string } }} req
 */
export const getInternshipById = async (req, res, next) => {
    const user = req.user;

    try {
        const internship = await internshipRepo.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ success: false, error: "Stage introuvable" });
        }

        if (user.role === "student" && !internship.students.some((s) => s._id.equals(user._id))) {
            return res.status(403).json({ success: false, error: "Accès refusé" });
        }

        if (user.role === "teacher" && !internship.assignedTeacher?._id.equals(user._id)) {
            return res.status(403).json({ success: false, error: "Accès refusé" });
        }

        return res.status(200).json({ success: true, internship });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/internships/create
 * Crée un stage et l'assigne à un ou plusieurs étudiants.
 * @requires INTERNSHIP_CREATE
 * @param {{ body: { students: string[], companyId?: string, assignedTeacher?: string, deadline?: string, title?: string, type?: string, group?: string, schoolYear?: string } }} req
 */
export const createInternship = async (req, res, next) => {
    const { students, companyId, externalCompanyName, assignedTeacher, deadline, title, type, group, schoolYear } = req.body;
    const studentIds = Array.isArray(students) ? students : [students];

    try {
        let resolvedGroup = group ?? null;
        if (!resolvedGroup && studentIds.length > 0) {
            const firstStudent = await userRepo.findById(studentIds[0]);
            if (firstStudent?.group) resolvedGroup = firstStudent.group;
        }

        const internship = await internshipRepo.create({
            students: studentIds,
            company: companyId ?? null,
            externalCompanyName: externalCompanyName ?? null,
            createdBy: req.user._id,
            assignedTeacher,
            deadline,
            title,
            type,
            group: resolvedGroup,
            schoolYear,
            isGroupAssignment: studentIds.length > 1,
        });

        for (const studentId of studentIds) {
            createNotification(studentId, "internship_assigned", "Internship", internship._id);
        }

        dbLog({ action: "INTERNSHIP_CREATED", message: `Stage créé pour ${studentIds.length} étudiant(s)`, userId: req.user._id, ip: req.ip, meta: { internshipId: internship._id, students: studentIds } });

        return res.status(201).json({ success: true, internship });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /api/internships/update/:id
 * Modifie les métadonnées d'un stage (teacher, deadline, company, title, type…).
 * @requires INTERNSHIP_UPDATE
 * @param {{ params: { id: string } }} req
 */
export const updateInternship = async (req, res, next) => {
    const { assignedTeacher, deadline, companyId, externalCompanyName, title, type, group, schoolYear } = req.body;

    try {
        const internship = await internshipRepo.updateById(req.params.id, {
            assignedTeacher, deadline, company: companyId ?? null, externalCompanyName: externalCompanyName ?? null, title, type, group, schoolYear,
        });

        if (!internship) {
            return res.status(404).json({ success: false, error: "Stage introuvable" });
        }

        return res.status(200).json({ success: true, internship });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /api/internships/:id/sheet
 * Sauvegarde la fiche de stage (brouillon). Accessible uniquement par l'étudiant assigné.
 * Statut passe à "in_progress".
 * @param {{ params: { id: string }, body: { startDate?, endDate?, missions?, description?, companyTutor?, companyType?, companyId?, externalCompanyName?, externalCompanyWebsite? } }} req
 */
export const updateSheet = async (req, res, next) => {
    const { startDate, endDate, missions, description, companyTutor, companyType, companyId, externalCompanyName, externalCompanyWebsite } = req.body;
    const user = req.user;

    try {
        const internship = await internshipRepo.findRawById(req.params.id);

        if (!internship) return res.status(404).json({ success: false, error: "Stage introuvable" });

        if (!internship.students.some((s) => s.equals(user._id))) {
            return res.status(403).json({ success: false, error: "Accès refusé" });
        }

        if (!["assigned", "in_progress"].includes(internship.status)) {
            return res.status(400).json({ success: false, error: "Ce stage ne peut plus être modifié" });
        }

        if (companyType === "existing" && companyId) {
            internship.company = companyId;
        } else if (companyType === "external") {
            internship.company = null;
        }

        const saved = await internshipRepo.saveSheet(internship, { startDate, endDate, missions, description, companyTutor, companyType, externalCompanyName, externalCompanyWebsite });
        const populated = await internshipRepo.findById(saved._id);
        return res.status(200).json({ success: true, internship: populated });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/internships/:id/submit
 * Soumet la fiche de stage. Statut passe à "submitted".
 * Accessible uniquement par l'étudiant assigné, depuis le statut "in_progress".
 * @param {{ params: { id: string } }} req
 */
export const submitSheet = async (req, res, next) => {
    const user = req.user;

    try {
        const internship = await internshipRepo.findRawById(req.params.id);

        if (!internship) return res.status(404).json({ success: false, error: "Stage introuvable" });

        if (!internship.students.some((s) => s.equals(user._id))) {
            return res.status(403).json({ success: false, error: "Accès refusé" });
        }

        if (internship.status !== "in_progress") {
            return res.status(400).json({ success: false, error: "La fiche doit être en cours avant de soumettre" });
        }

        const saved = await internshipRepo.submit(internship);
        const populated = await internshipRepo.findById(saved._id);

        dbLog({ action: "INTERNSHIP_SUBMITTED", message: `Fiche soumise pour le stage ${req.params.id}`, userId: user._id, ip: req.ip, meta: { internshipId: req.params.id } });

        return res.status(200).json({ success: true, internship: populated });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /api/internships/:id/validate
 * Valide ou rejette une fiche soumise. Notifie les étudiants.
 * @requires INTERNSHIP_VALIDATE
 * @param {{ params: { id: string }, body: { status: "validated"|"rejected", grade?: number, comment?: string } }} req
 */
export const validateInternship = async (req, res, next) => {
    const { status, grade, comment } = req.body;

    if (!["validated", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, error: "Statut invalide" });
    }

    try {
        const internship = await internshipRepo.findRawById(req.params.id);

        if (!internship) return res.status(404).json({ success: false, error: "Stage introuvable" });

        if (internship.status !== "submitted") {
            return res.status(400).json({ success: false, error: "Ce stage n'a pas encore été soumis" });
        }

        const updated = await internshipRepo.evaluate(internship, { status, grade, comment, validatedBy: req.user._id });

        for (const studentId of internship.students) {
            createNotification(studentId, "internship_status_changed", "Internship", internship._id);
        }

        dbLog({ action: "INTERNSHIP_VALIDATED", message: `Stage ${req.params.id} → ${status}`, userId: req.user._id, ip: req.ip, meta: { internshipId: req.params.id, status, grade } });

        return res.status(200).json({ success: true, internship: updated });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/internships/:id/submit-docs
 * Soumet les documents de stage (convention + rapport PDF). Statut passe à "docs_submitted".
 * @param {{ params: { id: string }, files: { convention: Express.Multer.File[], report: Express.Multer.File[] } }} req
 */
export const submitDocs = async (req, res, next) => {
    const user = req.user;

    try {
        const internship = await internshipRepo.findRawById(req.params.id);

        if (!internship) return res.status(404).json({ success: false, error: "Stage introuvable" });

        if (!internship.students.some((s) => s.equals(user._id))) {
            return res.status(403).json({ success: false, error: "Accès refusé" });
        }

        if (!["validated", "docs_rejected"].includes(internship.status)) {
            return res.status(400).json({ success: false, error: "Ce stage ne peut pas soumettre des documents dans son état actuel" });
        }

        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5500}`;
        const conventionUrl = req.files?.convention?.[0] ? `${baseUrl}/uploads/${req.files.convention[0].filename}` : null;
        const reportUrl = req.files?.report?.[0] ? `${baseUrl}/uploads/${req.files.report[0].filename}` : null;

        if (!conventionUrl || !reportUrl) {
            return res.status(400).json({ success: false, error: "Les fichiers convention et rapport sont requis" });
        }

        const updated = await internshipRepo.submitDocs(internship, { conventionUrl, reportUrl });
        const populated = await internshipRepo.findById(updated._id);
        return res.status(200).json({ success: true, internship: populated });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /api/internships/:id/confirm-docs
 * Confirme ou rejette les documents soumis. Notifie les étudiants.
 * @requires INTERNSHIP_VALIDATE
 * @param {{ params: { id: string }, body: { status: "completed"|"docs_rejected", comment?: string } }} req
 */
export const confirmDocs = async (req, res, next) => {
    const { status, comment } = req.body;

    if (!["completed", "docs_rejected"].includes(status)) {
        return res.status(400).json({ success: false, error: "Statut invalide (completed ou docs_rejected attendu)" });
    }

    try {
        const internship = await internshipRepo.findRawById(req.params.id);

        if (!internship) return res.status(404).json({ success: false, error: "Stage introuvable" });

        if (internship.status !== "docs_submitted") {
            return res.status(400).json({ success: false, error: "Les documents n'ont pas encore été soumis" });
        }

        const updated = await internshipRepo.confirmDocs(internship, { status, comment });
        const populated = await internshipRepo.findById(updated._id);

        for (const studentId of internship.students) {
            createNotification(studentId, "internship_status_changed", "Internship", internship._id);
        }

        return res.status(200).json({ success: true, internship: populated });
    } catch (err) {
        return next(err);
    }
};

/**
 * DELETE /api/internships/delete/:id
 * Supprime un stage.
 * @requires INTERNSHIP_DELETE
 * @param {{ params: { id: string } }} req
 */
export const deleteInternship = async (req, res, next) => {
    try {
        const internship = await internshipRepo.deleteById(req.params.id);

        if (!internship) return res.status(404).json({ success: false, error: "Stage introuvable" });

        return res.status(200).json({ success: true, message: "Stage supprimé" });
    } catch (err) {
        return next(err);
    }
};
