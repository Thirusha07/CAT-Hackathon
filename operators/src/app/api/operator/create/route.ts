import { NextRequest, NextResponse } from 'next/server';
import Operator from '../../../../../models/operator';
import connectDB from '../../../../../lib/mongo';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    console.log("Incoming request body:", body);

    const existing = await Operator.findOne({ operatorId: body.operatorId });
    if (existing) {
      return NextResponse.json({ message: "Operator already exists" }, { status: 409 });
    }

    // Convert fields
    body.yearsOfExperience = Number(body.yearsOfExperience);
    body.healthCheckupValidUntil = new Date(body.healthCheckupValidUntil);

    if (body.documentStatus) {
      body.documentStatus.medicalFitnessValidUntil = new Date(body.documentStatus.medicalFitnessValidUntil);
      body.documentStatus.audiometryValidUntil = new Date(body.documentStatus.audiometryValidUntil);
      body.documentStatus.visionValidUntil = new Date(body.documentStatus.visionValidUntil);
      body.documentStatus.trainingCertValidUntil = new Date(body.documentStatus.trainingCertValidUntil);
    }

    const operator = await Operator.create(body);
    console.log("Saved Operator document:", operator);

    return NextResponse.json({ message: "Operator created", operator }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating operator:", error.message);

      if (error.name === 'ValidationError') {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }

      return NextResponse.json({ message: "Error creating operator" }, { status: 500 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json({ message: "Unexpected error occurred" }, { status: 500 });
    }
  }
}
