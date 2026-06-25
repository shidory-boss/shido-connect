'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { pwaApi } from '@/lib/pwaApi'

export default function DocumentsWidget({ config }: { config?: Record<string,string> }) {
  const [unread, setUnread] = useState<number | null>(null)
  const color = config?.color || '#0891B2'

  useEffect(() => {
    pwaApi.get('/documents/list').then(r => setUnread(r.data?.unread ?? 0)).catch(() => setUnread(0))
  }, [])

  return (
    <Link href="/documents" style={{ textDecoration:'none', display:'block', borderRadius:16, background:`linear-gradient(135deg,${color},${color}cc)`, padding:'18px 20px', color:'#fff', minHeight:110 }}>
      <div style={{ fontSize:28, marginBottom:8 }}>📄</div>
      <div style={{ fontSize:15, fontWeight:800 }}>{config?.label || 'Mes documents'}</div>
      <div style={{ fontSize:12, opacity:.75, marginTop:4 }}>
        {unread === null ? '...' : unread > 0 ? `${unread} nouveau${unread>1?'x':''} document${unread>1?'s':''}` : 'Ordonnances & résultats'}
      </div>
      {unread && unread > 0 ? <div style={{ marginTop:8, display:'inline-block', background:'#EF4444', borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:700 }}>+{unread} nouveau</div> : null}
    </Link>
  )
}
