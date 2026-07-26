import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    record_type = Column(String, nullable=False)   # lab_report, prescription, vaccination
    file_url = Column(String, nullable=True)
    ocr_extracted_text = Column(String, nullable=True)
    ai_explanation = Column(String, nullable=True)
    extracted_medicines = Column(String, nullable=True)  # JSON string list
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
