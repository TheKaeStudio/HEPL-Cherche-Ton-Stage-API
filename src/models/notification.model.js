import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Utilisateur requis"],
        },
        type: {
            type: String,
            enum: [
                "new_message",
                "new_company",
                "internship_assigned",
                "internship_comment",
                "internship_status_changed",
            ],
            required: [true, "Type de notification requis"],
        },
        ref: {
            model: {
                type: String,
                enum: ["Message", "Company", "Internship", "Comment"],
            },
            id: { type: Schema.Types.ObjectId },
        },
        message: { type: String },
        read: { type: Boolean, default: false },
        readAt: { type: Date },
    },
    { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
