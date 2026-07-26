import { useState } from 'react'
import { usePatient } from '../context/PatientContext'
import { assessRisk } from '../api/endpoints'

const DISEASE_FIELDS = {
  diabetes: ['glucose', 'bmi'],
  heart: ['bp', 'age'],
  kidney: ['creatinine'],
  liver: ['bilirubin'],
}

export default function DiseaseRisk() {
  const { patient } = usePatient()
  const [disease, setDisease] = useState('diabetes')
  const [inputs, setInputs] = useState({})
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!patient) return
    const numericInputs = Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, parseFloat(v) || 0]))
    const { data } = await assessRisk({ patient_id: patient.id, disease, inputs: numericInputs })
    setResult(data)
  }

  const fields = DISEASE_FIELDS[disease] || ['value']

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Disease Risk Prediction</h1>
      <p className="text-gray-500 mb-6">Diabetes, heart, kidney, liver, and cancer risk screening.</p>

      <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <select value={disease} onChange={(e) => { setDisease(e.target.value); setInputs({}) }} className="w-full border rounded-md px-3 py-2 text-sm">
          <option value="diabetes">Diabetes</option>
          <option value="heart">Heart disease</option>
          <option value="kidney">Kidney disease</option>
          <option value="liver">Liver disease</option>
          <option value="cancer_breast">Cancer — Breast</option>
          <option value="cancer_skin">Cancer — Skin</option>
          <option value="cancer_lung">Cancer — Lung</option>
        </select>

        {fields.map((f) => (
          <input key={f} placeholder={f} type="number" value={inputs[f] || ''}
            onChange={(e) => setInputs({ ...inputs, [f]: e.target.value })}
            className="w-full border rounded-md px-3 py-2 text-sm" />
        ))}

        <button className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium">Assess Risk</button>
      </form>

      {result && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-3xl font-bold text-primary">{result.risk_percentage}%</p>
          <p className="text-sm text-gray-500 mb-3">estimated risk</p>
          <p className="text-sm text-gray-600">{result.prevention_tips}</p>
        </div>
      )}
    </div>
  )
}
