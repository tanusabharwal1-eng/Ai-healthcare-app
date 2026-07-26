import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class SymptomCheck(Base):
    __tablename__ = "symptom_checks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    symptoms_text = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    scan_type = Column(String, nullable=True)   # face, hand, body, none
    possible_conditions = Column(String, nullable=True)  # JSON string list
    urgency_level = Column(String, nullable=True)         # Low, Medium, High
    suggested_specialist = Column(String, nullable=True)
    explanation = Column(String, nullable=True)
    language = Column(String, default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
