import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { usePatient } from '../context/PatientContext'
import { logMood, moodHistory } from '../api/endpoints'

export default function MentalWellness() {
  const { patient } = usePatient()
  const [form, setForm] = useState({ mood_score: 5, journal_text: '', sleep_hours: '', steps: '', stress_level: 'Low' })
  const [history, setHistory] = useState([])

  const load = () => patient && moodHistory(patient.id).then((r) => setHistory(r.data.reverse()))
  useEffect(load, [patient])

  const submit = async (e) => {
    e.preventDefault()
    if (!patient) return
    await logMood({
      patient_id: patient.id, mood_score: Number(form.mood_score),
      journal_text: form.journal_text, sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
      steps: form.steps ? Number(form.steps) : null, stress_level: form.stress_level,
    })
    setForm({ mood_score: 5, journal_text: '', sleep_hours: '', steps: '', stress_level: 'Low' })
    load()
  }

  const chartData = history.map((h) => ({ date: new Date(h.created_at).toLocaleDateString(), mood: h.mood_score }))

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Mental Wellness</h1>
      <p className="text-gray-500 mb-6">Mood tracker, journal, sleep and step tracking.</p>

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <label className="text-sm text-gray-600">Mood (1-10): {form.mood_score}</label>
        <input type="range" min="1" max="10" value={form.mood_score}
          onChange={(e) => setForm({ ...form, mood_score: e.target.value })} className="w-full" />
        <textarea placeholder="Journal entry..." value={form.journal_text}
          onChange={(e) => setForm({ ...form, journal_text: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm" rows={3} />
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Sleep hrs" type="number" value={form.sleep_hours}
            onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <input placeholder="Steps" type="number" value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })} className="border rounded-md px-3 py-2 text-sm" />
          <select value={form.stress_level} onChange={(e) => setForm({ ...form, stress_level: e.target.value })} className="border rounded-md px-3 py-2 text-sm">
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <button className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium">Log Entry</button>
      </form>

      {chartData.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100" style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#0d9488" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
