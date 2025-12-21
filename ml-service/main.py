"""
ML Service for Digital Twin of a Student
Provides predictions for burnout risk, attendance risk, and exam performance
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

app = FastAPI(title="Digital Twin ML Service")

# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PredictionRequest(BaseModel):
    sleep_hours: float = Field(..., ge=0, le=24, description="Hours of sleep")
    attendance_percentage: float = Field(..., ge=0, le=100, description="Attendance percentage")
    study_hours: float = Field(..., ge=0, le=24, description="Hours of study")
    stress_level: int = Field(..., ge=1, le=10, description="Stress level (1-10)")
    deadlines_count: int = Field(..., ge=0, description="Number of upcoming deadlines")

# Response model
class PredictionResponse(BaseModel):
    burnout_risk: str = Field(..., description="Burnout risk level: Low, Medium, or High")
    attendance_risk: float = Field(..., ge=0, le=100, description="Attendance risk probability (%)")
    exam_performance: float = Field(..., ge=0, le=100, description="Predicted exam performance (%)")

# Initialize models (will be trained on startup)
burnout_model = None
attendance_model = None
exam_model = None
scaler = StandardScaler()

def generate_training_data():
    """
    Generate synthetic training data for model training
    In production, this would come from historical data
    """
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'sleep_hours': np.random.normal(7, 1.5, n_samples).clip(4, 10),
        'attendance_percentage': np.random.normal(85, 15, n_samples).clip(0, 100),
        'study_hours': np.random.normal(5, 2, n_samples).clip(0, 12),
        'stress_level': np.random.randint(1, 11, n_samples),
        'deadlines_count': np.random.poisson(3, n_samples).clip(0, 10)
    }
    
    df = pd.DataFrame(data)
    
    # Feature engineering
    df['sleep_deficit'] = np.maximum(0, 8 - df['sleep_hours'])
    df['deadline_pressure'] = df['deadlines_count'] * df['stress_level']
    df['attendance_trend'] = df['attendance_percentage'] / 100
    df['stress_study_ratio'] = df['stress_level'] / (df['study_hours'] + 1)
    df['total_activity'] = df['study_hours'] + df['sleep_hours']
    
    return df

def train_models():
    """
    Train ML models using synthetic data
    In production, use real historical data
    """
    global burnout_model, attendance_model, exam_model, scaler
    
    print("Generating training data...")
    df = generate_training_data()
    
    # Prepare features
    feature_cols = ['sleep_hours', 'attendance_percentage', 'study_hours', 
                    'stress_level', 'deadlines_count', 'sleep_deficit', 
                    'deadline_pressure', 'attendance_trend', 'stress_study_ratio', 
                    'total_activity']
    X = df[feature_cols].values
    X_scaled = scaler.fit_transform(X)
    
    # Burnout Risk (Classification: Low, Medium, High)
    burnout_scores = (
        (df['sleep_deficit'] * 20) +
        (df['stress_level'] * 5) +
        (df['deadline_pressure'] * 2) -
        (df['sleep_hours'] * 3)
    )
    df['burnout_label'] = pd.cut(
        burnout_scores,
        bins=[-np.inf, 30, 60, np.inf],
        labels=['Low', 'Medium', 'High']
    )
    y_burnout = df['burnout_label'].astype(str)
    
    burnout_model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    burnout_model.fit(X_scaled, y_burnout)
    print("✓ Burnout model trained")
    
    # Attendance Risk (Regression: 0-100 probability)
    attendance_risk = (
        100 - df['attendance_percentage'] +
        (df['stress_level'] * 3) +
        (df['deadlines_count'] * 2) -
        (df['sleep_hours'] * 2)
    ).clip(0, 100)
    
    attendance_model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    attendance_model.fit(X_scaled, attendance_risk)
    print("✓ Attendance risk model trained")
    
    # Exam Performance (Regression: 0-100 score)
    exam_performance = (
        50 +  # Base score
        (df['study_hours'] * 4) +
        (df['attendance_percentage'] * 0.3) -
        (df['stress_level'] * 2) +
        (df['sleep_hours'] >= 7).astype(int) * 10 -
        (df['deadlines_count'] * 2)
    ).clip(0, 100)
    
    exam_model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    exam_model.fit(X_scaled, exam_performance)
    print("✓ Exam performance model trained")
    
    print("All models trained successfully!")

@app.on_event("startup")
async def startup_event():
    """Train models when service starts"""
    train_models()

def extract_features(data: PredictionRequest) -> np.ndarray:
    """
    Extract and engineer features from input data
    """
    sleep_deficit = max(0, 8 - data.sleep_hours)
    deadline_pressure = data.deadlines_count * data.stress_level
    attendance_trend = data.attendance_percentage / 100
    stress_study_ratio = data.stress_level / (data.study_hours + 1)
    total_activity = data.study_hours + data.sleep_hours
    
    features = np.array([[
        data.sleep_hours,
        data.attendance_percentage,
        data.study_hours,
        data.stress_level,
        data.deadlines_count,
        sleep_deficit,
        deadline_pressure,
        attendance_trend,
        stress_study_ratio,
        total_activity
    ]])
    
    return features

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Digital Twin ML Service is running",
        "models_loaded": burnout_model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Main prediction endpoint
    Returns burnout risk, attendance risk, and exam performance predictions
    """
    if burnout_model is None or attendance_model is None or exam_model is None:
        raise HTTPException(status_code=503, detail="Models not yet trained")
    
    try:
        # Extract features
        features = extract_features(request)
        features_scaled = scaler.transform(features)
        
        # Make predictions
        burnout_pred = burnout_model.predict(features_scaled)[0]
        attendance_risk = float(attendance_model.predict(features_scaled)[0])
        exam_performance = float(exam_model.predict(features_scaled)[0])
        
        # Clamp values to valid ranges
        attendance_risk = max(0, min(100, attendance_risk))
        exam_performance = max(0, min(100, exam_performance))
        
        return PredictionResponse(
            burnout_risk=burnout_pred,
            attendance_risk=round(attendance_risk, 2),
            exam_performance=round(exam_performance, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

