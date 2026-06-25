'use client'

import Link from 'next/link'

export default function VitrineCountdownWidget() {
  return (
    <Link href="/vitrine/countdown" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 32 }}>⏳</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Événement à venir</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>J-7 avant l'ouverture</div>
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
