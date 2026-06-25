'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Tout', 'Intérieur', 'Équipe', 'Événements'] as const
type Category = typeof CATEGORIES[number]

interface Photo {
  id: number
  label: string
  category: Exclude<Category, 'Tout'>
  gradient: string
  icon: string
}

const PHOTOS: Photo[] = [
  { id: 1, label: 'Salle d\'attente', category: 'Intérieur', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '🛋️' },
  { id: 2, label: 'Équipe médicale', category: 'Équipe', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '👨‍⚕️' },
  { id: 3, label: 'Inauguration 2024', category: 'Événements', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '🎉' },
  { id: 4, label: 'Cabinet principal', category: 'Intérieur', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '🏥' },
  { id: 5, label: 'Staff infirmiers', category: 'Équipe', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '💉' },
  { id: 6, label: 'Journée portes ouvertes', category: 'Événements', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', icon: '🚪' },
]

export default function GalleryPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<Category>('Tout')
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  const filtered = activeFilter === 'Tout' ? PHOTOS : PHOTOS.filter(p => p.category === activeFilter)

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-primary)', lineHeight: 1 }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
          Galerie photos
        </div>
        {/* spacer */}
        <div style={{ width: 28 }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 16px 8px', overflowX: 'auto' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              background: activeFilter === cat ? 'var(--acc)' : 'var(--card)',
              color: activeFilter === cat ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid masonry simulée */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        padding: '8px 16px 24px',
      }}>
        {filtered.map((photo, i) => (
          <div
            key={photo.id}
            className="card-enter"
            onClick={() => setLightbox(photo)}
            style={{
              borderRadius: 'var(--radius)',
              background: photo.gradient,
              aspectRatio: i % 3 === 1 ? '1/1.4' : '1/1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: 6,
              animationDelay: `${i * 60}ms`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 28 }}>{photo.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textAlign: 'center', padding: '0 4px' }}>
              {photo.label}
            </div>
            <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 14 }}>📷</div>
          </div>
        ))}
      </div>

      {/* Bouton Ajouter */}
      <div style={{ padding: '0 16px 32px', textAlign: 'center' }}>
        <label style={{
          display: 'inline-block',
          padding: '12px 28px',
          borderRadius: 'var(--radius)',
          background: 'var(--acc)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          cursor: 'pointer',
        }}>
          📷 Ajouter une photo
          <input type="file" accept="image/*" style={{ display: 'none' }} />
        </label>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              borderRadius: 'var(--radius)',
              background: lightbox.gradient,
              width: '80vw', height: '80vw', maxWidth: 360, maxHeight: 360,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 12, position: 'relative',
            }}
          >
            <div style={{ fontSize: 56 }}>{lightbox.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{lightbox.label}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{lightbox.category}</div>
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(0,0,0,0.3)', border: 'none',
                color: '#fff', fontSize: 20, width: 32, height: 32,
                borderRadius: '50%', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
