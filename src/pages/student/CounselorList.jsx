import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MobileShell from '../../components/MobileShell'
import { getCounselors } from '../../services/api'
import './CounselorList.css'

const DAY_MAP = { 0:'Pazar', 1:'Pazartesi', 2:'Salı', 3:'Çarşamba', 4:'Perşembe', 5:'Cuma', 6:'Cumartesi' }

export default function CounselorList() {
  const navigate = useNavigate()
  const location = useLocation()
  const report = location.state?.report
  const [counselors, setCounselors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getCounselors().then(data => { setCounselors(data); setLoading(false) })
  }, [])

  const todayName = DAY_MAP[new Date().getDay()]

  const getAvailableToday = (c) => (c.availability[todayName] || []).length

  const handleSelect = (counselor) => {
    setSelected(counselor.id)
    setTimeout(() => {
      navigate('/bildir/randevu', { state: { report, counselor } })
    }, 300)
  }

  return (
    <MobileShell title="Danışman Seç" step={5} totalSteps={5} backTo="/bildir/tesekurler">
      <div className="counselor-page">
        <p className="counselor-intro">
          Bir danışman seçerek anonim görüşme randevusu oluşturabilirsin.
        </p>

        {loading ? (
          <div className="counselor-loading">
            <div className="loading-spinner" />
            <p>Danışmanlar yükleniyor...</p>
          </div>
        ) : (
          <div className="counselor-list">
            {counselors.map((c, i) => {
              const slotsToday = getAvailableToday(c)
              return (
                <button
                  key={c.id}
                  id={`counselor-${c.id}`}
                  className={`counselor-card animate-fade-in ${selected === c.id ? 'selected' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s`, '--c-color': c.color }}
                  onClick={() => handleSelect(c)}
                >
                  <div className="c-avatar" style={{ background: c.color }}>
                    {c.initials}
                  </div>
                  <div className="c-info">
                    <h3 className="c-name">{c.name}</h3>
                    <p className="c-title">{c.title}</p>
                    <div className="c-slots">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                      {slotsToday > 0
                        ? `Bugün ${slotsToday} uygun zaman`
                        : 'Bu gün için slot yok'}
                    </div>
                  </div>
                  <div className="c-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="counselor-anon-note">
          <span>🔒</span>
          <span>Danışman yalnızca olay bilgilerini görür — kimliğin paylaşılmaz</span>
        </div>
      </div>
    </MobileShell>
  )
}
