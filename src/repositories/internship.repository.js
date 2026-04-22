import Internship from "../models/internship.model.js";

const STUDENT_FIELDS = "firstname lastname email photo group";
const NAME_FIELDS = "firstname lastname";
const COMPANY_FIELDS = "name logo address sector";

const POPULATE_ALL = (query) => query
    .populate({ path: "students", select: STUDENT_FIELDS, populate: { path: "group", select: "name color" } })
    .populate({ path: "company", select: COMPANY_FIELDS, populate: { path: "sector", select: "name color" } })
    .populate("createdBy", NAME_FIELDS)
    .populate("assignedTeacher", NAME_FIELDS)
    .populate("group", "name color");

const findAll = (filter = {}) => POPULATE_ALL(Internship.find(filter)).sort({ createdAt: -1 });

const findAllPaginated = async (filter, skip, limit) => {
    const [internships, total] = await Promise.all([
        POPULATE_ALL(Internship.find(filter)).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Internship.countDocuments(filter),
    ]);
    return { internships, total };
};

const findById = (id) =>
    Internship.findById(id)
        .populate({ path: "students", select: STUDENT_FIELDS, populate: { path: "group", select: "name color" } })
        .populate({ path: "company", populate: { path: "sector", select: "name color" } })
        .populate("createdBy", NAME_FIELDS)
        .populate("assignedTeacher", NAME_FIELDS)
        .populate("evaluation.validatedBy", NAME_FIELDS)
        .populate("group", "name color");

const findRawById = (id) => Internship.findById(id);

const create = (data) => Internship.create(data);

const updateById = (id, data) =>
    Internship.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });

const saveSheet = (internship, sheetData) => {
    internship.sheet = sheetData;
    internship.status = "in_progress";
    return internship.save();
};

const submit = (internship) => {
    internship.status = "submitted";
    internship.sheet.submittedAt = new Date();
    return internship.save();
};

const evaluate = (internship, { status, grade, comment, validatedBy }) => {
    internship.status = status;
    internship.evaluation = { grade, comment, validatedBy, validatedAt: new Date() };
    return internship.save();
};

const submitDocs = (internship, { conventionUrl, reportUrl }) => {
    internship.documents = { convention: conventionUrl, report: reportUrl, submittedAt: new Date() };
    internship.status = "docs_submitted";
    return internship.save();
};

const confirmDocs = (internship, { status, comment }) => {
    internship.status = status;
    if (status === "docs_rejected") internship.documents.rejectionComment = comment;
    return internship.save();
};

const deleteById = (id) => Internship.findByIdAndDelete(id);

export default { findAll, findAllPaginated, findById, findRawById, create, updateById, saveSheet, submit, evaluate, submitDocs, confirmDocs, deleteById };
