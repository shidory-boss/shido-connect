/**
 * Gestion des notifications push Web (VAPID)
 * Appelé après login pour enregistrer la subscription
 */

const API_BASE = () =>
  process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001'

export async function setupPushNotifications(): Promise<void> {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    // 1. Demander permission (silencieux si déjà accordée)
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') return

    // 2. Récupérer clé publique VAPID depuis le backend
    const token = localStorage.getItem('sc_token')
    if (!token) return

    const res = await fetch(`${API_BASE()}/api/v1/pwa/push/vapid-key`)
    if (!res.ok) return
    const { publicKey } = await res.json()
    if (!publicKey) return

    // 3. S'abonner via le Service Worker
    const reg = await navigator.serviceWorker.ready
    const existingSub = await reg.pushManager.getSubscription()

    let sub = existingSub
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as ArrayBuffer,
      })
    }

    // 4. Envoyer la subscription au backend
    const subJson = sub.toJSON()
    await fetch(`${API_BASE()}/api/v1/pwa/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        p256dh: (subJson.keys as any)?.p256dh,
        auth: (subJson.keys as any)?.auth,
      }),
    })
  } catch (e) {
    // Non bloquant — push indisponible (HTTP, permission refusée, etc.)
    console.debug('[push] non disponible:', e)
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}
