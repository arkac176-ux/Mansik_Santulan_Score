from fastapi import FastAPI
from backend.routes.prediction_routes import router as prediction_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Mental Health Prediction API",
    description="Mental Health Score Prediction using Machine Learning",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Mental Health Prediction API is running!",
        "status": "Active"
    }


@app.get("/health")
def health_check():
    return {
        "status": "Healthy"
    }


app.include_router(prediction_router)