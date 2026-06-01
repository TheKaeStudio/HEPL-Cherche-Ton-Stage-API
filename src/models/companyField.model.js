import mongoose from "mongoose";

const companyFieldSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true },
);

export default mongoose.model("CompanyField", companyFieldSchema);
