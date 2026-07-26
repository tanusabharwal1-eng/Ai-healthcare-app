import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGuest, signup, login } from '../api/endpoints'
import { usePatient } from '../context/PatientContext'

export default function Login() {
  const [mode, setMode] = useState('guest')   // guest, signup, login
  const [form, setForm] = useState({ name: '', gender: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { setPatient } = usePatient()
  const navigate = useNavigate()

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'guest') {
        const { data } = await createGuest({ name: form.name, gender: form.gender })
        setPatient(data)
      } else if (mode === 'signup') {
        const { data } = await signup(form)
        setPatient(data)
      } else {
        const { data } = await login({ email: form.email, password: form.password })
        setPatient({ id: data.patient_id, name: form.email, is_guest: false })
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome</h1>
      <p className="text-gray-500 mb-6">Continue as guest, or create an account to save your history.</p>

      <div className="flex gap-2 mb-6">
        {['guest', 'signup', 'login'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-md text-sm capitalize ${mode === m ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode !== 'login' && (
          <>
            <input required placeholder="Name *" value={form.name} onChange={update('name')}
              className="w-full border rounded-md px-3 py-2 text-sm" />
            <select required value={form.gender} onChange={update('gender')}
              className="w-full border rounded-md px-3 py-2 text-sm">
              <option value="">Gender *</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </>
        )}
        {mode !== 'guest' && (
          <>
            <input required type="email" placeholder="Email" value={form.email} onChange={update('email')}
              className="w-full border rounded-md px-3 py-2 text-sm" />
            <input required type="password" placeholder="Password" value={form.password} onChange={update('password')}
              className="w-full border rounded-md px-3 py-2 text-sm" />
          </>
        )}
        {error && <p className="text-urgent text-sm">{error}</p>}
        <button className="w-full bg-primary text-white rounded-md py-2 text-sm font-medium">
          {mode === 'guest' ? 'Continue as Guest' : mode === 'signup' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  )
}
