import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getCounselor, updateCounselor } from '../../services/api'
import '../admin/Dashboard.css'
import './AvailabilitySettings.css'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
const ALL_SLOTS = [
  '09:30', '09:45', '10:00', '10:15', '10:30',
  '12:30', '12:45', '13:00',
  '15:15', '15:30',
]

export default function AvailabilitySettings() {
  const { teacher } = useAuth()
  const navigate = useNavigate()
  const [counselor, setCounselor] = useState(null)
  const [availability, setAvailability] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getCounselor(teacher.counselorId).then(c => {
      setCounselor(c)
      setAvailability(c.availability || {})
      setLoading(false)
    })
  }, [teacher])

  // Build a lookup: { 'Pazartesi|10:00': { bookingId, appointmentId } }
  const bookedMap = {}
  ;(counselor?.bookedSlots || []).forEach(b => {
    bookedMap[`${b.day}|${b.slot}`] = b
  })
  const isBooked = (day, slot) => !!bookedMap[`${day}|${slot}`]
  const getBooking = (day, slot) => bookedMap[`${day}|${slot}`]

  const toggleSlot = (day, slot) => {
    setAvailability(prev => {
      const daySlots = prev[day] || []
      const updated = daySlots.includes(slot)
        ? daySlots.filter(s => s !== slot)
        : [...daySlots, slot].sort()
      return { ...prev, [day]: updated }
    })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await updateCounselor(teacher.counselorId, { availability })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const totalSlots = Object.values(availability).reduce((sum, slots) => sum + slots.length, 0)

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="loading-spinner" /></div>

  return (
    <div className="availability-page">
      <div className="av-header">
        <button className="rd-back" onClick={() => navigate('/panel')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Panele Dön
        </button>
        <div>
          <h1 className="av-title">Müsaitlik Ayarları</h1>
          <p className="av-sub">{counselor?.name} — {counselor?.title}</p>
        </div>
      </div>

      <div className="av-info-card animate-fade-in">
        <span>⚠️</span>
        <div>
          <p className="av-info-title">Zaman Kısıtlamaları</p>
          <p className="av-info-text">
            Seçebileceğiniz saatler yalnızca okul teneffüs ve öğle aralarından oluşmaktadır.
            Ders saatleri içinde randevu planlanamaz. Maksimum süre 15 dakikadır.
          </p>
        </div>
      </div>

      <div className="av-stats animate-fade-in">
        <div className="av-stat"><span className="av-stat-num">{totalSlots}</span><span>Toplam Slot</span></div>
        <div className="av-stat"><span className="av-stat-num">{DAYS.filter(d => (availability[d] || []).length > 0).length}</span><span>Aktif Gün</span></div>
      </div>

      <div className="av-grid animate-fade-in delay-100">
        {DAYS.map(day => {
          const daySlots = availability[day] || []
          return (
            <div key={day} className="av-day-card">
              <div className="av-day-header">
                <h3 className="av-day-name">{day}</h3>
                <span className="av-day-count">{daySlots.length} slot</span>
              </div>
              <div className="av-slot-group">
                <p className="av-slot-group-label">Sabah Araları</p>
                <div className="av-slots">
                  {ALL_SLOTS.filter(s => s < '12:00').map(slot => {
                    const booked = isBooked(day, slot)
                    const booking = getBooking(day, slot)
                    return booked ? (
                      <div
                        key={slot}
                        className="av-slot-btn av-slot-booked"
                        title={`Rezerve: #${booking?.bookingId?.slice(0,8)}`}
                      >
                        🔒 {slot}
                        <span className="av-booking-hash">#{booking?.bookingId?.slice(0,8)}</span>
                      </div>
                    ) : (
                      <button
                        key={slot}
                        id={`av-${day}-${slot.replace(':','-')}`}
                        className={`av-slot-btn ${daySlots.includes(slot) ? 'active' : ''}`}
                        onClick={() => toggleSlot(day, slot)}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="av-slot-group">
                <p className="av-slot-group-label">Öğle Arası</p>
                <div className="av-slots">
                  {ALL_SLOTS.filter(s => s >= '12:00' && s < '14:00').map(slot => {
                    const booked = isBooked(day, slot)
                    const booking = getBooking(day, slot)
                    return booked ? (
                      <div
                        key={slot}
                        className="av-slot-btn av-slot-booked"
                        title={`Rezerve: #${booking?.bookingId?.slice(0,8)}`}
                      >
                        🔒 {slot}
                        <span className="av-booking-hash">#{booking?.bookingId?.slice(0,8)}</span>
                      </div>
                    ) : (
                      <button
                        key={slot}
                        id={`av-${day}-${slot.replace(':','-')}`}
                        className={`av-slot-btn ${daySlots.includes(slot) ? 'active' : ''}`}
                        onClick={() => toggleSlot(day, slot)}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="av-slot-group">
                <p className="av-slot-group-label">Öğleden Sonra</p>
                <div className="av-slots">
                  {ALL_SLOTS.filter(s => s >= '15:00').map(slot => {
                    const booked = isBooked(day, slot)
                    const booking = getBooking(day, slot)
                    return booked ? (
                      <div
                        key={slot}
                        className="av-slot-btn av-slot-booked"
                        title={`Rezerve: #${booking?.bookingId?.slice(0,8)}`}
                      >
                        🔒 {slot}
                        <span className="av-booking-hash">#{booking?.bookingId?.slice(0,8)}</span>
                      </div>
                    ) : (
                      <button
                        key={slot}
                        id={`av-${day}-${slot.replace(':','-')}`}
                        className={`av-slot-btn ${daySlots.includes(slot) ? 'active' : ''}`}
                        onClick={() => toggleSlot(day, slot)}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="av-save-bar">
        {saved && (
          <span className="av-saved-msg animate-fade-in">✅ Müsaitliğiniz kaydedildi!</span>
        )}
        <button
          id="save-availability-btn"
          className="btn-primary av-save-btn"
          style={{ maxWidth:320 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <span className="login-spinner" /> : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18}}>
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>
              </svg>
              Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  )
}
