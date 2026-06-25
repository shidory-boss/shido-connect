'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

type Patient = { first_name: string; last_name: string; phone?: string }

export default function ProfilPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const token = localStorage.getItem('sc_token')
  const raw = localStorage.getItem('sc_patient')
  const patient: Patient | null = raw ? JSON.parse(raw) : null

  if (!token || !patient) {
    return (
      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px', textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔐</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', marginBottom:8 }}>Connexion requise</div>
        <div style={{ fontSize:14, color:'#64748b', fontWeight:600, marginBottom:28 }}>Connectez-vous pour accéder à votre espace personnel</div>
        <Link href="/login" style={{ padding:'15px 40px', borderRadius:18, background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', textDecoration:'none', fontSize:15, fontWeight:800, boxShadow:`0 10px 32px rgba(29,158,117,.4)` }}>
          Se connecter
        </Link>
        <Link href="/home" style={{ marginTop:16, fontSize:13, color:'#94a3b8', fontWeight:600, textDecoration:'none' }}>← Retour à l&apos;accueil</Link>
      </div>
    )
  }

  const name = `${patient.first_name} ${patient.last_name}`
  const initials = `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase()

  const logout = () => {
    localStorage.removeItem('sc_token')
    localStorage.removeItem('sc_patient')
    router.push('/login')
  }

  const MENU = [
    { icon:'❤️', label:'Mon Dossier Santé', href:'/records', bg:'#EEF9F5', color:ACC, badge:null },
    { icon:'📅', label:'Mes Rendez-vous', href:'/booking', bg:'#FFF0F5', color:'#EC4899', badge:'2' },
    { icon:'💬', label:'Messages clinique', href:'/chat', bg:'##E8EDF5', color:'#0B1D35', badge:null },
    { icon:'💊', label:'Rappels médicaments', href:'/reminders', bg:'#FFFBEE', color:'#F59E0B', badge:null },
    { icon:'📄', label:'Résultats & Ordonnances', href:'/records', bg:'#F0FFF8', color:'#10B981', badge:null },
    { icon:'🔔', label:'Notifications', href:'/notifications', bg:'#FFF5F5', color:'#EF4444', badge:null },
  ]

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes glow {
          0%,100% { box-shadow:0 0 0 0 rgba(29,158,117,.4); }
          50%      { box-shadow:0 0 0 12px rgba(29,158,117,0); }
        }
        .menu-item { cursor:pointer; transition:all .2s; }
        .menu-item:active { transform:scale(.97) translateX(3px); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {/* HERO PHOTO */}
        <div style={{ position:'relative', height:320, overflow:'hidden' }}>
          <img
            src="/images/Hero 2.png"
            alt="profil"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
          />
          {/* Overlay navy → vert */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(6,15,28,.82) 0%,rgba(11,29,53,.7) 40%,rgba(15,110,86,.75) 100%)' }} />
          {/* Orbe */}
          <div style={{ position:'absolute', top:20, right:-40, width:180, height:180, borderRadius:'50%', background:`rgba(29,158,117,.18)`, pointerEvents:'none' }} />

          {/* Contenu centré */}
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:52, textAlign:'center' }}>
            <div style={{
              width:84, height:84, borderRadius:'50%',
              background:'rgba(255,255,255,.15)',
              border:'3px solid rgba(255,255,255,.35)',
              backdropFilter:'blur(10px)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:28, fontWeight:900, color:'#fff',
              marginBottom:14,
              animation:'glow 2.5s ease-in-out infinite',
              boxShadow:'0 8px 32px rgba(0,0,0,.3)',
            }}>
              {initials}
            </div>
            <div style={{
              fontSize:24, fontWeight:900,
              background:'linear-gradient(90deg,#fff 30%,#a8edda 50%,#fff 70%) 0 0 / 200% auto',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text',
              animation:'shimmer 4s linear infinite',
            }}>
              {name}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', fontWeight:600, marginTop:4 }}>
              {patient.phone || '07 XX XX XX XX'}
            </div>
          </div>
        </div>

        {/* CARD MENU */}
        <div style={{ margin:'0 20px', marginTop:'-36px', background:'#fff', borderRadius:24, overflow:'hidden', boxShadow:'0 16px 48px rgba(0,0,0,.1)', border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .1s both', zIndex:10, position:'relative' }}>
          {MENU.map((item,i) => (
            <Link key={i} href={item.href} style={{ textDecoration:'none' }}>
              <div className="menu-item" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderBottom:i<MENU.length-1?'1px solid #f1f5f9':'none' }}>
                <div style={{ width:44,height:44,borderRadius:14,background:item.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0,boxShadow:`0 2px 8px ${item.color}20` }}>
                  {item.icon}
                </div>
                <div style={{ flex:1, fontSize:14, fontWeight:700, color:'#0f172a' }}>{item.label}</div>
                {item.badge && (
                  <div style={{ padding:'3px 9px', borderRadius:20, background: item.badge==='IA'?`${ACC}20`:'#EF444420', fontSize:11, fontWeight:800, color:item.badge==='IA'?ACC:'#EF4444', flexShrink:0 }}>
                    {item.badge}
                  </div>
                )}
                <div style={{ color:'#cbd5e1', fontSize:16, flexShrink:0 }}>→</div>
              </div>
            </Link>
          ))}
          <div className="menu-item" onClick={logout} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', cursor:'pointer' }}>
            <div style={{ width:44,height:44,borderRadius:14,background:'#FFF0F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>🔴</div>
            <div style={{ flex:1, fontSize:14, fontWeight:700, color:'#EF4444' }}>Se déconnecter</div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ textAlign:'center', padding:'24px 20px', animation:'slideUp .4s ease .3s both' }}>
          <div style={{ fontSize:13, fontWeight:800, color:ACC }}>ShidoConnect</div>
          <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginTop:2 }}>Abidjan, Côte d&apos;Ivoire · v2.0.0</div>
          <div style={{ fontSize:10, color:'#cbd5e1', fontWeight:600, marginTop:2 }}>© 2025 ShidoOS · Tous droits réservés</div>
        </div>
      </div>
    </>
  )
}
