'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = 'Général' | 'RDV' | 'Tarifs' | 'Urgences'

interface FaqItem {
  id: number
  question: string
  answer: string
  category: Category
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    category: 'Général',
    question: 'Quels sont vos horaires d\'ouverture ?',
    answer: 'Nous sommes ouverts du lundi au vendredi de 8h à 18h, et le samedi de 8h à 13h. Nous sommes fermés les dimanches et jours fériés.',
  },
  {
    id: 2,
    category: 'Général',
    question: 'Comment obtenir mon dossier médical ?',
    answer: 'Vous pouvez accéder à votre dossier médical directement depuis l\'application, section "Dossier". Pour une copie papier, contactez notre secrétariat avec une pièce d\'identité.',
  },
  {
    id: 3,
    category: 'RDV',
    question: 'Comment prendre un rendez-vous ?',
    answer: 'Vous pouvez prendre rendez-vous via l\'application (section "RDV"), par téléphone, ou directement à l\'accueil. Les créneaux en ligne sont disponibles 24h/24.',
  },
  {
    id: 4,
    category: 'RDV',
    question: 'Puis-je annuler ou reporter un rendez-vous ?',
    answer: 'Oui, vous pouvez annuler ou reporter jusqu\'à 2h avant votre rendez-vous depuis l\'application. Au-delà, merci d\'appeler directement le secrétariat.',
  },
  {
    id: 5,
    category: 'Tarifs',
    question: 'Quels sont vos tarifs de consultation ?',
    answer: 'La consultation de médecine générale est à 5 000 FCFA. Les consultations de spécialistes varient de 10 000 à 25 000 FCFA selon la spécialité. Ces tarifs sont affichés lors de la prise de rendez-vous.',
  },
  {
    id: 6,
    category: 'Tarifs',
    question: 'Acceptez-vous les assurances maladie ?',
    answer: 'Oui, nous acceptons les principales assurances (CNPS, Allianz, NSIA, Sanlam, GNA). Munissez-vous de votre carte de tiers payant et d\'une pièce d\'identité.',
  },
  {
    id: 7,
    category: 'Urgences',
    question: 'Comment gérer une urgence médicale ?',
    answer: 'En cas d\'urgence vitale, appelez le SAMU au 185 ou le CAMU. Notre clinique dispose d\'une unité d\'urgence ouverte de 8h à 20h. Hors de ces heures, rendez-vous aux urgences du CHU.',
  },
  {
    id: 8,
    category: 'Urgences',
    question: 'Proposez-vous des téléconsultations urgentes ?',
    answer: 'Oui, des créneaux de téléconsultation urgente sont disponibles sous 2h en semaine. Rendez-vous dans la section "Téléconsultation" de l\'application et choisissez "Urgence".',
  },
]

const CATEGORIES: Category[] = ['Général', 'RDV', 'Tarifs', 'Urgences']

export default function FaqPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('Général')
  const [openId, setOpenId] = useState<number | null>(null)

  const filtered = FAQ_ITEMS.filter(item =>
    item.category === activeCategory &&
    (search === '' ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()))
  )

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
          FAQ
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '16px 16px 32px' }}>
        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, color: 'var(--text-secondary)',
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 38px',
              background: 'var(--card)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius)',
              fontSize: 14,
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category tabs */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          marginBottom: 20, paddingBottom: 4,
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: activeCategory === cat ? 'var(--accent)' : 'var(--card-border)',
                background: activeCategory === cat ? 'var(--accent)' : 'var(--card)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontWeight: activeCategory === cat ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', fontSize: 14 }}>
              Aucune question trouvée pour "{search}"
            </div>
          )}
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="card-enter"
              style={{
                background: 'var(--card)',
                border: '1px solid',
                borderColor: openId === item.id ? 'var(--accent)' : 'var(--card-border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
                animationDelay: `${i * 60}ms`,
              }}
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{ flex: 1, fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {item.question}
                </div>
                <div style={{
                  fontSize: 16, color: 'var(--text-secondary)',
                  transition: 'transform 0.2s',
                  transform: openId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0,
                }}>
                  ▼
                </div>
              </button>
              <div style={{
                maxHeight: openId === item.id ? 300 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}>
                <div style={{
                  padding: '0 16px 16px',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  borderTop: '1px solid var(--card-border)',
                  paddingTop: 12,
                }}>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
