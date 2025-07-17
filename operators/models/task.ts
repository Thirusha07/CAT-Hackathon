import mongoose, { Schema, Document, model, models } from "mongoose";

// Enum for task status
export enum TaskStatus {
  COMPLETED = "Completed",
  ASSIGNED = "Assigned",
  UNASSIGNED = "Unassigned",
}

// Define the schema
const TaskSchema = new Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.UNASSIGNED,
    },
    assignedOperator: {
      type: String,
      required: false,
    },
    assignedManager: {
      type: String,
      required: false,
    },
    machineType: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in dev
const Task = models.Task || model("Task", TaskSchema);

export default Task;
