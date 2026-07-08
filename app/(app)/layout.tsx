'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import BottomNav from '@/components/shell/BottomNav'
import InstallBanner from '@/components/InstallBanner'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullScreen = pathname.startsWith('/chat/')

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    }
  }, [])

  // Transition jour/nuit douce — palette change selon l'heure
  useEffect(() => {
    const applyTimeTheme = () => {
      const h = new Date().getHours()
      const isNight = h >= 19 || h < 6
      const isSunset = h === 18
      let accent = 'var(--accent)'
      let bg = '#f0faf6'
      if (isNight)       { accent = 'var(--accent-dark)'; bg = '#0a1628' }
      else if (isSunset) { accent = '#16835f'; bg = '#0f2a1e' }
      document.documentElement.style.setProperty('--accent', accent)
      document.documentElement.style.setProperty('--bg-app', bg)
      document.documentElement.style.setProperty('--transition', 'background-color 1.8s ease, color 1.8s ease')
    }
    applyTimeTheme()
    const t = setInterval(applyTimeTheme, 60_000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="app-outer">
      <div className="app-shell">
        <main style={{ paddingBottom: isFullScreen ? 0 : 'calc(68px + env(safe-area-inset-bottom) + 28px)' }}>
          {children}
        </main>
        {!isFullScreen && <BottomNav />}
        <InstallBanner />
      </div>
    </div>
  )
}
