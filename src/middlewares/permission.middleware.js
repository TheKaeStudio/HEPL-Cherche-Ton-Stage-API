import { rolePermissions } from "../../config/roles.js";
import dbLog from "../utils/dbLogger.js";

export const authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        const role = req.user.role;
        const permissions = rolePermissions[role] || [];

        const hasPermission = requiredPermissions.some((permission) =>
            permissions.includes(permission),
        );

        if (!hasPermission) {
            dbLog({
                level: "warn",
                action: "PERMISSION_DENIED",
                message: `Accès refusé — rôle "${role}" sur ${req.method} ${req.originalUrl}`,
                userId: req.user._id,
                ip: req.ip,
                meta: { role, requiredPermissions },
            });
            return res.status(403).json({ message: "Accès refusé" });
        }

        next();
    };
};
