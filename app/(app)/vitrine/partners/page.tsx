'use client'

import { useRouter } from 'next/navigation'

const PARTNER_COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const DEFAULT_PARTNERS = [
  { id: 1, name: 'CNPS Côte d\'Ivoire', type: 'Assurance', initials: 'CN', description: 'Caisse nationale de prévoyance sociale' },
  { id: 2, name: 'Biomédis Labo', type: 'Laboratoire', initials: 'BL', description: 'Analyses médicales et bilans biologiques' },
  { id: 3, name: 'PharmaCIV', type: 'Pharmacie', initials: 'PC', description: 'Réseau de pharmacies partenaires' },
  { id: 4, name: 'Allianz Santé', type: 'Assurance', initials: 'AS', description: 'Couverture santé entreprise et individuel' },
  { id: 5, name: 'IRM Cocody', type: 'Imagerie', initials: 'IC', description: 'Imagerie médicale et radiologie' },
  { id: 6, name: 'MediStock CI', type: 'Fournisseur', initials: 'MS', description: 'Matériel et consommables médicaux' },
]

export default function PartnersPage() {
  const router = useRouter()

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center',
        padding: '14px 16px', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: 'var(--text-primary)', padding: '4px 8px',
            borderRadius: 8,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
          Nos partenaires
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, textAlign: 'center' }}>
          Ils nous font confiance et travaillent avec nous pour vous offrir les meilleurs soins.
        </p>

        {/* Grid 3 cols */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}>
          {DEFAULT_PARTNERS.map((partner, i) => (
            <div
              key={partner.id}
              className="card-enter"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                padding: '16px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
                animationDelay: `${i * 60}ms`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--accent)'
                el.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--card-border)'
                el.style.transform = 'scale(1)'
              }}
            >
              {/* Logo placeholder */}
              <div style={{
                width: 48, height: 48,
                borderRadius: '50%',
                background: PARTNER_COLORS[i % PARTNER_COLORS.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 10px',
                color: '#fff', fontWeight: 800, fontSize: 15,
              }}>
                {partner.initials}
              </div>
              <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)', marginBottom: 4 }}>
                {partner.name}
              </div>
              <div style={{
                display: 'inline-block',
                background: 'var(--bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 20,
                padding: '2px 8px',
                fontSize: 11,
                color: 'var(--text-secondary)',
              }}>
                {partner.type}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton ajouter */}
        <button style={{
          width: '100%',
          padding: '14px',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>+</span>
          Ajouter un partenaire
        </button>
      </div>
    </div>
  )
}
