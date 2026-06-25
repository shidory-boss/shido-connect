'use client'
import { useEffect, useState } from 'react'
import { useClinicConfig } from '@/lib/useClinicConfig'
import { pwaApi } from '@/lib/pwaApi'

export default function LabResultsPage() {
  const { config } = useClinicConfig()
  const accent = config?.primary_color || '#059669'
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pwaApi.get('/lab-results').then(r => { setItems(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',padding:'20px 16px',fontFamily:'system-ui'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button onClick={() => history.back()} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>←</button>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:'#0f172a'}}>🔬 Résultats labo</div>
          <div style={{fontSize:12,color:'#64748b'}}>Vos analyses biologiques</div>
        </div>
      </div>
      {loading && <div style={{textAlign:'center',padding:40,color:'#94a3b8'}}>Chargement...</div>}
      {!loading && items.length === 0 && (
        <div style={{textAlign:'center',padding:40,background:'#fff',borderRadius:16,border:'1px solid #e2e8f0'}}>
          <div style={{fontSize:48,marginBottom:12}}>🔬</div>
          <div style={{fontSize:16,fontWeight:700,color:'#0f172a'}}>Aucun résultat</div>
          <div style={{fontSize:13,color:'#64748b',marginTop:4}}>Vos résultats apparaîtront ici</div>
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{background:'#fff',borderRadius:14,padding:16,marginBottom:12,border:'1px solid #e2e8f0'}}>
          <div style={{fontSize:14,fontWeight:700,color:'#0f172a'}}>{item.name || 'Analyse'}</div>
          <div style={{fontSize:12,color:'#64748b'}}>{item.date || ''}</div>
        </div>
      ))}
    </div>
  )
}
