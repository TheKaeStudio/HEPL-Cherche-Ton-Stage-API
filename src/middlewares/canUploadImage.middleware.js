import jwt from "jsonwebtoken";
import userRepo from "../repositories/user.repository.js";

export const canUploadImage = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer")) {
        return res.status(401).json({ success: false, error: "Accès refusé" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === "limited") {
            req.user = { role: "limited", companyId: decoded.companyId };
            return next();
        }

        const user = await userRepo.findById(decoded.userId);
        if (!user) return res.status(401).json({ success: false, error: "Accès refusé" });
        if (!user.verified) return res.status(403).json({ success: false, error: "Email non vérifié" });

        req.user = user;
        return next();
    } catch {
        return res.status(401).json({ success: false, error: "Token invalide ou expiré" });
    }
};
