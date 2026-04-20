import jwt from "jsonwebtoken";
import { rolePermissions } from "../../config/roles.js";
import p from "../../config/permissions.js";
import userRepo from "../repositories/user.repository.js";
import logger from "../utils/logger.js";

export const canUpdateCompany = async (req, res, next) => {
    const companyId = req.params.id;

    if (req.headers.authorization?.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userRepo.findById(decoded.userId);

            if (user && rolePermissions[user.role]?.includes(p.COMPANY_UPDATE)) {
                req.user = user;
                return next();
            }
        } catch {
            logger.debug("Token utilisateur invalide, tentative via token temporaire...");
        }
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: "Accès refusé" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === "limited" && decoded.companyId === companyId) {
            return next();
        }

        return res.status(403).json({ message: "Accès refusé" });
    } catch {
        return res.status(401).json({ message: "Session invalide" });
    }
};
