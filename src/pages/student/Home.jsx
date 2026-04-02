import { useNavigate } from 'react-router-dom'
import MobileShell from '../../components/MobileShell'
import '../../components/MobileShell.css'
import './Home.css'

export default function StudentHome() {
  const navigate = useNavigate()

  return (
    <MobileShell hideBack>
      <div className="home-screen">
        {/* Logo area */}
        <div className="home-logo-area">
          <img
            src={`${import.meta.env.BASE_URL}gubi-mascot.png`}
            alt="GÜBİ"
            style={{
              width: 90, height: 90, objectFit: 'contain',
              filter: 'drop-shadow(0 8px 20px rgba(142,68,173,0.30))'
            }}
          />
          <h1 className="home-title animate-fade-in">
            GÜBİ
          </h1>
          <p className="home-subtitle animate-fade-in delay-100">Güvenli Bildir Anti-Zorbalık Platformu</p>
          <div className="home-school-badge animate-fade-in delay-200">
            🏫 Atatürk Anadolu Lisesi
          </div>
        </div>

        {/* Card */}
        <div className="home-card animate-slide-up delay-200">
          <div className="home-card-icon">🛡️</div>
          <h2 className="home-card-title">Zorbalığı Bildir</h2>
          <p className="home-card-text">
            Zorbalığa tanık oldun mu? Kimliğin tamamen gizli tutularak, güvenli şekilde bildirebilirsin.
          </p>
          <div className="home-anon-badges">
            <span className="anon-badge">🔒 Anonim</span>
            <span className="anon-badge">⚡ Hızlı</span>
            <span className="anon-badge">💙 Güvenli</span>
          </div>
        </div>


        {/* CTA */}
        <div className="home-cta-area animate-slide-up delay-400">
          <button
            id="start-report-btn"
            className="home-bildir-btn"
            onClick={() => navigate('/bildir/sorular')}
          >
            <span className="home-bildir-ripple" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            BİLDİR
          </button>
          <p className="home-anon-note">Kimliğin asla paylaşılmaz</p>

          <button
            id="check-status-btn"
            className="home-status-btn"
            onClick={() => navigate('/bildir/durum')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Randevumu Sorgula
          </button>
        </div>
      </div>
    </MobileShell>
  )
}
