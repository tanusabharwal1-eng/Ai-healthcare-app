"""
OCR service — extracts text from uploaded lab reports / prescriptions.
Uses pytesseract locally. Swap for a hosted OCR API if preferred.
"""
import pytesseract
from PIL import Image
import io

def extract_text_from_image(file_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(file_bytes))
    text = pytesseract.image_to_string(image)
    return text.strip()

def extract_medicines_from_text(ocr_text: str) -> list[str]:
    """
    Naive line-based medicine extraction as a placeholder.
    Replace with an AI call (ai_service) for real extraction —
    prescriptions are messy and rule-based parsing alone won't hold up.
    """
    lines = [l.strip() for l in ocr_text.split("\n") if l.strip()]
    candidates = [l for l in lines if any(ch.isalpha() for ch in l) and len(l) < 60]
    return candidates
