import Notification from "../models/notification.model.js";

/**
 * Retourne toutes les notifications d'un utilisateur, triées par date décroissante.
 * @param {string} userId
 */
const findByUser = (userId) =>
    Notification.find({ user: userId }).sort({ createdAt: -1 });

/**
 * @param {string} userId
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<{ notifications: Notification[], total: number }>}
 */
const findByUserPaginated = async (userId, skip, limit) => {
    const filter = { user: userId };
    const [notifications, total] = await Promise.all([
        Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Notification.countDocuments(filter),
    ]);
    return { notifications, total };
};

/**
 * @param {string} id
 * @param {string} userId
 */
const findByIdAndUser = (id, userId) =>
    Notification.findOne({ _id: id, user: userId });

/** @param {object} data */
const create = (data) => Notification.create(data);

/**
 * Marque une notification comme lue.
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<Notification|null>}
 */
const markAsRead = async (id, userId) => {
    const notification = await Notification.findOne({ _id: id, user: userId });
    if (!notification) return null;
    notification.read = true;
    notification.readAt = new Date();
    return notification.save();
};

/**
 * Marque toutes les notifications non lues d'un utilisateur comme lues.
 * @param {string} userId
 */
const markAllAsRead = (userId) =>
    Notification.updateMany({ user: userId, read: false }, { read: true, readAt: new Date() });

export default { findByUser, findByUserPaginated, findByIdAndUser, create, markAsRead, markAllAsRead };
