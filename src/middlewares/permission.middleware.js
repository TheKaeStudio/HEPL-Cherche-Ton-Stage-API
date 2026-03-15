import { rolePermissions } from "../../config/roles.js";

export const authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        const role = req.user.role;

        const permissions = rolePermissions[role] || [];

        if (!permissions) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const hasPermission = requiredPermissions.some((permission) =>
            permissions.includes(permission),
        );

        if (!hasPermission) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        next();
    };
};
