import CompanyField from "../models/companyField.model.js";

const findAll  = () => CompanyField.find().sort({ order: 1, createdAt: 1 });
const count    = () => CompanyField.countDocuments();
const create   = (data) => CompanyField.create(data);
const updateById = (id, data) =>
    CompanyField.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
const deleteById = (id) => CompanyField.findByIdAndDelete(id);

export default { findAll, count, create, updateById, deleteById };
