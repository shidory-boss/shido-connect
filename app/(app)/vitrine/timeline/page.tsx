'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TimelineStep {
  id: number
  year: string
  title: string
  description: string
  icon: string
}

const DEFAULT_STEPS: TimelineStep[] = [
  {
    id: 1,
    year: '2015',
    title: 'Fondation',
    description: 'Création de notre établissement avec une vision claire : offrir des soins de qualité accessibles à tous. Les premiers médecins fondateurs posent les bases d\'une pratique médicale moderne et humaine.',
    icon: '🏥',
  },
  {
    id: 2,
    year: '2017',
    title: 'Première expansion',
    description: 'Ouverture de nouveaux services spécialisés et agrandissement des locaux. L\'équipe passe de 5 à 20 professionnels de santé pour répondre à la demande croissante.',
    icon: '📈',
  },
  {
    id: 3,
    year: '2019',
    title: 'Certification',
    description: 'Obtention de la certification qualité nationale. Reconnaissance officielle de notre engagement envers l\'excellence des soins et la sécurité des patients.',
    icon: '🏆',
  },
  {
    id: 4,
    year: '2022',
    title: 'Nouveau bâtiment',
    description: 'Inauguration de notre nouveau bâtiment équipé des technologies médicales les plus récentes. Un espace conçu pour le bien-être des patients et l\'efficacité des équipes soignantes.',
    icon: '🏗️',
  },
  {
    id: 5,
    year: '2024',
    title: 'Aujourd\'hui',
    description: 'Nous continuons à innover et à grandir, avec plus de 5000 patients suivis annuellement. Notre mission reste intacte : votre santé, notre priorité.',
    icon: '✨',
  },
]

function TimelineCard({ step, index }: { step: TimelineStep; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const isLeft = index % 2 === 0

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`card-enter${visible ? ' visible' : ''}`}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        marginBottom: 32,
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.45s ease ${index * 0.1}s, transform 0.45s ease ${index * 0.1}s`,
      }}
    >
      {/* Dot on timeline */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 20,
        transform: 'translateX(-50%)',
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: 'var(--acc)',
        border: '3px solid var(--bg)',
        zIndex: 2,
      }} />

      <div
        style={{
          width: 'calc(50% - 28px)',
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius)',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 20 }}>{step.icon}</span>
          <span style={{
            background: 'var(--acc)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 20,
          }}>{step.year}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
          {step.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {step.description}
        </div>
      </div>
    </div>
  )
}

export default function TimelinePage() {
  const router = useRouter()
  const [steps, setSteps] = useState<TimelineStep[]>(DEFAULT_STEPS)
  const [showForm, setShowForm] = useState(false)
  const [newStep, setNewStep] = useState({ year: '', title: '', description: '', icon: '📌' })

  const handleAdd = () => {
    if (!newStep.year || !newStep.title) return
    setSteps(prev => [
      ...prev,
      { id: Date.now(), ...newStep },
    ])
    setNewStep({ year: '', title: '', description: '', icon: '📌' })
    setShowForm(false)
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            lineHeight: 1,
            padding: 0,
          }}
        >←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
          Notre histoire
        </div>
        <div style={{ width: 28 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '24px 16px', maxWidth: 600, margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>
          Notre parcours depuis la création
        </p>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 2,
            background: 'var(--card-border)',
            transform: 'translateX(-50%)',
          }} />

          {steps.map((step, i) => (
            <TimelineCard key={step.id} step={step} index={i} />
          ))}
        </div>

        {/* Add step form */}
        {showForm && (
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius)',
            padding: 16,
            marginBottom: 16,
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>
              Nouvelle étape
            </div>
            {[
              { key: 'year', label: 'Année', placeholder: 'ex: 2025' },
              { key: 'title', label: 'Titre', placeholder: 'ex: Nouvelle spécialité' },
              { key: 'icon', label: 'Icône', placeholder: 'ex: 🌟' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                <input
                  value={(newStep as Record<string, string>)[key]}
                  onChange={e => setNewStep(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--card-border)',
                    background: 'var(--bg)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Description</div>
              <textarea
                value={newStep.description}
                onChange={e => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez cette étape..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--card-border)',
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  background: 'var(--acc)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >Ajouter</button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  background: 'var(--card-border)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >Annuler</button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            background: 'var(--card)',
            border: '1px dashed var(--card-border)',
            borderRadius: 'var(--radius)',
            padding: '12px',
            fontSize: 13,
            color: 'var(--acc)',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 8,
          }}
        >+ Ajouter une étape</button>
      </div>
    </div>
  )
}
