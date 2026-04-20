import messageRepo from "../repositories/message.repository.js";
import { createNotification } from "../utils/createNotification.js";

export const getInbox = async (req, res, next) => {
    try {
        const messages = await messageRepo.findByRecipient(req.user._id);
        return res.status(200).json({ success: true, messages });
    } catch (err) {
        return next(err);
    }
};

export const getMessageById = async (req, res, next) => {
    try {
        const message = await messageRepo.findByIdAndRecipient(req.params.id, req.user._id);

        if (!message) return res.status(404).json({ success: false, error: "Message introuvable" });

        return res.status(200).json({ success: true, message });
    } catch (err) {
        return next(err);
    }
};

export const sendMessage = async (req, res, next) => {
    const { recipientId, subject, content } = req.body;

    try {
        const message = await messageRepo.create({ sender: req.user._id, recipient: recipientId, subject, content });

        createNotification(recipientId, "new_message", "Message", message._id);

        return res.status(201).json({ success: true, message });
    } catch (err) {
        return next(err);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const message = await messageRepo.markAsRead(req.params.id, req.user._id);

        if (!message) return res.status(404).json({ success: false, error: "Message introuvable" });

        return res.status(200).json({ success: true, message });
    } catch (err) {
        return next(err);
    }
};
