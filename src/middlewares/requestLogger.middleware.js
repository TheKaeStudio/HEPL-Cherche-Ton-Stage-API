import logger from "../utils/logger.js";

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
