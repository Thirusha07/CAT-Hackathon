// app/api/training-modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import TrainingModule from '../../../../../models/training'; // Adjust path as per your project structure
import connectDB from '../../../../../lib/mongo'; // Adjust path as per your project structure

// app/api/training-modules/route.ts

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const alertType = searchParams.get("alert_type");

    let query = {};
    if (alertType) {
      query = { alertType: alertType.toLowerCase() }; // Assuming field is 'alertType'
    }

    const modules = await TrainingModule.find(query);

    console.log("Query alertType:", alertType);
    console.log("Modules fetched:", modules);

    return NextResponse.json({ trainingModules: modules }, { status: 200 });

  } catch (error) {
    console.error("Error fetching training modules:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// export async function POST(req: NextRequest) {
//   // Establish a connection to the MongoDB database
//   await connectDB();

//   try {
//     // Parse the incoming request body as JSON
//     const body = await req.json();
//     console.log("Incoming request body for TrainingModule:", body);

//     // Check if a training module with the given ID already exists
//     const existingModule = await TrainingModule.findOne({ id: body.id });
//     if (existingModule) {
//       // If a module with the same ID is found, return a 409 Conflict response
//       return NextResponse.json({ message: "Training module with this ID already exists" }, { status: 409 });
//     }

//     // Create a new TrainingModule document in the database using the request body
//     const newTrainingModule = await TrainingModule.create(body);
//     console.log("Saved TrainingModule document:", newTrainingModule);

//     // Return a 201 Created response with a success message and the created module
//     return NextResponse.json({ message: "Training module created successfully", trainingModule: newTrainingModule }, { status: 201 });
//   } catch (error) {
//     // Catch any errors that occur during the process
//     if (error instanceof Error) {
//       // Log the specific error message if it's an instance of Error
//       console.error("Error creating training module:", error.message);

//       // If the error is a Mongoose validation error, return a 400 Bad Request
//       if (error.name === 'ValidationError') {
//         return NextResponse.json({ message: error.message }, { status: 400 });
//       }

//       // For any other general error, return a 500 Internal Server Error
//       return NextResponse.json({ message: "Error creating training module" }, { status: 500 });
//     } else {
//       // Handle unknown error types
//       console.error("Unknown error occurred while creating training module:", error);
//       return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
//     }
//   }
// }
