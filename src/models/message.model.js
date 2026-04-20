import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Expéditeur requis"],
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Destinataire requis"],
        },
        subject: {
            type: String,
            required: [true, "Sujet requis"],
            trim: true,
            maxlength: [255, "Le sujet ne peut pas dépasser 255 caractères"],
        },
        content: {
            type: String,
            required: [true, "Contenu requis"],
            trim: true,
        },
        read: { type: Boolean, default: false },
        readAt: { type: Date },
    },
    { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
