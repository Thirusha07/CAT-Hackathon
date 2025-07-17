import mongoose, { Schema, Document, models, model } from "mongoose";

// Define the type for weather
export enum Weather {
  SUNNY = "Sunny",
  RAINY = "Rainy",
  CLOUDY = "Cloudy",
  WINDY = "Windy",
  STORMY = "Stormy",
}

// Create the Mongoose schema
const ActivitySchema = new Schema(
  {
    operatorId: {
      type: String,
      required: true,
    },
    machineId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    weather: {
      type: String,
      enum: Object.values(Weather),
      default: Weather.SUNNY,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite on hot reload in dev
const Activity = models.Activity || model("Activity", ActivitySchema);

export default Activity;
