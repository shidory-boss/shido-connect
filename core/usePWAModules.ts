'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PWAActiveModule } from '@/lib/types'
import { configApi } from '@/lib/api'
import { storage } from '@/lib/storage'

interface UsePWAModulesReturn {
  modules: PWAActiveModule[]
  loading: boolean
  isActive: (key: string) => boolean
  getSettings: <T = Record<string, unknown>>(key: string) => T
  refresh: () => Promise<void>
}

const DEFAULT_MODULES: PWAActiveModule[] = [
  { key: 'pwa_booking',      enabled: true, settings: {} },
  { key: 'pwa_chat',         enabled: true, settings: {} },
  { key: 'pwa_records',      enabled: true, settings: {} },
]

// pwa_queue_status → pwa_chat : File d'attente remplacée par Messagerie dans la nav
function migrateModules(mods: PWAActiveModule[]): PWAActiveModule[] {
  return mods.map(m => m.key === 'pwa_queue_status' ? { ...m, key: 'pwa_chat' } : m)
}

export function usePWAModules(): UsePWAModulesReturn {
  const [modules, setModules] = useState<PWAActiveModule[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    // 1. Cache
    const cached = storage.getModules()
    if (cached) {
      setModules(migrateModules(cached))
      setLoading(false)
      return
    }
    // 2. Backend
    try {
      const token = storage.getToken()
      if (!token) { setModules(DEFAULT_MODULES); setLoading(false); return }
      const active = await configApi.getActiveModules()
      storage.setModules(active)
      setModules(migrateModules(active))
    } catch {
      setModules(DEFAULT_MODULES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const isActive = useCallback(
    (key: string) => modules.some(m => m.key === key && m.enabled),
    [modules]
  )

  const getSettings = useCallback(
    <T = Record<string, unknown>>(key: string): T => {
      const mod = modules.find(m => m.key === key)
      return (mod?.settings || {}) as T
    },
    [modules]
  )

  return { modules, loading, isActive, getSettings, refresh: load }
}
