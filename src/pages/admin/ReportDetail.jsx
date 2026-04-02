import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getReports, updateReport } from '../../services/api'
import '../admin/Dashboard.css'
import './ReportDetail.css'

const STATUS_OPTIONS = ['Yeni', 'Doğrulandı', 'Takip Gerekiyor', 'Kapatıldı']
const STATUS_COLORS = {
  'Yeni': { bg:'#E3F2FD', text:'#1565C0' },
  'Doğrulandı': { bg:'#E8F5E9', text:'#2E7D32' },
  'Takip Gerekiyor': { bg:'#FFF8E1', text:'#F57F17' },
  'Kapatıldı': { bg:'#F3E5F5', text:'#6A1B9A' },
}

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    getReports().then(reports => {
      const r = reports.find(r => r.id === id)
      setReport(r)
      setStatus(r?.status || '')
      setLoading(false)
    })
  }, [id])

  const handleSaveStatus = async () => {
    setSaving(true)
    const updated = await updateReport(id, { status })
    setReport(updated)
    setSaving(false)
  }

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="loading-spinner" /></div>
  if (!report) return <div style={{ padding:40 }}>Rapor bulunamadı.</div>

  const sc = STATUS_COLORS[report.status] || {}
  const typeIcon = { Fiziksel:'👊', Sözlü:'💬', 'Sosyal Dışlama':'🚫', Siber:'💻' }

  return (
    <div className="report-detail-page">
      {/* Back */}
      <button className="rd-back" onClick={() => navigate('/panel')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Panele Dön
      </button>

      <div className="rd-container">
        {/* Header */}
        <div className="rd-card animate-fade-in">
          <div className="rd-header">
            <div>
              <div className="rd-code">{report.anonymousCode}</div>
              <h1 className="rd-title">{typeIcon[report.type]} {report.type} Zorbalık Bildirimi</h1>
              <p className="rd-date">{new Date(report.createdAt).toLocaleString('tr-TR')}</p>
            </div>
            <span className="status-pill" style={{ background:sc.bg, color:sc.text, fontSize:'0.9rem', padding:'8px 18px' }}>
              {report.status}
            </span>
          </div>

          {/* Criteria */}
          <div className="rd-criteria">
            {[
              { label:'Süreklilik', value:report.isContinuous, desc:'Olay daha önce de yaşanmış' },
              { label:'Güç Farkı', value:report.hasPowerImbalance, desc:'Taraflar arasında dengesizlik var' },
              { label:'Kasıt', value:report.isIntentional, desc:'Bilerek yapılmış davranış' },
            ].map(c => (
              <div key={c.label} className={`rd-criterion ${c.value ? 'yes' : 'no'}`}>
                <span className="rd-criterion-icon">{c.value ? '✓' : '✗'}</span>
                <div>
                  <p className="rd-criterion-label">{c.label}</p>
                  <p className="rd-criterion-desc">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rd-two-col">
          {/* Description */}
          <div className="rd-card animate-fade-in delay-100">
            <h2 className="rd-section-title">Olay Açıklaması</h2>
            <div className="rd-anon-tag">
              🔒 Anonim Bildirim — Kimlik Gizli
            </div>
            <p className="rd-description">{report.description}</p>
          </div>

          {/* Status & actions */}
          <div className="rd-card animate-fade-in delay-200">
            <h2 className="rd-section-title">Durum Güncelle</h2>
            <div className="rd-status-btns">
              {STATUS_OPTIONS.map(s => {
                const c = STATUS_COLORS[s]
                return (
                  <button
                    key={s}
                    id={`status-${s.replace(' ', '-')}`}
                    className={`rd-status-btn ${status === s ? 'selected' : ''}`}
                    style={status === s ? { background:c.bg, color:c.text, border:`1.5px solid ${c.text}` } : {}}
                    onClick={() => setStatus(s)}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            <button
              id="save-status-btn"
              className="btn-primary"
              style={{ marginTop:16 }}
              onClick={handleSaveStatus}
              disabled={saving || status === report.status}
            >
              {saving ? <span className="login-spinner" /> : 'Kaydet'}
            </button>

            {/* Identity reveal (demo only) */}
            <div className="rd-identity-reveal">
              <h3 className="rd-section-title" style={{ marginBottom:8 }}>Kimlik</h3>
              {!reveal ? (
                <button className="rd-reveal-btn" onClick={() => setReveal(true)}>
                  🔓 Kimliği Görüntüle (Bu eylem kayıt altına alınır)
                </button>
              ) : (
                <div className="rd-revealed">
                  <p className="rd-revealed-text">Anonim rapor — kimlik verisi saklanmamaktadır.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
