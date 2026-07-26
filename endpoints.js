import api from './client'

// Auth
export const createGuest = (data) => api.post('/auth/guest', data)
export const signup = (data) => api.post('/auth/signup', data)
export const login = (data) => api.post('/auth/login', data)

// Symptom checker
export const analyzeSymptoms = (formData) =>
  api.post('/symptom-checker/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const symptomHistory = (patientId) => api.get(`/symptom-checker/history/${patientId}`)

// Health records
export const uploadRecord = (formData) =>
  api.post('/health-records/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const listRecords = (patientId) => api.get(`/health-records/${patientId}`)

// Medicine reminders
export const createReminder = (data) => api.post('/medicine-reminders/', data)
export const listReminders = (patientId) => api.get(`/medicine-reminders/${patientId}`)
export const markTaken = (reminderId) => api.post(`/medicine-reminders/${reminderId}/mark-taken`)

// Appointments
export const bookAppointment = (data) => api.post('/appointments/', data)
export const listAppointments = (patientId) => api.get(`/appointments/${patientId}`)

// Disease prediction
export const assessRisk = (data) => api.post('/disease-prediction/assess', data)
export const riskHistory = (patientId) => api.get(`/disease-prediction/${patientId}`)

// Mental wellness
export const logMood = (data) => api.post('/mental-wellness/mood', data)
export const moodHistory = (patientId) => api.get(`/mental-wellness/mood/${patientId}`)

// Women's health
export const createPregnancyTracker = (data) => api.post('/women-health/pregnancy', data)
export const getPregnancyTracker = (patientId) => api.get(`/women-health/pregnancy/${patientId}`)

// Elder care
export const logVitals = (data) => api.post('/elder-care/vitals', data)
export const vitalsHistory = (patientId) => api.get(`/elder-care/vitals/${patientId}`)
export const addFamilyLink = (data) => api.post('/elder-care/family-link', data)
export const listFamilyLinks = (patientId) => api.get(`/elder-care/family-link/${patientId}`)

// Emergency
export const getQrCard = (patientId) => api.get(`/emergency/qr-card/${patientId}`)
