# train_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib # Import joblib for saving/loading models
import random # For your random data generation

# --- Data Generation Function (FULL IMPLEMENTATION) ---
def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    random.seed(42)

    data = {
        'operator_fatigue_score': np.random.uniform(0, 1, num_samples), # 0 (alert) to 1 (very fatigued)
        'shift_hours': np.random.uniform(4, 12, num_samples),
        'machine_temp_anomaly': np.random.uniform(-5, 10, num_samples), # Deviation from normal temp
        'hydraulic_pressure_fluctuation': np.random.uniform(0, 0.8, num_samples), # 0 (stable) to 0.8 (high fluctuation)
        'recent_harsh_events': np.random.randint(0, 5, num_samples), # Count in last hour
        'weather_condition': random.choices(['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Stormy', 'Foggy'], k=num_samples),
        'location_type': random.choices(['Open Pit', 'Confined Area', 'Haul Road', 'Workshop Area', 'Processing Plant'], k=num_samples),
        'operator_experience_years': np.random.randint(1, 20, num_samples),
        'time_of_day_category': random.choices(['Day', 'Night', 'Dawn/Dusk'], k=num_samples),
        'task_type': random.choices(['Digging', 'Loading', 'Hauling', 'Grading', 'Maintenance'], k=num_samples)
    }

    df = pd.DataFrame(data)

    # --- Create Target Variable: Incident Type ---
    # 0: No Incident, 1: Fatigue, 2: Mechanical, 3: Collision/Proximity, 4: Environmental
    incident_types = []
    for i in range(num_samples):
        # Fatigue incident logic (more likely with high fatigue, long hours, night)
        if (df.loc[i, 'operator_fatigue_score'] > 0.7 and df.loc[i, 'shift_hours'] > 9) or \
           (df.loc[i, 'time_of_day_category'] == 'Night' and df.loc[i, 'operator_fatigue_score'] > 0.6):
            incident_types.append('Fatigue')
        # Mechanical incident logic (more likely with temp/pressure anomalies)
        elif df.loc[i, 'machine_temp_anomaly'] > 5 or df.loc[i, 'hydraulic_pressure_fluctuation'] > 0.5:
            incident_types.append('Mechanical')
        # Collision/Proximity logic (more likely with harsh events, confined/busy areas, bad weather)
        elif (df.loc[i, 'recent_harsh_events'] > 2 and df.loc[i, 'location_type'] in ['Confined Area', 'Haul Road']) or \
             (df.loc[i, 'weather_condition'] in ['Rainy', 'Foggy', 'Stormy'] and df.loc[i, 'recent_harsh_events'] > 0):
            incident_types.append('Collision/Proximity')
        # Environmental incident logic (specific weather, location)
        elif df.loc[i, 'weather_condition'] in ['Stormy', 'Foggy', 'Windy'] and df.loc[i, 'location_type'] in ['Open Pit', 'Haul Road']:
            incident_types.append('Environmental')
        else:
            incident_types.append('None') # No incident

    df['incident_type'] = incident_types

    # Adjust distribution to have more 'None' incidents (real-world is imbalanced)
    none_incidents = df[df['incident_type'] == 'None'].sample(n=int(num_samples * 0.7), replace=True, random_state=42)
    other_incidents = df[df['incident_type'] != 'None']
    df_balanced = pd.concat([none_incidents, other_incidents]).sample(frac=1, random_state=42).reset_index(drop=True)

    return df_balanced # <--- This is the crucial return statement

# --- Main Script Execution ---

print("Generating synthetic data...")
df_incidents = generate_synthetic_data(num_samples=2000) # Call the function and assign its return value
print("Synthetic data generated.")

# --- 2. Data Preprocessing Code ---
X = df_incidents.drop('incident_type', axis=1)
y = df_incidents['incident_type']

categorical_features = ['weather_condition', 'location_type', 'time_of_day_category', 'task_type']
numerical_features = ['operator_fatigue_score', 'shift_hours', 'machine_temp_anomaly',
                      'hydraulic_pressure_fluctuation', 'recent_harsh_events', 'operator_experience_years']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', 'passthrough', numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# --- 3. Model Training Code ---
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
])

print("Starting model training...")
model_pipeline.fit(X_train, y_train)
print("Model training complete.")

# --- 4. Model Saving Code ---
joblib.dump(model_pipeline, 'incident_prediction_model.pkl')
print("\nModel and preprocessor saved as 'incident_prediction_model.pkl'")

# (Optional: Add evaluation code here if you want to see training metrics)
# from sklearn.metrics import classification_report
# y_pred = model_pipeline.predict(X_test)
# print("\nTest Set Classification Report:")
# print(classification_report(y_test, y_pred))