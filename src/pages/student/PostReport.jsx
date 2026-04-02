import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MobileShell from '../../components/MobileShell'
import './PostReport.css'

// Confetti particle generator
const CONFETTI_COLORS = ['#8e44ad','#6c5ce7','#0984e3','#74b9ff','#fd79a8','#fdcb6e','#00b894','#e17055']
const NUM_PARTICLES = 48

function createParticles() {
  return Array.from({ length: NUM_PARTICLES }, (_, i) => ({
    id: i,
    x: Math.random() * 100,        // % from left
    delay: Math.random() * 1.6,    // s delay
    duration: 1.8 + Math.random() * 1.6,  // s fall time
    size: 6 + Math.random() * 8,   // px
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotate: Math.random() * 360,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
    sway: (Math.random() - 0.5) * 60,  // horizontal drift px
  }))
}

export default function PostReport() {
  const navigate = useNavigate()
  const location = useLocation()
  const report = location.state?.report
  const [shown, setShown] = useState(false)
  const [particles] = useState(createParticles)
  const [phase, setPhase] = useState(0)  // 0=celebrate, 1=question

  useEffect(() => {
    const t1 = setTimeout(() => setShown(true), 200)
    const t2 = setTimeout(() => setPhase(1), 2200)   // reveal question after celebration
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleYes = () => navigate('/bildir/danismanlar', { state: { report } })
  const handleNo  = () => navigate('/bildir/son')

  return (
    <MobileShell hideBack>
      <div className="post-report-page">

        {/* ── Confetti Canvas ── */}
        <div className="confetti-stage" aria-hidden="true">
          {particles.map(p => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.x}%`,
                width: p.shape === 'rect' ? p.size * 0.6 : p.size,
                height: p.size,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                '--sway': `${p.sway}px`,
                '--rot': `${p.rotate}deg`,
              }}
            />
          ))}
        </div>

        {/* ── GÜBİ Celebrating Bear ── */}
        <div className={`gubi-celebrate-wrapper ${shown ? 'shown' : ''}`}>
          <img
            src={`${import.meta.env.BASE_URL}gubi-celebrate.png`}
            alt="GÜBİ kutluyor!"
            className="gubi-celebrate-img"
          />
        </div>

        {/* ── Title ── */}
        <div className={`post-content ${shown ? 'animate-fade-in' : ''}`}>
          <h1 className="post-title">Teşekkürler!</h1>
          <p className="post-subtitle">Sessizliği kırdın. Bu adımı atmak cesaret istiyor.</p>

          {report && (
            <div className="post-code-card">
              <p className="post-code-label">Bildirim Kodun</p>
              <p className="post-code">{report.anonymousCode}</p>
              <p className="post-code-hint">Bu kodu saklayabilirsin — kimliğinle bağlantısı yoktur.</p>
              <CopyCodeButton code={report.anonymousCode} />
            </div>
          )}

          {/* Question section — fades in after bear animation */}
          <div className={`post-question-section ${phase >= 1 ? 'visible' : ''}`}>
            <div className="post-divider">
              <div className="post-divider-line" />
              <span>Sana bir sorum var</span>
              <div className="post-divider-line" />
            </div>

            <div className="post-question-card">
              <span className="post-q-icon">🤝</span>
              <h2 className="post-q-text">
                Bu durumla alakalı öğretmeninle görüşmek ister misin?
              </h2>
              <p className="post-q-sub">Anonim olarak bir danışmanla 15 dakikalık görüşme planlayabilirsin.</p>
            </div>

            <div className="post-actions">
              <button
                id="want-appointment-btn"
                className="btn-primary"
                onClick={handleYes}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}>
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
                Evet, Danışmanla Görüşmek İstiyorum
              </button>
              <button
                id="no-appointment-btn"
                className="btn-secondary"
                onClick={handleNo}
              >
                Hayır, Teşekkürler
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  )
}

function CopyCodeButton({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  return (
    <button
      id="copy-code-btn"
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        padding: '7px 18px',
        background: copied
          ? 'linear-gradient(135deg, #00b894, #00cec9)'
          : 'linear-gradient(135deg, #8e44ad, #6c5ce7)',
        border: 'none',
        borderRadius: 'var(--radius-full)',
        color: 'white',
        fontSize: '0.80rem',
        fontWeight: 700,
        fontFamily: "'Outfit', sans-serif",
        cursor: 'pointer',
        transition: 'all 300ms ease',
        boxShadow: copied
          ? '0 4px 14px rgba(0,184,148,0.35)'
          : '0 4px 14px rgba(108,92,231,0.30)',
        transform: copied ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Kopyalandı!
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Kodu Kopyala
        </>
      )}
    </button>
  )
}
