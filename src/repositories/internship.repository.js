import Internship from "../models/internship.model.js";

const STUDENT_FIELDS = "firstname lastname email photo group";
const NAME_FIELDS    = "firstname lastname";
const COMPANY_FIELDS = "name logo address sector";

const POPULATE_ALL = (query) => query
    .populate({ path: "students", select: STUDENT_FIELDS, populate: { path: "group", select: "name color" } })
    .populate({ path: "company", select: COMPANY_FIELDS, populate: { path: "sector", select: "name color" } })
    .populate("createdBy", NAME_FIELDS)
    .populate("assignedTeacher", NAME_FIELDS)
    .populate("group", "name color");

/** @param {object} [filter] */
const findAll = (filter = {}) => POPULATE_ALL(Internship.find(filter)).sort({ createdAt: -1 });

/**
 * @param {object} filter
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<{ internships: Internship[], total: number }>}
 */
const findAllPaginated = async (filter, skip, limit) => {
    const [internships, total] = await Promise.all([
        POPULATE_ALL(Internship.find(filter)).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Internship.countDocuments(filter),
    ]);
    return { internships, total };
};

/** Retourne le stage avec toutes les populations (étudiants, entreprise, enseignant…). */
const findById = (id) =>
    Internship.findById(id)
        .populate({ path: "students", select: STUDENT_FIELDS, populate: { path: "group", select: "name color" } })
        .populate({ path: "company", populate: { path: "sector", select: "name color" } })
        .populate("createdBy", NAME_FIELDS)
        .populate("assignedTeacher", NAME_FIELDS)
        .populate("evaluation.validatedBy", NAME_FIELDS)
        .populate("group", "name color");

/** Retourne le document brut (sans population) pour les mutations. */
const findRawById = (id) => Internship.findById(id);

/** @param {object} data */
const create = (data) => Internship.create(data);

/**
 * @param {string} id
 * @param {object} data
 */
const updateById = (id, data) =>
    Internship.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });

/**
 * Sauvegarde la fiche et passe le statut à "in_progress".
 * @param {Internship} internship
 * @param {object} sheetData
 */
const saveSheet = (internship, sheetData) => {
    internship.sheet = sheetData;
    internship.status = "in_progress";
    return internship.save();
};

/**
 * Soumet la fiche (statut → "submitted") et enregistre la date.
 * @param {Internship} internship
 */
const submit = (internship) => {
    internship.status = "submitted";
    internship.sheet.submittedAt = new Date();
    return internship.save();
};

/**
 * Évalue le stage (statut → validated/rejected).
 * @param {Internship} internship
 * @param {{ status: string, grade?: number, comment?: string, validatedBy: string }} opts
 */
const evaluate = (internship, { status, grade, comment, validatedBy }) => {
    internship.status = status;
    internship.evaluation = { grade, comment, validatedBy, validatedAt: new Date() };
    return internship.save();
};

/**
 * Enregistre les documents soumis et passe le statut à "docs_submitted".
 * @param {Internship} internship
 * @param {{ conventionUrl: string, reportUrl: string }} opts
 */
const submitDocs = (internship, { conventionUrl, reportUrl }) => {
    internship.documents = { convention: conventionUrl, report: reportUrl, submittedAt: new Date() };
    internship.status = "docs_submitted";
    return internship.save();
};

/**
 * Confirme ou rejette les documents (statut → completed/docs_rejected).
 * @param {Internship} internship
 * @param {{ status: string, comment?: string }} opts
 */
const confirmDocs = (internship, { status, comment }) => {
    internship.status = status;
    if (status === "docs_rejected") internship.documents.rejectionComment = comment;
    return internship.save();
};

/** @param {string} id */
const deleteById = (id) => Internship.findByIdAndDelete(id);

export default { findAll, findAllPaginated, findById, findRawById, create, updateById, saveSheet, submit, evaluate, submitDocs, confirmDocs, deleteById };
