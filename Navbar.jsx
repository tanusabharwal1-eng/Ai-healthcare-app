import { Link } from 'react-router-dom'
import { usePatient } from '../context/PatientContext'

export default function Navbar() {
  const { patient, logout } = usePatient()

  const links = [
    ['Dashboard', '/dashboard'],
    ['Symptom Checker', '/symptom-checker'],
    ['Health Records', '/health-records'],
    ['Medicine Reminders', '/medicine-reminders'],
    ['Appointments', '/appointments'],
    ['Disease Risk', '/disease-risk'],
    ['Mental Wellness', '/mental-wellness'],
    ["Women's Health", '/womens-health'],
    ['Elder Care', '/elder-care'],
    ['Emergency Card', '/emergency-card'],
  ]

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex flex-wrap items-center gap-4 sticky top-0 z-10">
      <Link to="/" className="font-bold text-primary text-lg mr-4">HealthAI</Link>
      {links.map(([label, path]) => (
        <Link key={path} to={path} className="text-sm text-gray-600 hover:text-primary">
          {label}
        </Link>
      ))}
      <div className="ml-auto flex items-center gap-3">
        {patient ? (
          <>
            <span className="text-sm text-gray-500">{patient.name} {patient.is_guest ? '(guest)' : ''}</span>
            <button onClick={logout} className="text-sm text-urgent">Logout</button>
          </>
        ) : (
          <Link to="/login" className="text-sm text-primary">Login / Guest</Link>
        )}
      </div>
    </nav>
  )
}
