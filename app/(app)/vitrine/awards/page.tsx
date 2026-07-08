'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const CERTIFICATIONS = [
  {
    id: 'iso',
    badge: 'gold',
    name: 'ISO 27001',
    org: 'Bureau Veritas',
    year: 2024,
    desc: 'Certification sécurité des systèmes d\'information et données patients',
    icon: '🛡️',
  },
  {
    id: 'hds',
    badge: 'gold',
    name: 'Hébergeur Données de Santé',
    org: 'ANSSi / Ministère Santé CI',
    year: 2023,
    desc: 'Agrément national hébergement données médicales sensibles',
    icon: '🏥',
  },
  {
    id: 'ce',
    badge: 'silver',
    name: 'Marquage CE Dispositif Médical',
    org: 'Conformité Européenne',
    year: 2023,
    desc: 'Logiciel qualifié dispositif médical classe IIa',
    icon: '✅',
  },
  {
    id: 'best',
    badge: 'gold',
    name: 'Best HealthTech Afrique',
    org: 'AfricaTech Summit',
    year: 2025,
    desc: 'Prix de la meilleure solution santé numérique d\'Afrique de l\'Ouest',
    icon: '🏆',
  },
]

const TIMELINE = [
  { year: 2021, title: 'Fondation de la clinique', desc: 'Lancement du projet à Abidjan.' },
  { year: 2022, title: 'Premier déploiement clinique', desc: '12 cabinets pilotes en Côte d\'Ivoire.' },
  { year: 2023, title: 'Certifications HDS & CE', desc: 'Double agrément pour les données de santé.' },
  { year: 2024, title: 'ISO 27001', desc: 'Sécurité renforcée, audit international réussi.' },
  { year: 2025, title: 'Prix AfricaTech', desc: 'Récompensés meilleure HealthTech Afrique.' },
]

const KPIS = [
  { label: 'Années d\'expérience', value: 4, suffix: '' },
  { label: 'Patients suivis', value: 12000, suffix: '+' },
  { label: 'Satisfaction', value: 97, suffix: '%' },
  { label: 'Certifications', value: 4, suffix: '' },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const duration = 1200
    const steps = 40
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}

export default function AwardsPage() {
  const router = useRouter()

  return (
    <div
      className="page-enter"
      style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 48 }}
    >
      {/* Header sticky */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--card)',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '14px 16px',
          gap: 12,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            padding: 0,
            lineHeight: 1,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
          Certifications & Récompenses
        </div>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ padding: '24px 16px 0' }}>

        {/* Chiffres clés */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginBottom: 32,
          }}
        >
          {KPIS.map((kpi, i) => (
            <div
              key={kpi.label}
              className="card-enter"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                padding: '18px 14px',
                textAlign: 'center',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--acc)' }}>
                <AnimatedCounter target={kpi.value} suffix={kpi.suffix} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                {kpi.label}
              </div>
            </div>
          ))}
        </div>

        {/* Cards certifications */}
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
          Nos certifications
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={cert.id}
              className="card-enter"
              style={{
                background: 'var(--card)',
                border: `1.5px solid ${cert.badge === 'gold' ? '#d4a017' : '#9e9e9e'}`,
                borderRadius: 'var(--radius)',
                padding: '16px 18px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  minWidth: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: cert.badge === 'gold' ? 'rgba(212,160,23,0.12)' : 'rgba(158,158,158,0.12)',
                  borderRadius: 10,
                }}
              >
                {cert.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
                    {cert.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: cert.badge === 'gold' ? '#d4a017' : '#9e9e9e',
                      background: cert.badge === 'gold' ? 'rgba(212,160,23,0.1)' : 'rgba(158,158,158,0.1)',
                      padding: '2px 8px',
                      borderRadius: 20,
                    }}
                  >
                    {cert.year}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--acc)', marginTop: 2, fontWeight: 600 }}>
                  {cert.org}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                  {cert.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
          Notre histoire
        </div>
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Ligne verticale */}
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: 8,
              bottom: 8,
              width: 2,
              background: 'var(--card-border)',
              borderRadius: 2,
            }}
          />
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map((item, i) => (
              <div
                key={item.year}
                style={{
                  position: 'relative',
                  paddingBottom: i < TIMELINE.length - 1 ? 24 : 0,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: -26,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--acc)',
                    border: '2px solid var(--bg)',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--acc)', marginBottom: 2 }}>
                  {item.year}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
