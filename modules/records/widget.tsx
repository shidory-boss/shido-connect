'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { pwaApi } from '@/lib/pwaApi'

export default function RecordsWidget({ config }: { config?: Record<string,string> }) {
  const [count, setCount] = useState<number | null>(null)
  const color = config?.color || '#7C3AED'

  useEffect(() => {
    pwaApi.get('/records/summary').then(r => setCount(r.data?.total_visits ?? 0)).catch(() => setCount(0))
  }, [])

  return (
    <Link href="/records" style={{ textDecoration:'none', display:'block', borderRadius:16, background:`linear-gradient(135deg,${color},${color}cc)`, padding:'18px 20px', color:'#fff', minHeight:110 }}>
      <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
      <div style={{ fontSize:15, fontWeight:800 }}>{config?.label || 'Mon dossier'}</div>
      <div style={{ fontSize:12, opacity:.75, marginTop:4 }}>
        {count === null ? '...' : `${count} consultation${count>1?'s':''} enregistrée${count>1?'s':''}`}
      </div>
    </Link>
  )
}
