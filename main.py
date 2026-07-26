from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import (
    auth, symptom_checker, health_records, medicine_reminders, appointments,
    disease_prediction, mental_wellness, women_health, elder_care, hospital, emergency,
)
from .models import (
    patient, health_record, symptom_check, medicine, appointment,
    disease_risk, mental_wellness as mw_model, women_health as wh_model,
    elder_care as ec_model, hospital as hosp_model,
)

app = FastAPI(title="AI Healthcare Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(symptom_checker.router)
app.include_router(health_records.router)
app.include_router(medicine_reminders.router)
app.include_router(appointments.router)
app.include_router(disease_prediction.router)
app.include_router(mental_wellness.router)
app.include_router(women_health.router)
app.include_router(elder_care.router)
app.include_router(hospital.router)
app.include_router(emergency.router)

@app.get("/")
def root():
    return {"status": "ok", "service": "AI Healthcare Platform API"}
