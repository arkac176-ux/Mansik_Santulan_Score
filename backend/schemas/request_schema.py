from pydantic import BaseModel, Field


class StudentInput(BaseModel):

    Study_Hours: float = Field(..., ge=0)
    Age: int = Field(..., ge=1, le=100)

    Avg_Daily_Usage_Hours: float = Field(..., ge=0)
    Daily_Unlocks: int = Field(..., ge=0)

    Physical_Activity_Hours: float = Field(..., ge=0)
    Sleep_Hours_Per_Night: float = Field(..., ge=0, le=24)

    Stress_Level: str
    Gender: str
    Academic_Level: str
    Most_Used_Platform: str
    Purpose_Of_Use: str
    Grouped_country: str
