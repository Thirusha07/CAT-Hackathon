// models/TrainingModule.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

// Define the schema
const TrainingModuleSchema = new Schema(
  {
    id: { type: String, required: true, unique: true }, // 👈 Optional: see notes below
    title: { type: String, required: true },
    alertType: String, // 👈 Make it required if always expected
    description: { type: String, required: true },
    video_url: { type: String, required: true },
    source: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in dev
const TrainingModule = models.TrainingModule || model("TrainingModule", TrainingModuleSchema, "Training");

export default TrainingModule;
