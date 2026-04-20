import Internship from "../models/internship.model.js";

const STUDENT_FIELDS = "firstname lastname email promotion photo";
const NAME_FIELDS = "firstname lastname";
const COMPANY_FIELDS = "name sector logo address";

const findAll = (filter = {}) =>
    Internship.find(filter)
        .populate("students", STUDENT_FIELDS)
        .populate("company", COMPANY_FIELDS)
        .populate("createdBy", NAME_FIELDS)
        .populate("assignedTeacher", NAME_FIELDS);

const findById = (id) =>
    Internship.findById(id)
        .populate("students", STUDENT_FIELDS)
        .populate("company")
        .populate("createdBy", NAME_FIELDS)
        .populate("assignedTeacher", NAME_FIELDS)
        .populate("evaluation.validatedBy", NAME_FIELDS);

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

const deleteById = (id) => Internship.findByIdAndDelete(id);

export default { findAll, findById, findRawById, create, updateById, saveSheet, submit, evaluate, deleteById };
