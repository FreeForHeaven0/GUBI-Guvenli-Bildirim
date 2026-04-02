import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getReports, getAppointments, getNotifications, markNotificationRead } from '../../services/api'
import './Dashboard.css'

const STATUS_COLORS = {
  'Yeni': { bg:'#E3F2FD', text:'#1565C0' },
  'Doğrulandı': { bg:'#E8F5E9', text:'#2E7D32' },
  'Takip Gerekiyor': { bg:'#FFF8E1', text:'#F57F17' },
  'Kapatıldı': { bg:'#F3E5F5', text:'#6A1B9A' },
}

const TYPE_ICONS = { Fiziksel: '👊', Sözlü: '💬', 'Sosyal Dışlama': '🚫', Siber: '💻' }

export default function AdminDashboard() {
  const { teacher, logout } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNotifs, setShowNotifs] = useState(false)
  const [activeTab, setActiveTab] = useState('reports')

  const load = useCallback(async () => {
    const [r, allAppts, n] = await Promise.all([
      getReports(),
      getAppointments(),
      getNotifications(teacher.counselorId),
    ])
    setReports(r)
    setAppointments(allAppts.filter(a => a.counselorId === teacher.counselorId))
    setNotifications(n)
    setLoading(false)
  }, [teacher])

  useEffect(() => { load() }, [load])

  // Poll every 10s
  useEffect(() => {
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [load])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkRead = async (id) => {
    await markNotificationRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const stats = {
    total: reports.length,
    new: reports.filter(r => r.status === 'Yeni').length,
    verified: reports.filter(r => r.status === 'Doğrulandı').length,
    pending: appointments.filter(a => a.status === 'Bekliyor').length,
  }

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src="/gubi-mascot.png" alt="GÜBİ" style={{ width:40, height:40, objectFit:'contain' }} />
          <div>
            <h2 className="sidebar-brand-name">GÜBİ</h2>
            <p className="sidebar-brand-sub">Yönetim Paneli</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            Bildirimler
            {stats.new > 0 && <span className="nav-badge">{stats.new}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => { setActiveTab('appointments'); navigate('/panel/randevular') }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Randevular
            {stats.pending > 0 && <span className="nav-badge">{stats.pending}</span>}
          </button>
          <button className="nav-item" onClick={() => navigate('/panel/musaitlik')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            Müsaitlik
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background: teacher.counselor?.color || '#00BFA5' }}>
              {teacher.counselor?.initials || '?'}
            </div>
            <div>
              <p className="sidebar-user-name">{teacher.counselor?.name}</p>
              <p className="sidebar-user-role">{teacher.counselor?.title}</p>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Çıkış Yap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <div>
            <h1 className="admin-topbar-title">Kontrol Paneli</h1>
            <p className="admin-topbar-sub">Atatürk Anadolu Lisesi — {new Date().toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long' })}</p>
          </div>
          <div className="admin-topbar-actions">
            <div className="notif-wrapper">
              <button id="notif-bell-btn" className="notif-btn" onClick={() => setShowNotifs(p => !p)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="notif-dropdown animate-fade-in">
                  <div className="notif-dropdown-header">
                    <span>Bildirimler</span>
                    <span className="notif-unread-label">{unreadCount} okunmamış</span>
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ padding:'20px', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>Bildirim yok</p>
                  ) : notifications.map(n => (
                    <div key={n.id} className={`notif-item ${n.read ? 'read' : ''}`} onClick={() => handleMarkRead(n.id)}>
                      <span className="notif-dot" />
                      <div>
                        <p className="notif-msg">{n.message}</p>
                        <p className="notif-time">{new Date(n.createdAt).toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { label:'Toplam Bildirim', value: stats.total, icon:'📋', color:'var(--navy-600)' },
            { label:'Yeni Bildirim', value: stats.new, icon:'🆕', color:'var(--accent-blue)' },
            { label:'Doğrulandı', value: stats.verified, icon:'✅', color:'var(--teal-500)' },
            { label:'Bekleyen Randevu', value: stats.pending, icon:'📅', color:'var(--accent-amber)' },
          ].map((s, i) => (
            <div key={i} className="stat-widget animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="stat-widget-icon" style={{ '--si-color': s.color }}>{s.icon}</div>
              <div className="stat-widget-value">{s.value}</div>
              <div className="stat-widget-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reports table */}
        <div className="admin-card animate-fade-in delay-200">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Zorbalık Bildirimleri</h2>
            <span className="admin-card-count">{reports.length} kayıt</span>
          </div>
          {loading ? (
            <div className="admin-loading"><div className="loading-spinner" /></div>
          ) : (
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Kod</th><th>Tür</th><th>Tarih</th><th>Durum</th><th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => {
                    const sc = STATUS_COLORS[r.status] || {}
                    return (
                      <tr key={r.id} className="report-row">
                        <td><span className="report-code">{r.anonymousCode}</span></td>
                        <td>
                          <span className="report-type">
                            {TYPE_ICONS[r.type]} {r.type}
                          </span>
                        </td>
                        <td className="report-date">
                          {new Date(r.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td>
                          <span className="status-pill" style={{ background: sc.bg, color: sc.text }}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <button
                            id={`view-report-${r.id}`}
                            className="table-action-btn"
                            onClick={() => navigate(`/panel/rapor/${r.id}`)}
                          >
                            Görüntüle →
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

