import Notification from "../models/notification.model.js";

const findByUser = (userId) =>
    Notification.find({ user: userId }).sort({ createdAt: -1 });

const findByIdAndUser = (id, userId) =>
    Notification.findOne({ _id: id, user: userId });

const create = (data) => Notification.create(data);

const markAsRead = async (id, userId) => {
    const notification = await Notification.findOne({ _id: id, user: userId });
    if (!notification) return null;
    notification.read = true;
    notification.readAt = new Date();
    return notification.save();
};

const markAllAsRead = (userId) =>
    Notification.updateMany({ user: userId, read: false }, { read: true, readAt: new Date() });

export default { findByUser, findByIdAndUser, create, markAsRead, markAllAsRead };
