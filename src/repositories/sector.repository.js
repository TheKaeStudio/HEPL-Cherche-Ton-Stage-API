import Sector from "../models/sector.model.js";

const findAll = () => Sector.find().sort("name");
const findById = (id) => Sector.findById(id);
const create = (data) => Sector.create(data);
const updateById = (id, data) => Sector.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
const deleteById = (id) => Sector.findByIdAndDelete(id);

export default { findAll, findById, create, updateById, deleteById };
