import json
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.health_record import HealthRecord
from ..services import ocr_service, ai_service

router = APIRouter(prefix="/health-records", tags=["health-records"])

@router.post("/upload")
async def upload_record(
    patient_id: str = Form(...),
    record_type: str = Form(...),   # lab_report, prescription, vaccination
    language: str = Form("en"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    file_bytes = await file.read()
    ocr_text = ocr_service.extract_text_from_image(file_bytes)
    medicines = ocr_service.extract_medicines_from_text(ocr_text)
    ai_result = await ai_service.explain_report(ocr_text, language=language)

    record = HealthRecord(
        patient_id=patient_id,
        record_type=record_type,
        file_url=None,  # wire up Cloudinary/S3 and store the URL here
        ocr_extracted_text=ocr_text,
        ai_explanation=ai_result.get("plain_language_explanation"),
        extracted_medicines=json.dumps(ai_result.get("medicines_identified", medicines)),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "ocr_text": ocr_text,
        "summary": ai_result.get("summary"),
        "key_findings": ai_result.get("key_findings", []),
        "medicines_identified": ai_result.get("medicines_identified", medicines),
        "plain_language_explanation": ai_result.get("plain_language_explanation"),
        "follow_up_advice": ai_result.get("follow_up_advice"),
    }

@router.get("/{patient_id}")
def list_records(patient_id: str, db: Session = Depends(get_db)):
    return db.query(HealthRecord).filter(HealthRecord.patient_id == patient_id).all()
