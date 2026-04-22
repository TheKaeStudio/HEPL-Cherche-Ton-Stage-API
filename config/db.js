import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URI)
            .then((mongoose) => {
                return mongoose;
            });
    }

    cached.conn = await cached.promise;

    console.log(`MongoDB connected in ${process.env.NODE_ENV} mode`);

    return cached.conn;
};

export default connectDB;
