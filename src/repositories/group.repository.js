import Group from "../models/group.model.js";

const findAll = () => Group.find().sort("name");
const findById = (id) => Group.findById(id);
const create = (data) => Group.create(data);
const updateById = (id, data) => Group.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
const deleteById = (id) => Group.findByIdAndDelete(id);

export default { findAll, findById, create, updateById, deleteById };
