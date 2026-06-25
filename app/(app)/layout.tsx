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
