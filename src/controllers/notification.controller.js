import notificationRepo from "../repositories/notification.repository.js";

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationRepo.findByUser(req.user._id);
        return res.status(200).json({ success: true, notifications });
    } catch (err) {
        return next(err);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const notification = await notificationRepo.markAsRead(req.params.id, req.user._id);

        if (!notification) return res.status(404).json({ success: false, error: "Notification introuvable" });

        return res.status(200).json({ success: true, notification });
    } catch (err) {
        return next(err);
    }
};

export const markAllAsRead = async (req, res, next) => {
    try {
        await notificationRepo.markAllAsRead(req.user._id);
        return res.status(200).json({ success: true, message: "Toutes les notifications marquées comme lues" });
    } catch (err) {
        return next(err);
    }
};
