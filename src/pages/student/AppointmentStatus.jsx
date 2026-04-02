import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import MobileShell from '../../components/MobileShell'
import { getAppointments, updateAppointment, bookSlot } from '../../services/api'
import './AppointmentStatus.css'

const STATUS_META = {
  'Bekliyor': {
    icon: '⏳',
    label: 'İnceleniyor',
    color: '#F57F17',
    bg: '#FFF8E1',
    border: '#FFE082',
    message: 'Randevu talebин danışmanın tarafından inceleniyor. Lütfen bekleyin.',
  },
  'Onaylandı': {
    icon: '✅',
    label: 'Onaylandı',
    color: '#2E7D32',
    bg: '#E8F5E9',
    border: '#A5D6A7',
    message: 'Randevun onaylandı! Aşağıdaki zamanda danışmanınla görüşebilirsin.',
  },
  'Reddedildi': {
    icon: '❌',
    label: 'Reddedildi',
    color: '#C62828',
    bg: '#FFEBEE',
    border: '#EF9A9A',
    message: 'Maalesef bu randevu talebi reddedildi. Dilersen yeni bir randevu alabilirsin.',
  },
  'Karşı Teklif': {
    icon: '⚡',
    label: 'Karşı Teklif',
    color: '#1565C0',
    bg: '#E3F2FD',
    border: '#90CAF9',
    message: 'Danışmanın farklı bir zaman önerdi. Aşağıdan sana uygun bir saati seç.',
  },
}

export default function AppointmentStatus() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleLookup = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setError('Lütfen bildirim kodunu girin.'); return }
    setLoading(true)
    setError('')
    setAppointment(null)
    setSelectedSlot('')
    setConfirmed(false)
    try {
      const all = await getAppointments()
      const found = all.find(a => a.studentAnonymousCode === trimmed)
      if (!found) {
        setError('Bu koda ait randevu bulunamadı. Kodu kontrol edip tekrar dene.')
      } else {
        setAppointment(found)
      }
    } catch {
      setError('Sunucuya bağlanılamadı. Lütfen tekrar dene.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSlot = async () => {
    if (!selectedSlot || !appointment) return
    setConfirming(true)
    try {
      const bookingId = uuidv4()
      await updateAppointment(appointment.id, {
        status: 'Onaylandı',
        proposedSlot: selectedSlot,
        counterOfferSlots: [],
        bookingId,
      })
      await bookSlot({
        counselorId: appointment.counselorId,
        day: appointment.day,
        slot: selectedSlot,
        appointmentId: appointment.id,
        bookingId,
      })
      setAppointment(prev => ({ ...prev, status: 'Onaylandı', proposedSlot: selectedSlot, bookingId }))
      setConfirmed(true)
    } catch {
      setError('İşlem gerçekleştirilemedi. Tekrar dene.')
    } finally {
      setConfirming(false)
    }
  }

  const meta = appointment ? (STATUS_META[appointment.status] || {}) : null

  return (
    <MobileShell title="Randevu Durumu" backTo="/bildir">
      <div className="appt-status-page">

        {/* Lookup */}
        <div className="as-lookup-card">
          <div className="as-lookup-icon">🔍</div>
          <h2 className="as-lookup-title">Randevunu Sorgula</h2>
          <p className="as-lookup-sub">
            Bildirim kodunu girerek randevunun durumunu öğrenebilirsin.
          </p>
          <div className="as-input-row">
            <input
              id="anonymous-code-input"
              className="as-code-input"
              type="text"
              placeholder="Örn: KAHRAMAN-7834"
              value={code}
              onChange={e => { setCode(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              autoCapitalize="characters"
            />
            <button
              id="lookup-appointment-btn"
              className="as-lookup-btn"
              onClick={handleLookup}
              disabled={loading}
            >
              {loading
                ? <span className="login-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
              }
            </button>
          </div>
          {error && <p className="as-error">{error}</p>}
        </div>

        {/* Result */}
        {appointment && meta && (
          <div className="as-result animate-slide-up">

            {/* Status badge */}
            <div
              className="as-status-banner"
              style={{ background: meta.bg, border: `1.5px solid ${meta.border}` }}
            >
              <span className="as-status-icon">{confirmed && appointment.status !== 'Onaylandı' ? '✅' : meta.icon}</span>
              <div>
                <p className="as-status-label" style={{ color: meta.color }}>
                  {confirmed ? 'Onaylandı' : meta.label}
                </p>
                <p className="as-status-msg">
                  {confirmed
                    ? 'Saatini seçtin! Randevun onaylandı.'
                    : meta.message}
                </p>
              </div>
            </div>

            {/* Appointment detail */}
            <div className="as-detail-card">
              <div className="as-detail-row">
                <span className="as-detail-icon">📅</span>
                <div>
                  <p className="as-detail-key">Talep Edilen Zaman</p>
                  <p className="as-detail-val">{appointment.day} — {appointment.proposedSlot}</p>
                </div>
              </div>
              <div className="as-detail-row">
                <span className="as-detail-icon">🔐</span>
                <div>
                  <p className="as-detail-key">Anonim Kod</p>
                  <p className="as-detail-val mono">{appointment.studentAnonymousCode}</p>
                </div>
              </div>
            </div>

            {/* Counter offer slots — student picks one */}
            {appointment.status === 'Karşı Teklif' && !confirmed && (
              <div className="as-counter-section animate-fade-in">
                <p className="as-counter-title">⚡ Danışman Alternatif Saatler Önerdi</p>
                <p className="as-counter-sub">Sana uygun olan saati seç:</p>
                <div className="as-counter-slots">
                  {appointment.counterOfferSlots?.map(slot => (
                    <button
                      key={slot}
                      id={`counter-slot-${slot.replace(':', '-')}`}
                      className={`as-slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <span className="as-slot-time">{slot}</span>
                      <span className="as-slot-dur">15 dk</span>
                    </button>
                  ))}
                </div>

                {selectedSlot && (
                  <button
                    id="confirm-counter-slot-btn"
                    className="btn-primary as-confirm-btn animate-fade-in"
                    onClick={handleConfirmSlot}
                    disabled={confirming}
                  >
                    {confirming
                      ? <span className="login-spinner" />
                      : <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {selectedSlot} Saatini Onayla
                        </>
                    }
                  </button>
                )}
              </div>
            )}

            {/* Confirmed state */}
            {(appointment.status === 'Onaylandı' || confirmed) && (
              <div className="as-confirmed-card animate-fade-in">
                <span className="as-confirmed-icon">🎉</span>
                <p className="as-confirmed-text">
                  Randevun <strong>{appointment.proposedSlot}</strong> saatinde onaylandı!
                </p>
                <p className="as-confirmed-sub">Danışmanın seni bekliyor olacak.</p>
              </div>
            )}

            {/* Declined — offer to rebook */}
            {appointment.status === 'Reddedildi' && (
              <button
                id="rebook-btn"
                className="btn-secondary"
                onClick={() => navigate('/bildir/danismanlar')}
              >
                Yeni Randevu Al
              </button>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  )
}
