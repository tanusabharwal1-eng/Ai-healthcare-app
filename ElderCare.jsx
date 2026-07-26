import { useState, useEffect } from 'react'
import { usePatient } from '../context/PatientContext'
import { logVitals, vitalsHistory, addFamilyLink, listFamilyLinks } from '../api/endpoints'

export default function ElderCare() {
  const { patient } = usePatient()
  const [vitals, setVitals] = useState({ heart_rate: '', blood_pressure: '', blood_sugar: '' })
  const [readings, setReadings] = useState([])
  const [family, setFamily] = useState({ family_member_name: '', family_member_contact: '', relation: '' })
  const [links, setLinks] = useState([])

  const loadVitals = () => patient && vitalsHistory(patient.id).then((r) => setReadings(r.data))
  const loadFamily = () => patient && listFamilyLinks(patient.id).then((r) => setLinks(r.data))
  useEffect(() => { loadVitals(); loadFamily() }, [patient])

  const submitVitals = async (e) => {
    e.preventDefault()
    if (!patient) return
    await logVitals({
      patient_id: patient.id,
      heart_rate: vitals.heart_rate ? Number(vitals.heart_rate) : null,
      blood_pressure: vitals.blood_pressure || null,
      blood_sugar: vitals.blood_sugar ? Number(vitals.blood_sugar) : null,
    })
    setVitals({ heart_rate: '', blood_pressure: '', blood_sugar: '' })
    loadVitals()
  }

  const submitFamily = async (e) => {
    e.preventDefault()
    if (!patient) return
    await addFamilyLink({ patient_id: patient.id, ...family })
    setFamily({ family_member_name: '', family_member_contact: '', relation: '' })
    loadFamily()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Elderly Care</h1>
        <p className="text-gray-500 mb-6">Vitals monitoring and family dashboard.</p>

        <form onSubmit={submitVitals} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-3 gap-3">
          <input placeholder="Heart rate" type="number" value={vitals.heart_rate}
            onChange={(e) => setVitals({ ...vitals, heart_rate: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <input placeholder="BP (120/80)" value={vitals.blood_pressure}
            onChange={(e) => setVitals({ ...vitals, blood_pressure: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <input placeholder="Blood sugar" type="number" value={vitals.blood_sugar}
            onChange={(e) => setVitals({ ...vitals, blood_sugar: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <button className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium col-span-3">Log Vitals</button>
        </form>

        <div className="mt-4 space-y-2">
          {readings.map((r) => (
            <div key={r.id} className="bg-white border border-gray-100 rounded-md p-3 text-sm text-gray-600">
              HR {r.heart_rate ?? '-'} · BP {r.blood_pressure ?? '-'} · Sugar {r.blood_sugar ?? '-'} — {new Date(r.recorded_at).toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Family Dashboard</h2>
        <form onSubmit={submitFamily} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-3 gap-3">
          <input required placeholder="Name" value={family.family_member_name}
            onChange={(e) => setFamily({ ...family, family_member_name: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <input placeholder="Contact" value={family.family_member_contact}
            onChange={(e) => setFamily({ ...family, family_member_contact: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <input placeholder="Relation" value={family.relation}
            onChange={(e) => setFamily({ ...family, relation: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <button className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium col-span-3">Add Family Member</button>
        </form>
        <div className="mt-4 space-y-2">
          {links.map((f) => (
            <div key={f.id} className="bg-white border border-gray-100 rounded-md p-3 text-sm text-gray-600">
              {f.family_member_name} ({f.relation}) — {f.family_member_contact}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
