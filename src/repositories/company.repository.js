import Company from "../models/company.model.js";

const findAll = () => Company.find().populate("sector", "name color");

const findById = (id) => Company.findById(id).populate("sector", "name color");

const findByInviteKey = (key) => Company.findOne({ "invite.key": key });

const normalizeContacts = (data) => {
    const contacts = data.contacts?.length
        ? data.contacts
        : data.contact
          ? [data.contact]
          : [];

    return {
        ...data,
        contacts: contacts,
        contact: contacts[0] ?? undefined,
    };
};

const create = async (data) => {
    const company = await Company.create(normalizeContacts(data));
    return company.populate("sector", "name color");
};

const updateById = (id, data) =>
    Company.findByIdAndUpdate(id, normalizeContacts(data), {
        returnDocument: "after",
        runValidators: true,
    }).populate("sector", "name color");

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

export default {
    findAll,
    findById,
    findByInviteKey,
    create,
    updateById,
    deleteById,
    setInviteKey,
    consumeInvite,
};
