import mongoose from "mongoose";

const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Nom de l'entreprise requis"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description requise"],
        },
        logo: { type: String, trim: true },
        sector: {
            type: String,
            trim: true,
        },
        size: {
            type: String,
            enum: ["TPE", "PME", "ETI", "GE"],
        },
        offresObservation: { type: Boolean, default: false },
        offres3e: { type: Boolean, default: false },
        address: {
            street: String,
            city: String,
            province: String,
            postalCode: String,
            country: { type: String, default: "Belgique" },
        },
        website: { type: String, trim: true },
        phone: { type: String, trim: true },
        contactPerson: {
            name: String,
            email: String,
            phone: String,
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
