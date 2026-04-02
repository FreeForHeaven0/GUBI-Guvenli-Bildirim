import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileShell from '../../components/MobileShell'
import './FilterQuestions.css'

const QUESTIONS = [
  {
    id: 'isContinuous',
    step: 1,
    icon: '🔄',
    label: 'Süreklilik',
    question: 'Bu olay daha önce de yaşandı mı?',
    detail: 'Zorbalık, tek seferlik bir çatışmadan farklı olarak tekrar eden bir davranış kalıbıdır.',
  },
  {
    id: 'hasPowerImbalance',
    step: 2,
    icon: '⚖️',
    label: 'Güç Farkı',
    question: 'Sence taraflar arasında fiziksel veya sosyal bir güç dengesizliği var mı?',
    detail: 'Örneğin; gruba karşı tek kişi, fiziksel olarak daha güçlü biri veya popüler birine karşı dışlanmış biri.',
  },
  {
    id: 'isIntentional',
    step: 3,
    icon: '🎯',
    label: 'Kasıt',
    question: 'Bu davranışın bilerek ve karşı tarafı üzmek için yapıldığını düşünüyor musun?',
    detail: 'Kazara olan ya da niyetsiz davranışlar zorbalık sayılmaz.',
  },
]

export default function FilterQuestions() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedNow, setSelectedNow] = useState(null)
  const [animating, setAnimating] = useState(false)

  const q = QUESTIONS[currentQ]

  const handleAnswer = (value) => {
    if (animating) return
    setSelectedNow(value)
    setAnswers(prev => ({ ...prev, [q.id]: value }))

    setAnimating(true)
    setTimeout(() => {
      setAnimating(false)
      setSelectedNow(null)
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1)
      } else {
        // All answered — check if it's bullying
        const allAnswers = { ...answers, [q.id]: value }
        const isBullying = Object.values(allAnswers).some(v => v === true)
        if (!isBullying) {
          navigate('/bildir/zorbalık-degil', { state: { answers: allAnswers } })
        } else {
          navigate('/bildir/detaylar', { state: { answers: allAnswers } })
        }
      }
    }, 600)
  }

  const handleBack = () => {
    if (currentQ === 0) navigate('/bildir')
    else setCurrentQ(prev => prev - 1)
  }

  return (
    <MobileShell
      title="Durumu Değerlendir"
      step={currentQ + 1}
      totalSteps={3}
    >
      <div className="filter-page">
        {/* Progress dots */}
        <div className="filter-dots">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`filter-dot ${i === currentQ ? 'active' : ''} ${i < currentQ ? 'done' : ''}`}
            />
          ))}
        </div>

        {/* Question card */}
        <div className={`filter-card animate-fade-in ${animating ? 'filter-card--exit' : ''}`} key={currentQ}>
          <div className="filter-q-icon">{q.icon}</div>
          <div className="filter-q-label">{q.label}</div>
          <h2 className="filter-q-text">{q.question}</h2>
          <p className="filter-q-detail">{q.detail}</p>
        </div>

        {/* Answer buttons */}
        <div className="filter-answers">
          <button
            id={`answer-yes-btn-${currentQ}`}
            className={`filter-answer filter-answer--yes ${selectedNow === true ? 'selected' : ''}`}
            onClick={() => handleAnswer(true)}
            disabled={animating}
          >
            <span className="answer-icon">✓</span>
            <span className="answer-text">Evet</span>
          </button>
          <button
            id={`answer-no-btn-${currentQ}`}
            className={`filter-answer filter-answer--no ${selectedNow === false ? 'selected' : ''}`}
            onClick={() => handleAnswer(false)}
            disabled={animating}
          >
            <span className="answer-icon">✕</span>
            <span className="answer-text">Hayır / Emin Değilim</span>
          </button>
        </div>

        {/* Empathy note */}
        <div className="filter-empathy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          Cevapların anonim tutulur. Doğruyu söylemekten korkmana gerek yok.
        </div>

        <button className="filter-back-link" onClick={handleBack}>
          ← Geri Dön
        </button>
      </div>
    </MobileShell>
  )
}
