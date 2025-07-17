import mongoose, { Schema, Document } from "mongoose";
const IncidentSchema: Schema = new Schema({
  incidentId: { type: String, required: true, unique: true },
  incidentType: { type: String, required: true },
  machineId: { type: String, required: true },
  operatorId: { type: String, required: true },
  location: { type: String, required: true },
  dateTime: { type: Date, required: true },
  weather: { type: String, required: true },
  cause: { type: String, required: true },
  contributingFactors: { type: [String], default: [] },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Low",
    required: true,
  },
  actionsTaken: { type: String, required: true },
  detailedDescription: { type: String, required: true },
});

const IncidentModel =
  mongoose.models.Incident || mongoose.model("Incident", IncidentSchema);

export default IncidentModel;
