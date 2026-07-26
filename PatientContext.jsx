import { createContext, useContext, useState, useEffect } from 'react'

const PatientContext = createContext(null)

export function PatientProvider({ children }) {
  const [patient, setPatient] = useState(() => {
    const saved = localStorage.getItem('patient')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (patient) localStorage.setItem('patient', JSON.stringify(patient))
    else localStorage.removeItem('patient')
  }, [patient])

  const logout = () => setPatient(null)

  return (
    <PatientContext.Provider value={{ patient, setPatient, logout }}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient() {
  return useContext(PatientContext)
}
