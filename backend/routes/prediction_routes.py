from fastapi import APIRouter, HTTPException
from backend.schemas.request_schema import StudentInput
from backend.schemas.response_schema import PredictionResponse
from backend.services.prediction import predict_mental_health
from backend.utils.logger import logger

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict(data: StudentInput):

    try:
        print("PREDICTION REQUEST RECEIVED!")

        logger.info("Received new prediction request")

        input_data = data.model_dump()

        predicted_score = predict_mental_health(input_data)

        print(f"PREDICTION SUCCESSFUL! Score: {predicted_score}")

        logger.info(
            f"Prediction completed successfully. Score: {predicted_score}"
        )

        return PredictionResponse(
            predicted_mental_health_score=predicted_score,
            message="Prediction successful"
        )

    except Exception as e:

        print(f"PREDICTION ERROR: {e}")

        logger.exception("Prediction failed")

        raise HTTPException(
            status_code=500,
            detail="Internal server error during prediction"
        )