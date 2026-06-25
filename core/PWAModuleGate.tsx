'use client'

import { usePWAModules } from './usePWAModules'

interface PWAModuleGateProps {
  module: string
  children: React.ReactNode
  fallback?: React.ReactNode  // affiché si module inactif (optionnel)
}

// Rend le contenu uniquement si le module est actif pour cette clinique.
// Sinon : null (invisible) ou fallback si fourni.
export function PWAModuleGate({ module, children, fallback = null }: PWAModuleGateProps) {
  const { isActive, loading } = usePWAModules()
  if (loading) return null
  if (!isActive(module)) return <>{fallback}</>
  return <>{children}</>
}
