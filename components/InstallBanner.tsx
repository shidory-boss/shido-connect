'use client'
import { useEffect, useState } from 'react'
import { usePWAConfig } from '@/core/PWAConfigContext'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBanner() {
  const { config } = usePWAConfig()
  const accent = config?.primary_color || '#1D9E75'

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showAndroid, setShowAndroid]       = useState(false)
  const [showIOS, setShowIOS]               = useState(false)
  const [dismissed, setDismissed]           = useState(false)
  const [installed, setInstalled]           = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Déjà installée ?
    if (window.matchMedia('(display-mode: standalone)').matches) { setInstalled(true); return }
    // Déjà refusée récemment ?
    const ts = localStorage.getItem('pwa_banner_dismissed')
    if (ts && Date.now() - Number(ts) < 7 * 86400_000) return // 7 jours

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowAndroid(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS Safari (pas de beforeinstallprompt)
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)
    if (isIOS && isSafari) setShowIOS(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    setShowAndroid(false)
    setShowIOS(false)
    setDismissed(true)
    localStorage.setItem('pwa_banner_dismissed', String(Date.now()))
  }

  const installAndroid = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    dismiss()
  }

  if (installed || dismissed || (!showAndroid && !showIOS)) return null

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: 12, right: 12, zIndex: 9999,
      background: '#fff', borderRadius: 18,
      border: `1.5px solid ${accent}30`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      padding: '16px 16px 14px',
      animation: 'slideUp .3s ease',
    }}>
      <style>{`@keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>

      {/* Fermer */}
      <button onClick={dismiss} style={{ position:'absolute', top:10, right:12, background:'none', border:'none', fontSize:18, cursor:'pointer', color:'#94a3b8' }}>×</button>

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${accent},${accent}cc)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🏥</div>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>Installer {config?.pwa_name || config?.clinic_name || 'l\'application'}</div>
          <div style={{ fontSize:12, color:'#64748b' }}>Accès rapide depuis votre écran d'accueil</div>
        </div>
      </div>

      {/* Avantages */}
      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
        {['⚡ Rapide', '📴 Hors-ligne', '🔔 Notifications', '📱 Natif'].map(b => (
          <span key={b} style={{ fontSize:11, background:`${accent}15`, color:accent, padding:'3px 8px', borderRadius:20, fontWeight:600 }}>{b}</span>
        ))}
      </div>

      {/* Android */}
      {showAndroid && (
        <button onClick={installAndroid} style={{
          width:'100%', padding:'12px', background:`linear-gradient(135deg,${accent},${accent}cc)`,
          color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer',
          boxShadow:`0 4px 16px ${accent}40`,
        }}>
          📲 Installer l'application
        </button>
      )}

      {/* iOS */}
      {showIOS && (
        <div style={{ background:'#f8fafc', borderRadius:12, padding:'12px 14px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#0f172a', marginBottom:8 }}>Comment installer :</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[
              { n:1, text:'Appuyez sur  (Partager) en bas de Safari' },
              { n:2, text:'Faites défiler et touchez "Sur l\'écran d\'accueil"' },
              { n:3, text:'Tapez "Ajouter" en haut à droite' },
            ].map(s => (
              <div key={s.n} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:accent, color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{s.n}</div>
                <div style={{ fontSize:12, color:'#475569', lineHeight:1.5 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
