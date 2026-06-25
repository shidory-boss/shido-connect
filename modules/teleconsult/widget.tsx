'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { pwaApi } from '@/lib/pwaApi'

export default function TeleconsultWidget({ config }: { config?: Record<string,string> }) {
  const [next, setNext] = useState<string | null>(null)
  const color = config?.color || '#DC2626'

  useEffect(() => {
    pwaApi.get('/teleconsult/next').then(r => setNext(r.data?.scheduled_at ?? null)).catch(() => {})
  }, [])

  return (
    <Link href="/teleconsult" style={{ textDecoration:'none', display:'block', borderRadius:16, background:`linear-gradient(135deg,${color},${color}cc)`, padding:'18px 20px', color:'#fff', minHeight:110 }}>
      <div style={{ fontSize:28, marginBottom:8 }}>🎥</div>
      <div style={{ fontSize:15, fontWeight:800 }}>{config?.label || 'Téléconsultation'}</div>
      <div style={{ fontSize:12, opacity:.75, marginTop:4 }}>
        {next ? `Prochaine : ${new Date(next).toLocaleDateString('fr-FR')}` : 'Consulter en vidéo'}
      </div>
    </Link>
  )
}
