'use client'
import { clinicConfig } from '@/chassis.config'

import { useEffect, useState } from 'react'
import { queueApi } from '@/lib/api'
import type { QueueEntry } from '@/lib/types'

const ACC  = clinicConfig.accent
const ACC2 = clinicConfig.accentDark

export default function QueuePage() {
  const [entry, setEntry]       = useState<QueueEntry | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [checking, setChecking] = useState(false)
  const [reason, setReason]     = useState('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError]       = useState('')

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

  const checkin = async () => {
    if (!reason.trim()) { setError('Décrivez brièvement votre motif de consultation.'); return }
    setChecking(true)
    setError('')
    try {
      const e = await queueApi.checkin({ reason: reason.trim() })
      setEntry(e)
      setNotFound(false)
      setShowForm(false)
      setReason('')
    } catch {
      setError("Impossible de rejoindre la file. Réessayez ou présentez-vous à l'accueil.")
    } finally {
      setChecking(false)
    }
  }

  const urgent = entry && entry.position <= 2

  return (
    <div className="apage">
      <div className="ahdr">
        <div className="ahdr-name">🎫 File d&apos;attente</div>
      </div>

      <div style={{ padding: '20px 22px 0', textAlign: 'center' }}>
        {loading && <div className="skeleton" style={{ height: 220, borderRadius: 24 }} />}

        {!loading && notFound && (
          <div style={{ padding: '40px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏥</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>Vous n&apos;êtes pas en file</div>
            <div style={{ fontSize: 14, marginTop: 8, color: 'var(--text-secondary)', marginBottom: 28 }}>
              Rejoignez la file d&apos;attente depuis l&apos;application ou présentez-vous à l&apos;accueil.
            </div>

            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={{
                width: '100%', padding: '16px', borderRadius: 18, border: 'none',
                background: `linear-gradient(135deg,${ACC2},${ACC})`,
                color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer',
                boxShadow: `0 8px 24px rgba(29,158,117,.4)`,
              }}>
                🎫 Rejoindre la file d&apos;attente
              </button>
            ) : (
              <div style={{ background: '#fff', borderRadius: 20, padding: '20px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,.08)', textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>Motif de consultation</div>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Ex : fièvre depuis 2 jours, contrôle tension, renouvellement ordonnance..."
                  rows={3}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'Nunito, system-ui, sans-serif', fontWeight: 600, color: '#0f172a', outline: 'none', resize: 'none', boxSizing: 'border-box' as const, background: '#f8fafc' }}
                />
                {error && (
                  <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, marginTop: 6, marginBottom: 4 }}>⚠️ {error}</div>
                )}
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button onClick={() => { setShowForm(false); setError('') }} style={{ flex: 1, padding: '13px', borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                    Annuler
                  </button>
                  <button onClick={checkin} disabled={checking} style={{ flex: 2, padding: '13px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg,${ACC2},${ACC})`, color: '#fff', fontSize: 14, fontWeight: 900, cursor: checking ? 'not-allowed' : 'pointer', opacity: checking ? 0.7 : 1 }}>
                    {checking ? '⏳ Inscription...' : '✅ Confirmer'}
                  </button>
                </div>
              </div>
            )}
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
