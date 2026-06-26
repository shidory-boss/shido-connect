import type { Patient, PWAConfig, PWAActiveModule } from './types'

const KEYS = {
  TOKEN: 'sc_token',
  PATIENT: 'sc_patient',
  CONFIG: 'sc_config',
  MODULES: 'sc_modules',
  AVION_URL: 'sc_avion_url',
  CONFIG_TTL: 'sc_config_ttl',
  MODULES_TTL: 'sc_modules_ttl',
  THEME: 'sc_theme',
  ONBOARDING: 'sc_onboarding_done',
  LAST_TAB: 'sc_last_tab',
  NOTIF_READ: 'sc_notif_read',
  CHAT_DRAFT: 'sc_chat_draft',
  PREFS: 'sc_prefs',
}

const TTL_MS = 30 * 60 * 1000 // 30 minutes

function isExpired(ttlKey: string): boolean {
  const ttl = localStorage.getItem(ttlKey)
  if (!ttl) return true
  return Date.now() > parseInt(ttl)
}

export const storage = {
  // Auth
  setToken: (token: string) => localStorage.setItem(KEYS.TOKEN, token),
  getToken: (): string | null => localStorage.getItem(KEYS.TOKEN),
  clearToken: () => localStorage.removeItem(KEYS.TOKEN),

  setPatient: (p: Patient) => localStorage.setItem(KEYS.PATIENT, JSON.stringify(p)),
  getPatient: (): Patient | null => {
    const raw = localStorage.getItem(KEYS.PATIENT)
    try { return raw ? JSON.parse(raw) : null } catch { return null }
  },
  clearPatient: () => localStorage.removeItem(KEYS.PATIENT),

  // Config — retourne la valeur même expirée (stale-while-revalidate)
  setConfig: (config: PWAConfig) => {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config))
    localStorage.setItem(KEYS.CONFIG_TTL, String(Date.now() + TTL_MS))
  },
  getConfig: (): PWAConfig | null => {
    const raw = localStorage.getItem(KEYS.CONFIG)
    try { return raw ? JSON.parse(raw) : null } catch { return null }
  },
  isConfigStale: (): boolean => {
    const ttl = localStorage.getItem(KEYS.CONFIG_TTL)
    if (!ttl) return true
    return Date.now() > parseInt(ttl)
  },

  // Modules actifs — retourne la valeur même expirée (stale-while-revalidate)
  setModules: (modules: PWAActiveModule[]) => {
    localStorage.setItem(KEYS.MODULES, JSON.stringify(modules))
    localStorage.setItem(KEYS.MODULES_TTL, String(Date.now() + TTL_MS))
  },
  getModules: (): PWAActiveModule[] | null => {
    const raw = localStorage.getItem(KEYS.MODULES)
    try { return raw ? JSON.parse(raw) : null } catch { return null }
  },
  isModulesStale: (): boolean => {
    const ttl = localStorage.getItem(KEYS.MODULES_TTL)
    if (!ttl) return true
    return Date.now() > parseInt(ttl)
  },

  // URL du backend avion connecté
  setAvionUrl: (url: string) => localStorage.setItem(KEYS.AVION_URL, url),
  getAvionUrl: (): string | null => localStorage.getItem(KEYS.AVION_URL),

  // Thème
  setTheme: (t: string) => localStorage.setItem(KEYS.THEME, t),
  getTheme: (): string => localStorage.getItem(KEYS.THEME) || 'light',

  // Onboarding
  setOnboardingDone: () => localStorage.setItem(KEYS.ONBOARDING, '1'),
  isOnboardingDone: (): boolean => localStorage.getItem(KEYS.ONBOARDING) === '1',

  // Dernier onglet actif
  setLastTab: (t: string) => localStorage.setItem(KEYS.LAST_TAB, t),
  getLastTab: (): string => localStorage.getItem(KEYS.LAST_TAB) || 'home',

  // Notifications lues
  markNotifRead: (id: string) => {
    try {
      const a = JSON.parse(localStorage.getItem(KEYS.NOTIF_READ) || '[]')
      if (!a.includes(id)) { a.push(id); localStorage.setItem(KEYS.NOTIF_READ, JSON.stringify(a)) }
    } catch { localStorage.setItem(KEYS.NOTIF_READ, JSON.stringify([id])) }
  },
  isNotifRead: (id: string): boolean => {
    try { return JSON.parse(localStorage.getItem(KEYS.NOTIF_READ) || '[]').includes(id) } catch { return false }
  },

  // Brouillon chat
  saveChatDraft: (m: string) => localStorage.setItem(KEYS.CHAT_DRAFT, m),
  getChatDraft: (): string => localStorage.getItem(KEYS.CHAT_DRAFT) || '',
  clearChatDraft: () => localStorage.removeItem(KEYS.CHAT_DRAFT),

  // Préférences utilisateur
  setPrefs: (p: Record<string, unknown>) => {
    try {
      const e = JSON.parse(localStorage.getItem(KEYS.PREFS) || '{}')
      localStorage.setItem(KEYS.PREFS, JSON.stringify({ ...e, ...p }))
    } catch { localStorage.setItem(KEYS.PREFS, JSON.stringify(p)) }
  },
  getPrefs: (): Record<string, unknown> => {
    try { return JSON.parse(localStorage.getItem(KEYS.PREFS) || '{}') } catch { return {} }
  },

  // Déconnexion auth uniquement
  clearAuth: () => {
    localStorage.removeItem(KEYS.TOKEN)
    localStorage.removeItem(KEYS.PATIENT)
  },

  // Logout complet
  clearAll: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
}
