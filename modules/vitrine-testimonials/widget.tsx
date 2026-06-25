'use client'
import Link from 'next/link'

export default function VitrineTestimonialsWidget({ config }: { config?: Record<string, string> }) {
  const rating = config?.rating || '4.8'

  return (
    <Link href="/vitrine/testimonials" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 32 }}>⭐</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Avis clients</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Ce que disent nos patients</div>
          <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>{rating} ★</div>
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
