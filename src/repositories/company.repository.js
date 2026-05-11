import Company from "../models/company.model.js";

/** Retourne toutes les entreprises avec leur secteur, triées par date décroissante. */
const findAll = () => Company.find().populate("sector", "name color").sort({ createdAt: -1 });

/**
 * Retourne une page d'entreprises.
 * @param {number} skip - Nombre de documents à sauter.
 * @param {number} limit - Nombre de documents à retourner.
 * @returns {Promise<{ companies: Company[], total: number }>}
 */
const findPaginated = async (skip, limit) => {
    const [companies, total] = await Promise.all([
        Company.find().populate("sector", "name color").sort({ createdAt: -1 }).skip(skip).limit(limit),
        Company.countDocuments(),
    ]);
    return { companies, total };
};

/**
 * @param {string} id
 * @returns {Promise<Company|null>}
 */
const findById = (id) => Company.findById(id).populate("sector", "name color");

/**
 * @param {string} key - Clé d'invitation.
 * @returns {Promise<Company|null>}
 */
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

/**
 * Crée une entreprise. Normalise contacts → contact/contacts.
 * @param {object} data
 * @returns {Promise<Company>}
 */
const create = async (data) => {
    const company = await Company.create(normalizeContacts(data));
    return company.populate("sector", "name color");
};

/**
 * @param {string} id
 * @param {object} data
 * @returns {Promise<Company|null>}
 */
const updateById = (id, data) =>
    Company.findByIdAndUpdate(id, normalizeContacts(data), {
        returnDocument: "after",
        runValidators: true,
    }).populate("sector", "name color");

/**
 * @param {string} id
 * @returns {Promise<Company|null>}
 */
const deleteById = (id) => Company.findByIdAndDelete(id);

/**
 * Génère et stocke une clé d'invitation pour une entreprise.
 * @param {string} id
 * @param {string} key - Clé hex générée par crypto.
 * @returns {Promise<Company|null>}
 */
const setInviteKey = async (id, key) => {
    const company = await Company.findById(id);
    if (!company) return null;
    company.invite = { key, createdAt: new Date(), used: false };
    return company.save();
};

/**
 * Marque la clé d'invitation comme utilisée.
 * @param {Company} company
 */
const consumeInvite = (company) => {
    company.invite.used = true;
    return company.save();
};

export default {
    findAll,
    findPaginated,
    findById,
    findByInviteKey,
    create,
    updateById,
    deleteById,
    setInviteKey,
    consumeInvite,
};
