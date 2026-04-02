import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudentByTc } from '../services/api'
import './StudentLogin.css'

// Demo entries — show ONLY school/grade, NO real names for privacy
const DEMO_STUDENTS = [
  { tc: '10293847561', label: 'Demo Öğrenci 1', grade: '10-A', school: 'Atatürk Anadolu Lisesi' },
  { tc: '40586970314', label: 'Demo Öğrenci 2', grade: '12-A', school: 'Kadıköy Anadolu Lisesi' },
  { tc: '70819203647', label: 'Demo Öğrenci 3', grade: '9-A',  school: 'Galatasaray Lisesi' },
  { tc: '91031425869', label: 'Demo Öğrenci 4', grade: '11-C', school: 'Beşiktaş Atatürk A.L.' },
  { tc: '23253647081', label: 'Demo Öğrenci 5', grade: '9-B',  school: 'İstanbul Erkek Lisesi' },
]

// Mask TC for display: show first 2 and last 2 digits only
const maskTc = (tc) => tc.slice(0, 2) + '*'.repeat(7) + tc.slice(-2)

export default function StudentLogin() {
  const navigate = useNavigate()
  const [tc, setTc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [found, setFound] = useState(null)

  // Core search function — accepts TC directly so demo buttons can call it immediately
  const searchTc = async (tcValue) => {
    if (tcValue.length !== 11) {
      setError('TC Kimlik numarası 11 haneli olmalıdır.')
      return
    }
    setLoading(true)
    setError('')
    setFound(null)
    try {
      const student = await getStudentByTc(tcValue)
      if (!student) {
        setError('Bu TC Kimlik numarasına ait öğrenci bulunamadı. Lütfen kontrol edin.')
      } else {
        setFound(student)
      }
    } catch {
      setError('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleTcChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 11)
    setTc(val)
    setError('')
    setFound(null)
  }

  // Demo button: fill field AND immediately search
  const fillDemo = (d) => {
    setTc(d.tc)
    setError('')
    setFound(null)
    searchTc(d.tc)   // auto-triggers search immediately
  }

  const handleConfirm = () => {
    // ⚠️ PRIVACY: ONLY store school info — never name, tc, or real id
    const safeSession = {
      school:     found.school,
      city:       found.city,
      grade:      found.grade,
      schoolCode: found.schoolCode,
    }
    sessionStorage.setItem('gubiStudent', JSON.stringify(safeSession))
    navigate('/bildir', { state: { student: safeSession } })
  }

  return (
    <div className="student-login-page">
      <div className="sl-bg">
        <div className="sl-orb sl-orb-1" />
        <div className="sl-orb sl-orb-2" />
        <div className="sl-orb sl-orb-3" />
      </div>

      <button className="sl-back" onClick={() => navigate('/')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Ana Sayfa
      </button>

      <div className="sl-container animate-fade-in">

        {/* ── Left: info + demo accounts ── */}
        <div className="sl-left">
          <div className="sl-brand">
            <img src="/gubi-mascot.png" alt="GÜBİ" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            <div>
              <h1 className="sl-brand-title">GÜBİ</h1>
              <p className="sl-brand-sub">Güvenli Bildir</p>
            </div>
          </div>

          <p className="sl-brand-desc">
            Kimliğini doğrulamak sadece okulunu bulmak için kullanılır.
            Bildirimin tamamen anonimdir — adın hiçbir zaman kaydedilmez.
          </p>

          <div className="sl-privacy-badges">
            <span className="sl-badge">🔒 Anonim Bildirim</span>
            <span className="sl-badge">🏫 Okul Tespiti</span>
            <span className="sl-badge">🛡️ Spam Önleme</span>
          </div>

          <p className="sl-demo-label">🎯 Demo TC Numaraları — Hızlı Giriş:</p>
          <div className="sl-demo-list">
            {DEMO_STUDENTS.map((d, i) => (
              <button key={i} className="sl-demo-btn" onClick={() => fillDemo(d)}>
                <span className="sl-demo-avatar">
                  {String(i + 1).padStart(2,'0')}
                </span>
                <div className="sl-demo-info">
                  <span className="sl-demo-name">{d.school}</span>
                  <span className="sl-demo-detail">Sınıf: {d.grade}</span>
                </div>
                {/* Masked TC — only partial digits shown */}
                <span className="sl-demo-tc">{maskTc(d.tc)}</span>
                <span className="sl-demo-arrow">→</span>
              </button>
            ))}
          </div>

          <p className="sl-privacy-note">
            🔐 Demo numaraları sadece test içindir. Gerçek TC kimlik bilgileri sisteme kaydedilmez.
          </p>
        </div>

        {/* ── Right: TC input card ── */}
        <div className="sl-right">
          <div className="sl-card">

            {/* Step 1: TC entry */}
            {!found && (
              <>
                <div className="sl-card-header">
                  <span className="sl-step-badge">Adım 1 / 2</span>
                  <h2>TC Kimlik Doğrulama</h2>
                  <p>11 haneli TC Kimlik numaranı gir. Okul bilgin otomatik bulunacak.</p>
                </div>

                <div className="sl-tc-input-group">
                  <label htmlFor="tc-input">T.C. Kimlik Numarası</label>
                  <div className="sl-tc-wrapper">
                    <span className="sl-tc-flag">🇹🇷</span>
                    <input
                      id="tc-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="_ _ _ _ _ _ _ _ _ _ _"
                      value={tc}
                      onChange={handleTcChange}
                      onKeyDown={e => e.key === 'Enter' && searchTc(tc)}
                      className={`sl-tc-field ${tc.length === 11 ? 'ready' : ''}`}
                      maxLength={11}
                    />
                    <span className={`sl-tc-count ${tc.length === 11 ? 'done' : ''}`}>
                      {tc.length}/11
                    </span>
                  </div>

                  <div className="sl-tc-dots">
                    {Array.from({ length: 11 }, (_, i) => (
                      <div key={i} className={`sl-dot ${i < tc.length ? 'filled' : ''}`} />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="sl-error animate-fade-in">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  id="tc-search-btn"
                  className="sl-submit"
                  onClick={() => searchTc(tc)}
                  disabled={tc.length !== 11 || loading}
                >
                  {loading ? <span className="login-spinner" /> : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                      </svg>
                      Okulumu Bul
                    </>
                  )}
                </button>

                <p className="sl-note">
                  🔐 TC numaranız yalnızca okul bilginizi bulmak için kullanılır ve sistemde saklanmaz.
                </p>
              </>
            )}

            {/* Step 2: School confirmation */}
            {found && (
              <div className="animate-slide-up">
                <div className="sl-card-header">
                  <span className="sl-step-badge sl-step-badge--success">✓ Kimlik Doğrulandı</span>
                  <h2>Okul Bulundu!</h2>
                  <p>Aşağıdaki bilgiler doğru mu? Onaylarsan bildiri akışına geçebilirsin.</p>
                </div>

                <div className="sl-found-card">
                  <div className="sl-found-school-icon">🏫</div>
                  <div className="sl-found-info">
                    <p className="sl-found-school">{found.school}</p>
                    <p className="sl-found-city">{found.city}</p>
                    <p className="sl-found-grade">Sınıf: {found.grade}</p>
                  </div>
                  <div className="sl-found-check">✓</div>
                </div>

                <div className="sl-anon-notice">
                  <span>🛡️</span>
                  <span>Bildirimin <strong>tamamen anonim</strong> olacak. Adın ve TC numaranın hiçbir yerde görünmeyecek.</span>
                </div>

                <button id="confirm-school-btn" className="sl-submit sl-submit--confirm" onClick={handleConfirm}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Evet, Bildirmeye Devam Et
                </button>
                <button className="sl-back-step" onClick={() => { setFound(null); setTc(''); setError('') }}>
                  ← Farklı TC Gir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
