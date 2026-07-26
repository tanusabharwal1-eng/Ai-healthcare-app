import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class MedicineReminder(Base):
    __tablename__ = "medicine_reminders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    medicine_name = Column(String, nullable=False)
    dosage = Column(String, nullable=True)
    frequency = Column(String, nullable=True)     # e.g. "twice a day"
    time_of_day = Column(String, nullable=True)   # JSON list of times
    notify_via = Column(String, default="app")    # app, whatsapp, sms, voice
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MedicineLog(Base):
    __tablename__ = "medicine_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    reminder_id = Column(String, ForeignKey("medicine_reminders.id"), nullable=False)
    scheduled_time = Column(DateTime(timezone=True), nullable=False)
    taken = Column(Boolean, default=False)
    taken_at = Column(DateTime(timezone=True), nullable=True)
