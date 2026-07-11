// Wrapper fetch vers le backend avion connecté (ShidoMedical, ShidoBiz, etc.)

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sc_avion_url')
    const onLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    // En production, ignorer toute URL localhost stockée en localStorage
    if (stored && (onLocalhost || (!stored.includes('localhost') && !stored.includes('127.0.0.1')))) {
      return stored
    }
  }
  return process.env.NEXT_PUBLIC_MEDICAL_API || process.env.NEXT_PUBLIC_AVION_API_URL || 'http://localhost:8001'
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('sc_token')
  if (!token) return null
  // Vérification expiration JWT (payload base64)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('sc_token')
      localStorage.removeItem('sc_patient')
      if (typeof window !== 'undefined') window.location.href = '/login'
      return null
    }
  } catch { /* token malformé — on le garde, le backend rejettera */ }
  return token
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  public?: boolean   // true = pas de token requis
  silent401?: boolean // true = 401 lance une erreur sans logout/redirect
}

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const base = getBaseUrl()
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (!opts.public && token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${base}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })

  if (res.status === 401) {
    if (!opts.silent401 && typeof window !== 'undefined') {
      localStorage.removeItem('sc_token')
      localStorage.removeItem('sc_patient')
      window.location.href = '/login'
    }
    throw new Error('Non authentifié')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Erreur serveur' }))
    throw new Error(err.detail || `Erreur ${res.status}`)
  }

  return res.json()
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (phone: string, password: string) =>
    apiFetch<{ access_token: string; patient: import('./types').Patient }>(
      '/api/v1/pwa/auth/login',
      { method: 'POST', body: { phone, password }, public: true }
    ),
  register: (data: { first_name: string; last_name: string; phone: string; password: string }) =>
    apiFetch<{ access_token: string; patient: import('./types').Patient }>(
      '/api/v1/pwa/auth/register',
      { method: 'POST', body: data, public: true }
    ),
  me: () => apiFetch<import('./types').Patient>('/api/v1/pwa/auth/me'),
}

// ─── CONFIG & MODULES ─────────────────────────────────────────────────────────

export const configApi = {
  getPublicConfig: () =>
    apiFetch<import('./types').PWAConfig>('/api/v1/pwa/config/public', { public: true }),
  getActiveModules: () =>
    apiFetch<import('./types').PWAActiveModule[]>('/api/v1/pwa/modules/active', { silent401: true }),
}

// ─── RDV PUBLIC (sans auth) ───────────────────────────────────────────────────

export const publicAppointmentApi = {
  getDoctors: () =>
    apiFetch<{ id: number; first_name: string; last_name: string; specialite?: string; img?: string }[]>(
      '/api/v1/appointments/public/doctors', { public: true }
    ),
  create: (data: {
    patient_name: string
    patient_phone: string
    doctor_id?: number | null
    reason?: string
    scheduled_at: string
    clinic_id?: number | null
    patient_blood_group?: string
    patient_insurance?: string
    patient_city?: string
    patient_commune?: string
    patient_quartier?: string
    notes?: string
    patient_signature?: string
  }) =>
    apiFetch<{ status: string; id: number }>(
      '/api/v1/appointments/public', { method: 'POST', body: data, public: true }
    ),
}

// ─── RENDEZ-VOUS ──────────────────────────────────────────────────────────────

export const bookingApi = {
  getSlots: (date: string, doctor_id?: number) =>
    apiFetch<{ date: string; slots: string[] }[]>(`/api/v1/pwa/booking/slots?date=${date}${doctor_id ? `&doctor_id=${doctor_id}` : ''}`),
  getMyAppointments: () =>
    apiFetch<import('./types').Appointment[]>('/api/v1/pwa/booking/my'),
  create: (data: { date: string; time: string; service: string; doctor_id?: number; notes?: string }) =>
    apiFetch<import('./types').Appointment>('/api/v1/pwa/booking/create', { method: 'POST', body: data }),
  cancel: (id: number) =>
    apiFetch<void>(`/api/v1/pwa/booking/${id}/cancel`, { method: 'PATCH' }),
}

// ─── FILE D'ATTENTE ───────────────────────────────────────────────────────────

export const queueApi = {
  getStatus: () =>
    apiFetch<import('./types').QueueEntry | null>('/api/v1/pwa/queue/my-status'),
  checkin: (data: { reason: string }) =>
    apiFetch<import('./types').QueueEntry>('/api/v1/pwa/queue/checkin', { method: 'POST', body: data }),
}

// ─── CHAT INTERNE ─────────────────────────────────────────────────────────────

export const chatApi = {
  getThreads: () =>
    apiFetch<import('./types').ChatThread[]>('/api/v1/pwa/chat/threads'),
  getMessages: (threadId: number) =>
    apiFetch<import('./types').ChatMessage[]>(`/api/v1/pwa/chat/threads/${threadId}/messages`),
  send: (threadId: number, content: string) =>
    apiFetch<import('./types').ChatMessage>(`/api/v1/pwa/chat/threads/${threadId}/send`, {
      method: 'POST', body: { content }
    }),
  createThread: (subject: string, first_message: string) =>
    apiFetch<import('./types').ChatThread>('/api/v1/pwa/chat/threads', {
      method: 'POST', body: { subject, content: first_message || ' ', first_message }
    }),
  markRead: (threadId: number) =>
    apiFetch<void>(`/api/v1/pwa/chat/threads/${threadId}/read`, { method: 'PATCH' }),
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────

export const documentsApi = {
  getAll: () =>
    apiFetch<import('./types').PatientDocument[]>('/api/v1/pwa/documents'),
}

// ─── PAIEMENT ─────────────────────────────────────────────────────────────────

export const paymentApi = {
  getInvoices: () =>
    apiFetch<import('./types').Invoice[]>('/api/v1/pwa/payment/invoices'),
  initPay: (invoice_id: number, method: 'wave' | 'orange_money' | 'mtn_momo') =>
    apiFetch<{ payment_url: string; reference: string }>(
      '/api/v1/pwa/payment/init',
      { method: 'POST', body: { invoice_id, method } }
    ),
}
