'use client'
import { clinicConfig } from '@/chassis.config'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { chatApi } from '@/lib/api'

const ACC  = clinicConfig.accent
const ACC2 = clinicConfig.accentDark

type Msg = {
  id: number
  content: string
  sender_type: 'patient' | 'clinic'
  sender_name: string
  created_at: string | null
}

// Canaux statiques read-only (rdv, résultats)
const STATIC_META: Record<string, { name: string; subtitle: string; avatar: string; color: string; messages: { id:number; sender_type:'clinic'; sender_name:string; content:string; created_at:string|null }[] }> = {
  rdv: {
    name: 'Rendez-vous', subtitle: 'Confirmations & rappels automatiques',
    avatar: '📅', color: '#F59E0B',
    messages: [
      { id: 1, sender_type:'clinic', sender_name:'Système', content:'📅 Vos confirmations de rendez-vous et rappels automatiques apparaîtront ici.', created_at: null },
    ],
  },
  results: {
    name: 'Résultats & Documents', subtitle: 'Ordonnances, bilans, analyses',
    avatar: '📋', color: '#0B1D35',
    messages: [
      { id: 1, sender_type:'clinic', sender_name:'Système', content:'📋 Vos résultats d\'analyses, ordonnances et bilans médicaux apparaîtront ici.', created_at: null },
    ],
  },
}

function fmtTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatThreadPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const isStatic  = id === 'rdv' || id === 'results'
  const staticMeta = isStatic ? STATIC_META[id] : null

  const [mounted,   setMounted]   = useState(false)
  const [messages,  setMessages]  = useState<Msg[]>([])
  const [text,      setText]      = useState('')
  const [sending,   setSending]   = useState(false)
  const [threadId,  setThreadId]  = useState<number | null>(null)
  const [patient,   setPatient]   = useState<{first_name:string;last_name:string;phone:string} | null>(null)
  const [clinicName, setClinicName] = useState('Votre clinique')
  const [recording, setRecording] = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const wsRef      = useRef<WebSocket | null>(null)
  const srRef      = useRef<any>(null)

  const startRecording = () => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const sr = new SR()
    sr.lang = 'fr-FR'
    sr.continuous = false
    sr.interimResults = false
    sr.onresult = (e: any) => {
      const transcript: string = e.results[0]?.[0]?.transcript || ''
      if (transcript) setText(prev => prev ? `${prev} ${transcript}` : transcript)
    }
    sr.onend = () => setRecording(false)
    sr.onerror = () => setRecording(false)
    srRef.current = sr
    sr.start()
    setRecording(true)
  }

  const stopRecording = () => {
    srRef.current?.stop()
    srRef.current = null
    setRecording(false)
  }
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadMessages = async (tid: number) => {
    try {
      const list: Msg[] = await chatApi.getMessages(tid) as Msg[]
      setMessages(list)
      chatApi.markRead(tid).catch(() => {})
    } catch { /* backend indisponible */ }
  }

  const ensureThread = async (): Promise<number | null> => {
    try {
      const list = await chatApi.getThreads()
      if (list.length > 0) return list[0].id
      const t = await chatApi.createThread('Votre clinique', '')
      return t.id
    } catch { return null }
  }

  const connectWS = (tid: number) => {
    // Construire l'URL WebSocket depuis l'URL API HTTP(S)
    const base = (process.env.NEXT_PUBLIC_MEDICAL_API || localStorage.getItem('sc_avion_url') || 'http://localhost:8000')
      .replace(/^https/, 'wss').replace(/^http/, 'ws')
    const token = localStorage.getItem('sc_token') || ''
    const ws = new WebSocket(`${base}/api/v1/pwa/chat/ws/${tid}?token=${token}`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      try {
        const msg: Msg = JSON.parse(e.data)
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev
          return [...prev, msg]
        })
        chatApi.markRead(tid).catch(() => {})
      } catch { /* message malformé */ }
    }

    ws.onerror = () => {
      // Fallback polling si WS non supporté par le backend
      if (!pollRef.current) {
        pollRef.current = setInterval(() => loadMessages(tid), 5000)
      }
    }

    ws.onclose = () => {
      wsRef.current = null
      // Reconnexion automatique après 3s si pas de polling actif
      if (!pollRef.current) {
        setTimeout(() => connectWS(tid), 3000)
      }
    }
  }

  useEffect(() => {
    setMounted(true)
    if (isStatic && staticMeta) {
      setMessages(staticMeta.messages)
      return
    }

    const raw = localStorage.getItem('sc_patient')
    if (raw) {
      const p = JSON.parse(raw)
      setPatient(p)
    }
    const cfg = (() => { try { return JSON.parse(localStorage.getItem('sc_config') || 'null') } catch { return null } })()
    if (cfg?.clinic_name) setClinicName(cfg.clinic_name)

    const numId = parseInt(id)
    const resolved = !isNaN(numId) ? numId : null

    const init = async () => {
      const tid = resolved ?? await ensureThread()
      if (!tid) return
      setThreadId(tid)
      await loadMessages(tid)
      connectWS(tid)
    }
    init()

    return () => {
      wsRef.current?.close()
      wsRef.current = null
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!mounted) return null

  const send = async () => {
    if (!text.trim() || sending) return
    const token = typeof window !== 'undefined' ? localStorage.getItem('sc_token') : null
    if (!token) { router.push('/login'); return }

    const tid = threadId ?? await ensureThread()
    if (!tid) return
    if (!threadId) setThreadId(tid)

    setSending(true)
    const content = text.trim()
    setText('')

    // Optimistic update
    const tempMsg: Msg = {
      id: Date.now(), content, sender_type: 'patient',
      sender_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Moi',
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      await chatApi.send(tid, content)
      await loadMessages(tid)
    } catch {
      // garde le message optimiste
    }
    setSending(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const meta = isStatic && staticMeta ? staticMeta : {
    name: clinicName, subtitle: 'Médecins · Secrétariat · Support',
    avatar: '🏥', color: ACC,
  }
  const c = meta.color
  const NAV_CLEARANCE = 16

  return (
    <>
      <style>{`
        @keyframes msgIn { from{opacity:0;transform:translateY(6px) scale(.98)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        #chat-scroll::-webkit-scrollbar { display:none; }
        #chat-scroll { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <div style={{ position:'fixed', top:0, bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:420, display:'flex', flexDirection:'column', background:'#eef2f7', fontFamily:'Nunito,system-ui,sans-serif', zIndex:600 }}>

        {/* HEADER */}
        <div style={{ background:`linear-gradient(135deg,${ACC2},${c})`, paddingTop:'env(safe-area-inset-top,44px)', padding:'44px 16px 12px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 4px 20px rgba(0,0,0,.18)', flexShrink:0 }}>
          <button onClick={() => router.push('/chat')} style={{ background:'rgba(255,255,255,.2)', border:'none', borderRadius:12, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer', color:'#fff', flexShrink:0 }}>←</button>
          <div style={{ width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
            {meta.avatar}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>{meta.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.75)', fontWeight:600 }}>
              {isStatic ? meta.subtitle : '● En ligne · répond rapidement'}
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div id="chat-scroll" style={{ flex:1, overflowY:'auto', padding:`12px 12px ${NAV_CLEARANCE + 72}px` }}>

          {messages.length === 0 && !isStatic && (
            <div style={{ textAlign:'center', padding:'40px 20px', color:'#94a3b8' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>Démarrez la conversation</div>
              <div style={{ fontSize:12, fontWeight:600 }}>Envoyez un message à votre clinique</div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.sender_type === 'patient'
            return (
              <div key={msg.id} style={{ display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom:6, animation:`msgIn .22s ease ${Math.min(i,4)*0.05}s both` }}>
                <div style={{ maxWidth:'78%', background: isMe ? `linear-gradient(135deg,${c},${ACC2})` : '#fff', color: isMe ? '#fff' : '#1e293b', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding:'10px 14px', boxShadow:'0 2px 10px rgba(0,0,0,.08)', fontSize:14, fontWeight:600, lineHeight:1.5 }}>
                  {!isMe && <div style={{ fontSize:10, fontWeight:800, color: c, marginBottom:4, opacity:.85 }}>{msg.sender_name}</div>}
                  {msg.content}
                  <div style={{ fontSize:10, textAlign:'right', marginTop:4, fontWeight:500, color: isMe ? 'rgba(255,255,255,.65)' : '#94a3b8' }}>
                    {fmtTime(msg.created_at)}{isMe && ' ✓'}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={{ position:'absolute', bottom:`calc(${NAV_CLEARANCE}px + env(safe-area-inset-bottom,0px))`, left:12, right:12 }}>
          {isStatic ? (
            <div style={{ background:'rgba(255,255,255,.92)', backdropFilter:'blur(16px)', borderRadius:22, padding:'14px 20px', textAlign:'center', fontSize:13, fontWeight:700, color:'#94a3b8', boxShadow:'0 4px 20px rgba(0,0,0,.1)' }}>
              🔔 Canal en lecture seule — messages automatiques
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1, background:'rgba(255,255,255,.95)', backdropFilter:'blur(16px)', borderRadius:26, padding:'11px 18px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 20px rgba(0,0,0,.12)', border:'1px solid rgba(0,0,0,.06)' }}>
                <input
                  ref={inputRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Écrire un message…"
                  style={{ flex:1, border:'none', outline:'none', background:'none', fontSize:14, fontFamily:'Nunito,system-ui,sans-serif', fontWeight:600, color:'#1e293b' }}
                />
              </div>
              {text.trim() ? (
                <button onClick={send} disabled={sending} style={{ width:50, height:50, borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#fff', boxShadow:`0 4px 16px ${ACC}55`, opacity: sending ? .7 : 1 }}>
                  ➤
                </button>
              ) : (
                <button onClick={() => recording ? stopRecording() : startRecording()} style={{ width:50, height:50, borderRadius:'50%', flexShrink:0, background: recording ? 'linear-gradient(135deg,#ef4444,#dc2626)' : `linear-gradient(135deg,${ACC2},${ACC})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: recording ? '0 4px 20px rgba(239,68,68,.5)' : `0 4px 16px ${ACC}55`, animation: recording ? 'pulse 1s ease-in-out infinite' : 'none', transition:'background .2s,box-shadow .2s' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="8" y="1" width="8" height="13" rx="4" fill="white" opacity=".95"/>
                    <path d="M5 10a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".95"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="9" y1="21" x2="15" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
