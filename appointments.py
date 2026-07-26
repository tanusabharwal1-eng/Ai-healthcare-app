from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..database import get_db
from ..models.appointment import Appointment

router = APIRouter(prefix="/appointments", tags=["appointments"])

class AppointmentCreate(BaseModel):
    patient_id: str
    department: Optional[str] = None
    doctor_name: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    mode: Optional[str] = "in_person"   # in_person, video

@router.post("/")
def book(data: AppointmentCreate, db: Session = Depends(get_db)):
    appt = Appointment(**data.model_dump())
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt

@router.get("/{patient_id}")
def list_appointments(patient_id: str, db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.patient_id == patient_id).all()

@router.post("/{appointment_id}/cancel")
def cancel(appointment_id: str, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if appt:
        appt.status = "cancelled"
        db.commit()
    return appt
