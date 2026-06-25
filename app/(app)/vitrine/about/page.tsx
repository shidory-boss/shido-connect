'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DEFAULT_DESCRIPTION = `Fondée avec la conviction que chaque patient mérite un accès simple et rapide aux soins, notre clinique accompagne les familles depuis plus de 15 ans. Nous combinons l'expertise médicale et les technologies modernes pour offrir une prise en charge humaine et efficace.`

const DEFAULT_MISSIONS = [
  {
    icon: '✅',
    titre: 'Qualité',
    texte: 'Des soins rigoureux, des protocoles éprouvés et un suivi personnalisé pour chaque patient.',
  },
  {
    icon: '🤝',
    titre: 'Confiance',
    texte: 'Une relation transparente et respectueuse entre nos équipes, les patients et leurs familles.',
  },
  {
    icon: '🌍',
    titre: 'Proximité',
    texte: 'Ancrés dans notre communauté locale, nous œuvrons pour un accès aux soins équitable pour tous.',
  },
]

const DEFAULT_VALEURS = ['Écoute', 'Innovation', 'Respect', 'Engagement', 'Excellence', 'Solidarité']

const CHIP_COLORS = [
  { bg: '#e8f5e9', color: '#2e7d32' },
  { bg: '#e3f2fd', color: '#1565c0' },
  { bg: '#fff3e0', color: '#e65100' },
  { bg: '#f3e5f5', color: '#6a1b9a' },
  { bg: '#fce4ec', color: '#880e4f' },
  { bg: '#e0f7fa', color: '#006064' },
]

export default function VitrineAboutPage() {
  const router = useRouter()
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION)
  const [missions, setMissions] = useState(DEFAULT_MISSIONS)
  const [valeurs, setValeurs] = useState(DEFAULT_VALEURS)
  const [newValeur, setNewValeur] = useState('')

  const updateMission = (index: number, field: 'titre' | 'texte', value: string) => {
    setMissions(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))
  }

  const removeValeur = (index: number) => {
    setValeurs(prev => prev.filter((_, i) => i !== index))
  }

  const addValeur = () => {
    const v = newValeur.trim()
    if (v) {
      setValeurs(prev => [...prev, v])
      setNewValeur('')
    }
  }

  const handleSave = () => {
    // UI only — no API call
    alert('Modifications enregistrées (aperçu local)')
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
        padding: '0 16px',
        height: 56,
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 8,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
          À propos
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Notre histoire */}
        <div className="card-enter" style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius)',
          padding: 18,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 12 }}>
            📖 Notre histoire
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Décrivez l'histoire de votre établissement, sa création, ses grandes étapes…"
            rows={5}
            style={{
              width: '100%',
              background: 'var(--bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 14,
              color: 'var(--text-primary)',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Notre mission */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 12, paddingLeft: 2 }}>
            🎯 Notre mission
          </div>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {missions.map((m, i) => (
              <div key={i} className="card-enter" style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                padding: 16,
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{m.icon}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    value={m.titre}
                    onChange={e => updateMission(i, 'titre', e.target.value)}
                    placeholder="Titre de la mission"
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 8,
                      padding: '6px 10px',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                  <textarea
                    value={m.texte}
                    onChange={e => updateMission(i, 'texte', e.target.value)}
                    placeholder="Description de cette mission…"
                    rows={2}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 8,
                      padding: '6px 10px',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: 1.5,
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nos valeurs */}
        <div className="card-enter" style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius)',
          padding: 18,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>
            💎 Nos valeurs
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {valeurs.map((v, i) => {
              const c = CHIP_COLORS[i % CHIP_COLORS.length]
              return (
                <div key={i} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: c.bg,
                  color: c.color,
                  borderRadius: 20,
                  padding: '5px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {v}
                  <button
                    onClick={() => removeValeur(i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: c.color,
                      fontSize: 14,
                      padding: 0,
                      lineHeight: 1,
                      opacity: 0.7,
                    }}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newValeur}
              onChange={e => setNewValeur(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addValeur()}
              placeholder="Ajouter une valeur…"
              style={{
                flex: 1,
                background: 'var(--bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={addValeur}
              style={{
                background: 'var(--acc)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <button
          onClick={handleSave}
          style={{
            background: 'var(--acc)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '14px 20px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            marginBottom: 32,
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}
