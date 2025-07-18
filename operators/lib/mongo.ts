// lib/connectDB.ts
import mongoose from "mongoose";

const URI = 'mongodb+srv://21pw39:KLT4FLQyxfHGurWd@cat.p3vbxlh.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    console.log("Connected DB name:", mongoose.connection.name);
    return;
  }

    try {
        console.log("Entered to db");
        await mongoose.connect(URI,{
  dbName: "Hackathon",
});
 console.log("Connected DB name:", mongoose.connection.name);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

export default connectDB;
