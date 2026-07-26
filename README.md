# AI Healthcare Platform

A hackathon-scale healthcare platform: AI symptom checker (text + face/hand/body scan),
smart health records with OCR + AI report explanation, medicine reminders, appointments,
disease risk prediction, mental wellness tracking, women's healthcare, elder care with
family dashboard, hospital management (staff/billing/pharmacy), and an offline emergency
medical card. Multilingual (English/Hindi/Punjabi) AI responses. Login is optional — guest
mode requires only name + gender.

## Stack
- **Frontend**: React + Tailwind CSS (Vite)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (swap the `DATABASE_URL` for MongoDB/other if preferred)
- **AI**: Pluggable LLM API (symptom analysis, report explanation) — see `app/services/ai_service.py`
- **OCR**: pytesseract (swap for a hosted OCR API if preferred)

## Project structure
```
backend/
  app/
    main.py            # FastAPI app, wires all routers
    config.py           # env-based settings
    database.py          # SQLAlchemy engine/session
    models/              # one file per domain (patient, symptom_check, ...)
    schemas/              # pydantic request/response models
    routes/                # one router per module
    services/               # security, ocr_service, ai_service
  requirements.txt
  .env.example
frontend/
  src/
    pages/              # one page per module
    components/          # Navbar, UrgencyBadge
    context/               # PatientContext (guest/account session)
    api/                     # axios client + endpoint wrappers
  package.json
database/               # (reserved for migrations / seed scripts)
```

## Setup

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in DATABASE_URL, AI_API_KEY, AI_API_URL
uvicorn app.main:app --reload
```
API docs at `http://localhost:8000/docs`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

## What's wired vs. what's a placeholder

**Fully wired**: patient guest/account creation, symptom checker (text + demographics →
AI call → stored + returned), health record upload → OCR → AI explanation, medicine
reminders + dose logging, appointment booking, disease risk heuristic scoring, mood
tracking with chart, pregnancy tracker date math, elder vitals + family dashboard,
hospital staff auth/billing/pharmacy, emergency QR-card data endpoint.

**Placeholders you need to fill in for production**:
- `ai_service.py` — set `AI_API_KEY` / `AI_API_URL` for a real LLM provider (OpenAI-compatible
  chat completions endpoint expected; adjust `_call_llm` if your provider's response shape differs)
- Image analysis for face/hand/body scans — currently a stub description string; wire in
  a real vision model (skin lesion / wound classifier) in `routes/symptom_checker.py`
- File storage — `file_url` fields are `None`; wire Cloudinary/S3 upload in the upload routes
- `disease_prediction.py` — the risk scoring is a rough heuristic; replace with models
  trained on public datasets (Pima Diabetes, UCI Heart Disease, etc.)
- WhatsApp/SMS/voice medicine reminder delivery — `notify_via` is stored but not yet sent;
  wire Twilio/WhatsApp Business API on a scheduler (e.g. APScheduler or a cron job)
- Fingerprint login, video consultation, wearable integration — not yet started

## Notes
- AI symptom/report output is guidance, not diagnosis — every response includes a disclaimer
  and defaults to higher urgency when uncertain.
- Guest sessions are stored client-side (localStorage) with a server-side patient row;
  there's no password, so don't put guest-mode data behind anything sensitive.
