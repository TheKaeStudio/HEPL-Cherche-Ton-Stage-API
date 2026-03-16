import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: users });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            const err = new Error("Utilisateur introuvable");
            err.statusCode = 404;
            throw err;
        }
        console.log(user.firstname);

        const firstname = user.firstname || "";
        const lastname = user.lastname || "";
        
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: `Utilisateur ${firstname} ${lastname} supprimé avec succès`,
        });

        console.log(
            `Utilisateur ${firstname} ${lastname} supprimé avec succès`,
        );
    } catch (err) {
        next(err);
    }
};
