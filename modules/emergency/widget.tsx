'use client'
export default function EmergencyWidget({ config }: { config?: Record<string,string> }) {
  const color = config?.color || '#EF4444'
  return (
    <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:14,padding:'16px',cursor:'pointer'}} onClick={() => window.location.href='/emergency'}>
      <div style={{fontSize:28,marginBottom:6}}>🚨</div>
      <div style={{fontSize:13,fontWeight:700,color}}>Urgences / SOS</div>
      <div style={{fontSize:11,color:'#64748b',marginTop:2}}>Contacter la clinique</div>
      <button
        onClick={(e) => { e.stopPropagation(); window.location.href='tel:+22500000000' }}
        style={{marginTop:10,background:'#EF4444',color:'#fff',border:'none',borderRadius:8,padding:'6px 12px',fontSize:12,fontWeight:700,cursor:'pointer',width:'100%'}}
      >
        🆘 Appeler
      </button>
    </div>
  )
}
