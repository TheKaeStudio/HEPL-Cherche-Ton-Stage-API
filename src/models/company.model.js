import mongoose from "mongoose";

const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        invite: {
            key: String,
            createdAt: Date,
            used: { type: Boolean, default: false },
        },
    },
    { timestamps: true },
);

export default mongoose.model("Company", companySchema);
