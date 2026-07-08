'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { pwaApi } from '@/lib/pwaApi'
import { useClinicConfig } from '@/lib/useClinicConfig'

interface Doc { id:number; type:'ordonnance'|'resultat'|'compte_rendu'|'autre'; title:string; date:string; url:string; read:boolean }

const TYPE_LABELS: Record<string,{label:string,icon:string,color:string}> = {
  ordonnance:    { label:'Ordonnance',    icon:'💊', color:'var(--accent)' },
  resultat:      { label:'Résultat',      icon:'🔬', color:'#7C3AED' },
  compte_rendu:  { label:'Compte-rendu',  icon:'📝', color:'#0891B2' },
  autre:         { label:'Document',      icon:'📄', color:'#64748b' },
}

export default function DocumentsPage() {
  const router = useRouter()
  const { config } = useClinicConfig()
  const [docs, setDocs] = useState<Doc[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const accent = config?.primary_color || '#0891B2'

  useEffect(() => {
    pwaApi.get('/documents/list').then(r => setDocs(r.data?.documents || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer' }}>←</button>
        <div style={{ fontSize:17, fontWeight:800, color:'#0f172a' }}>Mes documents</div>
      </div>

      <div style={{ padding:'12px 20px', display:'flex', gap:8, overflowX:'auto' }}>
        {['all','ordonnance','resultat','compte_rendu'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'6px 16px', borderRadius:20, border:'none', background:filter===f ? accent : '#e2e8f0', color:filter===f ? '#fff' : '#475569', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
            {f === 'all' ? 'Tous' : TYPE_LABELS[f]?.label}
          </button>
        ))}
      </div>

      <div style={{ padding:'4px 20px 24px' }}>
        {loading && <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Chargement...</div>}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📄</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0f172a' }}>Aucun document</div>
          </div>
        )}
        {filtered.map(doc => {
          const meta = TYPE_LABELS[doc.type] || TYPE_LABELS.autre
          return (
            <a key={doc.id} href={doc.url} target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:14, background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'14px 16px', marginBottom:10, textDecoration:'none', opacity:doc.read ? 0.7 : 1 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${meta.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{meta.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', marginBottom:2 }}>{doc.title}</div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>{meta.label} · {new Date(doc.date).toLocaleDateString('fr-FR')}</div>
              </div>
              {!doc.read && <div style={{ width:8, height:8, borderRadius:'50%', background:accent, flexShrink:0 }} />}
              <span style={{ fontSize:18, color:'#94a3b8' }}>↗</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
