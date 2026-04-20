import logRepo from "../repositories/log.repository.js";

export const getLogs = async (req, res, next) => {
    const { level, action, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (level) filter.level = level;
    if (action) filter.action = action;

    try {
        const [logs, total] = await Promise.all([
            logRepo.findAll({ filter, page, limit }),
            logRepo.count(filter),
        ]);

        return res.status(200).json({
            success: true,
            logs,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (err) {
        return next(err);
    }
};
