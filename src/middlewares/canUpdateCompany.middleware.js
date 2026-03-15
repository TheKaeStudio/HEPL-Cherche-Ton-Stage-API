import jwt from "jsonwebtoken";
import { rolePermissions } from "../../config/roles.js";
import p from "../../config/permissions.js";
import User from "../models/user.model.js";

export const canUpdateCompany = async (req, res, next) => {
    const companyId = req.params.companyId;

    // Vérifier si l'utilisateur a la permission
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user) {
                const permissions = rolePermissions[user.role] || [];
                const canUpdate = permissions.includes(p.COMPANY_UPDATE);

                if (canUpdate) {
                    req.user = user;
                    return next();
                }
            }
        } catch (err) {
            console.log(
                "Session utilisateur invalide, tentative via token temporaire...",
            );
        }
    }

    // Si pas de permission, vérifier token JWT limited
    const token = req.query.token;

    if (!token) {
        return res.status(403).json({ message: "Accès réfusé" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (
            decoded.type === "company-edit" &&
            decoded.companyId === companyId
        ) {
            return next();
        }

        return res.status(403).json({ message: "Accès réfusé" });
    } catch (err) {
        return res.status(401).json({ message: "Session invalide" });
    }
};
