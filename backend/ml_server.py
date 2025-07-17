# ml_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS # Required for Cross-Origin Resource Sharing
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app) # Enable CORS for all routes, or specify origins if needed

# --- Load the trained model and preprocessor ---
try:
    model_pipeline = joblib.load('incident_prediction_model.pkl')
    print("ML Model loaded successfully.")
except FileNotFoundError:
    print("Error: 'incident_prediction_model.pkl' not found. Please run the training script first.")
    exit() # Exit if model not found, as server can't function

# Define the order of numerical and categorical features as used during training
numerical_features = ['operator_fatigue_score', 'shift_hours', 'machine_temp_anomaly',
                      'hydraulic_pressure_fluctuation', 'recent_harsh_events', 'operator_experience_years']
categorical_features = ['weather_condition', 'location_type', 'time_of_day_category', 'task_type']
all_features_order = numerical_features + categorical_features # Keep the order consistent

@app.route('/predict', methods=['POST'])
def predict():
    if not model_pipeline:
        return jsonify({'error': 'Model not loaded.'}), 500

    try:
        data = request.get_json(force=True) # Get JSON data from the request
        print(f"Received data for prediction: {data}")

        # Convert incoming JSON data to a Pandas DataFrame
        # Ensure the order of columns matches the training data
        input_df = pd.DataFrame([data])

        # Make prediction
        # The loaded model_pipeline already includes the preprocessor
        prediction_array = model_pipeline.predict(input_df)
        prediction_proba_array = model_pipeline.predict_proba(input_df)

        predicted_incident_type = prediction_array[0]
        
        # Get probabilities for all classes
        class_probabilities = {}
        for i, class_name in enumerate(model_pipeline.named_steps['classifier'].classes_):
            class_probabilities[class_name] = float(prediction_proba_array[0][i])

        print(f"Prediction: {predicted_incident_type}, Probabilities: {class_probabilities}")

        response = {
            'predictedIncidentType': predicted_incident_type,
            'predictionProbabilities': class_probabilities
        }
        return jsonify(response)

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # You can change the port if needed, e.g., 5001
    app.run(host='0.0.0.0', port=5000, debug=True)