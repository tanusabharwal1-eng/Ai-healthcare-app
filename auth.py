from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.patient import Patient
from ..schemas.patient import PatientCreate, PatientLogin, PatientOut
from ..services.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/guest", response_model=PatientOut)
def create_guest(data: PatientCreate, db: Session = Depends(get_db)):
    """Guest mode: only name + gender required, no password/email."""
    patient = Patient(
        name=data.name, gender=data.gender, is_guest=True,
        age=data.age, weight_kg=data.weight_kg, height_cm=data.height_cm,
        blood_group=data.blood_group, allergies=data.allergies,
        preferred_language=data.preferred_language or "en",
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.post("/signup", response_model=PatientOut)
def signup(data: PatientCreate, db: Session = Depends(get_db)):
    if not data.email or not data.password:
        raise HTTPException(400, "Email and password required for account signup")
    existing = db.query(Patient).filter(Patient.email == data.email).first()
    if existing:
        raise HTTPException(400, "Email already registered")
    patient = Patient(
        name=data.name, gender=data.gender, email=data.email,
        password_hash=hash_password(data.password), is_guest=False,
        age=data.age, weight_kg=data.weight_kg, height_cm=data.height_cm,
        blood_group=data.blood_group, allergies=data.allergies,
        preferred_language=data.preferred_language or "en",
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@router.post("/login")
def login(data: PatientLogin, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.email == data.email).first()
    if not patient or not patient.password_hash or not verify_password(data.password, patient.password_hash):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": patient.id})
    return {"access_token": token, "token_type": "bearer", "patient_id": patient.id}
