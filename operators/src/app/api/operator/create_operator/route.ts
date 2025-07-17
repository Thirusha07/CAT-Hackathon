import { NextRequest, NextResponse } from 'next/server';
import Operator from '../../../../../models/operator';
import connectDB from '../../../../../lib/mongo';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  try {
    const existing = await Operator.findOne({ operatorId: body.operatorId });
    if (existing) {
      return NextResponse.json({ message: "Operator already exists" }, { status: 409 });
    }

    const operator = await Operator.create(body);
    return NextResponse.json({ message: "Operator created", operator }, { status: 201 });
  } catch (error) {
    console.error("Error creating operator:", error);
    return NextResponse.json({ message: "Error creating operator" }, { status: 500 });
  }
}
