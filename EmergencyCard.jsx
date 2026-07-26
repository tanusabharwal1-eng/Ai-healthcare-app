import { useState, useEffect } from 'react'
import { usePatient } from '../context/PatientContext'
import { getQrCard } from '../api/endpoints'

export default function EmergencyCard() {
  const { patient } = usePatient()
  const [card, setCard] = useState(null)

  useEffect(() => {
    if (patient) getQrCard(patient.id).then((r) => setCard(r.data)).catch(() => {})
  }, [patient])

  if (!card) return <div className="max-w-md mx-auto py-8 px-4 text-gray-500">Loading emergency card...</div>

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Emergency Medical Card</h1>
      <p className="text-gray-500 mb-6">Works offline — this data is safe to embed in a printable QR card.</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-urgent space-y-2">
        <p><span className="font-semibold">Name:</span> {card.name}</p>
        <p><span className="font-semibold">Gender:</span> {card.gender}</p>
        <p><span className="font-semibold">Age:</span> {card.age ?? '-'}</p>
        <p><span className="font-semibold">Blood group:</span> {card.blood_group ?? '-'}</p>
        <p><span className="font-semibold">Allergies:</span> {card.allergies ?? 'None recorded'}</p>
      </div>
      <p className="text-xs text-gray-400 mt-3 italic">
        Render this JSON as a QR code (e.g. with the `qrcode` npm package) for the printable card.
      </p>
    </div>
  )
}
