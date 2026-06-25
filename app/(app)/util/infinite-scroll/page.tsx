'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CATEGORIES = ['Santé', 'Rendez-vous', 'Résultats', 'Ordonnance', 'Facture', 'Message']
const TITLES = [
  'Consultation Dr. Konan',
  'Résultat analyse sanguine',
  'Ordonnance renouvellée',
  'Facture réglée',
  'Message du cabinet',
  'Rappel vaccin',
  'Compte rendu radiologie',
  'Suivi tensionnel',
  'Prescription mise à jour',
  'Note de consultation',
]

function generateItems(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const idx = start + i
    const date = new Date(Date.now() - idx * 3600000 * 24)
    return {
      id: idx + 1,
      title: TITLES[idx % TITLES.length],
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: CATEGORIES[idx % CATEGORIES.length],
    }
  })
}

function Skeleton() {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      marginBottom: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ height: 14, width: '60%', background: 'var(--bg2)', borderRadius: 6, animation: 'pulse 1.2s ease-in-out infinite' }} />
      <div style={{ height: 11, width: '40%', background: 'var(--bg2)', borderRadius: 6, animation: 'pulse 1.2s ease-in-out infinite 0.2s' }} />
    </div>
  )
}

export default function InfiniteScrollPage() {
  const [items, setItems] = useState(() => generateItems(0, 10))
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(() => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      setItems(prev => [...prev, ...generateItems(prev.length, 10)])
      setLoading(false)
    }, 800)
  }, [loading])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .card-enter { animation: cardIn 0.3s ease both }
        @keyframes cardIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
      `}</style>

      {/* Header sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
      }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}
        >←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Chargement infini</span>
        <span style={{ width: 22 }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: 16 }}>
        {/* Compteur */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius)', padding: '10px 14px',
          marginBottom: 16, fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>♾️</span>
          <span>{items.length} élément{items.length > 1 ? 's' : ''} chargé{items.length > 1 ? 's' : ''}</span>
        </div>

        {/* Liste */}
        <div className="stagger">
          {items.map((item) => (
            <div key={item.id} className="card-enter" style={{
              background: 'var(--card)', border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius)', padding: '14px 16px',
              marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--acc)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}>
                {item.id}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.date}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 8px',
                background: 'var(--bg2)', borderRadius: 20, color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}>{item.category}</span>
            </div>
          ))}
        </div>

        {/* Skeletons pendant le chargement */}
        {loading && (
          <div>
            <Skeleton /><Skeleton /><Skeleton />
          </div>
        )}

        {/* Spinner */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
            <div style={{
              width: 24, height: 24, border: '3px solid var(--card-border)',
              borderTopColor: 'var(--acc)', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}

        {/* Sentinel IntersectionObserver */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  )
}
