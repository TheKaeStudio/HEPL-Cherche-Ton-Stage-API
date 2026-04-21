import mongoose from "mongoose";

const sectorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Nom du secteur requis"],
            unique: true,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
            default: "#6b7280",
        },
    },
    { timestamps: true },
);

export default mongoose.model("Sector", sectorSchema);
