import logger from "../utils/logger.js";
import dbLog from "../utils/dbLogger.js";

/**
 * Gestionnaire d'erreurs Express centralisé.
 * Normalise CastError (404), duplicate key (400), ValidationError (400) et erreurs génériques.
 * Logue les erreurs 5xx dans la DB via dbLog.
 */
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Erreur serveur";

    if (err.name === "CastError") {
        statusCode = 404;
        message = "Ressource introuvable";
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        statusCode = 400;
        message = `La valeur du champ "${field}" est déjà utilisée.`;
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    if (statusCode >= 500) {
        logger.error(err);
        dbLog({
            level: "error",
            action: "SERVER_ERROR",
            message: err.message || "Erreur interne",
            userId: req.user?._id ?? null,
            ip: req.ip,
            meta: { method: req.method, url: req.originalUrl, stack: err.stack },
        });
    }

    res.status(statusCode).json({ success: false, error: message });
};

export default errorMiddleware;
