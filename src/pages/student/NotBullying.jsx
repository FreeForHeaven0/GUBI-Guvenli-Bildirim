import { useNavigate } from 'react-router-dom'
import MobileShell from '../../components/MobileShell'
import '../../components/MobileShell.css'

export default function NotBullying() {
  const navigate = useNavigate()
  return (
    <MobileShell hideBack>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', gap:24, background:'var(--surface)', textAlign:'center' }}>
        <div style={{ fontSize:'4rem' }}>💛</div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--text-primary)' }}>Bu Zorbalık Değil</h1>
        <p style={{ color:'var(--text-secondary)', lineHeight:1.7, fontSize:'0.95rem' }}>
          Yanıtlarına göre bu durum zorbalık ölçütlerini karşılamıyor olabilir. Ancak her zaman destek alabilirsin.
        </p>
        <div style={{ background:'rgba(0,191,165,0.08)', border:'1px solid rgba(0,191,165,0.2)', borderRadius:'var(--radius-lg)', padding:'20px', width:'100%' }}>
          <p style={{ font:'700 0.85rem Inter', color:'var(--teal-600)', marginBottom:8 }}>Yine de endişeleniyor musun?</p>
          <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', lineHeight:1.6 }}>
            Hâlâ rahatsız edici bir durum yaşıyorsan bir rehber öğretmenle konuşmaktan çekinme.
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/')}>Ana Sayfaya Dön</button>
        <button className="btn-secondary" onClick={() => navigate('/bildir/sorular')}>Tekrar Değerlendir</button>
      </div>
    </MobileShell>
  )
}
