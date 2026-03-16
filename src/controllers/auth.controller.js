import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendActivationEmail } from "../utils/sendActivationEmail.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { lastname, firstname, email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            const err = new Error("Cette adresse mail est déjà utilisée");
            err.statusCode = 409;
            throw err;
        }

        let role = "student";
        if (normalizedEmail.endsWith("@hepl.be")) role = "teacher";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const activationToken = crypto.randomBytes(32).toString("hex");
        const activationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h

        const newUser = await User.create(
            [
                {
                    lastname,
                    firstname,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role,
                    verified: false,
                    activationToken,
                    activationTokenExpires,
                },
            ],
            { session },
        );

        await sendActivationEmail(normalizedEmail, activationToken);

        const token = jwt.sign(
            { userId: newUser[0]._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
        );

        await session.commitTransaction();
        session.endSession();

        const userToReturn = newUser[0].toObject();
        delete userToReturn.password;
        delete userToReturn.activationToken;
        delete userToReturn.activationTokenExpires;

        res.status(201).json({
            success: true,
            message:
                "Vérifie ta boîte mail pour activer ton compte.",
            data: {
                token,
                user: userToReturn,
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

        const user = await User.findOne({ email }).select("+password");

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

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
            success: true,
            message: "Connecté avec succès",
            data: {
                token,
                user: userWithoutPassword,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const activateAccount = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            activationToken: token,
            activationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            const err = new Error("Lien d'activation invalide ou expiré");
            err.statusCode = 400;
            throw err;
        }

        user.verified = true;
        user.activationToken = undefined;
        user.activationTokenExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message:
                "Compte activé avec succès ! Tu peux maintenant te connecter.",
        });
    } catch (err) {
        next(err);
    }
};