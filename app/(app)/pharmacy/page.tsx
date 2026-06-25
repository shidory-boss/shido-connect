'use client'
import { useEffect, useState } from 'react'
import { useClinicConfig } from '@/lib/useClinicConfig'
import { pwaApi } from '@/lib/pwaApi'

export default function PharmacyPage() {
  const { config } = useClinicConfig()
  const accent = config?.primary_color || '#16A34A'
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pwaApi.get('/pharmacy/prescriptions').then(r => { setItems(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',padding:'20px 16px',fontFamily:'system-ui'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button onClick={() => history.back()} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>←</button>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:'#0f172a'}}>🏪 Pharmacie</div>
          <div style={{fontSize:12,color:'#64748b'}}>Vos ordonnances</div>
        </div>
      </div>
      {loading && <div style={{textAlign:'center',padding:40,color:'#94a3b8'}}>Chargement...</div>}
      {!loading && items.length === 0 && (
        <div style={{textAlign:'center',padding:40,background:'#fff',borderRadius:16,border:'1px solid #e2e8f0'}}>
          <div style={{fontSize:48,marginBottom:12}}>🏪</div>
          <div style={{fontSize:16,fontWeight:700,color:'#0f172a'}}>Aucune ordonnance</div>
          <div style={{fontSize:13,color:'#64748b',marginTop:4}}>Vos ordonnances apparaîtront ici</div>
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{background:'#fff',borderRadius:14,padding:16,marginBottom:12,border:'1px solid #e2e8f0'}}>
          <div style={{fontSize:14,fontWeight:700,color:'#0f172a'}}>{item.name || 'Ordonnance'}</div>
          <div style={{fontSize:12,color:'#64748b'}}>{item.date || ''}</div>
          {item.status && (
            <div style={{marginTop:6,fontSize:11,fontWeight:600,color:item.status === 'dispensed' ? '#16A34A' : '#F59E0B',background:item.status === 'dispensed' ? 'rgba(22,163,74,0.1)' : 'rgba(245,158,11,0.1)',borderRadius:6,padding:'2px 8px',display:'inline-block'}}>
              {item.status === 'dispensed' ? 'Délivrée' : 'En attente'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
