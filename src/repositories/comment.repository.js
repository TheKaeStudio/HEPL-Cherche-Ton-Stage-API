import Comment from "../models/comment.model.js";

const findByInternship = (internshipId) =>
    Comment.find({ internship: internshipId })
        .populate("author", "firstname lastname role")
        .sort({ createdAt: 1 });

const create = (data) => Comment.create(data);

const deleteById = (id) => Comment.findByIdAndDelete(id);

export default { findByInternship, create, deleteById };
