'use client'
export default function PharmacyWidget({ config }: { config?: Record<string,string> }) {
  const color = config?.color || '#16A34A'
  return (
    <div style={{background:'rgba(22,163,74,0.08)',border:'1px solid rgba(22,163,74,0.2)',borderRadius:14,padding:'16px',cursor:'pointer'}} onClick={() => window.location.href='/pharmacy'}>
      <div style={{fontSize:28,marginBottom:6}}>🏪</div>
      <div style={{fontSize:13,fontWeight:700,color}}>Pharmacie</div>
      <div style={{fontSize:11,color:'#64748b',marginTop:2}}>Ordonnances en cours</div>
    </div>
  )
}
