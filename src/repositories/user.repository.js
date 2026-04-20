import User from "../models/user.model.js";

const HIDDEN_FIELDS = "-password -activationToken -activationTokenExpires";

const findAll = () => User.find().select(HIDDEN_FIELDS);

const findById = (id) => User.findById(id);

const findByEmail = (email) => User.findOne({ email });

const findByEmailWithPassword = (email) => User.findOne({ email }).select("+password");

const findByActivationToken = (token) =>
    User.findOne({
        activationToken: token,
        activationTokenExpires: { $gt: Date.now() },
    });

const findVerifiedIds = () => User.find({ verified: true }, "_id");

const findDistinctPromotions = () => User.distinct("promotion", { role: "student", promotion: { $exists: true, $ne: null, $ne: "" } });

const create = (data, session = null) =>
    session
        ? User.create([data], { session }).then((docs) => docs[0])
        : User.create(data);

const activate = (user) => {
    user.verified = true;
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
    return user.save();
};

const updateById = (id, data) =>
    User.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }).select(HIDDEN_FIELDS);

const deleteById = (id) => User.findByIdAndDelete(id);

export default { findAll, findById, findByEmail, findByEmailWithPassword, findByActivationToken, findVerifiedIds, findDistinctPromotions, create, activate, updateById, deleteById };
