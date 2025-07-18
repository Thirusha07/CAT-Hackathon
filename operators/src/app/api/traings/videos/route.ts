// app/api/training-modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import TrainingModule from '../../../../../models/training'; // Adjust path as needed
import connectDB from '../../../../../lib/mongo'; // Adjust path as needed

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    // --- CHANGE THIS LINE: Get 'alert_type' instead of 'trigger_event' ---
    const selectedAlertType = searchParams.get("alert_type"); // Use the name sent by the frontend

    let query = {};
    // --- Use the correctly retrieved parameter here ---
    if (selectedAlertType) {
      query = {
        $or: [
          // Match the 'trigger_event' field (uppercase, as in your TRN-xxx docs)
          { trigger_event: selectedAlertType.toUpperCase() },
          // Match the 'alertType' field (title case, as in your fuel-xxx/idle-xxx docs)
          { alertType: selectedAlertType }
        ]
      };
    }

    // --- These console logs are good for debugging, they show the full DB content ---
    const allModules = await TrainingModule.find();
    console.log("🔍 All modules in DB:");
    allModules.forEach(m => console.log(m.title, '| Trigger_Event:', m.trigger_event, '| AlertType:', m.alertType));

    // --- This is the critical line that performs the filtered fetch ---
    const filteredModules = await TrainingModule.find(query);

    // --- Updated console logs to reflect correct parameter name ---
    console.log("📦 Query parameter (alert_type from frontend):", selectedAlertType);
    console.log("📦 Actual MongoDB query used:", JSON.stringify(query)); // Shows the exact query object
    console.log("📦 Modules fetched by query:", filteredModules); // Shows ONLY the filtered results

    return NextResponse.json({ trainingModules: filteredModules }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching training modules:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}