import User from "../models/user.model.js";

const HIDDEN_FIELDS = "-password -activationToken -activationTokenExpires";

/** @param {object} [filter] */
const findAll = (filter = {}) => User.find(filter).select(HIDDEN_FIELDS).populate("group", "name color");

/**
 * @param {object} filter
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<{ users: User[], total: number }>}
 */
const findPaginated = async (filter, skip, limit) => {
    const [users, total] = await Promise.all([
        User.find(filter).select(HIDDEN_FIELDS).populate("group", "name color").sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter),
    ]);
    return { users, total };
};

/** @param {string} id */
const findById = (id) => User.findById(id).populate("group", "name color");

/** @param {string} email */
const findByEmail = (email) => User.findOne({ email });

/** Inclut le champ password (select: false par défaut). */
const findByEmailWithPassword = (email) => User.findOne({ email }).select("+password");

/** Cherche un utilisateur par token d'activation non expiré. */
const findByActivationToken = (token) =>
    User.findOne({
        activationToken: token,
        activationTokenExpires: { $gt: Date.now() },
    });

/** Retourne uniquement les _id des utilisateurs vérifiés (pour les notifications de masse). */
const findVerifiedIds = () => User.find({ verified: true }, "_id");

/**
 * @param {object} data
 * @param {import("mongoose").ClientSession|null} [session]
 */
const create = (data, session = null) =>
    session
        ? User.create([data], { session }).then((docs) => docs[0])
        : User.create(data);

/** Active un compte : passe verified à true et efface le token d'activation. */
const activate = (user) => {
    user.verified = true;
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
    return user.save();
};

/**
 * @param {string} id
 * @param {object} data
 */
const updateById = (id, data) =>
    User.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true })
        .select(HIDDEN_FIELDS)
        .populate("group", "name color");

/** @param {string} id */
const deleteById = (id) => User.findByIdAndDelete(id);

export default { findAll, findPaginated, findById, findByEmail, findByEmailWithPassword, findByActivationToken, findVerifiedIds, create, activate, updateById, deleteById };
