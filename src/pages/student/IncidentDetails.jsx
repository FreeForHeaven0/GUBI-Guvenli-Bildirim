import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import MobileShell from '../../components/MobileShell'
import { createReport, createNotification } from '../../services/api'
import './IncidentDetails.css'

const TYPES = [
  { value: 'Fiziksel',      icon: '👊', color: '#FF6B6B' },
  { value: 'Sözlü',         icon: '💬', color: '#FFB347' },
  { value: 'Sosyal Dışlama',icon: '🚫', color: '#3D5AFE' },
  { value: 'Siber',         icon: '💻', color: '#00BFA5' },
]

export default function IncidentDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const answers = location.state?.answers || {}

  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const descRef = useRef()

  const validate = () => {
    const e = {}
    if (!type)              e.type = 'Lütfen zorbalık türünü seçin.'
    if (!description.trim()) e.description = 'Lütfen olayı kısaca açıklayın.'
    if (description.length < 20 && description.trim().length > 0)
      e.description = 'Daha fazla detay ekleyin (en az 20 karakter).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      if (errors.description) descRef.current?.classList.add('animate-shake')
      return
    }
    setSubmitting(true)
    try {
      const code = `ECH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
      const report = await createReport({
        id: uuidv4(),
        anonymousCode: code,
        createdAt: new Date().toISOString(),
        isContinuous: answers.isContinuous ?? false,
        hasPowerImbalance: answers.hasPowerImbalance ?? false,
        isIntentional: answers.isIntentional ?? false,
        type,
        description: description.trim(),
        status: 'Yeni',
        counselorId: null,
      })
      // Notify all counselors
      await Promise.all(['c1', 'c2', 'c3'].map(cId =>
        createNotification({
          id: uuidv4(),
          counselorId: cId,
          type: 'new_report',
          message: `Yeni bir zorbalık bildirimi alındı: ${code}`,
          read: false,
          createdAt: new Date().toISOString(),
        })
      ))
      navigate('/bildir/tesekurler', { state: { report } })
    } catch {
      setErrors({ submit: 'Bağlantı hatası. Sunucunun çalıştığından emin olun.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileShell title="Olay Detayları" step={4} totalSteps={5} backTo="/bildir/sorular">
      <div className="incident-page">
        {/* Anon badge */}
        <div className="incident-anon-badge">
          <span>🔒</span>
          <span>Bu form anonim olarak gönderilir — kimliğin gizli kalır</span>
        </div>

        {/* Type selector */}
        <div className="incident-section">
          <label className="incident-label">Zorbalık Türü *</label>
          <div className="type-grid">
            {TYPES.map(t => (
              <button
                key={t.value}
                id={`type-${t.value.replace(' ', '-')}`}
                className={`type-chip ${type === t.value ? 'selected' : ''}`}
                style={{ '--chip-color': t.color }}
                onClick={() => { setType(t.value); setErrors(e => ({ ...e, type: '' })) }}
              >
                <span className="chip-icon">{t.icon}</span>
                <span className="chip-label">{t.value}</span>
              </button>
            ))}
          </div>
          {errors.type && <p className="incident-error">{errors.type}</p>}
        </div>

        {/* Description */}
        <div className="incident-section" ref={descRef}>
          <label className="incident-label" htmlFor="description">
            Olayı Anlat *
          </label>
          <div className="textarea-wrapper">
            <textarea
              id="description"
              className={`incident-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Ne gördüğünü veya yaşandığını kısaca anlat. Kim, ne zaman, nerede?"
              value={description}
              onChange={e => {
                setDescription(e.target.value)
                setErrors(er => ({ ...er, description: '' }))
              }}
              rows={5}
              maxLength={500}
            />
            <span className="char-count">{description.length}/500</span>
          </div>
          {errors.description && <p className="incident-error">{errors.description}</p>}
        </div>

        {/* Criteria summary */}
        <div className="incident-summary">
          <p className="incident-summary-title">Değerlendirme Özeti</p>
          <div className="summary-badges">
            <span className={`summary-badge ${answers.isContinuous ? 'badge--yes' : 'badge--no'}`}>
              {answers.isContinuous ? '✓' : '✗'} Süreklilik
            </span>
            <span className={`summary-badge ${answers.hasPowerImbalance ? 'badge--yes' : 'badge--no'}`}>
              {answers.hasPowerImbalance ? '✓' : '✗'} Güç Farkı
            </span>
            <span className={`summary-badge ${answers.isIntentional ? 'badge--yes' : 'badge--no'}`}>
              {answers.isIntentional ? '✓' : '✗'} Kasıt
            </span>
          </div>
        </div>

        {errors.submit && <p className="incident-error incident-error--submit">{errors.submit}</p>}

        <button
          id="submit-report-btn"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ marginTop: 'auto' }}
        >
          {submitting ? <span className="login-spinner" /> : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:18,height:18}}>
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
              Bildirimi Gönder
            </>
          )}
        </button>
      </div>
    </MobileShell>
  )
}
