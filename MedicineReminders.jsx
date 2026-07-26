import { useState, useEffect } from 'react'
import { usePatient } from '../context/PatientContext'
import { createReminder, listReminders, markTaken } from '../api/endpoints'

export default function MedicineReminders() {
  const { patient } = usePatient()
  const [form, setForm] = useState({ medicine_name: '', dosage: '', frequency: '', notify_via: 'app' })
  const [reminders, setReminders] = useState([])

  const load = () => patient && listReminders(patient.id).then((r) => setReminders(r.data))
  useEffect(load, [patient])

  const submit = async (e) => {
    e.preventDefault()
    if (!patient) return
    await createReminder({ patient_id: patient.id, ...form })
    setForm({ medicine_name: '', dosage: '', frequency: '', notify_via: 'app' })
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Medicine Reminders</h1>
      <p className="text-gray-500 mb-6">Track doses, get notified, never miss a medicine.</p>

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 gap-3">
        <input required placeholder="Medicine name" value={form.medicine_name}
          onChange={(e) => setForm({ ...form, medicine_name: e.target.value })} className="border rounded-md px-3 py-2 text-sm col-span-2" />
        <input placeholder="Dosage (e.g. 500mg)" value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
        <input placeholder="Frequency (e.g. twice daily)" value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
        <select value={form.notify_via} onChange={(e) => setForm({ ...form, notify_via: e.target.value })} className="border rounded-md px-3 py-2 text-sm col-span-2">
          <option value="app">App notification</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="sms">SMS</option>
          <option value="voice">Voice reminder</option>
        </select>
        <button className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium col-span-2">Add Reminder</button>
      </form>

      <div className="mt-6 space-y-2">
        {reminders.map((r) => (
          <div key={r.id} className="bg-white border border-gray-100 rounded-md p-3 flex justify-between items-center text-sm">
            <div>
              <p className="font-medium text-gray-700">{r.medicine_name} {r.dosage}</p>
              <p className="text-gray-500">{r.frequency} — via {r.notify_via}</p>
            </div>
            <button onClick={() => markTaken(r.id).then(load)} className="text-primary text-xs font-medium">Mark taken</button>
          </div>
        ))}
      </div>
    </div>
  )
}
