import commentRepo from "../repositories/comment.repository.js";
import internshipRepo from "../repositories/internship.repository.js";
import { createNotification } from "../utils/createNotification.js";

/**
 * GET /api/internships/:id/comments
 * Retourne les commentaires d'un stage.
 * @param {{ params: { id: string } }} req
 */
export const getComments = async (req, res, next) => {
    try {
        const comments = await commentRepo.findByInternship(req.params.id);
        return res.status(200).json({ success: true, comments });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/internships/:id/comments
 * Ajoute un commentaire sur un stage. Notifie les étudiants assignés.
 * @requires COMMENT_CREATE
 * @param {{ params: { id: string }, body: { content: string } }} req
 */
export const addComment = async (req, res, next) => {
    const { content } = req.body;

    try {
        const internship = await internshipRepo.findRawById(req.params.id);
        if (!internship) return res.status(404).json({ success: false, error: "Stage introuvable" });

        const comment = await commentRepo.create({
            internship: internship._id,
            author: req.user._id,
            content,
        });

        for (const studentId of internship.students) {
            createNotification(studentId, "internship_comment", "Comment", comment._id);
        }

        return res.status(201).json({ success: true, comment });
    } catch (err) {
        return next(err);
    }
};

/**
 * DELETE /api/internships/:id/comments/:commentId
 * Supprime un commentaire.
 * @requires COMMENT_DELETE
 * @param {{ params: { id: string, commentId: string } }} req
 */
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await commentRepo.deleteById(req.params.commentId);

        if (!comment) return res.status(404).json({ success: false, error: "Commentaire introuvable" });

        return res.status(200).json({ success: true, message: "Commentaire supprimé" });
    } catch (err) {
        return next(err);
    }
};
