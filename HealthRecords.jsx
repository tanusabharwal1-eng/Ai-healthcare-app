import { useState, useEffect } from 'react'
import { usePatient } from '../context/PatientContext'
import { uploadRecord, listRecords } from '../api/endpoints'

export default function HealthRecords() {
  const { patient } = usePatient()
  const [recordType, setRecordType] = useState('lab_report')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (patient) listRecords(patient.id).then((r) => setRecords(r.data)).catch(() => {})
  }, [patient])

  const submit = async (e) => {
    e.preventDefault()
    if (!patient || !file) { setError('Login and choose a file first.'); return }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('patient_id', patient.id)
      formData.append('record_type', recordType)
      formData.append('language', patient.preferred_language || 'en')
      formData.append('file', file)
      const { data } = await uploadRecord(formData)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed — check backend OCR/AI config.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Smart Health Records</h1>
      <p className="text-gray-500 mb-6">Upload lab reports, prescriptions, or vaccination records.</p>

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <select value={recordType} onChange={(e) => setRecordType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
          <option value="lab_report">Lab Report</option>
          <option value="prescription">Prescription</option>
          <option value="vaccination">Vaccination Record</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        {error && <p className="text-urgent text-sm">{error}</p>}
        <button disabled={loading} className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50">
          {loading ? 'Processing...' : 'Upload & Analyze'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-2">
          <h3 className="font-semibold text-gray-700">Summary</h3>
          <p className="text-sm text-gray-600">{result.summary}</p>
          <h3 className="font-semibold text-gray-700">Plain-language explanation</h3>
          <p className="text-sm text-gray-600">{result.plain_language_explanation}</p>
          <h3 className="font-semibold text-gray-700">Medicines identified</h3>
          <ul className="list-disc ml-5 text-sm text-gray-600">
            {(result.medicines_identified || []).map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Past records</h3>
          <ul className="space-y-2">
            {records.map((r) => (
              <li key={r.id} className="bg-white border border-gray-100 rounded-md p-3 text-sm text-gray-600">
                {r.record_type} — uploaded {new Date(r.uploaded_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
