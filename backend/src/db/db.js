import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const projectname = 'resume-builder';
        await mongoose.connect(`${process.env.MONGO_URI}/${projectname}`);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;