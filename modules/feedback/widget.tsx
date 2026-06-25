'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { pwaApi } from '@/lib/pwaApi'

export default function FeedbackWidget({ config }: { config?: Record<string,string> }) {
  const [pending, setPending] = useState<number>(0)
  const color = config?.color || '#6366F1'

  useEffect(() => {
    pwaApi.get('/feedback/pending').then(r => setPending(r.data?.count ?? 0)).catch(() => {})
  }, [])

  return (
    <Link href="/feedback" style={{ textDecoration:'none', display:'block', borderRadius:16, background:`linear-gradient(135deg,${color},${color}cc)`, padding:'18px 20px', color:'#fff', minHeight:110 }}>
      <div style={{ fontSize:28, marginBottom:8 }}>✍️</div>
      <div style={{ fontSize:15, fontWeight:800 }}>{config?.label || 'Avis & Satisfaction'}</div>
      <div style={{ fontSize:12, opacity:.75, marginTop:4 }}>
        {pending > 0 ? `${pending} consultation${pending>1?'s':''} à noter` : 'Donnez votre avis'}
      </div>
      {pending > 0 && <div style={{ marginTop:8, display:'inline-block', background:'#FBBF24', color:'#000', borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:700 }}>À noter</div>}
    </Link>
  )
}
