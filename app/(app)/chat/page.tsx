'use client'
import { clinicConfig } from '@/chassis.config'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LOGO = '/images/Logo Oria Care 512 par 512.png'

const ACC  = clinicConfig.accent
const ACC2 = clinicConfig.accentDark

type RealThread = {
  id: number
  subject: string
  last_message: string | null
  last_message_at: string | null
  unread_count: number
}

// Canal "Clinique" réel + canaux informatifs statiques
const STATIC_CHANNELS = [
  {
    id: 'rdv',
    name: 'Rendez-vous',
    subtitle: 'Confirmations & rappels automatiques',
    avatar: '📅',
    color: '#F59E0B',
    lastMessage: 'Vos confirmations de rendez-vous apparaissent ici.',
    readOnly: true,
  },
  {
    id: 'results',
    name: 'Résultats & Documents',
    subtitle: 'Ordonnances, bilans, analyses',
    avatar: '📋',
    color: '#0B1D35',
    lastMessage: 'Vos résultats médicaux apparaissent ici.',
    readOnly: true,
  },
]

function fmtTime(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  if (diff < 172800000) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function ChatPage() {
  const [mounted, setMounted]     = useState(false)
  const [search, setSearch]       = useState('')
  const [thread, setThread]       = useState<RealThread | null>(null)
  const [loggedIn, setLoggedIn]   = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('sc_token')
    if (!token) { setLoggedIn(false); return }
    setLoggedIn(true)

    import('@/lib/api').then(({ chatApi }) => {
      chatApi.getThreads()
        .then((list: RealThread[]) => { if (list.length > 0) setThread(list[0]) })
        .catch(() => {})
    })
  }, [])

  if (!mounted) return null

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .thread-row:active { background:#f0faf6!important; }
        input::placeholder { color:rgba(255,255,255,0.6); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:100 }}>

        {/* HERO avec logo clinique */}
        <div style={{ position:'relative', background:`linear-gradient(160deg,rgba(6,15,28,.96) 0%,rgba(11,29,53,.92) 45%,${ACC2}EE 100%)`, padding:'48px 20px 20px', display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:`${ACC}18`, pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-20, left:-20, width:100, height:100, borderRadius:'50%', background:`${ACC}10`, pointerEvents:'none' }} />
          {/* Logo clinique */}
          <div style={{ width:72, height:72, borderRadius:'50%', border:`2.5px solid ${ACC}88`, overflow:'hidden', marginBottom:12, boxShadow:`0 0 0 6px ${ACC}22, 0 8px 32px rgba(0,0,0,.4)` }}>
            <Image src={LOGO} alt="logo" width={72} height={72} style={{ objectFit:'cover', width:'100%', height:'100%' }} />
          </div>
          <div style={{ fontSize:11, fontWeight:800, color:'#a8edda', letterSpacing:'2px', textTransform:'uppercase', marginBottom:4 }}>Messagerie sécurisée</div>
          <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:16 }}>Messages</div>
          {/* Barre de recherche */}
          <div style={{ width:'100%', background:'rgba(255,255,255,0.12)', backdropFilter:'blur(10px)', borderRadius:20, padding:'10px 16px', display:'flex', alignItems:'center', gap:10, border:'1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize:16, opacity:.7 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une conversation…" style={{ flex:1, background:'none', border:'none', outline:'none', fontSize:14, color:'#fff', fontFamily:'Nunito,system-ui,sans-serif', fontWeight:600 }} />
          </div>
        </div>

        <div style={{ background:'#fff' }}>

          {/* ── CANAL CLINIQUE RÉEL ── */}
          {loggedIn ? (
            <Link href={`/chat/${thread?.id ?? 'new'}`} style={{ textDecoration:'none' }}>
              <div className="thread-row" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom:'1px solid #f1f5f9', cursor:'pointer', animation:'fadeIn .3s ease both' }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{ width:54, height:54, borderRadius:'50%', border:`2px solid ${ACC}66`, overflow:'hidden' }}>
                    <Image src={LOGO} alt="logo" width={54} height={54} style={{ objectFit:'cover', width:'100%', height:'100%' }} />
                  </div>
                  <div style={{ position:'absolute', bottom:2, right:2, width:13, height:13, borderRadius:'50%', background:'#22c55e', border:'2.5px solid #fff' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
                    <div style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>Votre clinique</div>
                    <div style={{ fontSize:11, fontWeight: (thread?.unread_count ?? 0) > 0 ? 700 : 500, color: (thread?.unread_count ?? 0) > 0 ? ACC : '#94a3b8', flexShrink:0, marginLeft:8 }}>
                      {fmtTime(thread?.last_message_at ?? null)}
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:4 }}>Médecins · Secrétariat · Support</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ fontSize:13, color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                      {thread?.last_message ?? 'Démarrez une conversation avec votre clinique'}
                    </div>
                    {(thread?.unread_count ?? 0) > 0 && (
                      <div style={{ flexShrink:0, marginLeft:8, minWidth:20, height:20, borderRadius:10, background:ACC, color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 6px' }}>
                        {thread!.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/login" style={{ textDecoration:'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom:'1px solid #f1f5f9', background:'#f0faf6' }}>
                <div style={{ width:54, height:54, borderRadius:'50%', background:`${ACC}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🔐</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>Connexion requise</div>
                  <div style={{ fontSize:12, color:'#64748b', fontWeight:600, marginTop:2 }}>Connectez-vous pour accéder à vos messages</div>
                </div>
              </div>
            </Link>
          )}

          {/* ── CANAUX STATIQUES ── */}
          {STATIC_CHANNELS.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map((ch, i) => (
            <Link key={ch.id} href={`/chat/${ch.id}`} style={{ textDecoration:'none' }}>
              <div className="thread-row" style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 20px', borderBottom:'1px solid #f1f5f9', cursor:'pointer', animation:`fadeIn .3s ease ${(i+1)*0.07}s both` }}>
                <div style={{ width:54, height:54, borderRadius:'50%', background:`${ch.color}22`, border:`2px solid ${ch.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                  {ch.avatar}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2 }}>
                    <div style={{ fontSize:15, fontWeight:800, color:'#0f172a' }}>{ch.name}</div>
                    <div style={{ fontSize:11, color:'#94a3b8' }}>—</div>
                  </div>
                  <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:4 }}>{ch.subtitle}</div>
                  <div style={{ fontSize:13, color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ch.lastMessage}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* error supprimé — backend indisponible ne doit pas perturber le patient */}

        <div style={{ margin:'12px 20px', padding:'12px 16px', background:'#EEF9F5', borderRadius:14, border:`1px solid ${ACC}22` }}>
          <div style={{ fontSize:12, fontWeight:700, color:ACC }}>
            🔒 Vos messages sont privés. Seuls votre médecin et le secrétariat peuvent vous répondre.
          </div>
        </div>
      </div>
    </>
  )
}
