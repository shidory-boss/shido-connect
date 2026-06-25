'use client'

import { useState, useEffect } from 'react'

type Platform = 'ios' | 'android' | 'desktop'

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'desktop'
}

const IOS_STEPS = [
  { icon: '⬆️', label: 'Bouton partage Safari', desc: 'Appuyez sur l\'icône de partage en bas de Safari' },
  { icon: '📋', label: '"Sur l\'écran d\'accueil"', desc: 'Faites défiler et choisissez cette option' },
  { icon: '✅', label: 'Confirmer', desc: 'Appuyez sur "Ajouter" en haut à droite' },
]

const ANDROID_STEPS = [
  { icon: '⋮', label: 'Menu Chrome', desc: 'Appuyez sur les trois points en haut à droite' },
  { icon: '➕', label: '"Ajouter à l\'écran d\'accueil"', desc: 'Sélectionnez cette option dans le menu' },
  { icon: '✅', label: 'Confirmer', desc: 'Appuyez sur "Ajouter" dans la boîte de dialogue' },
]

export default function WidgetHomePage() {
  const [platform, setPlatform] = useState<Platform>('desktop')
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null)
  const [installed, setInstalled] = useState(false)
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android')

  useEffect(() => {
    setPlatform(detectPlatform())

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> })
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setInstalled(true)
      setDeferredPrompt(null)
    }
  }

  const steps = activeTab === 'ios' ? IOS_STEPS : ANDROID_STEPS

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
      }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}
        >←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Raccourci écran d'accueil</span>
        <span style={{ width: 22 }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: 16 }}>

        {/* Maquette téléphone */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            width: 160, height: 280, borderRadius: 28, border: '6px solid var(--text-primary)',
            background: 'var(--bg2)', position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}>
            {/* Notch */}
            <div style={{
              width: 60, height: 16, background: 'var(--text-primary)',
              borderRadius: '0 0 12px 12px', margin: '0 auto',
            }} />
            {/* Wallpaper */}
            <div style={{ padding: '8px 8px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  height: 44, borderRadius: 10, background: 'var(--card)',
                  border: '1px solid var(--card-border)', opacity: 0.5,
                }} />
              ))}
            </div>
            {/* Widget ShidoConnect */}
            <div style={{
              margin: '10px 8px 0',
              background: 'linear-gradient(135deg, var(--acc) 0%, #0066cc 100%)',
              borderRadius: 14, padding: '10px 12px',
              boxShadow: '0 4px 12px rgba(0,100,255,0.3)',
            }}>
              <div style={{ fontSize: 9, color: '#fff', opacity: 0.8, marginBottom: 2 }}>ShidoConnect</div>
              <div style={{ fontSize: 11, color: '#fff', fontWeight: 800 }}>📱 Accès rapide</div>
              <div style={{ fontSize: 9, color: '#fff', opacity: 0.8, marginTop: 4 }}>RDV · Messages · Résultats</div>
            </div>
            {/* Dock */}
            <div style={{
              position: 'absolute', bottom: 8, left: 8, right: 8,
              height: 44, borderRadius: 14, background: 'var(--card)',
              border: '1px solid var(--card-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}>
              {['📞', '📷', '🌐'].map((icon, i) => (
                <span key={i} style={{ fontSize: 18 }}>{icon}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton principal install */}
        {(deferredPrompt || platform === 'android') && !installed && (
          <button
            onClick={handleInstall}
            disabled={!deferredPrompt}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 'var(--radius)',
              background: deferredPrompt ? 'var(--acc)' : 'var(--bg2)',
              color: deferredPrompt ? '#fff' : 'var(--text-secondary)',
              border: 'none', fontWeight: 800, fontSize: 15, cursor: deferredPrompt ? 'pointer' : 'default',
              marginBottom: 20, fontFamily: 'inherit',
            }}
          >
            {deferredPrompt ? '📲 Ajouter à l\'écran d\'accueil' : '📱 Ouvrez ce site dans Chrome pour installer'}
          </button>
        )}

        {installed && (
          <div className="card-enter" style={{
            background: 'var(--card)', border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius)', padding: '14px 16px',
            marginBottom: 20, textAlign: 'center',
          }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <div style={{ fontWeight: 800, marginTop: 6 }}>Application installée !</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>ShidoConnect est sur votre écran d'accueil</div>
          </div>
        )}

        {/* Tabs iOS / Android */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['android', 'ios'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 'var(--radius)',
                background: activeTab === tab ? 'var(--acc)' : 'var(--card)',
                color: activeTab === tab ? '#fff' : 'var(--text-primary)',
                border: activeTab === tab ? 'none' : '1px solid var(--card-border)',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {tab === 'ios' ? '🍎 iOS (Safari)' : '🤖 Android (Chrome)'}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="stagger">
          {steps.map((step, idx) => (
            <div key={idx} className="card-enter" style={{
              background: 'var(--card)', border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius)', padding: '14px 16px',
              marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--bg2)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>
                  <span style={{ color: 'var(--acc)', marginRight: 6 }}>{idx + 1}.</span>
                  {step.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Info platform */}
        {platform !== 'desktop' && (
          <div style={{
            marginTop: 16, background: 'var(--bg2)', borderRadius: 'var(--radius)',
            padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>ℹ️</span>
            <span>Appareil détecté : <strong>{platform === 'ios' ? 'iOS' : 'Android'}</strong> — suivez les étapes {platform === 'ios' ? 'iOS' : 'Android'} ci-dessus.</span>
          </div>
        )}
      </div>
    </div>
  )
}
