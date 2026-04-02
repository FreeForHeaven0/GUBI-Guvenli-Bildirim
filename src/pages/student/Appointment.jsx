import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import MobileShell from '../../components/MobileShell'
import { createAppointment, createNotification, getCounselor } from '../../services/api'
import './Appointment.css'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']

export default function AppointmentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { report, counselor, counterOffer } = location.state || {}

  const [selectedDay, setSelectedDay] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [bookedSlots, setBookedSlots] = useState([])

  // Load the counselor's booked slots so we can filter them from the picker
  useEffect(() => {
    if (counselor?.id) {
      getCounselor(counselor.id).then(c => {
        setBookedSlots(c.bookedSlots || [])
      }).catch(() => {})
    }
  }, [counselor?.id])

  // Helper: is a given day+slot already booked?
  const isBooked = (day, slot) =>
    bookedSlots.some(b => b.day === day && b.slot === slot)

  // If received counter-offer, show those slots (counter-offer slots are never pre-booked)
  const isCounterOffer = Boolean(counterOffer)
  const rawSlots = isCounterOffer
    ? counterOffer
    : (counselor?.availability?.[selectedDay] || [])
  // Filter out any already-booked slots
  const availableSlots = rawSlots.filter(slot => !isBooked(selectedDay, slot))

  const handleSubmit = async () => {
    if (!selectedDay || !selectedSlot) {
      setError('Lütfen bir gün ve zaman seçin.')
      return
    }
    setSubmitting(true)
    try {
      const appt = await createAppointment({
        id: uuidv4(),
        reportId: report?.id,
        counselorId: counselor?.id,
        studentAnonymousCode: report?.anonymousCode,
        proposedSlot: selectedSlot,
        day: selectedDay,
        status: 'Bekliyor',
        counterOfferSlots: [],
        duration: 15,
        createdAt: new Date().toISOString(),
      })
      await createNotification({
        id: uuidv4(),
        counselorId: counselor?.id,
        type: 'appointment_request',
        message: `${report?.anonymousCode} kodlu öğrenciden randevu talebi: ${selectedDay} ${selectedSlot}`,
        read: false,
        createdAt: new Date().toISOString(),
      })
      navigate('/bildir/son', { state: { appointment: appt, counselor } })
    } catch {
      setError('Randevu oluşturulamadı. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileShell title="Randevu Seç" backTo="/bildir/danismanlar">
      <div className="appointment-page">
        {/* Counselor info */}
        {counselor && (
          <div className="appt-counselor-banner">
            <div className="appt-counselor-avatar" style={{ background: counselor.color }}>
              {counselor.initials}
            </div>
            <div>
              <p className="appt-counselor-name">{counselor.name}</p>
              <p className="appt-counselor-title">{counselor.title}</p>
            </div>
          </div>
        )}

        {isCounterOffer && (
          <div className="appt-counter-notice">
            <span>⚡</span>
            <span>Danışman bir karşı teklif gönderdi. Aşağıdaki alternatif saatlerden birini seçebilirsin.</span>
          </div>
        )}

        {/* Scheduling constraints notice */}
        <div className="appt-school-notice">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <p>Randevular yalnızca okul saatleri içinde ve teneffüs/öğle aralarında planlanabilir (15 dakika).</p>
        </div>

        {/* Day selector */}
        {!isCounterOffer && (
          <div className="appt-section">
            <label className="appt-label">Gün Seç</label>
            <div className="day-grid">
              {DAYS.map(day => {
                const totalSlots = counselor?.availability?.[day] || []
                const freeSlots = totalSlots.filter(slot => !isBooked(day, slot))
                const cnt = freeSlots.length
                return (
                  <button
                    key={day}
                    id={`day-${day}`}
                    className={`day-btn ${selectedDay === day ? 'selected' : ''} ${cnt === 0 ? 'disabled' : ''}`}
                    onClick={() => { if (cnt > 0) { setSelectedDay(day); setSelectedSlot('') } }}
                    disabled={cnt === 0}
                  >
                    <span className="day-name">{day.slice(0, 3)}</span>
                    <span className="day-slots">{cnt > 0 ? `${cnt} slot` : 'Dolu'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Time slot selector */}
        {(selectedDay || isCounterOffer) && availableSlots.length > 0 && (
          <div className="appt-section animate-fade-in">
            <label className="appt-label">
              {isCounterOffer ? 'Karşı Teklif Saatleri' : `${selectedDay} — Uygun Saatler`}
            </label>
            <div className="slot-grid">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  id={`slot-${slot.replace(':', '-')}`}
                  className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => { setSelectedSlot(slot); setError('') }}
                >
                  {slot}
                  <span className="slot-duration">15 dk</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedDay && availableSlots.length === 0 && (
          <p className="appt-no-slots">Bu gün için uygun saat bulunmuyor.</p>
        )}

        {error && <p className="appt-error">{error}</p>}

        <button
          id="confirm-appointment-btn"
          className="btn-primary"
          style={{ marginTop: 'auto' }}
          disabled={!selectedDay || !selectedSlot || submitting}
          onClick={handleSubmit}
        >
          {submitting ? <span className="login-spinner" /> : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18}}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Randevuyu Onayla
            </>
          )}
        </button>
      </div>
    </MobileShell>
  )
}
