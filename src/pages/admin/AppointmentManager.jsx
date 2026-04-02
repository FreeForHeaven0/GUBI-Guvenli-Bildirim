import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAppointmentsByCounselor, getAppointments, updateAppointment, createNotification, bookSlot } from '../../services/api'
import { v4 as uuidv4 } from 'uuid'
import '../admin/Dashboard.css'
import './AppointmentManager.css'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
const BREAK_SLOTS = ['09:30','09:45','10:00','10:15','10:30','12:30','12:45','13:00','15:15','15:30']

const STATUS_COLORS = {
  'Bekliyor':    { bg:'#FFF8E1', text:'#F57F17' },
  'Onaylandı':   { bg:'#E8F5E9', text:'#2E7D32' },
  'Reddedildi':  { bg:'#FFEBEE', text:'#C62828' },
  'Karşı Teklif':{ bg:'#E3F2FD', text:'#1565C0' },
}

export default function AppointmentManager() {
  const { teacher } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [counterModal, setCounterModal] = useState(null) // appt id
  const [counterSlots, setCounterSlots] = useState([])

  const load = async () => {
    try {
      // Fetch all appointments and filter client-side — more reliable than URL query params
      const all = await getAppointments()
      const data = all.filter(a => a.counselorId === teacher.counselorId)
      setAppointments(data)
    } catch {
      const data = await getAppointmentsByCounselor(teacher.counselorId)
      setAppointments(data)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAccept = async (appt) => {
    setActionLoading(appt.id)
    const bookingId = uuidv4()
    await updateAppointment(appt.id, { status: 'Onaylandı', bookingId })
    await bookSlot({
      counselorId: appt.counselorId,
      day: appt.day,
      slot: appt.proposedSlot,
      appointmentId: appt.id,
      bookingId,
    })
    await createNotification({
      id: uuidv4(),
      counselorId: teacher.counselorId,
      type: 'appointment_confirmed',
      message: `${appt.studentAnonymousCode} randevusu onaylandı: ${appt.day} ${appt.proposedSlot} [#${bookingId.slice(0,8)}]`,
      read: false,
      createdAt: new Date().toISOString(),
    })
    await load()
    setActionLoading(null)
  }

  const handleDecline = async (appt) => {
    setActionLoading(appt.id)
    await updateAppointment(appt.id, { status: 'Reddedildi' })
    await load()
    setActionLoading(null)
  }

  const handleCounterOffer = (appt) => {
    setCounterModal(appt)
    setCounterSlots([])
  }

  const toggleCounterSlot = (slot) => {
    setCounterSlots(prev => {
      if (prev.includes(slot)) return prev.filter(s => s !== slot)
      if (prev.length >= 3) return prev
      return [...prev, slot]
    })
  }

  const submitCounterOffer = async () => {
    if (!counterModal || counterSlots.length === 0) return
    setActionLoading(counterModal.id)
    await updateAppointment(counterModal.id, {
      status: 'Karşı Teklif',
      counterOfferSlots: counterSlots,
    })
    await load()
    setCounterModal(null)
    setActionLoading(null)
  }

  const pending = appointments.filter(a => a.status === 'Bekliyor')
  const others  = appointments.filter(a => a.status !== 'Bekliyor')

  return (
    <div className="appt-manager">
      <div className="apmt-header">
        <button className="rd-back" onClick={() => navigate('/panel')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Panele Dön
        </button>
        <h1 className="apmt-title">Randevu Yönetimi</h1>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="loading-spinner" /></div>
      ) : (
        <div className="apmt-content">
          {/* Pending */}
          <section className="apmt-section">
            <div className="apmt-section-header">
              <h2>Bekleyen Talepler</h2>
              {pending.length > 0 && <span className="apmt-badge">{pending.length}</span>}
            </div>
            {pending.length === 0 ? (
              <div className="apmt-empty">✅ Bekleyen randevu talebi yok</div>
            ) : pending.map(a => (
              <AppointmentCard
                key={a.id}
                appt={a}
                loading={actionLoading === a.id}
                onAccept={() => handleAccept(a)}
                onDecline={() => handleDecline(a)}
                onCounter={() => handleCounterOffer(a)}
              />
            ))}
          </section>

          {/* Others */}
          {others.length > 0 && (
            <section className="apmt-section">
              <div className="apmt-section-header"><h2>Geçmiş Randevular</h2></div>
              {others.map(a => <AppointmentCard key={a.id} appt={a} readOnly />)}
            </section>
          )}
        </div>
      )}

      {/* Counter-offer modal */}
      {counterModal && (
        <div className="modal-overlay" onClick={() => setCounterModal(null)}>
          <div className="modal-card animate-slide-up" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Karşı Teklif Gönder</h2>
            <p className="modal-sub">En fazla 3 alternatif zaman seçin.</p>
            <div className="counter-slots-grid">
              {BREAK_SLOTS.map(slot => (
                <button
                  key={slot}
                  className={`counter-slot-btn ${counterSlots.includes(slot) ? 'selected' : ''}`}
                  onClick={() => toggleCounterSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="counter-selected-label">
              {counterSlots.length > 0
                ? `Seçilen: ${counterSlots.join(', ')}`
                : 'Henüz seçilmedi'}
            </p>
            <div className="modal-actions">
              <button className="btn-primary" disabled={counterSlots.length === 0 || actionLoading} onClick={submitCounterOffer}>
                {actionLoading ? <span className="login-spinner" /> : 'Karşı Teklif Gönder'}
              </button>
              <button className="btn-secondary" onClick={() => setCounterModal(null)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AppointmentCard({ appt, loading, onAccept, onDecline, onCounter, readOnly }) {
  const sc = STATUS_COLORS[appt.status] || {}
  return (
    <div className="apmt-card animate-fade-in">
      <div className="apmt-card-top">
        <div>
          <p className="apmt-student-code">{appt.studentAnonymousCode}</p>
          <p className="apmt-slot">📅 {appt.day} — {appt.proposedSlot} (15 dk)</p>
          <p className="apmt-created">{new Date(appt.createdAt).toLocaleString('tr-TR')}</p>
        </div>
        <span className="status-pill" style={{ background:sc.bg, color:sc.text }}>{appt.status}</span>
      </div>

      {appt.counterOfferSlots?.length > 0 && (
        <div className="apmt-counter-slots">
          <p className="apmt-counter-label">Karşı Teklif Saatleri:</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {appt.counterOfferSlots.map(s => (
              <span key={s} className="apmt-counter-slot">{s}</span>
            ))}
          </div>
        </div>
      )}

      {!readOnly && appt.status === 'Bekliyor' && (
        <div className="apmt-actions">
          <button id={`accept-${appt.id}`} className="apmt-btn apmt-btn--accept" onClick={onAccept} disabled={loading}>
            {loading ? <span className="login-spinner" style={{width:16,height:16,borderWidth:2}} /> : '✓ Onayla'}
          </button>
          <button id={`counter-${appt.id}`} className="apmt-btn apmt-btn--counter" onClick={onCounter} disabled={loading}>
            ⚡ Karşı Teklif
          </button>
          <button id={`decline-${appt.id}`} className="apmt-btn apmt-btn--decline" onClick={onDecline} disabled={loading}>
            ✗ Reddet
          </button>
        </div>
      )}
    </div>
  )
}
