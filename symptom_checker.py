import json
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.symptom_check import SymptomCheck
from ..services import ai_service

router = APIRouter(prefix="/symptom-checker", tags=["symptom-checker"])

@router.post("/analyze")
async def analyze(
    patient_id: str = Form(...),
    symptoms_text: str = Form(""),
    scan_type: str = Form("none"),      # face, hand, body, none
    language: str = Form("en"),
    age: int | None = Form(None),
    gender: str | None = Form(None),
    weight_kg: float | None = Form(None),
    height_cm: float | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    image_description = None
    if image is not None:
        # Placeholder: plug in an image-classification model here
        # (e.g. skin condition / wound classifier) and describe findings.
        image_description = f"Uploaded {scan_type} image for visual analysis (model not yet wired)."

    result = await ai_service.analyze_symptoms(
        symptoms_text=symptoms_text, language=language, age=age, gender=gender,
        weight_kg=weight_kg, height_cm=height_cm, image_description=image_description,
    )

    record = SymptomCheck(
        patient_id=patient_id,
        symptoms_text=symptoms_text,
        image_url=None,  # set once file storage (Cloudinary/S3) is wired
        scan_type=scan_type,
        possible_conditions=json.dumps(result.get("possible_conditions", [])),
        urgency_level=result.get("urgency_level"),
        suggested_specialist=result.get("suggested_specialist"),
        explanation=result.get("explanation"),
        language=language,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "possible_conditions": result.get("possible_conditions", []),
        "urgency_level": result.get("urgency_level"),
        "suggested_specialist": result.get("suggested_specialist"),
        "explanation": result.get("explanation"),
        "disclaimer": result.get("disclaimer", "Not a diagnosis. Consult a doctor."),
    }

@router.get("/history/{patient_id}")
def history(patient_id: str, db: Session = Depends(get_db)):
    return db.query(SymptomCheck).filter(SymptomCheck.patient_id == patient_id).all()
