'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { queueApi } from '@/lib/api'
import type { QueueEntry } from '@/lib/types'

export default function QueueWidget() {
  const [entry, setEntry] = useState<QueueEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    queueApi.getStatus().then(e => setEntry(e)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="skeleton" style={{ height: 72, borderRadius: 18 }} />
  if (!entry) return null

  const urgent = entry.position <= 2

  return (
    <Link href="/queue" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        background: urgent ? 'var(--warning-bg)' : undefined,
      }}>
        <div style={{ fontSize: 32 }}>🎫</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>File d&apos;attente</div>
          <div style={{ fontSize: 13, color: urgent ? 'var(--warning-color)' : 'var(--text-secondary)', marginTop: 2 }}>
            {urgent ? `⚡ Vous êtes le n°${entry.position} — préparez-vous !` : `Position n°${entry.position}`}
          </div>
          {entry.estimated_wait_minutes != null && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>~{entry.estimated_wait_minutes} min d&apos;attente</div>
          )}
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
