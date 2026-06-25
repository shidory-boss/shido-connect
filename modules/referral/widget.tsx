'use client'
export default function ReferralWidget({ config }: { config?: Record<string,string> }) {
  const color = config?.color || '#EC4899'
  return (
    <div style={{background:'rgba(236,72,153,0.08)',border:'1px solid rgba(236,72,153,0.2)',borderRadius:14,padding:'16px',cursor:'pointer'}} onClick={() => window.location.href='/referral'}>
      <div style={{fontSize:28,marginBottom:6}}>🎁</div>
      <div style={{fontSize:13,fontWeight:700,color}}>Parrainage</div>
      <div style={{fontSize:11,color:'#64748b',marginTop:2}}>Invitez un proche</div>
    </div>
  )
}
