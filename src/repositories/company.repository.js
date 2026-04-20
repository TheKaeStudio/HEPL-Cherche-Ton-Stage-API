import Company from "../models/company.model.js";

const findAll = () => Company.find();

const findById = (id) => Company.findById(id);

const findByInviteKey = (key) => Company.findOne({ "invite.key": key });

const create = (data) => Company.create(data);

const updateById = (id, data) =>
    Company.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });

const deleteById = (id) => Company.findByIdAndDelete(id);

const setInviteKey = async (id, key) => {
    const company = await Company.findById(id);
    if (!company) return null;
    company.invite = { key, createdAt: new Date(), used: false };
    return company.save();
};

const consumeInvite = (company) => {
    company.invite.used = true;
    return company.save();
};

export default { findAll, findById, findByInviteKey, create, updateById, deleteById, setInviteKey, consumeInvite };
