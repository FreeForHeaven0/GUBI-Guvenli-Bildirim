import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './TeacherLogin.css'

// Demo credentials displayed for the demo
const DEMO_ACCOUNTS = [
  { username: 'ayse.kaya',     password: 'Echo@2847', name: 'Ayşe Kaya' },
  { username: 'mehmet.demir',  password: 'Echo@5193', name: 'Mehmet Demir' },
  { username: 'zeynep.arslan', password: 'Echo@7364', name: 'Zeynep Arslan' },
]

export default function TeacherLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Lütfen kullanıcı adı ve şifrenizi girin.')
      return
    }
    setLoading(true)
    try {
      await login(username.trim(), password.trim())
      navigate('/panel')
    } catch (err) {
      setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc) => {
    setUsername(acc.username)
    setPassword(acc.password)
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
      </div>

      <button className="login-back" onClick={() => navigate('/')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Ana Sayfa
      </button>

      <div className="login-container animate-fade-in">
        {/* Left panel */}
        <div className="login-left">
          <div className="login-brand">
            <img src="/gubi-mascot.png" alt="GÜBİ" style={{ width:64, height:64, objectFit:'contain' }} />
            <h1 className="login-brand-title">GÜBİ</h1>
            <p className="login-brand-sub">Öğretmen & Danışman Paneli</p>
          </div>
          <p className="login-brand-desc">
            Okul güvenlik ekibine hoş geldiniz. Bu panel üzerinden zorbalık bildirimlerini
            yönetebilir, öğrencilerle randevu planlayabilirsiniz.
          </p>

          {/* Demo accounts */}
          <div className="demo-section">
            <p className="demo-label">🎯 Demo Hesaplar — Hızlı Giriş:</p>
            <div className="demo-accounts">
              {DEMO_ACCOUNTS.map((acc, i) => (
                <button key={i} className="demo-account-btn" onClick={() => fillDemo(acc)}>
                  <span className="demo-avatar">{acc.name.split(' ').map(n => n[0]).join('')}</span>
                  <div>
                    <div className="demo-name">{acc.name}</div>
                    <div className="demo-user">@{acc.username}</div>
                  </div>
                  <span className="demo-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div className="login-right">
          <div className="login-form-card">
            <div className="login-form-header">
              <h2>Öğretmen Girişi</h2>
              <p>Atatürk Anadolu Lisesi GÜBİ Sistemi</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" id="login-form">
              <div className="form-group">
                <label htmlFor="username">Kullanıcı Adı</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                  </svg>
                  <input
                    id="username"
                    type="text"
                    placeholder="kullanici.adi"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Şifre</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" className="show-pass-btn" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error animate-shake">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" id="login-submit-btn" className="login-submit" disabled={loading}>
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                    </svg>
                    Giriş Yap
                  </>
                )}
              </button>
            </form>

            <p className="login-footer-note">
              🔐 Bu sayfa yalnızca yetkili okul personeli içindir
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

