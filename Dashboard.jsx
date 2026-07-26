import { usePatient } from '../context/PatientContext'
import { Link } from 'react-router-dom'

const MODULES = [
  ['Symptom Checker', '/symptom-checker', 'AI-based symptom & image analysis'],
  ['Health Records', '/health-records', 'Reports, prescriptions, vaccinations'],
  ['Medicine Reminders', '/medicine-reminders', 'Never miss a dose'],
  ['Appointments', '/appointments', 'Book in-person or video visits'],
  ['Disease Risk', '/disease-risk', 'Diabetes, heart, kidney, liver, cancer'],
  ['Mental Wellness', '/mental-wellness', 'Mood, journal, sleep tracking'],
  ["Women's Health", '/womens-health', 'Pregnancy & nutrition tracker'],
  ['Elder Care', '/elder-care', 'Vitals & family dashboard'],
  ['Emergency Card', '/emergency-card', 'Offline-safe medical QR card'],
]

export default function Dashboard() {
  const { patient } = usePatient()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        {patient ? `Welcome, ${patient.name}` : 'Welcome'}
      </h1>
      <p className="text-gray-500 mb-6">Everything about your health, in one place.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {MODULES.map(([title, path, desc]) => (
          <Link key={path} to={path} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-primary transition">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
