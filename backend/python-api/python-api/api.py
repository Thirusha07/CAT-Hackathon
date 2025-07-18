from flask import Flask, jsonify, request
from flask_cors import CORS
from fatigue_detection import is_driver_fatigued
from proximity_hazards import run_proximity_detection # You'll need to refactor this
from weather_api import fetch_weather_data, classify_weather
from chatbot import get_chatbot_response
from task_time_estimation import train_model,predict_task_time


app = Flask(__name__)
CORS(app)

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is required"}), 400
    
    weather_data = fetch_weather_data(city)
    if weather_data:
        # Assuming you want to return the classified forecast
        forecast_list = weather_data.get("list", [])
        classified_forecast = []
        for entry in forecast_list:
            classified_forecast.append({
                "dt_txt": entry.get("dt_txt", "N/A"),
                "classification": classify_weather(entry)
            })
        return jsonify(classified_forecast)
    return jsonify({"error": "Could not fetch weather data"}), 500


@app.route('/api/start-fatigue-detection', methods=['POST'])
def start_fatigue_detection():
    fatigued = is_driver_fatigued()
    return jsonify({
        "status": "completed",
        "fatigued": fatigued
    })


@app.route('/api/start-proximity-detection', methods=['POST'])
def start_proximity_detection():
    run_proximity_detection()
    return jsonify({"status": "Proximity detection started. This response will not be sent."})
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get('question', '').strip()

    if not question:
        return jsonify({'error': 'No question provided.'}), 400

    response = get_chatbot_response(question)
    return jsonify({'response': response})
@app.route('/api/predict-duration', methods=['POST'])
def predict_task_duration():
    data = request.get_json()
    location = data.get("location")
    task = data.get("task")

    if not location or not task:
        return jsonify({"error": "Both 'location' and 'task' are required"}), 400

    # 🌦️ Step 1: Call your Weather API
    weather_data = fetch_weather_data(location)

    if weather_data and "list" in weather_data:
        # 🧠 Step 2: Use first entry in the forecast and classify it
        current_entry = weather_data["list"][0]
        weather = classify_weather(current_entry)

        duration_model = train_model()
        # 🔮 Step 3: Predict using the trained ML model
        estimated_time = predict_task_time(duration_model, task_type=task, weather=weather)

        return jsonify({
            "location": location,
            "task": task,
            "weather": weather,
            "estimated_duration_minutes": round(estimated_time, 2)
        })
    else:
        return jsonify({"error": "Failed to fetch or classify weather data"}), 500



print("✅ Server is starting...")
if __name__ == "__main__":
    app.run(debug=True, port=5001)