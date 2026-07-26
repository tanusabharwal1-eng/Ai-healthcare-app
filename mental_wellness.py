import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    mood_score = Column(Integer, nullable=False)   # 1-10
    journal_text = Column(String, nullable=True)
    sleep_hours = Column(Integer, nullable=True)
    steps = Column(Integer, nullable=True)
    stress_level = Column(String, nullable=True)   # Low, Medium, High
    created_at = Column(DateTime(timezone=True), server_default=func.now())
