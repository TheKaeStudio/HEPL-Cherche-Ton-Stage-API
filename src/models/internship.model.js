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
            default: null,
        },
        externalCompanyName: { type: String, trim: true, default: null },
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            default: null,
        },
        status: {
            type: String,
            enum: ["assigned", "in_progress", "submitted", "validated", "rejected", "docs_submitted", "docs_rejected", "completed"],
            default: "assigned",
        },
        schoolYear: { type: String, trim: true },
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
            companyType: { type: String, enum: ["existing", "external"] },
            externalCompanyName: String,
            externalCompanyWebsite: String,
            submittedAt: Date,
        },
        documents: {
            convention: String,
            report: String,
            submittedAt: Date,
            rejectionComment: String,
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
