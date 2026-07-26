import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class VitalReading(Base):
    __tablename__ = "vital_readings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    heart_rate = Column(Float, nullable=True)
    blood_pressure = Column(String, nullable=True)   # "120/80"
    blood_sugar = Column(Float, nullable=True)
    fall_detected = Column(String, nullable=True)     # timestamp or null
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

class FamilyLink(Base):
    __tablename__ = "family_links"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    family_member_name = Column(String, nullable=False)
    family_member_contact = Column(String, nullable=True)
    relation = Column(String, nullable=True)
