import mongoose, { Schema, Document, model, models } from "mongoose";

// Enum for machine types
export enum MachineType {
  DUMP_TRUCK = "Dump Truck",
  WHEEL_LOADER = "Wheel Loader",
  GRADER = "Grader",
  DOZER = "Dozer",
  LOADER = "Loader",
  EXCAVATOR = "Excavator",
}

// Define the schema
const MachineSchema = new Schema(
  {
    machineIds: {
      type: [String],
      required: true,
      validate: [(val: string[]) => val.length > 0, "At least one machine ID is required"],
    },
    machineType: {
      type: String,
      enum: Object.values(MachineType),
      required: true,
    },
    tasks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development
const Machine = models.Machine || model("Machine", MachineSchema);

export default Machine;
