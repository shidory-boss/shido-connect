'use client'

// ─── MODULE PWA ───────────────────────────────────────────────────────────────

export type PWAModuleSettingType = 'boolean' | 'number' | 'text' | 'select' | 'color'

export interface PWAModuleSettingDef {
  key: string
  type: PWAModuleSettingType
  label: string
  default: unknown
  options?: { value: string; label: string }[] // pour type 'select'
  min?: number
  max?: number
}

export interface PWAModuleManifest {
  key: string                        // identifiant unique ex: 'pwa_booking'
  name: string                       // nom affiché
  description: string
  icon: string                       // emoji
  version: string
  price: number                      // FCFA/mois, 0 = inclus
  avions: string[]                   // ['shido-medical'] ou ['*']
  avironModulePair?: string          // jumeau côté avion ex: 'rdv'

  // Navigation
  navItem?: {
    label: string
    href: string
    position: number                 // ordre dans la bottom nav
  }

  // Home widgets
  homeWidget?: boolean
  homeWidgetOrder?: number
  homeWidgetSize?: 'small' | 'medium' | 'large' | 'full'

  // Settings configurables depuis ShidoStudio
  settings: PWAModuleSettingDef[]

  // Dépendances
  deps?: string[]
}

export interface PWAActiveModule {
  key: string
  settings: Record<string, unknown>  // valeurs configurées dans ShidoStudio
  enabled: boolean
}

// ─── CONFIG PWA ───────────────────────────────────────────────────────────────

export interface PWAConfig {
  clinic_id: number
  clinic_name: string
  logo_url: string | null
  primary_color: string              // couleur accent de la clinique
  secondary_color: string
  theme: 'light' | 'dark' | 'auto'
  welcome_message: string
  contact_phone: string
  contact_address: string
  services: string[]
  opening_hours: Record<string, string>
  pwa_name: string                   // nom affiché sur l'icône home screen
  avion_api_url: string              // URL du backend avion connecté
}

// ─── PATIENT ──────────────────────────────────────────────────────────────────

export interface Patient {
  id: number
  first_name: string
  last_name: string
  phone: string
  email?: string
  date_of_birth?: string
  gender?: 'M' | 'F'
  clinic_id: number
  avatar_url?: string
  avatar?: string | null
}

export interface PatientAuth {
  patient: Patient
  access_token: string
  token_type: string
}

// ─── MESSAGE INTERNE ──────────────────────────────────────────────────────────

export interface ChatMessage {
  id: number
  content: string
  sender_type: 'patient' | 'clinic'
  sender_name: string
  created_at: string
  read_at: string | null
  attachment?: {
    type: 'ordonnance' | 'resultat' | 'devis' | 'facture' | 'image'
    label: string
    url: string
  }
}

export interface ChatThread {
  id: number
  subject: string
  last_message: string
  last_message_at: string
  unread_count: number
  messages: ChatMessage[]
}

// ─── RENDEZ-VOUS ──────────────────────────────────────────────────────────────

export interface Appointment {
  id: number
  date: string
  time: string
  doctor_name: string
  doctor_photo?: string
  service: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'done'
  clinic_name: string
  notes?: string
}

// ─── FILE D'ATTENTE ───────────────────────────────────────────────────────────

export interface QueueEntry {
  id: number
  position: number
  total_in_queue: number
  estimated_wait_minutes: number
  status: 'waiting' | 'called' | 'in_consultation' | 'done'
  called_at?: string
}

// ─── DOCUMENT LIVRÉ ───────────────────────────────────────────────────────────

export type DocumentType = 'ordonnance' | 'resultat' | 'devis' | 'facture' | 'certificat' | 'image'

export interface PatientDocument {
  id: number
  type: DocumentType
  label: string
  date: string
  url: string
  read: boolean
}

// ─── FACTURE / PAIEMENT ───────────────────────────────────────────────────────

export interface Invoice {
  id: number
  reference: string
  amount: number
  paid_amount: number
  balance: number
  status: 'pending' | 'partial' | 'paid'
  date: string
  items: { label: string; amount: number }[]
}
