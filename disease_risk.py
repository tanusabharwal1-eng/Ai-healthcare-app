import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class DiseaseRiskAssessment(Base):
    __tablename__ = "disease_risk_assessments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    disease = Column(String, nullable=False)   # diabetes, heart, kidney, liver, cancer_type
    input_data = Column(String, nullable=True) # JSON string of inputs used
    risk_percentage = Column(Float, nullable=True)
    prevention_tips = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
