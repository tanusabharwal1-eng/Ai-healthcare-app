"""
AI service — thin wrapper around an LLM API for:
- symptom analysis -> possible conditions / urgency / specialist / explanation
- report & prescription explanation in plain language
- multilingual output (en, hi, pa)

Plug in AI_API_URL + AI_API_KEY in .env. Keep responses structured (JSON)
so the frontend never has to parse free text.
"""
import json
import httpx
from ..config import settings

SYMPTOM_SYSTEM_PROMPT = """You are a careful medical triage assistant, not a doctor.
Given patient symptoms (and optional demographics/image description), respond ONLY as JSON:
{
  "possible_conditions": ["..."],
  "urgency_level": "Low" | "Medium" | "High",
  "suggested_specialist": "...",
  "explanation": "...",
  "disclaimer": "This is not a medical diagnosis. Consult a doctor for confirmation."
}
Always err toward higher urgency when uncertain. Respond in the requested language."""

REPORT_SYSTEM_PROMPT = """You are a medical report explainer. Given OCR text from a lab
report or prescription, respond ONLY as JSON:
{
  "summary": "...",
  "key_findings": ["..."],
  "medicines_identified": ["..."],
  "plain_language_explanation": "...",
  "follow_up_advice": "..."
}
Respond in the requested language. Keep it simple enough for a non-medical reader."""


async def _call_llm(system_prompt: str, user_content: str) -> dict:
    if not settings.ai_api_key or not settings.ai_api_url:
        return {"error": "AI_API_KEY / AI_API_URL not configured in .env"}

    headers = {"Authorization": f"Bearer {settings.ai_api_key}", "Content-Type": "application/json"}
    payload = {
        "model": "your-model-here",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(settings.ai_api_url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()

    text = data["choices"][0]["message"]["content"] if "choices" in data else str(data)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"raw_response": text}


async def analyze_symptoms(symptoms_text: str, language: str = "en",
                            age: int | None = None, gender: str | None = None,
                            weight_kg: float | None = None, height_cm: float | None = None,
                            image_description: str | None = None) -> dict:
    user_content = (
        f"Language: {language}\n"
        f"Gender: {gender}\nAge: {age}\nWeight(kg): {weight_kg}\nHeight(cm): {height_cm}\n"
        f"Symptoms: {symptoms_text}\n"
        f"Image findings: {image_description or 'none'}"
    )
    return await _call_llm(SYMPTOM_SYSTEM_PROMPT, user_content)


async def explain_report(ocr_text: str, language: str = "en") -> dict:
    user_content = f"Language: {language}\nOCR text:\n{ocr_text}"
    return await _call_llm(REPORT_SYSTEM_PROMPT, user_content)
