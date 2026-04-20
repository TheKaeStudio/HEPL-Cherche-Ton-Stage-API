import Log from "../models/log.model.js";

const findAll = ({ filter = {}, page = 1, limit = 50 }) =>
    Log.find(filter)
        .populate("userId", "firstname lastname email role")
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

const count = (filter = {}) => Log.countDocuments(filter);

const create = (data) => Log.create(data);

export default { findAll, count, create };
