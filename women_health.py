import uuid
from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class PregnancyTracker(Base):
    __tablename__ = "pregnancy_trackers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    lmp_date = Column(Date, nullable=True)          # last menstrual period
    due_date = Column(Date, nullable=True)
    current_week = Column(Integer, nullable=True)
    baby_growth_notes = Column(String, nullable=True)
    nutrition_notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
