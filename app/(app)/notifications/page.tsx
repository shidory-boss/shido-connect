'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

type Notif = { id:number; icon:string; title:string; body:string; time:string; read:boolean; color:string }

const INITIAL_NOTIFS: Notif[] = [
  { id:1, icon:'📅', title:'Rappel Rendez-vous', body:'RDV avec Dr. Shidory demain à 10:00. Cocody, Oria Care.', time:'Il y a 2 heures', read:false, color:'#0B1D35' },
  { id:2, icon:'✅', title:'Résultats Disponibles', body:'Vos résultats d\'analyse sanguine (NFS) sont disponibles dans votre espace.', time:'Il y a 5 heures', read:false, color:'#10B981' },
  { id:3, icon:'💊', title:'Rappel Médicament', body:'N\'oubliez pas votre Paracétamol 500mg ce soir à 20:00.', time:'Il y a 8 heures', read:false, color:'#8B5CF6' },
  { id:4, icon:'⭐', title:'Évaluez votre Consultation', body:'Comment s\'est passée votre consultation avec Dr. Yan ?', time:'Hier', read:true, color:'#F59E0B' },
  { id:5, icon:'🎉', title:'Bienvenue chez ShidoConnect !', body:'Votre compte est créé avec succès. Prenez bien soin de vous.', time:'Il y a 3 jours', read:true, color:ACC },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS)

  const markRead = (id: number) => setNotifs(ns => ns.map(n => n.id===id ? {...n,read:true} : n))
  const markAllRead = () => setNotifs(ns => ns.map(n => ({...n,read:true})))
  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:none; }
        }
        .notif-item { cursor:pointer; transition:all .2s; }
        .notif-item:hover { transform:translateX(4px); }
        .notif-item:active { transform:scale(.98); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 24px', borderRadius:'0 0 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>Notifications</div>
              {unreadCount > 0 && <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>{unreadCount} non lue{unreadCount>1?'s':''}</div>}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ padding:'8px 14px', borderRadius:12, background:'rgba(255,255,255,.2)', border:'1.5px solid rgba(255,255,255,.3)', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer' }}>
                Tout lire
              </button>
            )}
          </div>
        </div>

        <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:12 }}>
          {notifs.map((n, i) => (
            <div key={n.id} className="notif-item" onClick={() => markRead(n.id)} style={{
              background:'#fff', borderRadius:18, padding:'16px',
              display:'flex', alignItems:'flex-start', gap:12,
              border:`1.5px solid ${n.read ? '#e2e8f0' : `${n.color}40`}`,
              borderLeft:`4px solid ${n.read ? '#e2e8f0' : n.color}`,
              boxShadow: n.read ? '0 2px 8px rgba(0,0,0,.04)' : `0 4px 16px ${n.color}20`,
              animation:`slideUp .4s ease ${i*0.05}s both`,
              opacity: n.read ? 0.75 : 1,
            }}>
              <div style={{ width:48,height:48,borderRadius:16,background:`${n.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>
                {n.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <div style={{ fontSize:13, fontWeight:900, color:'#0f172a', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</div>
                  {!n.read && <div style={{ width:8,height:8,borderRadius:'50%',background:n.color,flexShrink:0 }}/>}
                </div>
                <div style={{ fontSize:12, color:'#475569', fontWeight:600, lineHeight:1.5 }}>{n.body}</div>
                <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, marginTop:6 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
