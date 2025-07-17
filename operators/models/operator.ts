import mongoose, { Schema, Document, model, models } from "mongoose";

// Specialization Enum
export enum Specialization {
  HEAVY_MACHINERY = "Heavy Machinery",
  EARTH_MOVING = "Earth Moving",
  MATERIAL_HANDLING = "Material Handling",
  ELECTRICAL = "Electrical",
  MECHANICAL = "Mechanical",
}

// Health symptoms enum options
const healthSymptoms = ["Drowsy", "Headache", "Dizzy", "Nausea", "Fatigued"];


// Schema definition
const OperatorSchema = new Schema(
  {
    fullName: { type: String, required: true },
    operatorId: { type: String, required: true, unique: true },
    sectorId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    assignedMachines: {
      type: [String],
      required: true,
      default: [],
    },

    primeSiteLocation: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true },
    profilePicture: { type: String },
    preferredLanguage: { type: String },
    yearsOfExperience: { type: Number, required: true },
    specialization: {
      type: String,
      enum: Object.values(Specialization),
      required: true,
    },
    healthCheckupValidUntil: { type: Date, required: true },

    operatorHealthDetails: {
      currentSymptoms: {
        type: [String],
        enum: healthSymptoms,
        default: [],
      },
      medicationList: { type: String },
      preExistingConditions: { type: String },
      realtimeBiometrics: {
        heartRate: { type: Number },
        bodyTemp: { type: Number },
        cabinTemp: { type: Number },
        cabinHumidity: { type: Number },
        cabinCO2: { type: Number },
      },
    },

    documentStatus: {
      medicalFitnessValidUntil: { type: Date, required: true },
      audiometryValidUntil: { type: Date, required: true },
      visionValidUntil: { type: Date, required: true },
      trainingCertValidUntil: { type: Date, required: true },
    },
  },
  {
    timestamps: true,
  }
);

// Export model
const Operator = models.Operator || model("Operator", OperatorSchema);
export default Operator;
