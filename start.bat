@echo off
echo Starting AI Healthcare Platform...

REM Start backend in a new window
start "Backend - FastAPI" cmd /k "cd backend && call venv\Scripts\activate && uvicorn app.main:app --reload"

REM Give backend a moment to boot
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "Frontend - React" cmd /k "cd frontend && npm run dev"

REM Give frontend a moment to boot
timeout /t 5 /nobreak >nul

REM Open the site in Microsoft Edge
start msedge http://localhost:5173

echo Done. Two terminal windows are running the backend and frontend - keep them open.
