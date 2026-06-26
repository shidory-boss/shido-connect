'use client'
import { useEffect, useState } from 'react'

export default function ResetCache() {
  const [status, setStatus] = useState('Nettoyage en cours...')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        // 1. Désinscrire tous les service workers
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations()
          await Promise.all(regs.map(r => r.unregister()))
          setStatus(`${regs.length} service worker(s) supprimé(s). Suppression des caches...`)
        }

        // 2. Vider tous les caches
        if ('caches' in window) {
          const keys = await caches.keys()
          await Promise.all(keys.map(k => caches.delete(k)))
          setStatus(`Caches supprimés (${keys.length}). Rechargement...`)
        }

        setDone(true)

        // 3. Rediriger vers l'accueil après 1.5s
        setTimeout(() => {
          window.location.replace('/')
        }, 1500)
      } catch (e) {
        setStatus('Erreur : ' + String(e))
      }
    }
    run()
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', fontFamily: "'Josefin Sans','Nunito',sans-serif",
      padding: 24
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 32px',
        textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,.08)',
        maxWidth: 360, width: '100%'
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>
          {done ? '✅' : '🔄'}
        </div>
        <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
          {done ? 'Cache vidé !' : 'Réinitialisation'}
        </h2>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          {status}
        </p>
        {done && (
          <p style={{ color: '#1D9E75', fontSize: 13, marginTop: 12, fontWeight: 700 }}>
            Redirection vers l&apos;accueil...
          </p>
        )}
      </div>
    </div>
  )
}
