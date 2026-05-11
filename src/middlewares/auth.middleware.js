import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * Vérifie le JWT Bearer dans Authorization header.
 * Charge l'utilisateur depuis la DB et vérifie que son email est confirmé.
 * Attache `req.user` sur succès.µ
 */
export const authenticate = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, error: "Accès refusé" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, error: "Accès refusé" });
        }

        if (!user.verified) {
            return res.status(403).json({ success: false, code: "EMAIL_NOT_VERIFIED", error: "Tu dois confirmer ton adresse email avant d'accéder à cette ressource." });
        }

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: "Token invalide ou expiré" });
    }
};