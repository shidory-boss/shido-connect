'use client'
import { useEffect, useState } from 'react'

export interface ClinicConfig {
  clinic_name: string
  pwa_name: string
  primary_color: string
  secondary_color: string
  theme: 'light' | 'dark'
  logo_url: string | null
  welcome_message: string
  contact_phone: string
  contact_address: string
  active_modules: string[]
  // Champs libres configurables par clinique (clé→valeur)
  module_config: Record<string, Record<string, string>>
}

const DEFAULT: ClinicConfig = {
  clinic_name: 'Ma Clinique',
  pwa_name: 'MonEspace Santé',
  primary_color: '#1D9E75',
  secondary_color: '#378ADD',
  theme: 'light',
  logo_url: null,
  welcome_message: 'Bienvenue dans votre espace santé',
  contact_phone: '',
  contact_address: '',
  active_modules: ['pwa_booking','pwa_queue_status','pwa_chat','pwa_payment'],
  module_config: {},
}

export function useClinicConfig() {
  const [config, setConfig] = useState<ClinicConfig>(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_AVION_API_URL || 'http://localhost:8001'
    fetch(`${base}/api/v1/pwa/config/public`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setConfig({ ...DEFAULT, ...data }) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { config, loading }
}
