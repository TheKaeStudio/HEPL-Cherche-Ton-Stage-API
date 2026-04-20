import mongoose from "mongoose";

const Schema = mongoose.Schema;

const internshipSchema = new Schema(
    {
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: [true, "Entreprise requise"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedTeacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: ["Bachelier", "Master", "Observation"],
        },
        group: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["assigned", "in_progress", "submitted", "validated", "rejected"],
            default: "assigned",
        },
        deadline: {
            type: Date,
        },
        isGroupAssignment: {
            type: Boolean,
            default: false,
        },
        sheet: {
            startDate: Date,
            endDate: Date,
            missions: [String],
            description: String,
            companyTutor: {
                name: String,
                email: String,
                phone: String,
            },
            submittedAt: Date,
        },
        evaluation: {
            grade: { type: Number, min: 0, max: 20 },
            comment: String,
            validatedBy: { type: Schema.Types.ObjectId, ref: "User" },
            validatedAt: Date,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Internship", internshipSchema);
