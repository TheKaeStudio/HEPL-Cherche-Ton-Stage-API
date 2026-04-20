import Notification from "../models/notification.model.js";

export const createNotification = async (userId, type, refModel, refId, message = null) => {
    try {
        await Notification.create({
            user: userId,
            type,
            ref: { model: refModel, id: refId },
            ...(message && { message }),
        });
    } catch (err) {
        console.error("Erreur création notification:", err);
    }
};
