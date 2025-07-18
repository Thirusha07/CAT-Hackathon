import { NextRequest, NextResponse } from 'next/server';

import connectDB from '../../../../../lib/mongo';
import Activity, { Weather } from '../../../../../models/activity';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const { operatorId, machineId, taskId, weather } = body;

  try {
    const activity = await Activity.create({
      operatorId,
      machineId,
      taskId,
      weather: weather || Weather.SUNNY,
    });

    return NextResponse.json({ message: 'Activity created', activity }, { status: 201 });
  } catch (err) {
    console.error('Error creating activity:', err);
    return NextResponse.json({ message: 'Error creating activity' }, { status: 500 });
  }
}
