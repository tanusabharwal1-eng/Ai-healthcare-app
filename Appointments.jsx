import { useState, useEffect } from 'react'
import { usePatient } from '../context/PatientContext'
import { bookAppointment, listAppointments } from '../api/endpoints'

export default function Appointments() {
  const { patient } = usePatient()
  const [form, setForm] = useState({ department: '', doctor_name: '', scheduled_at: '', mode: 'in_person' })
  const [appts, setAppts] = useState([])

  const load = () => patient && listAppointments(patient.id).then((r) => setAppts(r.data))
  useEffect(load, [patient])

  const submit = async (e) => {
    e.preventDefault()
    if (!patient) return
    await bookAppointment({ patient_id: patient.id, ...form, scheduled_at: form.scheduled_at || null })
    setForm({ department: '', doctor_name: '', scheduled_at: '', mode: 'in_person' })
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Appointments</h1>
      <p className="text-gray-500 mb-6">Book in-person or video consultations.</p>

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 gap-3">
        <input placeholder="Department" value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
        <input placeholder="Doctor name" value={form.doctor_name}
          onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
        <input type="datetime-local" value={form.scheduled_at}
          onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
        <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
          <option value="in_person">In-person</option>
          <option value="video">Video consultation</option>
        </select>
        <button className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium col-span-2">Book Appointment</button>
      </form>

      <div className="mt-6 space-y-2">
        {appts.map((a) => (
          <div key={a.id} className="bg-white border border-gray-100 rounded-md p-3 text-sm">
            <p className="font-medium text-gray-700">{a.department} — {a.doctor_name || 'Unassigned'}</p>
            <p className="text-gray-500">{a.mode} · {a.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
