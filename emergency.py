from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.patient import Patient

router = APIRouter(prefix="/emergency", tags=["emergency"])

@router.get("/qr-card/{patient_id}")
def qr_card(patient_id: str, db: Session = Depends(get_db)):
    """
    Returns the minimal offline-safe medical info to embed in a QR code:
    blood group, allergies, name, emergency-relevant basics only.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(404, "Patient not found")
    return {
        "name": patient.name,
        "gender": patient.gender,
        "blood_group": patient.blood_group,
        "allergies": patient.allergies,
        "age": patient.age,
    }
