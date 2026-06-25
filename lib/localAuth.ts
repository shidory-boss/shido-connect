// Authentification locale — fonctionne sans backend
// Les comptes et données sont stockés dans localStorage, indexés par numéro de téléphone

export type LocalPatient = {
  id: string
  phone: string
  first_name: string
  last_name: string
  email?: string
  birth_date?: string
  gender?: 'M' | 'F' | ''
  blood_type?: string
  height?: string
  weight?: string
  allergies?: string
  chronic_conditions?: string
  current_medications?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  avatar_url?: string
  created_at: string
}

type LocalAccount = {
  patient: LocalPatient
  password_hash: string
}

const ACCOUNTS_KEY = 'sc_local_accounts'
const DATA_KEY_PREFIX = 'sc_health_'
const LOCAL_TOKEN_PREFIX = 'local_'

function simpleHash(str: string): string {
  // Hash simple mais suffisant pour usage local (pas envoyé réseau)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

function getAccounts(): Record<string, LocalAccount> {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}') } catch { return {} }
}

function saveAccounts(accounts: Record<string, LocalAccount>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export const localAuth = {
  register(phone: string, password: string, first_name: string, last_name: string): LocalPatient {
    const accounts = getAccounts()
    const normalized = phone.replace(/\s/g, '')
    if (accounts[normalized]) throw new Error('Ce numéro est déjà utilisé')

    const patient: LocalPatient = {
      id: 'local_' + normalized,
      phone: normalized,
      first_name,
      last_name,
      email: '',
      birth_date: '',
      gender: '',
      blood_type: '',
      height: '',
      weight: '',
      allergies: '',
      chronic_conditions: '',
      current_medications: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      avatar_url: '',
      created_at: new Date().toISOString(),
    }

    accounts[normalized] = { patient, password_hash: simpleHash(password + normalized) }
    saveAccounts(accounts)
    return patient
  },

  login(phone: string, password: string): LocalPatient {
    const accounts = getAccounts()
    const normalized = phone.replace(/\s/g, '')
    const account = accounts[normalized]
    if (!account) throw new Error('Compte introuvable. Créez un compte.')
    if (account.password_hash !== simpleHash(password + normalized)) throw new Error('Mot de passe incorrect')
    return account.patient
  },

  updatePatient(phone: string, updates: Partial<LocalPatient>) {
    const accounts = getAccounts()
    const normalized = phone.replace(/\s/g, '')
    if (!accounts[normalized]) return
    accounts[normalized].patient = { ...accounts[normalized].patient, ...updates }
    saveAccounts(accounts)
    return accounts[normalized].patient
  },

  getPatient(phone: string): LocalPatient | null {
    const accounts = getAccounts()
    return accounts[phone.replace(/\s/g, '')]?.patient || null
  },

  makeToken(phone: string): string {
    return LOCAL_TOKEN_PREFIX + simpleHash(phone + Date.now())
  },

  isLocalToken(token: string): boolean {
    return token.startsWith(LOCAL_TOKEN_PREFIX)
  },
}

// Données santé persistantes — séparées du compte pour pouvoir les étendre
const HEALTH_KEY = (phone: string) => DATA_KEY_PREFIX + phone.replace(/\s/g, '')

export type HealthData = {
  appointments: unknown[]
  lab_results: unknown[]
  medications: unknown[]
  documents: unknown[]
  symptom_diary: unknown[]
  last_updated: string
}

export const healthStore = {
  get(phone: string): HealthData {
    try {
      const raw = localStorage.getItem(HEALTH_KEY(phone))
      return raw ? JSON.parse(raw) : healthStore.empty()
    } catch { return healthStore.empty() }
  },

  save(phone: string, data: Partial<HealthData>) {
    const current = healthStore.get(phone)
    localStorage.setItem(HEALTH_KEY(phone), JSON.stringify({
      ...current,
      ...data,
      last_updated: new Date().toISOString(),
    }))
  },

  empty(): HealthData {
    return {
      appointments: [],
      lab_results: [],
      medications: [],
      documents: [],
      symptom_diary: [],
      last_updated: new Date().toISOString(),
    }
  },
}
