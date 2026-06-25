'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const PLANS = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    price: '5 000',
    unit: 'FCFA / consult.',
    highlight: false,
    badge: null,
    services: [
      'Consultation générale',
      'Ordonnance électronique',
      'Suivi dossier patient',
      'Historique des visites',
    ],
    cta: 'Choisir Essentiel',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '10 000',
    unit: 'FCFA / consult.',
    highlight: true,
    badge: 'Recommandé',
    services: [
      'Consultation générale',
      'Ordonnance électronique',
      'Suivi dossier patient',
      'Historique des visites',
      'Bilan biologique inclus',
      'Suivi téléconsultation',
    ],
    cta: 'Choisir Standard',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '20 000',
    unit: 'FCFA / consult.',
    highlight: false,
    badge: null,
    services: [
      'Consultation générale',
      'Ordonnance électronique',
      'Suivi dossier patient',
      'Historique des visites',
      'Bilan biologique inclus',
      'Suivi téléconsultation',
      'Imagerie médicale',
      'Spécialiste à domicile',
    ],
    cta: 'Choisir Premium',
  },
]

const COMPARISON = [
  { feature: 'Consultation générale', essentiel: true, standard: true, premium: true },
  { feature: 'Ordonnance électronique', essentiel: true, standard: true, premium: true },
  { feature: 'Suivi dossier patient', essentiel: true, standard: true, premium: true },
  { feature: 'Bilan biologique', essentiel: false, standard: true, premium: true },
  { feature: 'Téléconsultation', essentiel: false, standard: true, premium: true },
  { feature: 'Imagerie médicale', essentiel: false, standard: false, premium: true },
  { feature: 'Spécialiste à domicile', essentiel: false, standard: false, premium: true },
  { feature: 'Support prioritaire 24h', essentiel: false, standard: false, premium: true },
]

export default function PricingPage() {
  const router = useRouter()
  const [showComparison, setShowComparison] = useState(false)

  return (
    <div
      className="page-enter"
      style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 40 }}
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
          Nos tarifs
        </div>
        <div style={{ width: 30 }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: '24px 16px 0' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 24 }}>
          Choisissez le plan adapté à vos besoins
        </p>

        {/* Cards plans */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 8,
          }}
        >
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className="card-enter"
              style={{
                minWidth: plan.highlight ? 200 : 170,
                flex: plan.highlight ? '0 0 200px' : '0 0 170px',
                background: 'var(--card)',
                border: plan.highlight ? '2px solid var(--acc)' : '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                padding: '20px 16px',
                position: 'relative',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {plan.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--acc)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 20,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 8 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: plan.highlight ? 'var(--acc)' : 'var(--text-primary)' }}>
                {plan.price}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                {plan.unit}
              </div>

              <ul className="stagger" style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {plan.services.map((s) => (
                  <li key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--acc)', fontWeight: 700, marginTop: 1 }}>✓</span>
                    {s}
                  </li>
                ))}
              </ul>

              <button
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: plan.highlight ? 'var(--acc)' : 'transparent',
                  color: plan.highlight ? '#fff' : 'var(--acc)',
                  border: `1.5px solid var(--acc)`,
                  borderRadius: 'var(--radius)',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Accordion comparaison */}
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => setShowComparison(v => !v)}
            style={{
              width: '100%',
              background: 'var(--card)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius)',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--text-primary)',
            }}
          >
            Voir la comparaison détaillée
            <span style={{ transition: 'transform .2s', transform: showComparison ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
          </button>

          {showComparison && (
            <div
              style={{
                marginTop: 8,
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
              }}
            >
              {/* Header tableau */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, 60px)', padding: '10px 14px', borderBottom: '1px solid var(--card-border)', gap: 4 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Service</div>
                {['Ess.', 'Std.', 'Prem.'].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>{h}</div>
                ))}
              </div>
              {COMPARISON.map((row, i) => (
                <div
                  key={row.feature}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr repeat(3, 60px)',
                    padding: '9px 14px',
                    gap: 4,
                    borderBottom: i < COMPARISON.length - 1 ? '1px solid var(--card-border)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{row.feature}</div>
                  {(['essentiel', 'standard', 'premium'] as const).map(k => (
                    <div key={k} style={{ textAlign: 'center', fontSize: 14 }}>
                      {row[k] ? <span style={{ color: 'var(--acc)', fontWeight: 700 }}>✓</span> : <span style={{ color: 'var(--text-secondary)', opacity: 0.4 }}>—</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note légale */}
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 28, opacity: 0.75 }}>
          * Tarifs indicatifs — remboursement selon assurance
        </p>
      </div>
    </div>
  )
}
