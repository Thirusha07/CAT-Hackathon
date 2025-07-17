// src/app/api/predict/route.ts
import { NextResponse } from 'next/server';

// IMPORTANT: Store this in your .env.local file
const PYTHON_ML_SERVER_URL = process.env.PYTHON_ML_SERVER_URL || 'http://127.0.0.1:5000';

export async function POST(request: Request) {
  try {
    const {
      operatorFatigueScore,
      shiftHours,
      machineTempAnomaly,
      hydraulicPressureFluctuation,
      recentHarshEvents,
      weatherCondition,
      locationType,
      operatorExperienceYears,
      timeOfDayCategory,
      taskType
    } = await request.json();

    // Prepare data payload for the Python server
    const payload = {
      operator_fatigue_score: operatorFatigueScore,
      shift_hours: shiftHours,
      machine_temp_anomaly: machineTempAnomaly,
      hydraulic_pressure_fluctuation: hydraulicPressureFluctuation,
      recent_harsh_events: recentHarshEvents,
      weather_condition: weatherCondition,
      location_type: locationType,
      operator_experience_years: operatorExperienceYears,
      time_of_day_category: timeOfDayCategory,
      task_type: taskType
    };

    console.log('Forwarding payload to Python ML server:', payload);

    // Forward the request to your Python ML server
    const pythonResponse = await fetch(`${PYTHON_ML_SERVER_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json();
      console.error('Error from Python ML server:', errorData);
      return NextResponse.json({ error: 'Prediction failed from ML server', details: errorData }, { status: pythonResponse.status });
    }

    const predictionResult = await pythonResponse.json();
    console.log('Received prediction from Python ML server:', predictionResult);

    return NextResponse.json(predictionResult);

  } catch (error) {
    console.error('Error in Next.js API route:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}