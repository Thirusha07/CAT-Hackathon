import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongo';
import Machine from '../../../../../models/machine';


export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const data = await req.json();

    const existing = await Machine.findOne({ machineId: data.machineId });
    if (existing) {
      return NextResponse.json({ message: "Machine already exists" }, { status: 409 });
    }

    const machine = await Machine.create(data);
    return NextResponse.json({ message: "Machine created successfully", machine }, { status: 201 });
  } catch (err) {
    console.error("Error creating machine:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
