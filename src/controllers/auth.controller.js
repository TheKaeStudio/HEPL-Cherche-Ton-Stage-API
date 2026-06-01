import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/user.repository.js";
import { sendActivationEmail } from "../utils/sendActivationEmail.js";
import dbLog from "../utils/dbLogger.js";

/**
 * POST /api/auth/sign-up
 * Crée un compte. Rôle assigné automatiquement selon le domaine email (@hepl.be → teacher, sinon student).
 * @param {{ body: { lastname: string, firstname: string, email: string, password: string } }} req
 */
export const signUp = async (req, res, next) => {
    try {
        const { lastname, firstname, email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const existingUser = await userRepo.findByEmail(normalizedEmail);
        if (existingUser) {
            const err = new Error("Cette adresse mail est déjà utilisée");
            err.statusCode = 409;
            throw err;
        }

        let role = "student";
        if (normalizedEmail.endsWith("@hepl.be")) role = "teacher";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const activationToken = crypto.randomBytes(32).toString("hex");
        // const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const newUser = await userRepo.create({
            lastname,
            firstname,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            verified: true,
            // activationToken,
            // activationTokenExpires,
        });

        // await sendActivationEmail(normalizedEmail, activationToken);

        dbLog({
            action: "AUTH_SIGNUP",
            message: `Nouvelle inscription: ${normalizedEmail}`,
            userId: newUser._id,
            ip: req.ip,
            meta: { email: normalizedEmail, role },
        });

        return res.status(201).json({
            success: true,
            message: "Compte créé. Vérifie ta boîte mail pour activer ton compte.",
        });
    } catch (err) {
        return next(err);
    }
};


/**
 * POST /api/auth/sign-in
 * Authentifie un utilisateur et retourne un JWT.
 * @param {{ body: { email: string, password: string } }} req
 * @returns {{ token: string, user: object }}
 */
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userRepo.findByEmailWithPassword(email);

        if (!user) {
            dbLog({
                level: "warn",
                action: "AUTH_SIGNIN_FAILED",
                message: `Utilisateur inconnu: ${email}`,
                ip: req.ip,
                meta: { email },
            });
            const err = new Error("Adresse mail invalide");
            err.statusCode = 404;
            throw err;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            dbLog({
                level: "warn",
                action: "AUTH_SIGNIN_FAILED",
                message: `Mauvais mot de passe: ${email}`,
                ip: req.ip,
                meta: { email, userId: user._id },
            });
            const err = new Error("Mot de passe incorrect");
            err.statusCode = 401;
            throw err;
        }

        if (!user.verified) {
            dbLog({
                level: "warn",
                action: "AUTH_SIGNIN_UNVERIFIED",
                message: `Connexion refusée — compte non vérifié: ${email}`,
                ip: req.ip,
                meta: { email, userId: user._id },
            });
            return res.status(403).json({
                success: false,
                code: "EMAIL_NOT_VERIFIED",
                error: "Tu dois confirmer ton adresse email avant de te connecter.",
            });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        dbLog({
            action: "AUTH_SIGNIN",
            message: `Connexion réussie: ${email}`,
            userId: user._id,
            ip: req.ip,
        });

        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json({
            success: true,
            message: "Connecté avec succès",
            data: { token, user: userWithoutPassword },
        });
    } catch (err) {
        return next(err);
    }
};

/**
 * GET /api/auth/activate/:token
 * Active un compte via le token reçu par email.
 * @param {{ params: { token: string } }} req
 */
export const activateAccount = async (req, res, next) => {
    try {
        const user = await userRepo.findByActivationToken(req.params.token);

        if (!user) {
            const err = new Error("Lien d'activation invalide ou expiré");
            err.statusCode = 400;
            throw err;
        }

        await userRepo.activate(user);

        dbLog({
            action: "AUTH_ACTIVATED",
            message: `Compte activé: ${user.email}`,
            userId: user._id,
            ip: req.ip,
        });

        return res.status(200).json({
            success: true,
            message:
                "Compte activé avec succès ! Tu peux maintenant te connecter.",
        });
    } catch (err) {
        return next(err);
    }
};
