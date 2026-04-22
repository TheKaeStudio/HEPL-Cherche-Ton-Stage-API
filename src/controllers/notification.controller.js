import notificationRepo from "../repositories/notification.repository.js";

const parsePage = (query, defaultLimit = 20) => {
    const page  = Math.max(1, parseInt(query.page)  || 1);
    const limit = Math.min(100, parseInt(query.limit) || defaultLimit);
    const skip  = (page - 1) * limit;
    return { page, limit, skip };
};

export const getNotifications = async (req, res, next) => {
    try {
        if (req.query.page) {
            const { page, limit, skip }       = parsePage(req.query);
            const { notifications, total }    = await notificationRepo.findByUserPaginated(req.user._id, skip, limit);
            return res.status(200).json({
                success: true,
                notifications,
                total,
                hasMore: skip + notifications.length < total,
                page,
                limit,
            });
        }
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
