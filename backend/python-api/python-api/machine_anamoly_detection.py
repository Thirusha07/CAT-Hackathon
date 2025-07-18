import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder, StandardScaler

def engineer_features(df):
    """Engineers new features for the model from a dataframe."""
    df_processed = df.copy()
    df_processed['Task Start Time'] = pd.to_datetime(df_processed['Task Start Time'])
    df_processed['Task End Time'] = pd.to_datetime(df_processed['Task End Time'])
    df_processed['Task Duration (min)'] = (df_processed['Task End Time'] - df_processed['Task Start Time']).dt.total_seconds() / 60
    df_processed['Idle Percentage'] = (df_processed['Idle Time (min)'] / df_processed['Task Duration (min)'].replace(0, 1)) * 100
    df_processed['Fuel Efficiency (L/cycle)'] = (df_processed['Fuel Used (L)'] / df_processed['Load Cycles'].replace(0, np.nan))
    df_processed['Work Rate (cycles/min)'] = (df_processed['Load Cycles'] / df_processed['Task Duration (min)'].replace(0, np.nan))
    df_processed.fillna(0, inplace=True)
    return df_processed

def run_full_analysis(training_data_path='data.json', new_data_path='new_data.json'):
    """
    Trains an anomaly detection model on historical data and classifies new data.
    """
    
    # --- Part 1: Training on Historical Data ---
    print("--- Phase 1: Training Model on Historical Data ---")
    try:
        df_train = pd.read_json(training_data_path)
    except (FileNotFoundError, ValueError) as e:
        print(f"❌ Error loading training data file '{training_data_path}': {e}")
        return

    # Engineer features for training data
    df_train_processed = engineer_features(df_train)

    # Encode categorical features and save the encoders
    categorical_cols = ['Machine ID', 'Operator ID', 'Seatbelt Status', 'Safety Triggered', 'Task Type', 'Weather']
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df_train_processed[col] = le.fit_transform(df_train_processed[col])
        label_encoders[col] = le

    # Define features and scale them
    # --- THIS IS THE UPDATED LINE ---
    features = [
        'Fuel Used (L)', 'Load Cycles', 'Idle Time (min)', 'Seatbelt Status',
        'Safety Triggered', 'Task Duration (min)', 'Idle Percentage',
        'Fuel Efficiency (L/cycle)', 'Work Rate (cycles/min)', 'Weather' # <-- Added Weather
    ]
    # ---------------------------------
    X_train = df_train_processed[features]
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)

    # Train the model
    print("Training Isolation Forest model...")
    model = IsolationForest(contamination='auto', random_state=42)
    model.fit(X_train_scaled)
    print("✅ Model training complete.")

    # --- Part 2: Classifying New Data ---
    print(f"\n--- Phase 2: Classifying New Data from '{new_data_path}' ---")
    try:
        new_data = pd.read_json(new_data_path)
    except (FileNotFoundError, ValueError) as e:
        print(f"❌ Error loading new data file '{new_data_path}': {e}")
        return

    # Process each new record individually
    for index, record in new_data.iterrows():
        df_new = pd.DataFrame([record])
        df_new_processed = engineer_features(df_new)

        # Apply the saved label encoders
        for col, le in label_encoders.items():
            try:
                # Get the first item to transform
                value_to_transform = df_new_processed[col].iloc[0]
                df_new_processed[col] = le.transform([value_to_transform])
            except ValueError:
                print(f"Warning: Unseen label '{df_new_processed[col].iloc[0]}' in column '{col}'. Assigning default value -1.")
                df_new_processed[col] = -1
        
        # Scale the new data using the scaler from training
        X_new = df_new_processed[features]
        X_new_scaled = scaler.transform(X_new)

        # Predict
        prediction = model.predict(X_new_scaled)
        
        # Output the result
        result = "🚨 Unusual Behavior Detected" if prediction[0] == -1 else "✅ Normal Behavior"
        print("\n-----------------------------")
        print(f"Classifying record with Timestamp: {record['Timestamp']}")
        print(f"Result: {result}")
        print(f"Details: Operator {record['Operator ID']}, Machine {record['Machine ID']}, Task {record['Task Type']}")


if _name_ == "_main_":
    run_full_analysis()