import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class StaffUser(Base):
    __tablename__ = "staff_users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)   # developer, reception, doctor
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

class Bill(Base):
    __tablename__ = "bills"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    description = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    status = Column(String, default="unpaid")   # unpaid, paid
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PharmacyItem(Base):
    __tablename__ = "pharmacy_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    medicine_name = Column(String, nullable=False)
    stock_qty = Column(Float, default=0)
    price = Column(Float, default=0)
