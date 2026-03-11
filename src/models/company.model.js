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
    },
    { timestamps: true },
);

export default mongoose.model("Company", companySchema);
