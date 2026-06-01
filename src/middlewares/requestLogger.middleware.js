import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    console.log(`→ ${req.method} ${req.originalUrl} [${new Date().toISOString()}] origin=${req.headers.origin ?? "-"}`);

    res.on("finish", () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
        console.log(`← ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
        logger[level](`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`, {
            userId: req.user?._id ?? "anonymous",
            ip: req.ip,
        });
    });

    next();
};
