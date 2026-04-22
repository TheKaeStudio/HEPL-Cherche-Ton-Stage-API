import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected in ${process.env.NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
};

export default connectDB;