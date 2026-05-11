import Sector from "../models/sector.model.js";

/** Retourne tous les secteurs triés par nom. */
const findAll = () => Sector.find().sort("name");

/** @param {string} id */
const findById = (id) => Sector.findById(id);

/** @param {object} data */
const create = (data) => Sector.create(data);

/**
 * @param {string} id
 * @param {object} data
 */
const updateById = (id, data) => Sector.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });

/** @param {string} id */
const deleteById = (id) => Sector.findByIdAndDelete(id);

export default { findAll, findById, create, updateById, deleteById };
