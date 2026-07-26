import { useState } from 'react'
import { usePatient } from '../context/PatientContext'
import { analyzeSymptoms } from '../api/endpoints'
import UrgencyBadge from '../components/UrgencyBadge'

const LANGUAGES = [
  ['en', 'English'], ['hi', 'Hindi'], ['pa', 'Punjabi'],
]

export default function SymptomChecker() {
  const { patient } = usePatient()
  const [symptoms, setSymptoms] = useState('')
  const [scanType, setScanType] = useState('none')
  const [language, setLanguage] = useState('en')
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!patient) { setError('Please login or continue as guest first.'); return }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('patient_id', patient.id)
      formData.append('symptoms_text', symptoms)
      formData.append('scan_type', scanType)
      formData.append('language', language)
      if (patient.age) formData.append('age', patient.age)
      if (patient.gender) formData.append('gender', patient.gender)
      if (patient.weight_kg) formData.append('weight_kg', patient.weight_kg)
      if (patient.height_cm) formData.append('height_cm', patient.height_cm)
      if (image) formData.append('image', image)

      const { data } = await analyzeSymptoms(formData)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed — check the backend AI config.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">AI Symptom Checker</h1>
      <p className="text-gray-500 mb-6">Describe symptoms, or scan face / hand / body for visual signs.</p>

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <textarea
          placeholder="Describe your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />

        <div className="flex gap-3 flex-wrap">
          <select value={scanType} onChange={(e) => setScanType(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            <option value="none">No image scan</option>
            <option value="face">Scan: Face</option>
            <option value="hand">Scan: Hand</option>
            <option value="body">Scan: Body (rash/wound)</option>
          </select>

          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
            {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>

          {scanType !== 'none' && (
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
              className="text-sm" />
          )}
        </div>

        {error && <p className="text-urgent text-sm">{error}</p>}

        <button disabled={loading} className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Check Symptoms'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3">
          <UrgencyBadge level={result.urgency_level} />
          <div>
            <h3 className="font-semibold text-gray-700">Possible conditions</h3>
            <ul className="list-disc ml-5 text-sm text-gray-600">
              {(result.possible_conditions || []).map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Suggested specialist</h3>
            <p className="text-sm text-gray-600">{result.suggested_specialist}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Explanation</h3>
            <p className="text-sm text-gray-600">{result.explanation}</p>
          </div>
          <p className="text-xs text-gray-400 italic">{result.disclaimer}</p>
        </div>
      )}
    </div>
  )
}
