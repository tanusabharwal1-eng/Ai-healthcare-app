from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models.medicine import MedicineReminder, MedicineLog

router = APIRouter(prefix="/medicine-reminders", tags=["medicine-reminders"])

class ReminderCreate(BaseModel):
    patient_id: str
    medicine_name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    time_of_day: Optional[str] = None
    notify_via: Optional[str] = "app"   # app, whatsapp, sms, voice

@router.post("/")
def create_reminder(data: ReminderCreate, db: Session = Depends(get_db)):
    reminder = MedicineReminder(**data.model_dump())
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder

@router.get("/{patient_id}")
def list_reminders(patient_id: str, db: Session = Depends(get_db)):
    return db.query(MedicineReminder).filter(MedicineReminder.patient_id == patient_id).all()

@router.post("/{reminder_id}/mark-taken")
def mark_taken(reminder_id: str, db: Session = Depends(get_db)):
    from datetime import datetime
    log = MedicineLog(reminder_id=reminder_id, scheduled_time=datetime.utcnow(),
                       taken=True, taken_at=datetime.utcnow())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/{reminder_id}/history")
def reminder_history(reminder_id: str, db: Session = Depends(get_db)):
    return db.query(MedicineLog).filter(MedicineLog.reminder_id == reminder_id).all()
