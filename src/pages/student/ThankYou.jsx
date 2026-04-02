import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import MobileShell from '../../components/MobileShell'

export default function ThankYou() {
  const navigate = useNavigate()
  const location = useLocation()
  const { appointment, counselor } = location.state || {}
  const [shown, setShown] = useState(false)

  useEffect(() => { setTimeout(() => setShown(true), 200) }, [])

  return (
    <MobileShell hideBack>
      <div style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'32px 24px', gap:20,
        background:'linear-gradient(180deg, #f0f4ff 0%, #e8eeff 50%, #ffffff 100%)',
        textAlign:'center'
      }}>
        {/* Mascot */}
        <img
          src={`${import.meta.env.BASE_URL}gubi-mascot.png`}
          alt="GÜBİ maskot"
          style={{
            width: 130, height: 130, objectFit:'contain',
            filter: shown ? 'drop-shadow(0 8px 24px rgba(142,68,173,0.30))' : 'none',
            transform: shown ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), filter 0.5s ease',
          }}
        />

        <h1 style={{ fontSize:'2rem', fontWeight:900, lineHeight:1.2,
          background:'linear-gradient(135deg,#8e44ad,#6c5ce7,#0984e3)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
        }}>
          Sessizliği Kırdın!
        </h1>
        <p style={{ fontSize:'1rem', color:'#4a3580', lineHeight:1.7, maxWidth:300 }}>
          Adım atmak cesaret ister. Sen bu cesareti gösterdin — ve bu önemli.
        </p>

        {appointment && counselor && (
          <div style={{
            background:'#ffffff', border:'1.5px solid rgba(108,92,231,0.18)',
            borderRadius:'var(--radius-xl)', padding:'20px 24px', width:'100%',
            boxShadow:'0 4px 20px rgba(108,92,231,0.12)'
          }}>
            <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#8e44ad', textTransform:'uppercase',
              letterSpacing:'0.08em', marginBottom:8 }}>
              Randevu Oluşturuldu
            </p>
            <p style={{ fontSize:'1rem', fontWeight:700, color:'#2d1b4e', marginBottom:4 }}>
              {counselor.name}
            </p>
            <p style={{ fontSize:'0.85rem', color:'#6c5ce7' }}>
              {appointment.day} — {appointment.proposedSlot} (Onay Bekleniyor)
            </p>
          </div>
        )}

        <div style={{
          background:'rgba(108,92,231,0.06)', border:'1.5px solid rgba(108,92,231,0.12)',
          borderRadius:'var(--radius-lg)', padding:'16px 18px', width:'100%'
        }}>
          <p style={{ fontSize:'0.85rem', color:'#4a3580', lineHeight:1.6 }}>
            💜 Her tanık, bir değişim başlatabilir. Teşekkür ederiz.
          </p>
        </div>

        <button
          style={{
            background:'linear-gradient(135deg,#8e44ad,#6c5ce7,#0984e3)',
            border:'none', borderRadius:'var(--radius-md)', color:'white',
            padding:'14px 32px', fontSize:'0.95rem', fontWeight:700,
            cursor:'pointer', transition:'all 250ms ease', width:'100%',
            boxShadow:'0 6px 20px rgba(142,68,173,0.30)'
          }}
          onClick={() => navigate('/')}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </MobileShell>
  )
}
