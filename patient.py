import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)              # mandatory
    gender = Column(String, nullable=False)             # mandatory
    email = Column(String, unique=True, nullable=True)  # optional account
    password_hash = Column(String, nullable=True)       # null for guest
    is_guest = Column(Boolean, default=True)
    age = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    blood_group = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    preferred_language = Column(String, default="en")   # en, hi, pa
    created_at = Column(DateTime(timezone=True), server_default=func.now())
