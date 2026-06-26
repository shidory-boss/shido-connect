'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

export default function CallPage() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(0)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  return (
    <>
      <style>{`
        @keyframes orbPulse {
          0%,100% { opacity:.2; transform:scale(.9); }
          50%      { opacity:.5; transform:scale(1.06); }
        }
        @keyframes floatBob {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-12px); }
        }
        @keyframes ringGlow {
          from { box-shadow:0 0 0 0 rgba(29,158,117,.5); }
          to   { box-shadow:0 0 0 24px rgba(29,158,117,0); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        .ctrl-btn { cursor:pointer; transition:all .2s; border:none; }
        .ctrl-btn:active { transform:scale(.9); }
      `}</style>

      <div style={{
        minHeight:'100dvh', height:'100dvh',
        background:'linear-gradient(145deg,#0a3d2b,#0F6E56 50%,#1D9E75)',
        display:'flex', flexDirection:'column',
        fontFamily:'Nunito,system-ui,sans-serif',
        position:'relative', overflow:'hidden',
      }}>

        {/* Orbes */}
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(77,212,160,.4),transparent)', animation:'orbPulse 3s ease-in-out infinite alternate', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.15),transparent)', animation:'orbPulse 3s ease-in-out infinite alternate', animationDelay:'.8s', pointerEvents:'none' }} />

        {/* HEADER */}
        <div style={{ padding:'52px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <button onClick={() => router.push('/teleconsult')} className="ctrl-btn" style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.15)',color:'#fff',fontSize:14,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center' }}>
            ✕
          </button>
          <div style={{ fontSize:14, fontWeight:800, color:'#fff', textAlign:'center' }}>Téléconsultation</div>
          <div style={{ padding:'6px 14px', borderRadius:20, background:'rgba(74,222,128,.2)', border:'1px solid rgba(74,222,128,.4)', fontSize:12, fontWeight:800, color:'#4ade80', fontVariantNumeric:'tabular-nums' }}>
            {formatTime(seconds)}
          </div>
        </div>

        {/* ZONE VIDÉO PRINCIPALE */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:'20px' }}>
          <div style={{ width:'100%', maxWidth:320, aspectRatio:'3/4', background:'rgba(255,255,255,.06)', borderRadius:28, border:'1.5px solid rgba(255,255,255,.2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', boxShadow:'0 16px 48px rgba(0,0,0,.3)' }}>

            {/* Médecin avatar */}
            <div style={{ animation:'floatBob 4s ease-in-out infinite', display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{
                width:110, height:110, borderRadius:'50%',
                background:'rgba(255,255,255,.18)', backdropFilter:'blur(12px)',
                border:'3px solid rgba(255,255,255,.4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:52, marginBottom:16,
                animation:'ringGlow 2s ease-in-out infinite',
              }}>👨‍⚕️</div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', textShadow:'0 2px 12px rgba(0,0,0,.3)' }}>Votre médecin</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', fontWeight:600, marginTop:4 }}>Téléconsultation</div>
            </div>

            {/* Icône caméra si off */}
            {!camOn && (
              <div style={{ position:'absolute', top:16, right:16, width:36,height:36,borderRadius:10,background:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>
                📵
              </div>
            )}

            {/* Mini preview (soi) */}
            <div style={{ position:'absolute', bottom:16, right:16, width:72, height:96, borderRadius:14, background:'rgba(0,0,0,.5)', border:'2px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
              🙂
            </div>
          </div>
        </div>

        {/* CONTRÔLES */}
        <div style={{ padding:'20px 40px 40px', display:'flex', alignItems:'center', justifyContent:'space-around', flexShrink:0, animation:'slideUp .5s ease both' }}>

          {/* Micro */}
          <button className="ctrl-btn" onClick={() => setMicOn(!micOn)} style={{
            width:58, height:58, borderRadius:'50%',
            background: micOn ? 'rgba(255,255,255,.18)' : 'rgba(239,68,68,.8)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
          }}>
            {micOn ? '🎤' : '🔇'}
          </button>

          {/* Raccrocher */}
          <button className="ctrl-btn" onClick={() => router.push('/teleconsult')} style={{
            width:72, height:72, borderRadius:'50%',
            background:'#EF4444',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:28,
            boxShadow:'0 8px 24px rgba(239,68,68,.6)',
          }}>
            📵
          </button>

          {/* Caméra */}
          <button className="ctrl-btn" onClick={() => setCamOn(!camOn)} style={{
            width:58, height:58, borderRadius:'50%',
            background: camOn ? 'rgba(255,255,255,.18)' : 'rgba(239,68,68,.8)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
          }}>
            {camOn ? '📹' : '🚫'}
          </button>
        </div>
      </div>
    </>
  )
}
