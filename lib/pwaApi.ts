const BASE = process.env.NEXT_PUBLIC_AVION_API_URL || 'http://localhost:8001'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('pwa_token')
}

async function request(method: string, path: string, body?: unknown) {
  const token = getToken()
  const res = await fetch(`${BASE}/api/v1/pwa${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json().then(data => ({ data }))
}

export const pwaApi = {
  get:   (path: string)                  => request('GET',   path),
  post:  (path: string, body?: unknown)  => request('POST',  path, body),
  patch: (path: string, body?: unknown)  => request('PATCH', path, body),
}
