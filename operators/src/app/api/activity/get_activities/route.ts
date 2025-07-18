import Activity from "../../../../../models/activity";


export async function getAllActivitiesWithTasks() {
  try {
    const activities = await Activity.find().populate("taskId"); // Populates task details
    return activities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
}