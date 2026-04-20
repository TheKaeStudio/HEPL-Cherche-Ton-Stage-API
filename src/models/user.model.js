import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        lastname: {
            type: String,
            required: [true, "Nom requis"],
            trim: true,
            minlength: 2,
            maxlength: 30,
        },
        firstname: {
            type: String,
            required: [true, "Prénom requis"],
            trim: true,
            minlength: 2,
            maxlength: 30,
        },
        email: {
            type: String,
            required: [true, "Adresse mail requis"],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 5,
            maxlength: 255,
            match: [
                /^[a-zA-Z0-9._%+-]+@(student\.)?hepl\.be$/,
                "Veuillez utiliser une adresse email HEPL valide",
            ],
        },
        password: {
            type: String,
            required: [true, "Mot de passe requis"],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["student", "teacher", "manager", "admin"],
            default: "student",
        },
        promotion: {
            type: String,
            trim: true,
        },
        phone: { type: String, trim: true },
        photo: { type: String, trim: true },
        verified: { type: Boolean, default: false },
        activationToken: { type: String },
        activationTokenExpires: { type: Date },
    },
    { timestamps: true },
);

export default mongoose.model("User", userSchema);
