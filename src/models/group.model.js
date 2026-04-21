import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Nom du groupe requis"],
            unique: true,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
            default: "#3b82f6",
        },
    },
    { timestamps: true },
);

export default mongoose.model("Group", groupSchema);
