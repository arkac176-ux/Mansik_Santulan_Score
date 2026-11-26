from pydantic import BaseModel, Field, field_validator


class StudentInput(BaseModel):

    Study_Hours: float = Field(..., ge=0, le=24)
    Age: int = Field(..., ge=1, le=100)
    Avg_Daily_Usage_Hours: float = Field(..., ge=0, le=24)
    Daily_Unlocks: int = Field(..., ge=0)
    Physical_Activity_Hours: float = Field(..., ge=0, le=24)
    Sleep_Hours_Per_Night: float = Field(..., ge=0, le=24)

    Stress_Level: str
    Gender: str
    Academic_Level: str
    Most_Used_Platform: str
    Purpose_Of_Use: str
    Grouped_country: str

    @field_validator("Stress_Level", mode="before")
    @classmethod
    def normalize_stress_level(cls, value):

        if not isinstance(value, str):
            return value

        value = value.strip()

        stress_mapping = {
            "low": "Low",
            "medium": "Medium",
            "moderate": "Medium",
            "high": "High",
            "very high": "Very High"
        }

        return stress_mapping.get(value.lower(), value)