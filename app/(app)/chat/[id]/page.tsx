'use client'
import { clinicConfig } from '@/chassis.config'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { chatApi, apiFetch } from '@/lib/api'

const ACC  = clinicConfig.accent
const ACC2 = clinicConfig.accentDark
const LOGO = '/images/Logo Oria Care 512 par 512.png'

type Msg = {
  id: number
  content: string
  sender_type: 'patient' | 'clinic'
  sender_name: string
  created_at: string | null
  attachment?: { type: string; label: string; url: string } | null
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

// Son de notification (bip doux)
function playMsgSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.35)
  } catch { /* navigateur non supporté */ }
}

export default function ChatThreadPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const isStatic  = id === 'rdv' || id === 'results'
  const staticMeta = isStatic ? STATIC_META[id] : null

  const [mounted,    setMounted]    = useState(false)
  const [messages,   setMessages]   = useState<Msg[]>([])
  const [text,       setText]       = useState('')
  const [sending,    setSending]    = useState(false)
  const [threadId,   setThreadId]   = useState<number | null>(null)
  const [patient,    setPatient]    = useState<{first_name:string;last_name:string;phone:string} | null>(null)
  const [clinicName, setClinicName] = useState(clinicConfig.name || 'Votre clinique')
  const [recording,  setRecording]  = useState(false)
  const [audioBlob,  setAudioBlob]  = useState<Blob | null>(null)
  const [uploading,  setUploading]  = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const wsRef      = useRef<WebSocket | null>(null)
  const srRef      = useRef<any>(null)
  const mediaRef   = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevCountRef = useRef(0)

  // ── Recording voix ──────────────────────────────────────────
  const startAudioRec = async () => {
    try {
      if (!navigator.mediaDevices) {
        alert('Le microphone nécessite HTTPS. Accédez à l\'app via https:// pour envoyer des audios.')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunks.current = []
      const mr = new MediaRecorder(stream)
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunks.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRef.current = mr
      mr.start()
      setRecording(true)
    } catch { /* micro refusé */ }
  }

  const stopAudioRec = () => {
    mediaRef.current?.stop()
    mediaRef.current = null
    setRecording(false)
  }

  // ── Charger messages ────────────────────────────────────────
  const loadMessages = async (tid: number) => {
    try {
      const list: Msg[] = await chatApi.getMessages(tid) as Msg[]
      setMessages(prev => {
        if (list.length > prev.length) {
          // Nouveaux messages côté clinique → son
          const newMsgs = list.slice(prev.length)
          if (newMsgs.some(m => m.sender_type === 'clinic')) playMsgSound()
        }
        return list
      })
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
    const base = (process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001')
      .replace(/^https/, 'wss').replace(/^http/, 'ws')
    const token = localStorage.getItem('sc_token') || ''
    const ws = new WebSocket(`${base}/api/v1/pwa/chat/ws/${tid}?token=${token}`)
    wsRef.current = ws
    ws.onmessage = (e) => {
      try {
        const msg: Msg = JSON.parse(e.data)
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev
          if (msg.sender_type === 'clinic') playMsgSound()
          return [...prev, msg]
        })
        chatApi.markRead(tid).catch(() => {})
      } catch { /* message malformé */ }
    }
    ws.onerror = () => {
      if (!pollRef.current) pollRef.current = setInterval(() => loadMessages(tid), 5000)
    }
    ws.onclose = () => {
      wsRef.current = null
      if (!pollRef.current) setTimeout(() => connectWS(tid), 3000)
    }
  }

  useEffect(() => {
    setMounted(true)
    if (isStatic && staticMeta) { setMessages(staticMeta.messages); return }
    const raw = localStorage.getItem('sc_patient')
    if (raw) setPatient(JSON.parse(raw))
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

  // ── Envoyer texte ───────────────────────────────────────────
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
    const tempMsg: Msg = {
      id: Date.now(), content, sender_type: 'patient',
      sender_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Moi',
      created_at: new Date().toISOString(), attachment: null,
    }
    setMessages(prev => [...prev, tempMsg])
    try {
      await chatApi.send(tid, content)
      await loadMessages(tid)
    } catch { /* garde le message optimiste */ }
    setSending(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── Envoyer vocal (audio blob) ──────────────────────────────
  const sendVoice = async () => {
    if (!audioBlob || uploading) return
    const tid = threadId ?? await ensureThread()
    if (!tid) return
    if (!threadId) setThreadId(tid)
    setUploading(true)
    const fd = new FormData()
    fd.append('file', audioBlob, 'voice.webm')
    fd.append('thread_id', String(tid))
    fd.append('type', 'audio')
    try {
      const base = process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001'
      const token = localStorage.getItem('sc_token') || ''
      const res = await fetch(`${base}/api/v1/pwa/chat/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, {
          id: Date.now(), content: '🎤 Message vocal', sender_type: 'patient',
          sender_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Moi',
          created_at: new Date().toISOString(),
          attachment: { type: 'audio', label: 'Message vocal', url: data.url },
        }])
        await loadMessages(tid)
      }
    } catch { /* upload échoué */ }
    setAudioBlob(null)
    setUploading(false)
  }

  // ── Envoyer fichier ─────────────────────────────────────────
  const sendFile = async (file: File) => {
    const tid = threadId ?? await ensureThread()
    if (!tid) return
    if (!threadId) setThreadId(tid)
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('thread_id', String(tid))
    fd.append('type', file.type.startsWith('image/') ? 'image' : 'document')
    try {
      const base = process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001'
      const token = localStorage.getItem('sc_token') || ''
      const res = await fetch(`${base}/api/v1/pwa/chat/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      if (res.ok) {
        const data = await res.json()
        const isImg = file.type.startsWith('image/')
        setMessages(prev => [...prev, {
          id: Date.now(),
          content: isImg ? '🖼️ Image' : `📎 ${file.name}`,
          sender_type: 'patient',
          sender_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Moi',
          created_at: new Date().toISOString(),
          attachment: { type: isImg ? 'image' : 'document', label: file.name, url: data.url },
        }])
        await loadMessages(tid)
      }
    } catch { /* upload échoué */ }
    setUploading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const clinicLogoSrc = clinicConfig.name ? LOGO : '/icons/icon-192x192.png'
  const meta = isStatic && staticMeta ? staticMeta : {
    name: clinicName, subtitle: 'Médecins · Secrétariat · Support',
    avatar: null, color: ACC,
  }
  const c = meta.color

  return (
    <>
      <style>{`
        @keyframes msgIn { from{opacity:0;transform:translateY(6px) scale(.98)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes recPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.6)} 70%{box-shadow:0 0 0 10px rgba(239,68,68,0)} }
        #chat-scroll::-webkit-scrollbar { display:none; }
        #chat-scroll { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <div style={{ position:'fixed', top:0, bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:420, display:'flex', flexDirection:'column', background:'#eef2f7', fontFamily:'Nunito,system-ui,sans-serif', zIndex:600 }}>

        {/* HEADER */}
        <div style={{ background:`linear-gradient(135deg,${ACC2},${c})`, paddingTop:'env(safe-area-inset-top,44px)', padding:'44px 16px 12px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 4px 20px rgba(0,0,0,.18)', flexShrink:0 }}>
          <button onClick={() => router.push('/chat')} style={{ background:'rgba(255,255,255,.2)', border:'none', borderRadius:12, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer', color:'#fff', flexShrink:0 }}>←</button>
          <div style={{ width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,.15)', border:'2px solid rgba(255,255,255,.35)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
            {isStatic
              ? <span style={{ fontSize:18 }}>{(meta as any).avatar}</span>
              : <Image src={clinicLogoSrc} alt="logo" width={42} height={42} style={{ objectFit:'cover', borderRadius:'50%' }} />
            }
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>{meta.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.75)', fontWeight:600 }}>
              {isStatic ? meta.subtitle : '● En ligne · répond rapidement'}
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div id="chat-scroll" style={{ flex:1, overflowY:'auto', padding:'12px 12px 88px' }}>

          {messages.length === 0 && !isStatic && (
            <div style={{ textAlign:'center', padding:'40px 20px', color:'#94a3b8' }}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:`${ACC}15`, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                <Image src={clinicLogoSrc} alt="logo" width={60} height={60} style={{ objectFit:'cover' }} />
              </div>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:6 }}>Démarrez la conversation</div>
              <div style={{ fontSize:12, fontWeight:600 }}>Envoyez un message à votre clinique</div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.sender_type === 'patient'
            return (
              <div key={msg.id} style={{ display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom:8, animation:`msgIn .22s ease ${Math.min(i,4)*0.05}s both` }}>
                {!isMe && (
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`${c}22`, border:`1.5px solid ${c}44`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0, marginRight:6, alignSelf:'flex-end' }}>
                    <Image src={clinicLogoSrc} alt="logo" width={28} height={28} style={{ objectFit:'cover' }} />
                  </div>
                )}
                <div style={{ maxWidth:'72%', background: isMe ? `linear-gradient(135deg,${c},${ACC2})` : '#fff', color: isMe ? '#fff' : '#1e293b', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding:'10px 14px', boxShadow:'0 2px 10px rgba(0,0,0,.08)', fontSize:14, fontWeight:600, lineHeight:1.55 }}>
                  {!isMe && <div style={{ fontSize:10, fontWeight:800, color: c, marginBottom:4, opacity:.85 }}>{msg.sender_name}</div>}

                  {/* Attachment */}
                  {msg.attachment?.type === 'image' && (
                    <a href={msg.attachment.url} target="_blank" rel="noreferrer" style={{ display:'block', marginBottom:6 }}>
                      <img src={msg.attachment.url} alt={msg.attachment.label} style={{ maxWidth:'100%', borderRadius:10, display:'block' }} />
                    </a>
                  )}
                  {msg.attachment?.type === 'audio' && (
                    <audio controls src={msg.attachment.url} style={{ width:'100%', marginBottom:6, borderRadius:8 }} />
                  )}
                  {msg.attachment?.type === 'document' && (
                    <a href={msg.attachment.url} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, background: isMe ? 'rgba(255,255,255,.2)' : `${c}15`, padding:'8px 10px', borderRadius:10, textDecoration:'none', marginBottom:6 }}>
                      <span style={{ fontSize:20 }}>📎</span>
                      <span style={{ fontSize:12, fontWeight:700, color: isMe ? '#fff' : '#1e293b', wordBreak:'break-all' }}>{msg.attachment.label}</span>
                    </a>
                  )}

                  {/* Texte */}
                  <div style={{ whiteSpace:'pre-wrap', wordBreak:'break-word', overflowWrap:'anywhere' }}>{msg.content}</div>
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
        <div style={{ flexShrink:0, padding:'8px 12px', background:'#eef2f7', paddingBottom:'calc(8px + env(safe-area-inset-bottom,0px))' }}>
          {isStatic ? (
            <div style={{ background:'rgba(255,255,255,.92)', backdropFilter:'blur(16px)', borderRadius:22, padding:'14px 20px', textAlign:'center', fontSize:13, fontWeight:700, color:'#94a3b8', boxShadow:'0 4px 20px rgba(0,0,0,.1)' }}>
              🔔 Canal en lecture seule — messages automatiques
            </div>
          ) : audioBlob ? (
            /* Prévisualisation message vocal */
            <div style={{ background:'rgba(255,255,255,.95)', backdropFilter:'blur(16px)', borderRadius:22, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 20px rgba(0,0,0,.12)' }}>
              <span style={{ fontSize:20 }}>🎤</span>
              <audio controls src={URL.createObjectURL(audioBlob)} style={{ flex:1, height:36 }} />
              <button onClick={() => setAudioBlob(null)} style={{ background:'#fee2e2', border:'none', borderRadius:8, padding:'6px 10px', fontSize:12, fontWeight:700, color:'#ef4444', cursor:'pointer' }}>✕</button>
              <button onClick={sendVoice} disabled={uploading} style={{ background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', borderRadius:10, padding:'8px 14px', fontSize:12, fontWeight:800, color:'#fff', cursor:'pointer' }}>
                {uploading ? '…' : '➤ Envoyer'}
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {/* Bouton fichier — label pour compatibilité iOS Safari */}
              <label htmlFor="chat-file-input" style={{ width:42, height:42, borderRadius:'50%', flexShrink:0, background:'rgba(255,255,255,.9)', border:`1.5px solid ${ACC}44`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, WebkitTapHighlightColor:'transparent' }}>
                📎
              </label>
              <input id="chat-file-input" ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{ display:'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) sendFile(f); e.target.value = '' }} />

              {/* Champ texte */}
              <div style={{ flex:1, background:'rgba(255,255,255,.95)', backdropFilter:'blur(16px)', borderRadius:26, padding:'11px 16px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 20px rgba(0,0,0,.10)', border:'1px solid rgba(0,0,0,.06)' }}>
                <input
                  ref={inputRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Écrire un message…"
                  style={{ flex:1, border:'none', outline:'none', background:'none', fontSize:14, fontFamily:'Nunito,system-ui,sans-serif', fontWeight:600, color:'#1e293b', minWidth:0 }}
                />
              </div>

              {/* Bouton envoyer / micro */}
              {text.trim() ? (
                <button onClick={send} disabled={sending} style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#fff', boxShadow:`0 4px 16px ${ACC}55`, opacity: sending ? .7 : 1 }}>
                  ➤
                </button>
              ) : (
                <button
                  onMouseDown={e => { e.preventDefault(); startAudioRec() }}
                  onMouseUp={e => { e.preventDefault(); stopAudioRec() }}
                  onTouchStart={e => { e.preventDefault(); startAudioRec() }}
                  onTouchEnd={e => { e.preventDefault(); stopAudioRec() }}
                  title={typeof navigator !== 'undefined' && !navigator.mediaDevices ? 'Micro non disponible (HTTPS requis)' : 'Maintenir pour enregistrer'}
                  style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, background: recording ? 'linear-gradient(135deg,#ef4444,#dc2626)' : (typeof navigator !== 'undefined' && !navigator.mediaDevices ? '#94a3b8' : `linear-gradient(135deg,${ACC2},${ACC})`), border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: recording ? '0 4px 20px rgba(239,68,68,.5)' : `0 4px 16px ${ACC}55`, animation: recording ? 'recPulse 1s ease-in-out infinite' : 'none', transition:'background .2s,box-shadow .2s', touchAction:'none', WebkitTapHighlightColor:'transparent' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
