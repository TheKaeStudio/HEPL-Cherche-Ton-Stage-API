import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        internship: {
            type: Schema.Types.ObjectId,
            ref: "Internship",
            required: [true, "Stage requis"],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Auteur requis"],
        },
        content: {
            type: String,
            required: [true, "Contenu requis"],
            trim: true,
            maxlength: [2000, "Le commentaire ne peut pas dépasser 2000 caractères"],
        },
    },
    { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
