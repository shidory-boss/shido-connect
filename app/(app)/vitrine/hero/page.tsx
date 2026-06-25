'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function VitrineHeroPage() {
  const [titre, setTitre] = useState('Bienvenue chez nous')
  const [sousTitre, setSousTitre] = useState('Votre confiance, notre priorité')
  const [cta, setCta] = useState('Nous contacter')
  const [fondColor, setFondColor] = useState('#4f46e5')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const config = JSON.stringify({ titre, sousTitre, cta, fondColor }, null, 2)
    navigator.clipboard.writeText(config).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header sticky */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '14px 18px',
        gap: 12,
      }}>
        <Link href="/home" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: 20, lineHeight: 1 }}>
          ←
        </Link>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
          Hero Builder
        </div>
        <div style={{ width: 28 }} />
      </div>

      {/* Contenu scrollable */}
      <div style={{ padding: '20px 16px', maxWidth: 560, margin: '0 auto' }}>

        {/* PREVIEW */}
        <div className="card-enter" style={{
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          marginBottom: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}>
          <div
            className="gradientFlow"
            style={{
              background: `linear-gradient(135deg, ${fondColor}ee 0%, ${fondColor}99 60%, #7c3aed88 100%) 0 0 / 200% 200%`,
              padding: '48px 28px',
              textAlign: 'center',
              animation: 'gradientFlow 6s ease infinite',
            }}
          >
            <div style={{
              fontSize: 28,
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              marginBottom: 10,
              lineHeight: 1.2,
            }}>
              {titre || 'Votre titre'}
            </div>
            <div style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.88)',
              marginBottom: 24,
              lineHeight: 1.5,
            }}>
              {sousTitre || 'Votre sous-titre'}
            </div>
            <button style={{
              background: '#ffffff',
              color: fondColor,
              border: 'none',
              borderRadius: 50,
              padding: '12px 28px',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              letterSpacing: 0.4,
            }}>
              {cta || 'Bouton CTA'}
            </button>
          </div>
        </div>

        {/* Formulaire édition */}
        <div className="card-enter" style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius)',
          padding: '20px 18px',
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
            Personnaliser
          </div>

          {/* Titre principal */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Titre principal
            </label>
            <input
              value={titre}
              onChange={e => setTitre(e.target.value)}
              placeholder="Bienvenue chez nous"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 14,
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Sous-titre */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Sous-titre
            </label>
            <input
              value={sousTitre}
              onChange={e => setSousTitre(e.target.value)}
              placeholder="Votre confiance, notre priorité"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 14,
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Texte bouton CTA */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Texte bouton CTA
            </label>
            <input
              value={cta}
              onChange={e => setCta(e.target.value)}
              placeholder="Nous contacter"
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 14,
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Couleur fond */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Couleur de fond
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="color"
                value={fondColor}
                onChange={e => setFondColor(e.target.value)}
                style={{
                  width: 44,
                  height: 44,
                  border: '2px solid var(--card-border)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: 'none',
                  padding: 2,
                }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                {fondColor}
              </span>
            </div>
          </div>
        </div>

        {/* Bouton Copier le code */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            background: copied ? '#22c55e' : 'var(--acc)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '14px',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'background 0.3s',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          {copied ? '✓ Copié !' : 'Copier le code JSON'}
        </button>

        <div style={{ height: 32 }} />
      </div>
    </div>
  )
}
