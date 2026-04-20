import mongoose from "mongoose";

const Schema = mongoose.Schema;

const logSchema = new Schema(
    {
        level: {
            type: String,
            enum: ["info", "warn", "error"],
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        ip: {
            type: String,
            default: null,
        },
        meta: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true },
);

logSchema.index({ createdAt: -1 });
logSchema.index({ level: 1 });
logSchema.index({ action: 1 });

export default mongoose.model("Log", logSchema);
