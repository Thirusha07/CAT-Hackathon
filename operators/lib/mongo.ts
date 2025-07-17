import mongoose from "mongoose";

const URI = 'mongodb+srv://21pw39:KLT4FLQyxfHGurWd@cat.p3vbxlh.mongodb.net/';
console.log("Hello")

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        console.log("Entered to db");
        await mongoose.connect(URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

export default connectDB;