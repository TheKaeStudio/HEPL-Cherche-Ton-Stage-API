import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Nom requis"],
            trim: true,
            minlength: 2,
            maxLength: 30,
        },
        email: {
            type: String,
            required: [true, "Adresse mail requis"],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 5,
            maxLength: 255,
            match: [/\S+@\S+\.\S+/, "Entrez une adresse mail valide"],
        },
        password: {
            type: String,
            required: [true, "Mot de passe requis"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            default: "student",
        },
    },
    { timestamps: true },
);

export default mongoose.model("User", userSchema);
