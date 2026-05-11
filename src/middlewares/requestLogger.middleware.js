import logger from "../utils/logger.js";

/**
 * Logue chaque requête HTTP avec méthode, URL, status code et durée.
 * Niveau de log : info (2xx), warn (4xx), error (5xx).
 */
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const userId = req.user?._id ?? "anonymous";
        const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

        logger[level](`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`, {
            userId,
            ip: req.ip,
        });
    });

    next();
};
