'use client'
import { clinicConfig } from '@/chassis.config'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { chatApi, apiFetch } from '@/lib/api'

const ACC  = clinicConfig.accent  || '#1D9E75'
const ACC2 = clinicConfig.accentDark || '#0F6E56'
const LOGO = '/images/Logo Oria Care 512 par 512.png'

type Msg = {
  id: number
  content: string
  sender_type: 'patient' | 'clinic'
  sender_name: string
  created_at: string | null
  attachment?: { type: string; label: string; url: string } | null
}

// ─── Lecteur audio style Telegram ─────────────────────────────
const TG_BARS = [22,38,58,80,55,32,72,92,68,42,58,76,88,52,30,66,82,72,48,30,56,76,88,62,40,52,72,90,66,46,36,62,82,72,52,36,56,80,88,62,42,30,52,70,82]

function WAAudioPlayer({ src, isMe }: { src: string; isMe: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [dur, setDur]         = useState(0)
  const aRef = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    const a = aRef.current; if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().catch(() => {}); setPlaying(true) }
  }
  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`
  const progress = dur > 0 ? current / dur : 0

  // Couleurs Telegram : bulle verte = mes messages
  const btnBg   = isMe ? 'rgba(255,255,255,.28)' : 'rgba(29,158,117,.15)'
  const btnCol  = isMe ? '#fff' : '#1D9E75'
  const barFill = isMe ? 'rgba(255,255,255,.95)' : '#1D9E75'
  const barVoid = isMe ? 'rgba(255,255,255,.28)' : '#b8d8cc'
  const durCol  = isMe ? 'rgba(255,255,255,.65)' : '#7a9e94'

  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:190, padding:'2px 0' }}>
      <audio ref={aRef} src={src} style={{ display:'none' }}
        onTimeUpdate={e => setCurrent((e.target as HTMLAudioElement).currentTime)}
        onLoadedMetadata={e => setDur((e.target as HTMLAudioElement).duration)}
        onEnded={() => { setPlaying(false); setCurrent(0) }} />

      {/* Grand bouton play style Telegram */}
      <button onClick={toggle} style={{ width:46, height:46, borderRadius:'50%', background:btnBg, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow: isMe ? 'none' : '0 2px 8px rgba(0,0,0,.12)', transition:'transform .1s', WebkitTapHighlightColor:'transparent' }}
        onMouseDown={e => (e.currentTarget.style.transform='scale(.92)')}
        onMouseUp={e => (e.currentTarget.style.transform='scale(1)')}
        onTouchStart={e => (e.currentTarget.style.transform='scale(.92)')}
        onTouchEnd={e => (e.currentTarget.style.transform='scale(1)')}>
        {playing
          ? <svg width="16" height="16" viewBox="0 0 16 16" fill={btnCol}><rect x="2" y="2" width="4" height="12" rx="1.5"/><rect x="10" y="2" width="4" height="12" rx="1.5"/></svg>
          : <svg width="16" height="16" viewBox="0 0 16 16" fill={btnCol}><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg>
        }
      </button>

      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
        {/* Waveform dense */}
        <div style={{ display:'flex', alignItems:'flex-end', gap:1, height:26 }}>
          {TG_BARS.map((h, i) => (
            <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:2, background: (i/TG_BARS.length) < progress ? barFill : barVoid, transition:'background .06s' }} />
          ))}
        </div>
        {/* Durée + point bleu */}
        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, fontWeight:700, color:durCol }}>
          <span>{fmt(playing ? current : dur)}</span>
          <span style={{ fontSize:7, color:'#4FC3F7' }}>●</span>
        </div>
      </div>
    </div>
  )
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
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [lightbox,   setLightbox]   = useState<string | null>(null)
  const [recTime,    setRecTime]    = useState(0)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const wsRef      = useRef<WebSocket | null>(null)
  const srRef      = useRef<any>(null)
  const mediaRef   = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevCountRef = useRef(0)
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const recTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Supprimer un message ────────────────────────────────────
  const deleteMsg = async (msgId: number) => {
    const base = process.env.NEXT_PUBLIC_MEDICAL_API || 'https://api-oria.shidoos.com'
    const token = localStorage.getItem('sc_token') || ''
    try {
      await fetch(`${base}/api/v1/pwa/chat/messages/${msgId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setMessages(prev => prev.filter(m => m.id !== msgId))
    } catch { /* ignore */ }
    setDeletingId(null)
  }

  // ── Recording voix ──────────────────────────────────────────
  const startAudioRec = async () => {
    try {
      if (!navigator.mediaDevices) {
        alert('Le microphone nécessite HTTPS. Accédez à l\'app via https:// pour envoyer des audios.')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunks.current = []
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4'
        : ''
      const mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      const recordedMime = mr.mimeType || mimeType || 'audio/webm'
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunks.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: recordedMime })
        setAudioBlob(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRef.current = mr
      mr.start(100)
      setRecording(true)
      setRecTime(0)
      recTimerRef.current = setInterval(() => setRecTime(t => t + 1), 1000)
    } catch { /* micro refusé */ }
  }

  const stopAudioRec = () => {
    mediaRef.current?.stop()
    mediaRef.current = null
    setRecording(false)
    if (recTimerRef.current) { clearInterval(recTimerRef.current); recTimerRef.current = null }
  }

  const cancelRec = () => {
    if (mediaRef.current) {
      mediaRef.current.ondataavailable = null
      mediaRef.current.onstop = null
      mediaRef.current.stop()
      mediaRef.current = null
    }
    audioChunks.current = []
    setRecording(false)
    setAudioBlob(null)
    if (recTimerRef.current) { clearInterval(recTimerRef.current); recTimerRef.current = null }
    setRecTime(0)
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
    const ext = audioBlob.type.includes('mp4') ? 'mp4' : audioBlob.type.includes('ogg') ? 'ogg' : 'webm'
    const fd = new FormData()
    fd.append('file', audioBlob, `voice.${ext}`)
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

      {/* Wallpaper Telegram — fond doux avec léger motif */}
      <div style={{ position:'fixed', top:0, bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:420, display:'flex', flexDirection:'column', fontFamily:'Nunito,system-ui,sans-serif', zIndex:600,
        background:`linear-gradient(160deg, #d4e8cc 0%, #bdd4b5 50%, #c8dcc0 100%)`,
        backgroundImage:`radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,.22) 1px, transparent 0)`,
        backgroundSize:'18px 18px',
      }}>

        {/* HEADER — style glass Telegram */}
        <div style={{ paddingTop:'env(safe-area-inset-top,44px)', paddingLeft:12, paddingRight:12, paddingBottom:10,
          display:'flex', alignItems:'center', gap:10, flexShrink:0,
          background:`${c||ACC}dd`, backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
          boxShadow:'0 1px 0 rgba(255,255,255,.12), 0 2px 14px rgba(0,0,0,.15)',
        }}>
          {/* Bouton retour — petit cercle */}
          <button onClick={() => router.push('/chat')} style={{ background:'rgba(255,255,255,.22)', border:'none', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', flexShrink:0, WebkitTapHighlightColor:'transparent' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          {/* Avatar */}
          <div style={{ width:38, height:38, borderRadius:'50%', overflow:'hidden', flexShrink:0, boxShadow:'0 0 0 2px rgba(255,255,255,.4)' }}>
            {isStatic
              ? <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{(meta as any).avatar}</div>
              : <Image src={clinicLogoSrc} alt="logo" width={38} height={38} style={{ objectFit:'cover' }} />
            }
          </div>
          {/* Nom + statut */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:800, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{meta.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.8)', fontWeight:600 }}>
              {isStatic ? meta.subtitle : '● en ligne'}
            </div>
          </div>
          {/* Bouton téléphone */}
          <button style={{ background:'rgba(255,255,255,.22)', border:'none', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', flexShrink:0, WebkitTapHighlightColor:'transparent' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
          </button>
        </div>

        {/* MESSAGES */}
        <div id="chat-scroll" style={{ flex:1, overflowY:'auto', padding:'12px 10px 100px' }}>

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
              <div key={msg.id} style={{ display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom:8, animation:`msgIn .22s ease ${Math.min(i,4)*0.05}s both`, flexDirection:'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ display:'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems:'flex-end', gap:6 }}>
                {!isMe && (
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`${c}22`, border:`1.5px solid ${c}44`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                    <Image src={clinicLogoSrc} alt="logo" width={28} height={28} style={{ objectFit:'cover' }} />
                  </div>
                )}
                <div
                  onMouseDown={() => { longPressRef.current = setTimeout(() => setDeletingId(msg.id), 600) }}
                  onMouseUp={() => { if (longPressRef.current) clearTimeout(longPressRef.current) }}
                  onTouchStart={e => { e.preventDefault(); longPressRef.current = setTimeout(() => setDeletingId(msg.id), 600) }}
                  onTouchEnd={() => { if (longPressRef.current) clearTimeout(longPressRef.current) }}
                  style={{ maxWidth:'75%', background: isMe ? `linear-gradient(135deg,${ACC||'#1D9E75'},${ACC2||'#0F6E56'})` : '#fff', color: isMe ? '#fff' : '#1e293b', borderRadius: isMe ? '18px 4px 18px 18px' : '4px 18px 18px 18px', padding: msg.attachment?.type === 'image' ? '4px' : '9px 13px', boxShadow:'0 1px 4px rgba(0,0,0,.16)', fontSize:14, fontWeight:500, lineHeight:1.55, userSelect:'none', cursor:'pointer' }}>
                  {!isMe && <div style={{ fontSize:10, fontWeight:800, color: c, marginBottom:4, opacity:.85 }}>{msg.sender_name}</div>}

                  {/* Attachment image — thumbnail cliquable, lightbox au clic */}
                  {msg.attachment?.type === 'image' && (() => {
                    const att = msg.attachment!
                    const openLb = (e: React.SyntheticEvent) => { e.preventDefault(); e.stopPropagation(); setLightbox(att.url) }
                    return (
                      <div onClick={openLb} onTouchEnd={openLb} style={{ cursor:'zoom-in', borderRadius:12, overflow:'hidden', marginBottom:4, maxWidth:240, lineHeight:0, position:'relative', userSelect:'none', WebkitUserSelect:'none' }}>
                        <img src={att.url} alt={att.label} draggable={false} style={{ width:'100%', maxHeight:200, objectFit:'cover', display:'block', borderRadius:12, pointerEvents:'none' }} />
                        <div style={{ position:'absolute', bottom:5, right:7, background:'rgba(0,0,0,.45)', borderRadius:10, padding:'1px 6px', fontSize:9.5, color:'#fff', fontWeight:700, pointerEvents:'none' }}>
                          {fmtTime(msg.created_at)}{isMe && ' ✓'}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Attachment audio — lecteur style WhatsApp */}
                  {msg.attachment?.type === 'audio' && (
                    <div style={{ marginBottom:4 }}>
                      <WAAudioPlayer src={msg.attachment.url} isMe={isMe} />
                    </div>
                  )}

                  {/* Document */}
                  {msg.attachment?.type === 'document' && (
                    <a href={msg.attachment.url} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, background: isMe ? 'rgba(255,255,255,.2)' : `${c}15`, padding:'8px 10px', borderRadius:10, textDecoration:'none', marginBottom:6 }}>
                      <span style={{ fontSize:20 }}>📎</span>
                      <span style={{ fontSize:12, fontWeight:700, color: isMe ? '#fff' : '#1e293b', wordBreak:'break-all' }}>{msg.attachment.label}</span>
                    </a>
                  )}

                  {/* Texte — masqué si c'est juste l'emoji placeholder d'une image/audio */}
                  {!(msg.attachment?.type === 'image' || msg.attachment?.type === 'audio') && (
                    <div style={{ whiteSpace:'pre-wrap', wordBreak:'break-word', overflowWrap:'anywhere' }}>{msg.content}</div>
                  )}
                  {/* Timestamp — masqué pour les images (déjà dans l'overlay) */}
                  {msg.attachment?.type !== 'image' && (
                    <div style={{ fontSize:10, textAlign:'right', marginTop:4, fontWeight:500, color: isMe ? 'rgba(255,255,255,.65)' : '#94a3b8' }}>
                      {fmtTime(msg.created_at)}{isMe && ' ✓'}
                    </div>
                  )}
                </div>
                </div>
                {/* Menu suppression (long-press) */}
                {deletingId === msg.id && (
                  <div style={{ display:'flex', gap:8, marginTop:4, animation:'msgIn .15s ease both' }}>
                    <button onClick={() => deleteMsg(msg.id)} style={{ padding:'5px 14px', borderRadius:20, border:'none', background:'#ef4444', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>🗑 Supprimer</button>
                    <button onClick={() => setDeletingId(null)} style={{ padding:'5px 12px', borderRadius:20, border:'none', background:'rgba(0,0,0,.12)', color:'#64748b', fontSize:12, fontWeight:700, cursor:'pointer' }}>Annuler</button>
                  </div>
                )}
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* INPUT — barre flottante Telegram */}
        <div style={{ flexShrink:0, padding:'8px 10px', paddingBottom:'calc(10px + env(safe-area-inset-bottom,0px))', background:'transparent' }}>
          {isStatic ? (
            /* Lecture seule */
            <div style={{ background:'rgba(255,255,255,.88)', backdropFilter:'blur(16px)', borderRadius:26, padding:'14px 20px', textAlign:'center', fontSize:13, fontWeight:700, color:'#94a3b8', boxShadow:'0 4px 20px rgba(0,0,0,.14)' }}>
              🔔 Canal en lecture seule — messages automatiques
            </div>

          ) : recording ? (
            /* ── Barre d'enregistrement Telegram ── */
            <>
              <style>{`@keyframes rw{0%,100%{transform:scaleY(.12)}50%{transform:scaleY(1)}}`}</style>
              <div style={{ background:'rgba(255,255,255,.96)', backdropFilter:'blur(20px)', borderRadius:26, padding:'8px 10px 8px 14px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 24px rgba(0,0,0,.18)' }}>
                {/* Annuler */}
                <button onClick={cancelRec} style={{ width:34, height:34, borderRadius:'50%', background:'#fee2e2', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                </button>
                {/* Waveform animée rouge */}
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:2, height:32 }}>
                  {Array.from({length:26}, (_, i) => (
                    <div key={i} style={{ flex:1, background:'#ef4444', borderRadius:3, height:'100%', transformOrigin:'center', animation:`rw ${0.4+(i%5)*0.11}s ease-in-out ${(i%7)*0.055}s infinite` }} />
                  ))}
                </div>
                {/* Timer rouge */}
                <span style={{ fontSize:13, fontWeight:800, color:'#ef4444', flexShrink:0, minWidth:36, textAlign:'center', fontVariantNumeric:'tabular-nums' }}>
                  {`${String(Math.floor(recTime/60)).padStart(2,'0')}:${String(recTime%60).padStart(2,'0')}`}
                </span>
                {/* Stop — carré blanc dans cercle rouge */}
                <button onClick={stopAudioRec} style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#ef4444,#dc2626)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(239,68,68,.5)', WebkitTapHighlightColor:'transparent' }}>
                  <div style={{ width:11, height:11, background:'#fff', borderRadius:2 }} />
                </button>
              </div>
            </>

          ) : audioBlob ? (
            /* ── Prévisualisation vocale ── */
            <div style={{ background:'rgba(255,255,255,.96)', backdropFilter:'blur(20px)', borderRadius:26, padding:'8px 10px 8px 10px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 24px rgba(0,0,0,.18)' }}>
              <button onClick={() => { setAudioBlob(null); setRecTime(0) }} style={{ width:34, height:34, borderRadius:'50%', background:'#fee2e2', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
              </button>
              <div style={{ flex:1 }}>
                <WAAudioPlayer src={URL.createObjectURL(audioBlob)} isMe={false} />
              </div>
              <button onClick={sendVoice} disabled={uploading} style={{ width:40, height:40, borderRadius:'50%', background: uploading ? '#94a3b8' : `linear-gradient(135deg,${ACC2},${ACC})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 14px ${ACC}55`, WebkitTapHighlightColor:'transparent' }}>
                {uploading ? <span style={{ color:'#fff', fontSize:14 }}>…</span> : <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>}
              </button>
            </div>

          ) : (
            /* ── Saisie normale — pill Telegram ── */
            <div style={{ background:'rgba(255,255,255,.96)', backdropFilter:'blur(20px)', borderRadius:26, display:'flex', alignItems:'center', gap:0, boxShadow:'0 4px 24px rgba(0,0,0,.18)', overflow:'visible' }}>
              <input id="chat-file-input" ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{ display:'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) sendFile(f); e.target.value = '' }} />
              {/* Emoji / smiley */}
              <button style={{ width:46, height:46, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#94a3b8', fontSize:20, WebkitTapHighlightColor:'transparent' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round"/><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
              {/* Champ texte */}
              <input
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message…"
                style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:15, fontFamily:'Nunito,system-ui,sans-serif', fontWeight:600, color:'#1e293b', minWidth:0, padding:'12px 0' }}
              />
              {text.trim() ? (
                /* Envoyer */
                <button onClick={send} disabled={sending} style={{ width:42, height:42, margin:'0 4px 0 0', borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${ACC}55`, opacity: sending ? .7 : 1, WebkitTapHighlightColor:'transparent' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                </button>
              ) : (
                <>
                  {/* Pièce jointe */}
                  <label htmlFor="chat-file-input" style={{ width:40, height:46, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, WebkitTapHighlightColor:'transparent' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  </label>
                  {/* Micro — cercle vert */}
                  <button onClick={startAudioRec} style={{ width:42, height:42, margin:'0 4px 0 0', borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${ACC}55`, WebkitTapHighlightColor:'transparent' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="8" y="1" width="8" height="13" rx="4" fill="white" opacity=".95"/>
                      <path d="M5 10a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="9" y1="21" x2="15" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Lightbox image */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.92)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16, cursor:'zoom-out' }}>
          <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:18, right:18, background:'rgba(255,255,255,.15)', border:'none', borderRadius:'50%', width:38, height:38, fontSize:20, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>✕</button>
          <img src={lightbox} alt="" style={{ maxWidth:'100%', maxHeight:'90vh', objectFit:'contain', borderRadius:12, boxShadow:'0 8px 40px rgba(0,0,0,.6)' }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
