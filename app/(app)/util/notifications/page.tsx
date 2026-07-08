'use client'

import { useState } from 'react'

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Rappel RDV', body: 'Votre rendez-vous est demain à 10h00 avec ShidoConnect', time: 'Il y a 2h', icon: '📅' },
  { id: 2, title: 'Résultat disponible', body: 'Votre bilan sanguin est prêt à télécharger', time: 'Il y a 5h', icon: '🔬' },
  { id: 3, title: 'Message du médecin', body: 'Dr. Yao vous a envoyé un message', time: 'Hier', icon: '💬' },
  { id: 4, title: 'Ordonnance renouvelée', body: 'Votre ordonnance a été renouvelée', time: 'Il y a 2j', icon: '💊' },
  { id: 5, title: 'Rappel médicament', body: 'N\'oubliez pas votre traitement ce soir', time: 'Il y a 3j', icon: '⏰' },
]

export default function NotificationsPage() {
  const [enabled, setEnabled] = useState(false)
  const [permStatus, setPermStatus] = useState<string>('default')

  async function handleToggle(val: boolean) {
    if (val) {
      if (typeof Notification !== 'undefined') {
        const perm = await Notification.requestPermission()
        setPermStatus(perm)
        setEnabled(perm === 'granted')
      }
    } else {
      setEnabled(false)
    }
  }

  function sendTestNotification() {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('Test ShidoConnect', { body: 'Vos notifications fonctionnent !' })
    }
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        height: 56, background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px'
      }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>
          Notifications
        </div>
        <div style={{ width: 30 }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toggle */}
        <div className="card-enter" style={{
          background: 'var(--card)', borderRadius: 'var(--radius)',
          border: '1px solid var(--card-border)', padding: '16px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Activer les notifications</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              Recevez les alertes en temps réel
            </div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 50, height: 28, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => handleToggle(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: enabled ? 'var(--accent, #3b82f6)' : 'var(--card-border)',
              borderRadius: 14, transition: 'background 0.2s'
            }} />
            <span style={{
              position: 'absolute', top: 3, left: enabled ? 25 : 3,
              width: 22, height: 22, background: '#fff',
              borderRadius: '50%', transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </label>
        </div>

        {/* Status card */}
        <div className="card-enter" style={{
          background: enabled ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
          borderRadius: 'var(--radius)',
          border: `1px solid ${enabled ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 22 }}>{enabled ? '✅' : '⚠️'}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {enabled ? 'Notifications activées' : 'Notifications désactivées'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {enabled
                ? 'Vous recevrez toutes les alertes importantes'
                : 'Activez pour ne manquer aucun événement'}
            </div>
          </div>
        </div>

        {/* Bouton test */}
        {enabled && (
          <button
            className="card-enter"
            onClick={sendTestNotification}
            style={{
              background: 'var(--accent, #3b82f6)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)',
              padding: '14px 18px', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            Envoyer une notification test 🔔
          </button>
        )}

        {/* Info card */}
        <div className="card-enter" style={{
          background: 'var(--card)', borderRadius: 'var(--radius)',
          border: '1px solid var(--card-border)', padding: '14px 18px',
          display: 'flex', gap: 10, alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Les notifications vous alertent pour vos RDV, résultats, et messages
          </div>
        </div>

        {/* Dernières notifications */}
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>
            Dernières notifications
          </div>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOCK_NOTIFICATIONS.map(notif => (
              <div key={notif.id} className="card-enter" style={{
                background: 'var(--card)', borderRadius: 'var(--radius)',
                border: '1px solid var(--card-border)',
                padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: 12
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{notif.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{notif.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{notif.body}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', flexShrink: 0, marginTop: 2 }}>{notif.time}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
