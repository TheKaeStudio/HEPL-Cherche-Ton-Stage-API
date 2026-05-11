import Message from "../models/message.model.js";

const SENDER_FIELDS = "firstname lastname email role";

/**
 * Retourne tous les messages reçus par un utilisateur, triés par date décroissante.
 * @param {string} userId
 */
const findByRecipient = (userId) =>
    Message.find({ recipient: userId })
        .populate("sender", SENDER_FIELDS)
        .sort({ createdAt: -1 });

/**
 * @param {string} userId
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<{ messages: Message[], total: number }>}
 */
const findByRecipientPaginated = async (userId, skip, limit) => {
    const filter = { recipient: userId };
    const [messages, total] = await Promise.all([
        Message.find(filter).populate("sender", SENDER_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Message.countDocuments(filter),
    ]);
    return { messages, total };
};

/**
 * Retourne un message uniquement si l'utilisateur en est le destinataire.
 * @param {string} id
 * @param {string} recipientId
 */
const findByIdAndRecipient = (id, recipientId) =>
    Message.findOne({ _id: id, recipient: recipientId }).populate("sender", SENDER_FIELDS);

/** @param {object} data */
const create = (data) => Message.create(data);

/**
 * Marque un message comme lu et enregistre la date.
 * @param {string} id
 * @param {string} recipientId
 * @returns {Promise<Message|null>}
 */
const markAsRead = async (id, recipientId) => {
    const message = await Message.findOne({ _id: id, recipient: recipientId });
    if (!message) return null;
    message.read = true;
    message.readAt = new Date();
    return message.save();
};

export default { findByRecipient, findByRecipientPaginated, findByIdAndRecipient, create, markAsRead };
