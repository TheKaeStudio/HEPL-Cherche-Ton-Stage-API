import Message from "../models/message.model.js";

const SENDER_FIELDS = "firstname lastname email role";

const findByRecipient = (userId) =>
    Message.find({ recipient: userId })
        .populate("sender", SENDER_FIELDS)
        .sort({ createdAt: -1 });

const findByRecipientPaginated = async (userId, skip, limit) => {
    const filter = { recipient: userId };
    const [messages, total] = await Promise.all([
        Message.find(filter).populate("sender", SENDER_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Message.countDocuments(filter),
    ]);
    return { messages, total };
};

const findByIdAndRecipient = (id, recipientId) =>
    Message.findOne({ _id: id, recipient: recipientId }).populate("sender", SENDER_FIELDS);

const create = (data) => Message.create(data);

const markAsRead = async (id, recipientId) => {
    const message = await Message.findOne({ _id: id, recipient: recipientId });
    if (!message) return null;
    message.read = true;
    message.readAt = new Date();
    return message.save();
};

export default { findByRecipient, findByRecipientPaginated, findByIdAndRecipient, create, markAsRead };
