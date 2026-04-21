import userRepo from "../repositories/user.repository.js";
import dbLog from "../utils/dbLogger.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await userRepo.findAll();
        return res.status(200).json({ success: true, users });
    } catch (err) {
        return next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await userRepo.findById(req.params.id);

        if (!user) {
            const err = new Error("Utilisateur introuvable");
            err.statusCode = 404;
            throw err;
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        return next(err);
    }
};

export const updateUser = async (req, res, next) => {
    const { role, group, phone, photo } = req.body;
    const requesterId = req.user._id;
    const requesterRole = req.user.role;

    if (role && requesterRole !== "admin") {
        return res.status(403).json({ success: false, error: "Seul un admin peut modifier le rôle d'un utilisateur" });
    }

    const updates = {};
    if (role !== undefined) updates.role = role;
    if (group !== undefined) updates.group = group;
    if (phone !== undefined) updates.phone = phone;
    if (photo !== undefined) updates.photo = photo;

    try {
        const user = await userRepo.updateById(req.params.id, updates);

        if (!user) {
            const err = new Error("Utilisateur introuvable");
            err.statusCode = 404;
            throw err;
        }

        dbLog({ action: "USER_UPDATED", message: `Utilisateur modifié: ${user.email}`, userId: requesterId, ip: req.ip, meta: { targetUserId: req.params.id, updates } });

        return res.status(200).json({ success: true, user });
    } catch (err) {
        return next(err);
    }
};

export const updateMe = async (req, res, next) => {
    const ALLOWED = ["photo", "phone", "firstname", "lastname"];
    const updates = {};
    for (const key of ALLOWED) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    try {
        const user = await userRepo.updateById(req.user._id, updates);
        return res.status(200).json({ success: true, user });
    } catch (err) {
        return next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await userRepo.findById(req.params.id);
        if (!user) {
            const err = new Error("Utilisateur introuvable");
            err.statusCode = 404;
            throw err;
        }

        await userRepo.deleteById(req.params.id);

        dbLog({ level: "warn", action: "USER_DELETED", message: `Utilisateur supprimé: ${user.firstname} ${user.lastname} (${user.email})`, userId: req.user._id, ip: req.ip, meta: { deletedUserId: user._id, email: user.email, role: user.role } });

        return res.status(200).json({ success: true, message: `Utilisateur ${user.firstname} ${user.lastname} supprimé avec succès` });
    } catch (err) {
        return next(err);
    }
};
