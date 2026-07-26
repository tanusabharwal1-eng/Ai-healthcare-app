import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { usePatient } from './context/PatientContext'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SymptomChecker from './pages/SymptomChecker'
import HealthRecords from './pages/HealthRecords'
import MedicineReminders from './pages/MedicineReminders'
import Appointments from './pages/Appointments'
import DiseaseRisk from './pages/DiseaseRisk'
import MentalWellness from './pages/MentalWellness'
import WomensHealth from './pages/WomensHealth'
import ElderCare from './pages/ElderCare'
import EmergencyCard from './pages/EmergencyCard'

function RequirePatient({ children }) {
  const { patient } = usePatient()
  return patient ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RequirePatient><Dashboard /></RequirePatient>} />
        <Route path="/symptom-checker" element={<RequirePatient><SymptomChecker /></RequirePatient>} />
        <Route path="/health-records" element={<RequirePatient><HealthRecords /></RequirePatient>} />
        <Route path="/medicine-reminders" element={<RequirePatient><MedicineReminders /></RequirePatient>} />
        <Route path="/appointments" element={<RequirePatient><Appointments /></RequirePatient>} />
        <Route path="/disease-risk" element={<RequirePatient><DiseaseRisk /></RequirePatient>} />
        <Route path="/mental-wellness" element={<RequirePatient><MentalWellness /></RequirePatient>} />
        <Route path="/womens-health" element={<RequirePatient><WomensHealth /></RequirePatient>} />
        <Route path="/elder-care" element={<RequirePatient><ElderCare /></RequirePatient>} />
        <Route path="/emergency-card" element={<RequirePatient><EmergencyCard /></RequirePatient>} />
      </Routes>
    </div>
  )
}
