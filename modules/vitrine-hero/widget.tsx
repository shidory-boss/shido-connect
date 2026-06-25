'use client'

import Link from 'next/link'

export default function VitrineHeroWidget() {
  return (
    <Link href="/vitrine/hero" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 32 }}>🏠</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Page d&apos;accueil</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Hero section avec CTA</div>
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
