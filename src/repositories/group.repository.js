import Group from "../models/group.model.js";

/** Retourne tous les groupes triés par nom. */
const findAll = () => Group.find().sort("name");

/** @param {string} id */
const findById = (id) => Group.findById(id);

/** @param {object} data */
const create = (data) => Group.create(data);

/**
 * @param {string} id
 * @param {object} data
 */
const updateById = (id, data) => Group.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });

/** @param {string} id */
const deleteById = (id) => Group.findByIdAndDelete(id);

export default { findAll, findById, create, updateById, deleteById };
