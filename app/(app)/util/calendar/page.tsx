'use client'
import { useState } from 'react'

const SERVICES = [
  { key: 'google', label: 'Google Calendar', logo: '🟢', color: '#4285F4' },
  { key: 'apple', label: 'Apple Calendar', logo: '🍎', color: '#555' },
  { key: 'outlook', label: 'Outlook', logo: '📧', color: '#0078D4' },
]

const UPCOMING = [
  { icon: '📅', title: 'Consultation médicale', date: '25 juin 2026 — 09h00' },
  { icon: '📅', title: 'Bilan sanguin', date: '27 juin 2026 — 07h30' },
  { icon: '📅', title: 'Suivi cardiologie', date: '02 juil. 2026 — 14h00' },
]

export default function CalendarSyncPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ google: true })
  const [modal, setModal] = useState<string | null>(null)
  const [autoSync, setAutoSync] = useState(true)
  const [reminder, setReminder] = useState(true)

  function handleConnect(key: string) {
    setModal(key)
  }

  function handleConfirm() {
    if (modal) setConnected(p => ({ ...p, [modal]: true }))
    setModal(null)
  }

  function handleDisconnect(key: string) {
    setConnected(p => ({ ...p, [key]: false }))
  }

  const serviceLabel = SERVICES.find(s => s.key === modal)?.label ?? ''

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}>←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Synchronisation agenda</span>
        <span style={{ width: 30 }} />
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        {/* Services */}
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Services calendrier</div>
        <div className="stagger">
          {SERVICES.map(s => (
            <div key={s.key} className="card-enter" style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</div>
                <div style={{ fontSize: 12, marginTop: 2, color: connected[s.key] ? '#22c55e' : 'var(--text-secondary)' }}>
                  {connected[s.key] ? '● Connecté' : '○ Non connecté'}
                </div>
              </div>
              {connected[s.key] ? (
                <button onClick={() => handleDisconnect(s.key)}
                  style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Déconnecter
                </button>
              ) : (
                <button onClick={() => handleConnect(s.key)}
                  style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: 'var(--acc)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Connecter
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Toggles */}
        <div className="card-enter" style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Préférences</div>
          {[
            { label: 'Sync automatique', sub: 'Synchroniser en arrière-plan', val: autoSync, set: setAutoSync },
            { label: 'Rappel 1h avant', sub: 'Notification avant chaque RDV', val: reminder, set: setReminder },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: i === 0 ? 12 : 0, marginBottom: i === 0 ? 12 : 0, borderBottom: i === 0 ? '1px solid var(--card-border)' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.sub}</div>
              </div>
              <div onClick={() => t.set(!t.val)}
                style={{ width: 46, height: 26, borderRadius: 13, background: t.val ? 'var(--acc)' : 'var(--bg2)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', border: '1px solid var(--card-border)' }}>
                <div style={{ position: 'absolute', top: 3, left: t.val ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming events */}
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Événements synchronisés</div>
        <div className="stagger">
          {UPCOMING.map((ev, i) => (
            <div key={i} className="card-enter" style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{ev.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{ev.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '24px 20px', maxWidth: 320, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔗</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Connexion {serviceLabel}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
              Vous allez être redirigé vers <strong>{serviceLabel}</strong> pour autoriser la synchronisation de votre agenda.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setModal(null)}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Annuler
              </button>
              <button onClick={handleConfirm}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'var(--acc)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
