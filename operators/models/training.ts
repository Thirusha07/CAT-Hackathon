// models/TrainingModule.ts
import mongoose, { Schema, Document, model, models } from "mongoose";


// Define the schema
const TrainingModuleSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    trigger_event: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video_url: { type: String, required: true },
    source: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in dev
const TrainingModule = models.TrainingModule || model("TrainingModule", TrainingModuleSchema);
export default TrainingModule;
