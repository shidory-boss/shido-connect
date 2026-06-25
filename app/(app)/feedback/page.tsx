'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { pwaApi } from '@/lib/pwaApi'
import { useClinicConfig } from '@/lib/useClinicConfig'

interface PendingFeedback { consultation_id:number; date:string; doctor:string; motif:string }

export default function FeedbackPage() {
  const router = useRouter()
  const { config } = useClinicConfig()
  const [pending, setPending] = useState<PendingFeedback[]>([])
  const [current, setCurrent] = useState<PendingFeedback | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<number[]>([])
  const accent = config?.primary_color || '#6366F1'

  useEffect(() => {
    pwaApi.get('/feedback/pending').then(r => setPending(r.data?.consultations || [])).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!current || rating === 0) return
    setSending(true)
    try {
      await pwaApi.post('/feedback/submit', { consultation_id: current.consultation_id, rating, comment })
      setDone(d => [...d, current.consultation_id])
      setCurrent(null); setRating(0); setComment('')
    } catch {}
    setSending(false)
  }

  const remaining = pending.filter(p => !done.includes(p.consultation_id))

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer' }}>←</button>
        <div>
          <div style={{ fontSize:17, fontWeight:800, color:'#0f172a' }}>Avis & Satisfaction</div>
          <div style={{ fontSize:12, color:'#64748b' }}>{remaining.length} avis à laisser</div>
        </div>
      </div>

      <div style={{ padding:'20px' }}>
        {remaining.length === 0 && (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🌟</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>Tout est noté !</div>
            <div style={{ fontSize:13, color:'#64748b', marginTop:6 }}>Merci pour vos retours. Ils nous aident à améliorer nos services.</div>
          </div>
        )}

        {remaining.map(p => (
          <div key={p.consultation_id} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'16px', marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', marginBottom:4 }}>{p.motif}</div>
            <div style={{ fontSize:12, color:'#94a3b8', marginBottom:12 }}>Dr. {p.doctor} · {new Date(p.date).toLocaleDateString('fr-FR')}</div>
            <button onClick={() => setCurrent(p)}
              style={{ width:'100%', background:accent, color:'#fff', border:'none', borderRadius:10, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              ✍️ Laisser mon avis
            </button>
          </div>
        ))}
      </div>

      {current && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:50, display:'flex', alignItems:'flex-end' }} onClick={() => setCurrent(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:'20px 20px 0 0', padding:'24px 20px', width:'100%' }}>
            <div style={{ fontSize:16, fontWeight:800, color:'#0f172a', marginBottom:4 }}>Votre avis</div>
            <div style={{ fontSize:12, color:'#94a3b8', marginBottom:20 }}>Dr. {current.doctor} · {current.motif}</div>

            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#475569', marginBottom:10 }}>Note globale</div>
              <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)}
                    style={{ fontSize:36, background:'none', border:'none', cursor:'pointer', opacity:n<=rating ? 1 : 0.3, transition:'all .15s' }}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Votre commentaire (optionnel)..."
              style={{ width:'100%', minHeight:80, padding:'12px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:13, color:'#0f172a', outline:'none', resize:'none', boxSizing:'border-box', marginBottom:16 }} />

            <button onClick={handleSubmit} disabled={rating===0 || sending}
              style={{ width:'100%', background:rating===0 ? '#e2e8f0' : accent, color:rating===0 ? '#94a3b8' : '#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:800, cursor:rating===0 ? 'not-allowed' : 'pointer' }}>
              {sending ? 'Envoi...' : 'Envoyer mon avis →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
