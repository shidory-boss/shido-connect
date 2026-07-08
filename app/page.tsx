'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clinicConfig } from '@/chassis.config'

export default function SplashPage() {
  const router = useRouter()
  const [anim, setAnim] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setAnim('hold'), 400)
    const t2 = setTimeout(() => setAnim('out'), 2600)
    const t3 = setTimeout(() => router.replace('/home'), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const out = anim === 'out'

  return (
    <>
      <style>{`
        @keyframes orbPulse {
          0%,100% { opacity:.25; transform:scale(.9); }
          50%      { opacity:.7;  transform:scale(1.08); }
        }
        @keyframes ringGlow {
          from { box-shadow: 0 0 40px rgba(29,158,117,.5), 0 0 80px rgba(29,158,117,.25); }
          to   { box-shadow: 0 0 90px rgba(29,158,117,.9), 0 0 180px rgba(29,158,117,.6); }
        }
        @keyframes ringRotate { to { transform: rotate(360deg); } }
        @keyframes heroIn {
          from { opacity:0; transform: scale(.45) translateY(50px); }
          to   { opacity:1; transform: none; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes rise {
          0%   { opacity:0; transform:translateY(0) scale(.5); }
          50%  { opacity:.6; }
          100% { opacity:0; transform:translateY(-120px) scale(1.2); }
        }
        @keyframes shimmerName {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes floatBob {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-12px); }
        }
        @keyframes ecgSplash {
          0%   { stroke-dashoffset:500; opacity:.7; }
          70%  { stroke-dashoffset:0;   opacity:.7; }
          100% { stroke-dashoffset:0;   opacity:0; }
        }
      `}</style>

      <div style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'linear-gradient(145deg,#0a3d2b,#0F6E56 50%,#1D9E75 75%,#4dd4a0)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        opacity: out ? 0 : 1,
        transform: out ? 'scale(1.04)' : 'none',
        transition: 'opacity .6s ease, transform .6s ease',
        overflow:'hidden',
        fontFamily:'Nunito,system-ui,sans-serif',
      }}>
        {/* Orbes */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(77,212,160,.55),transparent)', animation:'orbPulse 3s ease-in-out infinite alternate' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.18),transparent)', animation:'orbPulse 3s ease-in-out infinite alternate', animationDelay:'.8s' }} />
        <div style={{ position:'absolute', top:'38%', left:'25%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,.3),transparent)', animation:'orbPulse 3s ease-in-out infinite alternate', animationDelay:'1.5s' }} />

        {/* Particules */}
        {[
          { left:'15%', bottom:'20%', delay:'0s', size:6 },
          { left:'75%', bottom:'35%', delay:'.5s', size:4 },
          { left:'40%', bottom:'15%', delay:'1s', size:5 },
          { left:'60%', bottom:'28%', delay:'.3s', size:3 },
          { left:'25%', bottom:'40%', delay:'.8s', size:4 },
        ].map((p,i) => (
          <div key={i} style={{
            position:'absolute', left:p.left, bottom:p.bottom,
            width:p.size, height:p.size, borderRadius:'50%',
            background:'rgba(255,255,255,.6)',
            animation:`rise ${2+i*0.4}s ease-in-out infinite`,
            animationDelay:p.delay,
          }} />
        ))}

        {/* Logo ring + icon */}
        <div style={{
          animation: anim === 'in' ? 'heroIn 1.1s cubic-bezier(.34,1.56,.64,1) .15s both' : 'floatBob 3s ease-in-out infinite',
          display:'flex', flexDirection:'column', alignItems:'center',
        }}>
          <div style={{
            width:136, height:136, borderRadius:'50%',
            background:'rgba(255,255,255,.13)', backdropFilter:'blur(24px)',
            border:'2px solid rgba(255,255,255,.35)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation:'ringGlow 2.2s ease-in-out infinite alternate',
            position:'relative',
          }}>
            <div style={{
              position:'absolute', inset:8, borderRadius:'50%',
              border:'1.5px dashed rgba(255,255,255,.3)',
              animation:'ringRotate 10s linear infinite',
            }} />
            <span style={{ fontSize:58, color:'#fff', textShadow:'0 0 36px rgba(255,255,255,.9)', position:'relative', zIndex:2 }}>✚</span>
          </div>

          <div style={{
            marginTop:22,
            fontSize:36, fontWeight:900, color:'#fff', letterSpacing:4,
            fontFamily:'Nunito,sans-serif',
            background:'linear-gradient(90deg,#fff 30%,#a8edda 50%,#fff 70%) 0 0 / 200% auto',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text',
            animation:'shimmerName 4s linear infinite',
          }}>
            {clinicConfig.name}
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', letterSpacing:7, textTransform:'uppercase', marginTop:5 }}>
            Votre santé
          </div>
        </div>

        {/* ECG Splash */}
        <svg viewBox="0 0 320 40" style={{ width:280, marginTop:28, opacity:.6 }}>
          <polyline points="0,20 30,20 45,20 55,4 65,36 75,8 85,20 110,20 130,20 145,20 155,5 165,35 175,9 185,20 210,20 250,20 265,20 275,5 285,35 295,9 305,20 320,20"
            fill="none" stroke="#a8edda" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="500"
            style={{ animation:'ecgSplash 2.2s ease 0.6s both' }} />
        </svg>

        {/* Tagline */}
        <div style={{
          marginTop:20, color:'rgba(255,255,255,.75)', fontSize:15, fontWeight:600,
          animation: anim !== 'in' ? 'fadeUp .9s ease 1.1s both' : 'none',
        }}>
          Votre Santé, Notre Priorité 💚
        </div>

        {/* Dots */}
        <div style={{ position:'absolute', bottom:58, display:'flex', gap:9 }}>
          {[true,false,false].map((on,i) => (
            <div key={i} style={{
              width: on ? 26 : 9, height:9, borderRadius: on ? 5 : '50%',
              background: on ? '#fff' : 'rgba(255,255,255,.35)',
            }} />
          ))}
        </div>
      </div>
    </>
  )
}
