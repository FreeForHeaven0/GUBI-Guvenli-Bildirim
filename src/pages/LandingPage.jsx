import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">
          <img src={`${import.meta.env.BASE_URL}gubi-mascot.png`} alt="GÜBİ" style={{ width:40, height:40, objectFit:'contain' }} />
          <span className="logo-text">GÜBİ</span>
          <span className="logo-sub">Güvenli Bildir</span>
        </div>
        <button
          id="teacher-login-btn"
          className="teacher-login-btn"
          onClick={() => navigate('/ogretmen-girisi')}
        >
          <span className="teacher-icon">👩‍🏫</span>
          Öğretmen Girişi
        </button>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-bg-waves">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />
        </div>

        <div className="hero-content animate-fade-in">
          <div className="hero-badge animate-fade-in delay-100">
            <span className="badge-dot" />
            Güvenli Alan
          </div>

          <h1 className="hero-title animate-fade-in delay-200">
            Sessizliği Kır,<br />
            <span className="hero-title-teal">Değişimi Başlat</span>
          </h1>

          <p className="hero-subtitle animate-fade-in delay-300">
            Zorbalığa tanık oldun mu? Anonim ve güvenli şekilde bildir.
            Sesin bir yankı gibi değişim yaratır.
          </p>

          {/* Main CTA */}
          <button
            id="report-btn"
            className="hero-cta animate-fade-in delay-400"
            onClick={() => navigate('/giris')}
          >
            <span className="cta-ripple" />
            <span className="cta-ripple cta-ripple-2" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            BİLDİR
          </button>

          <p className="hero-anon-note animate-fade-in delay-500">
            🔒 Kimliğin tamamen gizli tutulur
          </p>
        </div>

        {/* Phone Mockup */}
        <div className="phone-mockup animate-float animate-fade-in delay-300">
          <div className="phone-frame">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="phone-app-preview">
                <div className="preview-icon">🛡️</div>
                <div className="preview-text">
                  <div className="preview-line preview-line--bold" />
                  <div className="preview-line" />
                  <div className="preview-line preview-line--short" />
                </div>
                <div className="preview-btn" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats animate-fade-in delay-400">
        <div className="stat-card">
          <span className="stat-number">%100</span>
          <span className="stat-label">Anonim</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-card">
          <span className="stat-number">3</span>
          <span className="stat-label">Danışman</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how">
        <h2 className="section-title">Nasıl Çalışır?</h2>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} className="step-card animate-fade-in" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
              <div className="step-num">{i + 1}</div>
              <div className="step-icon">{s.icon}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bullying Types */}
      <section className="landing-types">
        <h2 className="section-title">Zorbalık Türleri</h2>
        <div className="types-grid">
          {types.map((t, i) => (
            <div key={i} className="type-card" style={{ '--type-color': t.color }}>
              <span className="type-icon">{t.icon}</span>
              <span className="type-label">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <img src={`${import.meta.env.BASE_URL}gubi-mascot.png`} alt="GÜBİ" style={{ width:28, height:28, objectFit:'contain' }} />
          <span>GÜBİ — Güvenli Bildir Anti-Zorbalık Platformu</span>
        </div>
        <p className="footer-note">
          Bu platform öğrencilerin güvenliği için tasarlanmıştır. Tüm veriler anonim olarak işlenir.
        </p>
        <p className="footer-copy">© 2024 GÜBİ Projesi — Anadolu Üniversitesi</p>
      </footer>
    </div>
  )
}


const steps = [
  { icon: '🔍', title: 'Gözlemle', desc: 'Zorbalığa tanık oldığında veya fark ettiğinde harekete geç.' },
  { icon: '📱', title: 'Bildir', desc: 'BİLDİR butonuna bas, 3 kısa soruya cevap ver.' },
  { icon: '✅', title: 'Onayla', desc: 'Olayı anonim olarak açıkla ve gönder.' },
  { icon: '🤝', title: 'Destek Al', desc: 'İstersen bir danışmanla görüşme planla.' },
]

const types = [
  { icon: '👊', label: 'Fiziksel', color: '#FF6B6B' },
  { icon: '💬', label: 'Sözlü', color: '#FFB347' },
  { icon: '🚫', label: 'Sosyal Dışlama', color: '#3D5AFE' },
  { icon: '💻', label: 'Siber', color: '#00BFA5' },
]
