'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { storage } from '@/lib/storage'
import { usePWAConfig } from '@/core/PWAConfigContext'
import { localAuth } from '@/lib/localAuth'

export default function LoginPage() {
  const router = useRouter()
  const { config } = usePWAConfig()
  const [phone, setPhone]         = useState('')
  const [password, setPassword]   = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [mode, setMode]           = useState<'login' | 'register'>('login')
  const [focused, setFocused]     = useState<string | null>(null)
  const [showPass, setShowPass]   = useState(false)
  const [mounted, setMounted]     = useState(false)
  const [particles, setParticles] = useState<{ id:number; x:number; y:number; color:string }[]>([])

  const burstParticles = () => {
    const colors = ['#4ade80','#a8edda','#fff','#1D9E75','#86efac']
    const pts = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(pts)
    setTimeout(() => setParticles([]), 900)
  }

  const acc  = config.primary_color   || '#1D9E75'
  const acc2 = config.secondary_color || '#0F6E56'

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Essaie le backend d'abord
      const res = await authApi.login(phone, password)
      storage.setToken(res.access_token)
      storage.setPatient(res.patient)
      burstParticles(); setTimeout(() => router.replace('/home'), 700)
    } catch {
      // Backend indisponible → auth locale
      try {
        const patient = localAuth.login(phone, password)
        const token = localAuth.makeToken(phone)
        storage.setToken(token)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        storage.setPatient(patient as any)
        burstParticles(); setTimeout(() => router.replace('/home'), 700)
      } catch (localErr: unknown) {
        setError(localErr instanceof Error ? localErr.message : 'Identifiants incorrects')
      }
    } finally { setLoading(false) }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Essaie le backend d'abord
      const res = await authApi.register({ first_name: firstName, last_name: lastName, phone, password })
      storage.setToken(res.access_token)
      storage.setPatient(res.patient)
      burstParticles(); setTimeout(() => router.replace('/home'), 800)
    } catch {
      // Backend indisponible → crée un compte local
      try {
        const patient = localAuth.register(phone, password, firstName, lastName)
        const token = localAuth.makeToken(phone)
        storage.setToken(token)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        storage.setPatient(patient as any)
        burstParticles(); setTimeout(() => router.replace('/home'), 800)
      } catch (localErr: unknown) {
        setError(localErr instanceof Error ? localErr.message : "Erreur lors de la création du compte")
      }
    } finally { setLoading(false) }
  }

  const inputStyle = (name: string) => ({
    width: '100%',
    background: focused === name ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)',
    border: `1.5px solid ${focused === name ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'}`,
    borderRadius: 16,
    padding: '16px 18px',
    fontSize: 16,
    fontFamily: 'Nunito, system-ui, sans-serif',
    fontWeight: 600,
    color: '#fff',
    outline: 'none',
    transition: 'all .25s ease',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxSizing: 'border-box' as const,
    boxShadow: focused === name ? `0 0 0 4px rgba(255,255,255,0.12)` : 'none',
  })

  return (
    <>
      <style>{`
        @keyframes luxFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes luxOrb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-40px) scale(1.1); }
          66%      { transform: translate(-20px,20px) scale(0.9); }
        }
        @keyframes luxOrb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-40px,30px) scale(1.08); }
          66%      { transform: translate(25px,-15px) scale(0.92); }
        }
        @keyframes luxSlideUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes luxPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
          50%      { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
        }
        @keyframes luxShimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        @keyframes luxSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes particleBurst {
          0%   { transform:translate(0,0) scale(1); opacity:1; }
          100% { transform:translate(var(--tx),var(--ty)) scale(0); opacity:0; }
        }
        @keyframes successPulse {
          0%,100% { box-shadow:0 8px 32px rgba(74,222,128,.4); }
          50%      { box-shadow:0 8px 64px rgba(74,222,128,.9); }
        }
        .lux-login-input::placeholder { color: rgba(255,255,255,0.45); }
        .lux-tab { transition: all .25s ease; cursor: pointer; }
        .lux-tab:active { transform: scale(.97); }
        .lux-btn { transition: all .2s ease; cursor: pointer; }
        .lux-btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .lux-btn:active { transform: scale(.97); }
        .lux-card { animation: luxSlideUp .5s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(145deg, ${acc2} 0%, ${acc} 45%, ${acc2} 100%) 0 0 / 300% 300%`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Nunito, system-ui, sans-serif',
      }}>

        {/* Orbes décoratifs */}
        <div style={{ position:'absolute', top:'-15%', left:'-10%', width:320, height:320, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)`, animation:'luxOrb1 12s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-8%', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)`, animation:'luxOrb2 15s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', right:'5%', width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)`, animation:'luxOrb1 9s ease-in-out infinite reverse', pointerEvents:'none' }} />

        {/* Points décoratifs */}
        {mounted && [
          {top:'15%',left:'8%'}, {top:'25%',right:'12%'}, {top:'60%',left:'5%'},
          {bottom:'20%',right:'8%'}, {bottom:'35%',left:'15%'}, {top:'75%',right:'18%'},
        ].map((pos, i) => (
          <div key={i} style={{ position:'absolute', ...pos, width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,0.35)', animation:`luxPulse ${2+i*0.4}s ease-in-out infinite`, animationDelay:`${i*0.3}s` }} />
        ))}

        {/* Card principale */}
        <div className="lux-card" style={{
          width: '100%',
          maxWidth: 400,
          margin: '0 16px',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 28,
          padding: '36px 28px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
          animationDelay: '.1s',
        }}>

          {/* Logo + Nom */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.22)',
              border: '2px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38,
              margin: '0 auto 16px',
              animation: 'luxFloat 4s ease-in-out infinite',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            }}>
              {config.logo_url
                ? <Image src={config.logo_url} alt="logo" width={52} height={52} unoptimized style={{ borderRadius:12, objectFit:'cover' }} />
                : '🏥'}
            </div>

            <h1 style={{ fontSize:26, fontWeight:900, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px', textShadow:'0 2px 12px rgba(0,0,0,0.2)' }}>
              {config.clinic_name || 'Oria Care'}
            </h1>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.72)', margin:0, fontWeight:600 }}>
              {config.welcome_message || 'Votre espace santé personnel'}
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display:'flex', background:'rgba(0,0,0,0.2)', borderRadius:16, padding:4, marginBottom:24, gap:4 }}>
            {(['login','register'] as const).map(m => (
              <div key={m} className="lux-tab"
                onClick={() => { setMode(m); setError('') }}
                style={{
                  flex:1, padding:'11px', borderRadius:12, textAlign:'center',
                  fontSize:14, fontWeight:800,
                  background: mode === m ? 'rgba(255,255,255,0.95)' : 'transparent',
                  color: mode === m ? acc2 : 'rgba(255,255,255,0.65)',
                  boxShadow: mode === m ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                }}>
                {m === 'login' ? 'Connexion' : 'Créer un compte'}
              </div>
            ))}
          </div>

          {/* Formulaire */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={{ display:'flex', flexDirection:'column', gap:12 }}>

            {mode === 'register' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[
                  { name:'firstName', label:'Prénom', value:firstName, set:setFirstName, placeholder:'Konan' },
                  { name:'lastName',  label:'Nom',    value:lastName,  set:setLastName,  placeholder:'Kouassi' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:6 }}>{f.label}</label>
                    <input
                      className="lux-login-input"
                      style={inputStyle(f.name)}
                      type="text" placeholder={f.placeholder} value={f.value}
                      onChange={e => f.set(e.target.value)} required
                      onFocus={() => setFocused(f.name)} onBlur={() => setFocused(null)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <label style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:6 }}>Téléphone</label>
              <input
                className="lux-login-input"
                style={inputStyle('phone')}
                type="tel" placeholder="07 XX XX XX XX" value={phone}
                onChange={e => setPhone(e.target.value)} required
                onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
              />
            </div>

            <div>
              <label style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:6 }}>Mot de passe</label>
              <div style={{ position:'relative' }}>
                <input
                  className="lux-login-input"
                  style={{ ...inputStyle('password'), paddingRight:52 }}
                  type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} required
                  onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:18, padding:4, color:'rgba(255,255,255,0.6)', lineHeight:1 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background:'rgba(239,68,68,0.25)', border:'1px solid rgba(239,68,68,0.5)', backdropFilter:'blur(8px)', color:'#fff', padding:'12px 16px', borderRadius:14, fontSize:13, fontWeight:700, textAlign:'center' }}>
                ⚠️ {error}
              </div>
            )}

            <button className="lux-btn" type="submit" disabled={loading} style={{
              width:'100%', padding:'16px',
              background: loading
                ? 'rgba(255,255,255,0.3)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
              border: 'none',
              borderRadius: 16,
              fontSize: 16, fontWeight: 900,
              color: acc2,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              letterSpacing: '-0.2px',
              marginTop: 4,
            }}>
              {loading
                ? <><span style={{ display:'inline-block', width:18, height:18, border:`3px solid ${acc2}`, borderTopColor:'transparent', borderRadius:'50%', animation:'luxSpin .8s linear infinite' }} /> Connexion...</>
                : mode === 'login' ? '✨ Se connecter' : '🚀 Créer mon compte'
              }
            </button>
          </form>

          {/* Particules succès */}
          {particles.map((p, i) => {
            const angle = (i / particles.length) * 360
            const dist = 60 + Math.random() * 80
            const tx = Math.cos(angle * Math.PI / 180) * dist
            const ty = Math.sin(angle * Math.PI / 180) * dist
            return (
              <div key={p.id} style={{
                position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
                width:8, height:8, borderRadius:'50%', background:p.color,
                // @ts-expect-error css vars
                '--tx': `${tx}px`, '--ty': `${ty}px`,
                animation:'particleBurst .8s ease-out forwards',
                pointerEvents:'none', zIndex:999,
              }} />
            )
          })}

          {/* Footer */}
          <div style={{ textAlign:'center', marginTop:24, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.15)' }}>
            <div style={{
              fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)',
              letterSpacing:'1.5px', textTransform:'uppercase',
            }}>
              Propulsé par Oria Care
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
