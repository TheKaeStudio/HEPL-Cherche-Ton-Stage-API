import winston from "winston";

const { combine, timestamp, colorize, printf, errors } = winston.format;

const fmt = printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}] ${stack || message}${metaStr}`;
});

const isProd = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
    level: isProd ? "info" : "debug",
    format: combine(
        errors({ stack: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        ...(isProd ? [] : [colorize()]),
        fmt,
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
