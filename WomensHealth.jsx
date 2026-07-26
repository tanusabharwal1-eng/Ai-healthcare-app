import { useState, useEffect } from 'react'
import { usePatient } from '../context/PatientContext'
import { createPregnancyTracker, getPregnancyTracker } from '../api/endpoints'

export default function WomensHealth() {
  const { patient } = usePatient()
  const [lmp, setLmp] = useState('')
  const [tracker, setTracker] = useState(null)

  useEffect(() => {
    if (patient) getPregnancyTracker(patient.id).then((r) => setTracker(r.data)).catch(() => {})
  }, [patient])

  const submit = async (e) => {
    e.preventDefault()
    if (!patient || !lmp) return
    const { data } = await createPregnancyTracker({ patient_id: patient.id, lmp_date: lmp })
    setTracker(data)
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Women's Healthcare</h1>
      <p className="text-gray-500 mb-6">Pregnancy tracker, baby growth, nutrition guidance.</p>

      {!tracker ? (
        <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3">
          <label className="text-sm text-gray-600">Last menstrual period date</label>
          <input required type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
          <button className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium">Start Tracking</button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-2">
          <p className="text-sm text-gray-600">Current week: <span className="font-semibold text-gray-800">{tracker.current_week}</span></p>
          <p className="text-sm text-gray-600">Estimated due date: <span className="font-semibold text-gray-800">{tracker.due_date}</span></p>
          <p className="text-xs text-gray-400 mt-4 italic">Nutrition guide and baby growth details go here as the pregnancy progresses.</p>
        </div>
      )}
    </div>
  )
}
