import Notification from "../models/notification.model.js";

/**
 * Crée une notification en base de données de façon silencieuse (ignore les erreurs).
 * @param {string} userId - Destinataire de la notification.
 * @param {string} type - Type de notification (new_message, internship_assigned…).
 * @param {string} refModel - Modèle référencé (Message, Internship, Comment…).
 * @param {string} refId - ID du document référencé.
 * @param {string|null} [message] - Message optionnel à afficher.
 */
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
