'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const SLIDES = [
  {
    bg: 'linear-gradient(160deg,#1D9E75 0%,#0a3d2b 100%)',
    icon: '🏥',
    title: 'Votre santé,\nalways connected',
    desc: 'Accédez à vos services médicaux où que vous soyez, à tout moment.',
    cta: null,
  },
  {
    bg: 'linear-gradient(160deg,#378ADD 0%,#1a4480 100%)',
    icon: '📅',
    title: 'Rendez-vous\nen 30 secondes',
    desc: 'Prenez rendez-vous avec votre médecin en quelques tapotements.',
    cta: null,
  },
  {
    bg: 'linear-gradient(160deg,#7C3AED 0%,#4c1d95 100%)',
    icon: '🎫',
    title: 'Suivez votre tour\nen temps réel',
    desc: 'Consultez votre position dans la file d\'attente depuis chez vous.',
    cta: null,
  },
  {
    bg: 'linear-gradient(160deg,#0f172a 0%,#1D9E75 100%)',
    icon: '📱',
    title: 'Prêt à commencer ?',
    desc: 'Rejoignez des milliers de patients qui gèrent leur santé simplement.',
    cta: 'Commencer →',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const done = () => {
    localStorage.setItem('sc_onboarding_done', '1')
    router.replace('/login')
  }

  const goTo = (n: number) => {
    if (n >= SLIDES.length) { done(); return }
    if (n < 0) return
    setCurrent(n)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? current + 1 : current - 1)
    }
    touchStartX.current = null
  }

  const slide = SLIDES[current]

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        minHeight: '100dvh',
        background: slide.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 24px 48px',
        fontFamily: 'Nunito, system-ui, sans-serif',
        transition: 'background .5s ease',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Passer */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={done}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 20, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          Passer
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24 }}>
        <div style={{ fontSize: 80, animation: 'floatIcon 3s ease-in-out infinite', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' }}>
          {slide.icon}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.25, whiteSpace: 'pre-line', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {slide.title}
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: 300, lineHeight: 1.6 }}>
          {slide.desc}
        </p>
        {slide.cta && (
          <button onClick={done}
            style={{ background: '#fff', color: '#0f172a', border: 'none', padding: '16px 40px', borderRadius: 16, fontSize: 16, fontWeight: 900, cursor: 'pointer', marginTop: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', transition: '.2s' }}>
            {slide.cta}
          </button>
        )}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? '#fff' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
        ))}
      </div>

      {/* Next arrow (not on last slide) */}
      {current < SLIDES.length - 1 && (
        <button onClick={() => goTo(current + 1)}
          style={{ position: 'absolute', bottom: 48, right: 24, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: 20, width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          →
        </button>
      )}

      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  )
}
