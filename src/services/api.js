const BASE = import.meta.env.VITE_API_URL || 'https://gubi-guvenli-bildirim.onrender.com'

// --- Reports ---
export const createReport = (data) =>
  fetch(`${BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

// json-server v1: use _sort=-field for descending (old _order=desc is broken)
export const getReports = () => fetch(`${BASE}/reports?_sort=-createdAt`).then(r => r.json())

// --- Students (TC Kimlik verification) ---
// json-server v1 can't reliably filter strings via URL params — fetch all and filter client-side
export const getStudentByTc = async (tc) => {
  const all = await fetch(`${BASE}/students`).then(r => r.json())
  return all.find(s => s.tc === tc) || null
}

export const updateReport = (id, data) =>
  fetch(`${BASE}/reports/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

// --- Counselors ---
export const getCounselors = () => fetch(`${BASE}/counselors`).then(r => r.json())
export const getCounselor = (id) => fetch(`${BASE}/counselors/${id}`).then(r => r.json())

export const updateCounselor = (id, data) =>
  fetch(`${BASE}/counselors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

// Atomically adds a booking entry to counselor.bookedSlots
export const bookSlot = async ({ counselorId, day, slot, appointmentId, bookingId }) => {
  const counselor = await getCounselor(counselorId)
  const existing = counselor.bookedSlots || []
  // Idempotent: don't double-book the same appointmentId
  if (existing.some(b => b.appointmentId === appointmentId)) return
  return updateCounselor(counselorId, {
    bookedSlots: [...existing, { bookingId, day, slot, appointmentId, bookedAt: new Date().toISOString() }],
  })
}

// --- Appointments ---
export const createAppointment = (data) =>
  fetch(`${BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const getAppointments = () => fetch(`${BASE}/appointments?_sort=-createdAt`).then(r => r.json())

export const getAppointmentsByCounselor = (counselorId) =>
  fetch(`${BASE}/appointments?counselorId=${counselorId}&_sort=-createdAt`).then(r => r.json())

export const updateAppointment = (id, data) =>
  fetch(`${BASE}/appointments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

// --- Notifications ---
export const getNotifications = (counselorId) =>
  fetch(`${BASE}/notifications?counselorId=${counselorId}&_sort=-createdAt`).then(r => r.json())

export const markNotificationRead = (id) =>
  fetch(`${BASE}/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: true }),
  }).then(r => r.json())

export const createNotification = (data) =>
  fetch(`${BASE}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())
