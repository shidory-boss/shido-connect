'use client'

import Link from 'next/link'

export default function UtilInfiniteScrollWidget() {
  return (
    <Link href="/util/infinite-scroll" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32 }}>♾️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Chargement infini</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Navigation fluide et continue</div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  )
}
