import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const err = new Error("Cet adresse mail est déjà utilisée");
            err.statusCode = 409;
            throw err;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create(
            [{ name, email, password: hashedPassword }],
            { session },
        );

        const token = jwt.sign(
            { userId: newUser[0]._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const err = new Error("Adresse mail invalide");
            err.statusCode = 404;
            throw err;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const err = new Error("Mot de passe incorrect");
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(200).json({
            success: true,
            message: "Connecté avec succès",
            data: {
                token,
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};
