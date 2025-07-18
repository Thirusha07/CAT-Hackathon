import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongo';
import Activity, { Weather } from '../../../../../models/activity';


export async function PATCH(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const { activityId, operatorId } = body;

  if (!activityId || !operatorId) {
    return NextResponse.json({ message: 'Missing activityId or operatorId' }, { status: 400 });
  }

  try {
    const updated = await Activity.findByIdAndUpdate(
      activityId,
      { operatorId },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Activity updated', activity: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ message: 'Failed to update activity' }, { status: 500 });
  }
}
