import joblib
import pandas as pd
from pathlib import Path


# Model path
BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "Mental_Health_Model.pkl"


# Load trained ML pipeline
model = joblib.load(MODEL_PATH)


# Prediction function
def predict_mental_health(input_data: dict):

    input_df = pd.DataFrame([input_data])

    prediction = model.predict(input_df)

    return float(prediction[0])