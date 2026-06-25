'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds, expired: false }
}

const DEFAULT_TARGET = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 16)
})()

export default function VitrineCountdownPage() {
  const router = useRouter()
  const [title, setTitle] = useState('Inauguration de notre nouveau service')
  const [description, setDescription] = useState('Rejoignez-nous pour célébrer l\'ouverture de notre nouveau service de consultations spécialisées.')
  const [targetDate, setTargetDate] = useState(DEFAULT_TARGET)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(DEFAULT_TARGET))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const blocks = [
    { value: timeLeft.days, label: 'JOURS' },
    { value: timeLeft.hours, label: 'HEURES' },
    { value: timeLeft.minutes, label: 'MINUTES' },
    { value: timeLeft.seconds, label: 'SECONDES' },
  ]

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-primary)', padding: '0 4px' }}
        >←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Événement à venir</span>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Hero card */}
        <div
          className="card-enter"
          style={{
            borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, var(--acc), #7c3aed)',
            padding: '24px 20px',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 6 }}>{title || 'Événement à venir'}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{description}</div>

          {timeLeft.expired ? (
            <div style={{ marginTop: 20, fontSize: 22, fontWeight: 800, color: '#fff' }}>
              L'événement a commencé !
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {blocks.map(b => (
                <div key={b.label} style={{
                  background: 'rgba(255,255,255,0.2)', borderRadius: 12,
                  padding: '10px 8px', minWidth: 56, textAlign: 'center',
                }}>
                  <div style={{ fontWeight: 800, fontSize: 24, color: '#fff', lineHeight: 1 }}>
                    {String(b.value).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 4, letterSpacing: 0.5 }}>
                    {b.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Config fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="stagger">
          <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Titre de l'événement</div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Inauguration, Journée portes ouvertes..."
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 8,
                border: '1px solid var(--card-border)', background: 'var(--bg)',
                color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              }}
            />
          </div>

          <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Description</div>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 8,
                border: '1px solid var(--card-border)', background: 'var(--bg)',
                color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                resize: 'vertical', lineHeight: 1.5,
              }}
            />
          </div>

          <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Date et heure cible</div>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 8,
                border: '1px solid var(--card-border)', background: 'var(--bg)',
                color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
