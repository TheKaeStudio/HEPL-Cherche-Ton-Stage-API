import Comment from "../models/comment.model.js";

/**
 * Retourne les commentaires d'un stage, triés par date croissante (ordre chronologique).
 * @param {string} internshipId
 */
const findByInternship = (internshipId) =>
    Comment.find({ internship: internshipId })
        .populate("author", "firstname lastname role")
        .sort({ createdAt: 1 });

/** @param {object} data */
const create = (data) => Comment.create(data);

/** @param {string} id */
const deleteById = (id) => Comment.findByIdAndDelete(id);

export default { findByInternship, create, deleteById };
