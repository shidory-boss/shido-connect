'use client'

import { useEffect, useState } from 'react'
import { queueApi } from '@/lib/api'
import type { QueueEntry } from '@/lib/types'

export default function QueuePage() {
  const [entry, setEntry] = useState<QueueEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const load = () => {
    queueApi.getStatus()
      .then(e => { setEntry(e); setNotFound(!e) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const iv = setInterval(load, 8000)
    return () => clearInterval(iv)
  }, [])

  const urgent = entry && entry.position <= 2

  return (
    <div className="apage">
      <div className="ahdr">
        <div className="ahdr-name">🎫 File d&apos;attente</div>
      </div>

      <div style={{ padding: '20px 22px 0', textAlign: 'center' }}>
        {loading && <div className="skeleton" style={{ height: 220, borderRadius: 24 }} />}

        {!loading && notFound && (
          <div style={{ padding: '64px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Vous n&apos;êtes pas en file</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Présentez-vous à l&apos;accueil pour obtenir un ticket.</div>
          </div>
        )}

        {!loading && entry && (
          <div className="acard" style={{
            padding: '40px 24px',
            background: urgent ? 'var(--warning-bg)' : undefined,
          }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: urgent ? 'var(--warning-color)' : 'var(--accent)', lineHeight: 1 }}>
              {entry.position}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 6 }}>
              {urgent ? '⚡ Préparez-vous !' : 'Votre position'}
            </div>
            <div style={{ width: 48, height: 3, background: 'var(--accent)', borderRadius: 2, margin: '20px auto' }} />
            {entry.estimated_wait_minutes != null && (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                Attente estimée : <strong>~{entry.estimated_wait_minutes} min</strong>
              </div>
            )}
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              {entry.total_in_queue} personne{entry.total_in_queue > 1 ? 's' : ''} en attente
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 20, opacity: 0.6 }}>
              Mise à jour automatique toutes les 8 sec
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
