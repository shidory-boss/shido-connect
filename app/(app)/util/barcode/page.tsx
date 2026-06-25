'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

export default function BarcodePage() {
  const router = useRouter()
  const [patient, setPatient] = useState<{first_name:string, last_name:string, phone?:string} | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem('sc_patient')
    if (raw) setPatient(JSON.parse(raw))
  }, [])

  const name = patient ? `${patient.first_name} ${patient.last_name}` : 'Patient Oria Care'
  const initials = patient ? `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase() : 'PS'
  const patId = patient?.phone ? `SHD-2025-${patient.phone.slice(-4)}` : 'SHD-2025-0001'

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes toastIn {
          from { opacity:0; transform:translateY(20px) scale(.95); }
          to   { opacity:1; transform:none; }
        }
        @keyframes floatBob {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {toast && (
          <div style={{ position:'fixed', bottom:100, left:'50%', transform:'translateX(-50%)', background:'#0f172a', color:'#fff', padding:'12px 24px', borderRadius:20, fontSize:13, fontWeight:700, zIndex:9999, animation:'toastIn .3s ease', whiteSpace:'nowrap' }}>
            {toast}
          </div>
        )}

        {/* HEADER */}
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 24px', borderRadius:'0 0 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>Ma Carte Médicale</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>Identité · QR · Urgences</div>
            </div>
          </div>
        </div>

        <div style={{ padding:'20px' }}>

          {/* CARD IDENTITÉ */}
          <div style={{ background:`linear-gradient(135deg,${ACC2},${ACC})`, borderRadius:24, padding:'24px', marginBottom:16, position:'relative', overflow:'hidden', boxShadow:`0 16px 48px rgba(29,158,117,.4)`, animation:'slideUp .4s ease .05s both' }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.08)', animation:'floatBob 5s ease-in-out infinite', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'-20px', left:'-20px', width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />

            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
              <div style={{ width:60,height:60,borderRadius:'50%',background:'rgba(255,255,255,.2)',border:'3px solid rgba(255,255,255,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:'#fff',flexShrink:0 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>{patId}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', fontWeight:600 }}>📍 Oria Care · Cocody</div>
              </div>
            </div>

            {/* Stats médicales */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
              {[
                { label:'Groupe Sanguin', val:'O+', bg:'rgba(255,255,255,.2)' },
                { label:'Âge', val:'32 ans', bg:'rgba(255,255,255,.15)' },
                { label:'Poids', val:'68 kg', bg:'rgba(255,255,255,.2)' },
              ].map((s,i) => (
                <div key={i} style={{ background:s.bg, borderRadius:14, padding:'10px 8px', textAlign:'center', backdropFilter:'blur(8px)' }}>
                  <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>{s.val}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,.7)', fontWeight:700, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Allergies */}
            <div style={{ background:'rgba(239,68,68,.2)', border:'1px solid rgba(239,68,68,.4)', borderRadius:14, padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:18 }}>⚠️</span>
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'#fff' }}>Allergies connues</div>
                <div style={{ fontSize:12, fontWeight:700, color:'#fca5a5' }}>Pénicilline · Aspirine</div>
              </div>
            </div>
          </div>

          {/* QR CODE */}
          <div style={{ background:'#fff', borderRadius:22, padding:'24px', marginBottom:16, border:'1.5px solid #e2e8f0', textAlign:'center', boxShadow:'0 8px 32px rgba(0,0,0,.08)', animation:'slideUp .4s ease .1s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:4 }}>📱 Scanner à l&apos;accueil</div>
            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:18 }}>Montrez ce QR au personnel médical</div>

            <div style={{ display:'inline-block', padding:16, background:'#fff', borderRadius:16, border:'2px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.08)', animation:'floatBob 4s ease-in-out infinite' }}>
              <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
                <rect width="180" height="180" fill="white"/>
                {/* Coin haut-gauche */}
                <rect x="10" y="10" width="50" height="50" fill="#1D9E75" rx="4"/>
                <rect x="18" y="18" width="34" height="34" fill="white" rx="2"/>
                <rect x="24" y="24" width="22" height="22" fill="#1D9E75" rx="2"/>
                {/* Coin haut-droit */}
                <rect x="120" y="10" width="50" height="50" fill="#1D9E75" rx="4"/>
                <rect x="128" y="18" width="34" height="34" fill="white" rx="2"/>
                <rect x="134" y="24" width="22" height="22" fill="#1D9E75" rx="2"/>
                {/* Coin bas-gauche */}
                <rect x="10" y="120" width="50" height="50" fill="#1D9E75" rx="4"/>
                <rect x="18" y="128" width="34" height="34" fill="white" rx="2"/>
                <rect x="24" y="134" width="22" height="22" fill="#1D9E75" rx="2"/>
                {/* Données centrales */}
                <rect x="70" y="10" width="8" height="8" fill="#1D9E75"/>
                <rect x="82" y="10" width="8" height="8" fill="#1D9E75"/>
                <rect x="94" y="10" width="8" height="8" fill="#1D9E75"/>
                <rect x="70" y="22" width="8" height="8" fill="#1D9E75"/>
                <rect x="94" y="22" width="8" height="8" fill="#1D9E75"/>
                <rect x="82" y="34" width="8" height="8" fill="#1D9E75"/>
                <rect x="70" y="46" width="8" height="8" fill="#1D9E75"/>
                <rect x="94" y="46" width="8" height="8" fill="#1D9E75"/>
                <rect x="70" y="70" width="8" height="8" fill="#1D9E75"/>
                <rect x="94" y="82" width="8" height="8" fill="#1D9E75"/>
                <rect x="106" y="70" width="8" height="8" fill="#1D9E75"/>
                <rect x="70" y="94" width="8" height="8" fill="#1D9E75"/>
                <rect x="106" y="94" width="8" height="8" fill="#1D9E75"/>
                <rect x="82" y="106" width="8" height="8" fill="#1D9E75"/>
                <rect x="70" y="130" width="8" height="8" fill="#1D9E75"/>
                <rect x="94" y="142" width="8" height="8" fill="#1D9E75"/>
                <rect x="106" y="118" width="8" height="8" fill="#1D9E75"/>
                <rect x="118" y="130" width="8" height="8" fill="#1D9E75"/>
                {/* Croix centrale */}
                <rect x="78" y="78" width="24" height="24" fill="white" rx="4"/>
                <text x="90" y="94" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1D9E75" fontFamily="Arial">✚</text>
              </svg>
            </div>

            <div style={{ marginTop:14, fontSize:11, color:'#94a3b8', fontWeight:600 }}>Valide jusqu&apos;au 31/12/2026 · {patId}</div>
          </div>

          {/* URGENCE */}
          <div style={{ background:'#FFF1F2', border:'1.5px solid #FECDD3', borderRadius:18, padding:'16px', marginBottom:20, animation:'slideUp .4s ease .15s both' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:24 }}>🚨</span>
              <div>
                <div style={{ fontSize:13, fontWeight:900, color:'#BE123C' }}>En cas d&apos;urgence</div>
                <div style={{ fontSize:12, color:'#9F1239', fontWeight:600, marginTop:2 }}>Montrez ce QR au personnel pour un accès immédiat à votre dossier médical.</div>
              </div>
            </div>
          </div>

          {/* BOUTONS */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <button onClick={() => showToast('💾 Carte sauvegardée dans vos photos !')} style={{
              padding:'14px', borderRadius:16, background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:`0 6px 18px rgba(29,158,117,.4)`
            }}>
              💾 Sauvegarder
            </button>
            <button onClick={() => showToast('📤 Lien de partage copié !')} style={{
              padding:'14px', borderRadius:16, background:'#fff', border:`2px solid ${ACC}`, color:ACC, fontSize:13, fontWeight:800, cursor:'pointer'
            }}>
              📤 Partager
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
