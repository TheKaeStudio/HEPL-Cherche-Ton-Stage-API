import logRepo from "../repositories/log.repository.js";
import logger from "./logger.js";

/**
 * @param {{ level?: "info"|"warn"|"error", action: string, message: string, userId?: string|null, ip?: string|null, meta?: object }} opts
 */
const dbLog = ({ level = "info", action, message, userId = null, ip = null, meta = {} }) => {
    logger[level](`[${action}] ${message}`, Object.keys(meta).length ? meta : undefined);

    logRepo.create({ level, action, message, userId, ip, meta }).catch((err) => {
        logger.error(`[DB_LOG_FAILED] Impossible de sauvegarder le log: ${err.message}`);
    });
};

export default dbLog;
