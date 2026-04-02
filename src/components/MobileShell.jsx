import { useNavigate } from 'react-router-dom'
import './MobileShell.css'

export default function MobileShell({ children, title, step, totalSteps, backTo, hideBack }) {
  const navigate = useNavigate()

  return (
    <div className="mobile-outer">
      <div className="mobile-frame">
        {/* Status bar */}
        <div className="mobile-status-bar">
          <span className="status-time">19:42</span>
          <div className="status-icons">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="white" opacity="0.8">
              <rect x="0" y="4" width="2" height="6" rx="1"/>
              <rect x="3" y="2.5" width="2" height="7.5" rx="1"/>
              <rect x="6" y="1" width="2" height="9" rx="1"/>
              <rect x="9" y="0" width="2" height="10" rx="1"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white" opacity="0.8">
              <path d="M8 1C4.7 1 1.8 2.4 0 4.6L8 14l8-9.4C14.2 2.4 11.3 1 8 1z"/>
            </svg>
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="white" strokeOpacity="0.4"/>
              <rect x="2" y="2" width="14" height="8" rx="1.5" fill="white" opacity="0.9"/>
              <path d="M20 4.5v3c.83-.44 1.38-1.3 1.38-2.25 0-.9-.55-1.76-1.38-2.25v1.5z" fill="white" opacity="0.5"/>
            </svg>
          </div>
        </div>

        {/* Top bar */}
        {(title || !hideBack) && (
          <div className="mobile-topbar">
            {!hideBack && (
              <button
                className="mobile-back-btn"
                onClick={() => backTo ? navigate(backTo) : navigate(-1)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
              </button>
            )}
            {title && <h2 className="mobile-topbar-title">{title}</h2>}
            {step && totalSteps && (
              <span className="mobile-step-badge">{step}/{totalSteps}</span>
            )}
          </div>
        )}

        {/* Progress bar */}
        {step && totalSteps && (
          <div className="mobile-progress-track">
            <div
              className="mobile-progress-fill"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="mobile-content">
          {children}
        </div>
      </div>
    </div>
  )
}
