import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    department = Column(String, nullable=True)
    doctor_name = Column(String, nullable=True)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    mode = Column(String, default="in_person")   # in_person, video
    status = Column(String, default="booked")    # booked, completed, cancelled
    queue_position = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
