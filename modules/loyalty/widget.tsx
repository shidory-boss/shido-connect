'use client'

import Link from 'next/link'

export default function LoyaltyWidget() {
  return (
    <Link href="/loyalty" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
        <div style={{ fontSize: 32 }}>⭐</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Fidélité</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Vos points et récompenses</div>
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
