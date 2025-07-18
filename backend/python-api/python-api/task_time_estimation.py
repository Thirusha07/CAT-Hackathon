# duration_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error
import os
import json

def train_model(data_file_path='data.json'):
    if not os.path.exists(data_file_path):
        raise FileNotFoundError(f"Data file '{data_file_path}' not found.")

    with open(data_file_path, 'r') as f:
        machine_data = json.load(f)

    df = pd.DataFrame(machine_data)
    df['Task Start Time'] = pd.to_datetime(df['Task Start Time'])
    df['Task End Time'] = pd.to_datetime(df['Task End Time'])
    df['Task Duration (min)'] = (df['Task End Time'] - df['Task Start Time']).dt.total_seconds() / 60
    df = df[df['Task Duration (min)'] > 0].copy()

    features = ['Task Type', 'Weather']
    target = 'Task Duration (min)'
    X = df[features]
    y = df[target]

    categorical_transformer = OneHotEncoder(handle_unknown='ignore')
    preprocessor = ColumnTransformer(transformers=[('cat', categorical_transformer, features)])

    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model_pipeline.fit(X_train, y_train)

    mae = mean_absolute_error(y_test, model_pipeline.predict(X_test))
    print(f"✅ Duration prediction model trained. MAE: {mae:.2f} minutes")

    return model_pipeline


def predict_task_time(model, task_type, weather):
    df = pd.DataFrame([[task_type, weather]], columns=['Task Type', 'Weather'])
    prediction = model.predict(df)
    return prediction[0]
