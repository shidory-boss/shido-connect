'use client'
export default function LabResultsWidget({ config }: { config?: Record<string,string> }) {
  const color = config?.color || '#059669'
  return (
    <div style={{background:'rgba(5,150,105,0.08)',border:'1px solid rgba(5,150,105,0.2)',borderRadius:14,padding:'16px',cursor:'pointer'}} onClick={() => window.location.href='/lab-results'}>
      <div style={{fontSize:28,marginBottom:6}}>🔬</div>
      <div style={{fontSize:13,fontWeight:700,color}}>Résultats labo</div>
      <div style={{fontSize:11,color:'#64748b',marginTop:2}}>Analyses disponibles</div>
    </div>
  )
}
