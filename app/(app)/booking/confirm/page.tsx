'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const CONFETTI_COLORS = ['#1D9E75','#34D399','#60A5FA','#F59E0B','#EC4899','#8B5CF6','#EF4444','#FBBF24']

function Confetti() {
  const pieces = Array.from({ length: 48 }, (_, i) => i)
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:999 }}>
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-40px) rotate(0deg) scale(1); opacity:1; }
          80%  { opacity:1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(.4); opacity:0; }
        }
        @keyframes sway {
          0%,100% { margin-left:0; }
          25%  { margin-left:20px; }
          75%  { margin-left:-20px; }
        }
      `}</style>
      {pieces.map(i => {
        const color  = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        const left   = (i * 2.1 + (i % 7) * 3) % 100
        const delay  = (i * 0.07) % 2.4
        const dur    = 2.2 + (i % 5) * 0.3
        const size   = 6 + (i % 4) * 3
        const isRect = i % 3 !== 0
        return (
          <div key={i} style={{
            position:'absolute',
            left:`${left}%`,
            top:0,
            width: isRect ? size : size + 2,
            height: isRect ? size * 0.5 : size + 2,
            background: color,
            borderRadius: isRect ? 2 : '50%',
            animation:`fall ${dur}s ${delay}s ease-in forwards, sway ${dur * 0.6}s ${delay}s ease-in-out infinite`,
            opacity:0,
          }} />
        )
      })}
    </div>
  )
}

export default function BookingConfirmPage() {
  const router = useRouter()
  const [data, setData]       = useState<any>(null)
  const [showConf, setShowConf] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('sc_booking_data')
    if (raw) setData(JSON.parse(raw))
    // Lance confettis après 200ms
    const t = setTimeout(() => setShowConf(true), 200)
    // Arrête après 4s
    const t2 = setTimeout(() => setShowConf(false), 4400)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  const fmtDate = (iso: string) => {
    if (!iso) return '—'
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  }


  return (
    <>
      {showConf && <Confetti />}

      <style>{`
        @keyframes popIn {
          0%   { opacity:0; transform:scale(0) rotate(-15deg); }
          60%  { transform:scale(1.15) rotate(5deg); }
          100% { opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes pulse {
          0%,100% { box-shadow:0 0 0 0 rgba(29,158,117,.4); }
          50%     { box-shadow:0 0 0 18px rgba(29,158,117,0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>

      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(180deg,#ecfdf5 0%,#f0faf6 40%,#fff 100%)',
        fontFamily:'Nunito,system-ui,sans-serif',
        display:'flex', flexDirection:'column', alignItems:'center',
        padding:'60px 20px 120px', textAlign:'center',
      }}>

        {/* Badge succès animé */}
        <div style={{
          width:110, height:110, borderRadius:'50%',
          background:`linear-gradient(135deg,${ACC2},${ACC})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:52, marginBottom:24,
          animation:'popIn .7s cubic-bezier(.34,1.56,.64,1) both, pulse 2.5s 1s ease-in-out infinite',
          boxShadow:`0 20px 60px rgba(29,158,117,.35)`,
        }}>✅</div>

        {/* Titre */}
        <div style={{
          fontSize:26, fontWeight:900, marginBottom:6,
          background:`linear-gradient(90deg,${ACC2} 0%,#34D399 50%,${ACC} 100%) 0 0 / 200% auto`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          animation:'shimmer 3s linear infinite, slideUp .4s ease .3s both',
          opacity:0, animationFillMode:'both',
        }}>
          Rendez-vous enregistré !
        </div>

        <div style={{ fontSize:13, color:'#64748b', fontWeight:700, marginBottom:8, animation:'slideUp .4s ease .45s both', opacity:0, animationFillMode:'both' }}>
          Votre demande a bien été transmise au cabinet
        </div>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:6,
          background:'#FEF3C7', borderRadius:20, padding:'6px 14px',
          fontSize:12, fontWeight:800, color:'#D97706',
          marginBottom:28, animation:'slideUp .4s ease .55s both', opacity:0, animationFillMode:'both',
        }}>
          ⏳ Confirmation du cabinet sous 24h
        </div>

        {/* Récapitulatif */}
        {data && (
          <div style={{
            background:'#fff', borderRadius:22, padding:'20px',
            width:'100%', maxWidth:380,
            border:'1.5px solid #e2e8f0',
            boxShadow:'0 12px 40px rgba(0,0,0,.08)',
            textAlign:'left',
            animation:'slideUp .4s ease .6s both', opacity:0, animationFillMode:'both',
            marginBottom:20,
          }}>
            <div style={{ fontSize:12, fontWeight:900, color:ACC, marginBottom:14, letterSpacing:'.5px' }}>
              📋 RÉCAPITULATIF
            </div>
            {[
              { label:'Patient',  val:`${data.first_name || ''} ${data.last_name || ''}`.trim() || '—', icon:'👤' },
              { label:'Médecin',  val:data.doctor_name || 'Oria Care',                                    icon:'👨‍⚕️' },
              { label:'Motif',    val:data.motif || 'Consultation générale',                             icon:'🩺' },
              { label:'Date',     val:fmtDate(data.rdv_date),                                            icon:'📅' },
              { label:'Heure',    val:data.rdv_time || '—',                                              icon:'🕐' },
              { label:'Assurance',val:data.assurance || 'Non renseignée',                               icon:'🛡️' },
            ].map((r, i, arr) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'10px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{r.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.5px' }}>{r.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', marginTop:1 }}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voir mes RDV */}
        <button onClick={() => router.push('/booking')} style={{
          width:'100%', maxWidth:380, padding:'16px',
          background:'#EEF9F5',
          border:`1.5px solid ${ACC}44`, borderRadius:18,
          fontSize:15, fontWeight:900, color:ACC,
          cursor:'pointer',
          marginBottom:12,
          animation:'slideUp .4s ease .75s both', opacity:0, animationFillMode:'both',
        }}>
          📅 Prendre un autre rendez-vous
        </button>

        {/* Payer + retour */}
        <button onClick={() => router.push('/payment')} style={{
          width:'100%', maxWidth:380, padding:'16px',
          background:`linear-gradient(135deg,${ACC2},${ACC})`,
          border:'none', borderRadius:18,
          fontSize:15, fontWeight:900, color:'#fff', cursor:'pointer',
          boxShadow:`0 8px 24px rgba(29,158,117,.3)`,
          marginBottom:12,
          animation:'slideUp .4s ease .85s both', opacity:0, animationFillMode:'both',
        }}>
          💳 Payer maintenant
        </button>

        <div onClick={() => router.push('/home')} style={{
          fontSize:13, color:'#94a3b8', fontWeight:700,
          cursor:'pointer', textDecoration:'underline',
          animation:'slideUp .4s ease .9s both', opacity:0, animationFillMode:'both',
        }}>
          Payer plus tard — Retour à l&apos;accueil
        </div>
      </div>
    </>
  )
}
