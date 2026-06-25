'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { PWAConfig } from '@/lib/types'
import { configApi } from '@/lib/api'
import { storage } from '@/lib/storage'

const DEFAULT_CONFIG: PWAConfig = {
  clinic_id: 0,
  clinic_name: 'Oria Care',
  logo_url: null,
  primary_color: '#1D9E75',
  secondary_color: '#166f52',
  theme: 'auto',
  welcome_message: 'Bienvenue',
  contact_phone: '',
  contact_address: '',
  services: [],
  opening_hours: {},
  pwa_name: 'Oria Care',
  avion_api_url: process.env.NEXT_PUBLIC_AVION_API_URL || 'http://localhost:8001',
}

interface PWAConfigContextValue {
  config: PWAConfig
  loading: boolean
  refresh: () => Promise<void>
}

const PWAConfigContext = createContext<PWAConfigContextValue>({
  config: DEFAULT_CONFIG,
  loading: true,
  refresh: async () => {},
})

export function PWAConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PWAConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  const applyConfig = (cfg: PWAConfig) => {
    setConfig(cfg)
    // Injecter les CSS vars
    const root = document.documentElement
    root.style.setProperty('--accent', cfg.primary_color)
    root.style.setProperty('--accent-secondary', cfg.secondary_color)
  }

  const fetchBackground = async () => {
    try {
      const cfg = await configApi.getPublicConfig()
      storage.setConfig(cfg)
      if (cfg.avion_api_url) storage.setAvionUrl(cfg.avion_api_url)
      applyConfig(cfg)
    } catch {
      // Silencieux — on garde le cache existant
    }
  }

  const load = async () => {
    // 1. Cache disponible → affichage instantané, même si stale
    const cached = storage.getConfig()
    if (cached) {
      applyConfig(cached)
      setLoading(false)
      // Toujours rafraîchir en background pour avoir le nom/logo à jour
      fetchBackground()
      return
    }
    // 2. Pas de cache → fetch bloquant (premier lancement)
    try {
      const cfg = await configApi.getPublicConfig()
      storage.setConfig(cfg)
      if (cfg.avion_api_url) storage.setAvionUrl(cfg.avion_api_url)
      applyConfig(cfg)
    } catch {
      // Fallback config par défaut — app démarre quand même
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <PWAConfigContext.Provider value={{ config, loading, refresh: load }}>
      {children}
    </PWAConfigContext.Provider>
  )
}

export const usePWAConfig = () => useContext(PWAConfigContext)
