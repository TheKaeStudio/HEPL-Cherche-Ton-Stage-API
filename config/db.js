import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected in ${process.env.NODE_ENV} mode`);
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
};

export default connectDB;