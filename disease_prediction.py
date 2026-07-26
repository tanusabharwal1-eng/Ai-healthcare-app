"""
Disease risk prediction — diabetes, heart, kidney, liver, cancer types.
Starts with a simple weighted-risk heuristic per disease so it works
without a trained model; swap in scikit-learn models trained on public
datasets (e.g. Pima Diabetes, UCI Heart Disease) once you have them.
"""
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models.disease_risk import DiseaseRiskAssessment

router = APIRouter(prefix="/disease-prediction", tags=["disease-prediction"])

class RiskInput(BaseModel):
    patient_id: str
    disease: str   # diabetes, heart, kidney, liver, cancer_<type>
    inputs: dict   # e.g. {"glucose": 140, "bmi": 28, "age": 45, "bp": 130}

PREVENTION_TIPS = {
    "diabetes": "Maintain a balanced diet, exercise regularly, monitor blood sugar.",
    "heart": "Reduce salt/fat intake, exercise, manage stress, avoid smoking.",
    "kidney": "Stay hydrated, control blood pressure and sugar, limit painkiller use.",
    "liver": "Limit alcohol, maintain healthy weight, avoid unnecessary medication.",
}

def _heuristic_risk(disease: str, inputs: dict) -> float:
    """Very rough placeholder scoring — replace with a real trained model."""
    score = 0
    if disease == "diabetes":
        score = min(100, inputs.get("glucose", 0) / 2 + inputs.get("bmi", 0))
    elif disease == "heart":
        score = min(100, inputs.get("bp", 0) / 2 + inputs.get("age", 0) / 2)
    elif disease == "kidney":
        score = min(100, inputs.get("creatinine", 0) * 20)
    elif disease == "liver":
        score = min(100, inputs.get("bilirubin", 0) * 15)
    else:
        score = min(100, sum(v for v in inputs.values() if isinstance(v, (int, float))) / 3)
    return round(score, 1)

@router.post("/assess")
def assess(data: RiskInput, db: Session = Depends(get_db)):
    risk_pct = _heuristic_risk(data.disease, data.inputs)
    tip = PREVENTION_TIPS.get(data.disease, "Maintain regular checkups and a healthy lifestyle.")

    record = DiseaseRiskAssessment(
        patient_id=data.patient_id, disease=data.disease,
        input_data=json.dumps(data.inputs), risk_percentage=risk_pct,
        prevention_tips=tip,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/{patient_id}")
def history(patient_id: str, db: Session = Depends(get_db)):
    return db.query(DiseaseRiskAssessment).filter(DiseaseRiskAssessment.patient_id == patient_id).all()
