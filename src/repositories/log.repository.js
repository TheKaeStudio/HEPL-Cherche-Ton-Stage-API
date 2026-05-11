import Log from "../models/log.model.js";

/**
 * Retourne des logs paginés, avec population de l'utilisateur.
 * @param {{ filter?: object, page?: number, limit?: number }} opts
 */
const findAll = ({ filter = {}, page = 1, limit = 50 }) =>
    Log.find(filter)
        .populate("userId", "firstname lastname email role")
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

/**
 * Compte les logs correspondant au filtre.
 * @param {object} [filter]
 */
const count = (filter = {}) => Log.countDocuments(filter);

/** @param {object} data */
const create = (data) => Log.create(data);

export default { findAll, count, create };
