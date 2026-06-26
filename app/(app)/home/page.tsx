'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useClinicConfig } from '@/lib/useClinicConfig'

const HERO_IMG  = '/images/Hero Principal.png'
const TEAM_IMGS = [
  '/images/Docteurs/Docteur africain 600x800.png',
  '/images/Docteurs/Docteur africain final 600x800.png',
  '/images/Docteurs/Femme docteur 600x800 final.png',
]
const CLIENT_IMGS = [
  '/images/Témoignages clients/Photos témoignages clients 1.jpg',
  '/images/Témoignages clients/Photos témoignages clients 2.jpg',
  '/images/Témoignages clients/Photos témoignages clients 3.jpg',
  '/images/Témoignages clients/Photos témoignages clients 4.jpg',
]

const SERVICES = [
  { icon:'🩺', label:'Consultation Générale', slug:'consultation-generale', img:'/images/Services/General Consultation mint green 800x800.png',            color:'#1D9E75', dark:'#0F6E56' },
  { icon:'🧪', label:'Analyses & Bilans',      slug:'analyses-bilans',       img:'/images/Services/Analyses and Reports 800x800 style reference.png',       color:'#0B1D35', dark:'#060F1C' },
  { icon:'🩻', label:'Radiologie & Imagerie',  slug:'radiologie-imagerie',   img:'/images/Services/Radiologie et Imagerie 800x800 style reference.png',     color:'#1D9E75', dark:'#0F6E56' },
  { icon:'👶', label:'Pédiatrie',              slug:'pediatrie',             img:'/images/Services/Pediatrie 800x800 style reference.png',                  color:'#0B1D35', dark:'#060F1C' },
  { icon:'❤️', label:'Cardiologie',            slug:'cardiologie',           img:'/images/Services/Cardiologie 800x800 style reference.png',                color:'#1D9E75', dark:'#0F6E56' },
  { icon:'🎥', label:'Téléconsultation',        slug:'teleconsultation',      img:'/images/Services/Teleconsultation 800x800 style reference.png',           color:'#0B1D35', dark:'#060F1C' },
  { icon:'🏥', label:'Hospitalisation',         slug:'hospitalisation',       img:'/images/Services/Hospitalisation 800x800 style reference.png',            color:'#1D9E75', dark:'#0F6E56' },
  { icon:'🚑', label:'Urgences 24h/24',        slug:'urgences',              img:'/images/Services/24-7 Emergency Room 800x800 style reference.png',        color:'#0B1D35', dark:'#060F1C' },
]

const TEAM = [
  { name:'Dr. Yanick Oulaï',   role:'Directeur Médical',        img: TEAM_IMGS[0], quote:'"La confiance et l\'écoute sont au cœur de notre engagement envers chaque patient."' },
  { name:'Dr. Franck Kouamé',  role:'Médecin Spécialiste',       img: TEAM_IMGS[1], quote:'"Notre équipe s\'engage à offrir des soins de pointe dans un environnement chaleureux."' },
  { name:'Dr. Christy Onamon', role:'Pédiatre & Obstétricienne', img: TEAM_IMGS[2], quote:'"Chaque enfant mérite les meilleurs soins. C\'est notre mission quotidienne."' },
]

const TESTIMONIALS = [
  { name:'Kouamé Brice',     service:'Consultation générale', img:CLIENT_IMGS[0], text:'Service impeccable, médecin à l\'écoute. J\'ai reçu un diagnostic précis et un suivi personnalisé. Je recommande vivement ce cabinet.' },
  { name:'N\'Guessan Akissi', service:'Bilan de santé',        img:CLIENT_IMGS[1], text:'Une clinique moderne avec du matériel de pointe. Le personnel est professionnel et très accueillant. Bravo à toute l\'équipe !' },
  { name:'Diallo Mamadou',   service:'Pédiatrie',              img:CLIENT_IMGS[2], text:'Docteur Traoré est formidable avec les enfants. Ma fille attendait la consultation avec joie. Une médecine humaine et de qualité.' },
  { name:'Assi Marie-Claire', service:'Téléconsultation',      img:CLIENT_IMGS[3], text:'J\'ai pu consulter depuis Bouaké sans me déplacer. La téléconsultation fonctionne parfaitement. Une vraie innovation en Côte d\'Ivoire !' },
]

const STATS = [
  { target:98,   suffix:'%', label:'Satisfaction patients' },
  { target:12,   suffix:'+', label:'Médecins spécialistes' },
  { target:5000, suffix:'k+', label:'Patients traités', display:(n:number) => n>=1000?`${Math.floor(n/1000)}k+`:`${n}` },
  { target:15,   suffix:'+', label:'Années d\'expérience' },
]

const QUICK_ACTIONS = [
  { href:'/booking',    icon:'📅', label:'Prendre RDV',     color:'#1D9E75' },
  { href:'/queue',      icon:'🎫', label:'File d\'attente', color:'#0B1D35' },
  { href:'/teleconsult',icon:'🎥', label:'Téléconsult',     color:'#8B5CF6' },
  { href:'/reminders',  icon:'💊', label:'Rappels médocs',  color:'#F59E0B' },
]

function StatsSection({ acc }: { acc: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState(STATS.map(() => 0))
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        STATS.forEach((s, i) => {
          const duration = 1600
          const steps = 60
          const interval = duration / steps
          let step = 0
          const timer = setInterval(() => {
            step++
            const progress = 1 - Math.pow(1 - step / steps, 3) // easeOutCubic
            setCounts(prev => {
              const next = [...prev]
              next[i] = Math.round(s.target * progress)
              return next
            })
            if (step >= steps) clearInterval(timer)
          }, interval)
        })
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ margin:'16px 16px 0', background:'linear-gradient(135deg,#0B1D35,#122848)', borderRadius:24, padding:'20px 16px', boxShadow:'0 12px 40px rgba(11,29,53,.4)', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'-20px', right:'-20px', width:120, height:120, borderRadius:'50%', background:'rgba(29,158,117,.12)' }} />
      {STATS.map((s, i) => {
        const display = s.display ? s.display(counts[i]) : `${counts[i]}${s.suffix}`
        return (
          <div key={i} style={{ textAlign:'center', position:'relative', zIndex:1 }}>
            <div style={{ fontSize:24, fontWeight:900, color:acc, letterSpacing:'-0.5px', transition:'color .2s' }}>{display}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', fontWeight:700, marginTop:3 }}>{s.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  const { config } = useClinicConfig()
  const [patient, setPatient]         = useState<{ first_name: string } | null>(null)
  const [activeTestim, setActiveTestim] = useState(0)
  const [mounted, setMounted]         = useState(false)
  const scrollRef                     = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY]         = useState(0)

  useEffect(() => {
    setMounted(true)
    const raw = localStorage.getItem('sc_patient')
    if (raw) setPatient(JSON.parse(raw))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrollY(el.scrollTop)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveTestim(i => (i + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const acc  = config?.primary_color   || '#1D9E75'
  const acc2 = config?.secondary_color || '#0F6E56'
  const name = config?.clinic_name     || 'Oria Care'

  return (
    <>
      <style>{`
        @keyframes heroFadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
        @keyframes shimmerTxt  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes floatBadge  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes scaleIn     { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes ecgDraw     { from{stroke-dashoffset:900} to{stroke-dashoffset:0} }
        @keyframes ecgFade     { 0%,85%{opacity:.55} 100%{opacity:0} }
        @keyframes ripple      { from{transform:scale(0);opacity:.5} to{transform:scale(3);opacity:0} }
        @keyframes slideRight  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:none} }
        @keyframes pulse       { 0%,100%{box-shadow:0 0 0 0 rgba(29,158,117,.45)} 70%{box-shadow:0 0 0 12px rgba(29,158,117,0)} }
        @keyframes slideUp     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

        /* float doux — même esprit que le badge "Ouvert maintenant" */
        @keyframes floatA { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-5px)} }
        @keyframes floatB { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(3px)}  }
        @keyframes floatC { 0%,100%{transform:translateY(-2px)} 50%{transform:translateY(4px)}  }
        @keyframes floatD { 0%,100%{transform:translateY(2px)}  50%{transform:translateY(-4px)} }

        /* shimmer lumière sur boutons CTA */
        @keyframes btnShimmer {
          0%   { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        /* glow bordure pulsante sur carte CTA */
        @keyframes borderGlow {
          0%,100% { box-shadow:0 16px 48px rgba(29,158,117,.35); }
          50%      { box-shadow:0 16px 64px rgba(29,158,117,.7), 0 0 0 3px rgba(29,158,117,.25); }
        }
        /* zoom subtil sur photos docteurs */
        @keyframes docZoom {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.04); }
        }
        /* pulse sur la carte RDV principale */
        @keyframes cardPulse {
          0%,100% { box-shadow:0 8px 24px rgba(29,158,117,.2); }
          50%      { box-shadow:0 8px 40px rgba(29,158,117,.5); }
        }

        .svc-card   { transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s; }
        .svc-card:active  { transform:scale(.95) rotate(-1deg); }
        .qa-card    { transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s; }
        .qa-card:active   { transform:scale(.93); }
        .rdv-btn    { transition:all .25s; }
        .rdv-btn:hover    { transform:translateY(-2px); filter:brightness(1.07); }
        .rdv-btn:active   { transform:scale(.96); }
        .team-card:hover .team-overlay { opacity:1!important; }
        .team-img   { animation:docZoom 6s ease-in-out infinite; }
        .cta-btn-shimmer {
          background: linear-gradient(90deg,#fff 0%,rgba(255,255,255,.55) 40%,#fff 55%,rgba(255,255,255,.55) 100%) 200% center / 300% auto;
          animation: btnShimmer 3.5s linear infinite;
        }
      `}</style>

      <div ref={scrollRef} style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'Nunito,system-ui,sans-serif', overflowY:'auto', paddingBottom:88 }}>

        {/* ══ HERO ══ */}
        <div style={{ position:'relative', height:500, overflow:'hidden' }}>
          <img
            src={HERO_IMG}
            alt="Clinique"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', transform:`scale(1.05) translateY(${scrollY * 0.15}px)`, transition:'transform .05s linear' }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(10,22,40,.78) 55%,rgba(10,22,40,.97) 100%)' }} />
          <div style={{ position:'absolute', top:40, right:-40, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle,${acc}44,transparent)`, animation:'floatBadge 6s ease-in-out infinite' }} />

          {/* Top bar patient */}
          <div style={{ position:'absolute', top:0, left:0, right:0, padding:'48px 22px 0', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:3 }}>
            {mounted && patient ? (
              <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,.85)' }}>Bonjour, {patient.first_name} 👋</div>
            ) : (
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.6)', letterSpacing:'1px', textTransform:'uppercase' }}>Bienvenue</div>
            )}
            {patient ? (
              <Link href="/profil" style={{ width:38, height:38, borderRadius:12, background:'rgba(255,255,255,.18)', border:'1.5px solid rgba(255,255,255,.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, textDecoration:'none', backdropFilter:'blur(8px)' }}>👤</Link>
            ) : (
              <Link href="/login" style={{ padding:'8px 16px', borderRadius:20, background:'rgba(255,255,255,.9)', color:acc2, fontSize:12, fontWeight:900, textDecoration:'none', boxShadow:'0 4px 16px rgba(0,0,0,.15)' }}>Connexion</Link>
            )}
          </div>

          {/* ECG LINE */}
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" style={{ position:'absolute', bottom:80, left:0, right:0, width:'100%', height:60, zIndex:1, opacity:.35, pointerEvents:'none' }}>
            <polyline points="0,30 40,30 55,30 65,5 75,55 85,10 95,30 120,30 140,30 155,30 165,8 175,52 185,12 195,30 220,30 260,30 275,30 285,7 295,53 305,11 315,30 340,30 400,30"
              fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="900" style={{ animation:'ecgDraw 3s linear infinite, ecgFade 3s linear infinite' }} />
          </svg>

          {/* Contenu hero */}
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 22px 32px', zIndex:2 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${acc}22`, backdropFilter:'blur(12px)', border:`1px solid ${acc}66`, borderRadius:20, padding:'6px 14px', marginBottom:14, width:'fit-content', animation:'floatBadge 3s ease-in-out infinite' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', animation:'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#fff', letterSpacing:'.5px' }}>Ouvert maintenant — 7h à 20h</span>
            </div>

            <div style={{ fontSize:30, fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:10, animation:'heroFadeUp .7s ease .1s both' }}>
              Des soins<br/>
              <span style={{
                background:`linear-gradient(90deg,${acc} 0%,#4ade80 50%,${acc} 100%) 200% center / 200% auto`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text', animation:'shimmerTxt 3s linear infinite',
              }}>d&apos;Excellence</span><br/>
              pour votre famille
            </div>

            <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', fontWeight:600, lineHeight:1.6, marginBottom:20, animation:'heroFadeUp .7s ease .2s both' }}>
              {name} — Médecine générale et spécialisée à Abidjan.
            </div>

            <div style={{ display:'flex', gap:10, marginBottom:0, animation:'heroFadeUp .7s ease .3s both' }}>
              <Link href="/booking" style={{ textDecoration:'none', flex:1 }}>
                <button className="rdv-btn" style={{ width:'100%', padding:'13px', borderRadius:16, background:`linear-gradient(135deg,${acc2},${acc})`, border:'none', color:'#fff', fontSize:13, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:`0 10px 30px ${acc}55`, animation:'floatA 3s ease-in-out infinite' }}>
                  📅 Prendre RDV
                </button>
              </Link>
              <Link href="/vitrine/services" style={{ textDecoration:'none', flex:1 }}>
                <button className="rdv-btn" style={{ width:'100%', padding:'13px', borderRadius:16, background:'rgba(255,255,255,.15)', border:'1.5px solid rgba(255,255,255,.4)', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', backdropFilter:'blur(10px)' }}>
                  Nos services →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ══ QUICK-ACTIONS PATIENT ══ */}
        <div style={{ margin:'-20px 16px 0', position:'relative', zIndex:20, animation:'scaleIn .5s ease .35s both' }}>
          <div style={{ background:'#fff', borderRadius:24, padding:'18px 16px', boxShadow:'0 16px 48px rgba(0,0,0,.14)', border:'1px solid rgba(255,255,255,.8)' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:14, textAlign:'center' }}>Espace patient</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {QUICK_ACTIONS.map((a, i) => {
                const floats = ['floatA','floatB','floatC','floatD']
                const delays = ['.1s','.35s','.6s','.85s']
                return (
                  <Link key={a.href} href={a.href} style={{ textDecoration:'none' }}>
                    <div className="qa-card" style={{
                      background:`${a.color}12`, borderRadius:18, padding:'14px 12px', textAlign:'center',
                      border:`1.5px solid ${a.color}28`,
                      animation:`slideUp .4s ease ${i*0.07}s both, ${floats[i]} ${3.5+i*0.4}s ease-in-out ${delays[i]} infinite`,
                    }}>
                      <div style={{ fontSize:26, marginBottom:6 }}>{a.icon}</div>
                      <div style={{ fontSize:11, fontWeight:900, color:'#0f172a', lineHeight:1.3 }}>{a.label}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* ══ STATS ══ */}
        <StatsSection acc={acc} />

        {/* ══ NOS SERVICES ══ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Ce que nous offrons</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a', lineHeight:1.2 }}>Nos Spécialités<br/>Médicales</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {SERVICES.map((s, i) => (
              <Link key={i} href={`/services/${s.slug}`} style={{ textDecoration:'none' }}>
                <div className="svc-card" style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 4px 18px rgba(0,0,0,.12)', animation:`scaleIn .4s ease ${i*0.05+0.2}s both`, position:'relative', height:160 }}
                  onTouchStart={e => {
                    const el = e.currentTarget
                    const rect = el.getBoundingClientRect()
                    const x = e.touches[0].clientX - rect.left
                    const y = e.touches[0].clientY - rect.top
                    const rip = document.createElement('span')
                    rip.style.cssText = `position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.35);left:${x-20}px;top:${y-20}px;animation:ripple .6s ease forwards;pointer-events:none;z-index:10`
                    el.appendChild(rip)
                    setTimeout(() => rip.remove(), 600)
                  }}>
                  <Image src={s.img} alt={s.label} fill sizes="50vw" style={{ objectFit:'cover', objectPosition:'center' }} />
                  <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg,transparent 20%,${s.dark}DD 100%)` }} />
                  <div style={{ position:'absolute', top:10, left:10, width:34, height:34, borderRadius:10, background:'rgba(255,255,255,.2)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.icon}</div>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 12px' }}>
                    <div style={{ fontSize:11, fontWeight:900, color:'#fff', lineHeight:1.3 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:s.color === '#1D9E75' ? '#a8edda' : 'rgba(255,255,255,.7)', fontWeight:800, marginTop:3 }}>Voir →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══ CTA RDV ══ */}
        <div style={{ margin:'32px 20px 0' }}>
          <div style={{ background:`linear-gradient(135deg,${acc2},${acc})`, borderRadius:28, padding:'28px 24px', position:'relative', overflow:'hidden', animation:'borderGlow 3s ease-in-out infinite' }}>
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
            <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
            <div style={{ position:'relative', zIndex:2 }}>
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.75)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Consultation gratuite</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:10 }}>Votre santé, notre priorité absolue</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:600, lineHeight:1.6, marginBottom:20 }}>
                Prenez rendez-vous en ligne en moins de 2 minutes. Notre équipe vous accueille 7j/7 à Abidjan.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <Link href="/booking" style={{ textDecoration:'none', flex:1 }}>
                  <button className="rdv-btn cta-btn-shimmer" style={{ width:'100%', padding:'14px', borderRadius:16, border:'none', color:acc2, fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:'0 8px 24px rgba(0,0,0,.2)' }}>
                    📅 Réserver maintenant
                  </button>
                </Link>
                <a href={`tel:${config?.contact_phone || '+2250102030405'}`} style={{ textDecoration:'none' }}>
                  <button className="rdv-btn" style={{ padding:'14px 18px', borderRadius:16, background:'rgba(255,255,255,.15)', border:'1.5px solid rgba(255,255,255,.4)', color:'#fff', fontSize:14, cursor:'pointer', fontFamily:'Nunito,sans-serif', backdropFilter:'blur(10px)' }}>
                    📞
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ══ ÉQUIPE ══ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Nos professionnels</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a', lineHeight:1.2 }}>L&apos;Équipe<br/>Médicale</div>
            <div style={{ fontSize:13, color:'#64748b', fontWeight:600, marginTop:8, lineHeight:1.6 }}>Des médecins expérimentés, dévoués et passionnés.</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {TEAM.map((m, i) => (
              <div key={i} className="team-card" style={{ background:'#fff', borderRadius:24, overflow:'hidden', boxShadow:'0 8px 28px rgba(0,0,0,.1)', display:'flex', animation:`slideRight .5s ease ${i*0.12+0.2}s both, cardPulse ${4+i*0.5}s ease-in-out ${i*0.8}s infinite` }}>
                <div style={{ width:110, flexShrink:0, position:'relative', overflow:'hidden' }}>
                  <Image src={m.img} alt={m.name} fill sizes="110px" style={{ objectFit:'cover' }} />
                  <div className="team-overlay" style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${acc2}cc,${acc}cc)`, opacity:0, transition:'opacity .3s' }} />
                </div>
                <div style={{ flex:1, padding:'18px 16px' }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'#0f172a', marginBottom:3 }}>{m.name}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:acc, marginBottom:10, textTransform:'uppercase', letterSpacing:'.5px' }}>{m.role}</div>
                  <div style={{ fontSize:12, color:'#64748b', fontWeight:600, lineHeight:1.55, fontStyle:'italic' }}>{m.quote}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ TÉMOIGNAGES ══ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Ils nous font confiance</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>Témoignages</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>
          <div style={{ background:'linear-gradient(135deg,#060F1C,#0B1D35,#122848)', borderRadius:28, padding:'28px 22px', position:'relative', overflow:'hidden', boxShadow:'0 16px 48px rgba(11,29,53,.5)', marginBottom:14 }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:150, height:150, borderRadius:'50%', background:`${acc}22` }} />
            <div style={{ fontSize:40, color:acc, fontWeight:900, lineHeight:1, marginBottom:12 }}>"</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,.95)', fontWeight:600, lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>
              {TESTIMONIALS[activeTestim].text}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Image src={TESTIMONIALS[activeTestim].img} alt="" width={48} height={48} style={{ borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(255,255,255,.4)' }} />
              <div>
                <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{TESTIMONIALS[activeTestim].name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.75)', fontWeight:700 }}>{TESTIMONIALS[activeTestim].service}</div>
              </div>
              <div style={{ marginLeft:'auto', color:'#FFD700', fontSize:14 }}>★★★★★</div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
            {TESTIMONIALS.map((_, i) => (
              <div key={i} onClick={() => setActiveTestim(i)} style={{ width:i===activeTestim?24:8, height:8, borderRadius:4, background:i===activeTestim?acc:'#e2e8f0', cursor:'pointer', transition:'all .3s' }} />
            ))}
          </div>
        </div>

        {/* ══ POURQUOI NOUS CHOISIR ══ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Nos engagements</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>Pourquoi nous<br/>choisir ?</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { icon:'🏆', title:'Excellence médicale',   desc:'Équipements modernes et médecins hautement qualifiés pour des diagnostics précis.', color:'#F59E0B' },
              { icon:'🤝', title:'Soins personnalisés',   desc:'Chaque patient est unique. Nous adaptons chaque traitement à votre situation.', color:'#1D9E75' },
              { icon:'📍', title:'Accessible à Abidjan',  desc:'Au cœur de la ville, parking disponible, accès facile en transport commun.', color:'#0B1D35' },
              { icon:'💳', title:'Tarifs transparents',   desc:'Des tarifs clairs affichés, sans surprises. Paiement Mobile Money accepté.', color:'#8B5CF6' },
            ].map((it, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:20, padding:'18px', display:'flex', gap:14, alignItems:'flex-start', boxShadow:'0 4px 16px rgba(0,0,0,.07)', border:`1px solid ${it.color}18` }}>
                <div style={{ width:50, height:50, borderRadius:16, background:`${it.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{it.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:4 }}>{it.title}</div>
                  <div style={{ fontSize:12, color:'#64748b', fontWeight:600, lineHeight:1.55 }}>{it.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FAQ ══ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Questions fréquentes</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>FAQ</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>
          <FaqSection acc={acc} />
        </div>

        {/* ══ FOOTER CONTACT ══ */}
        <div style={{ margin:'36px 20px 0', background:'linear-gradient(155deg,#0a1628,#1a2d4a)', borderRadius:28, padding:'32px 22px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:160, height:160, borderRadius:'50%', background:`${acc}18` }} />
          <div style={{ position:'relative', zIndex:2 }}>
            <div style={{ fontSize:11, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Contactez-nous</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:6 }}>{name}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.65)', fontWeight:600, lineHeight:1.6, marginBottom:22 }}>
              {config?.contact_address || 'Cocody, Abidjan, Côte d\'Ivoire'}<br/>
              Lun – Sam : 7h00 – 20h00 · Urgences 24h/24
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <a href={`tel:${config?.contact_phone || '+2250102030405'}`} style={{ textDecoration:'none' }}>
                <button className="rdv-btn" style={{ width:'100%', padding:'14px', borderRadius:16, background:`linear-gradient(135deg,${acc2},${acc})`, border:'none', color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:`0 8px 24px ${acc}44` }}>
                  📞 Nous appeler
                </button>
              </a>
              <Link href="/booking" style={{ textDecoration:'none' }}>
                <button className="rdv-btn" style={{ width:'100%', padding:'14px', borderRadius:16, background:'rgba(255,255,255,.1)', border:'1.5px solid rgba(255,255,255,.25)', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
                  📅 Prendre rendez-vous
                </button>
              </Link>
            </div>
            <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.1)', textAlign:'center' }}>
              <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,.8)' }}>Oria Care · {name}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:600, marginTop:4 }}>Abidjan, Côte d&apos;Ivoire · Propulsé par Oria Care</div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

function FaqSection({ acc }: { acc: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const FAQ = [
    { q:'Comment prendre rendez-vous ?',            r:'Via l\'application en cliquant sur "Prendre RDV", ou par téléphone. Nous confirmons votre RDV par SMS.' },
    { q:'Quels moyens de paiement acceptez-vous ?', r:'Espèces, Mobile Money (Orange Money, MTN MoMo, Wave) et cartes bancaires. Nous travaillons avec la CNAM et certaines mutuelles.' },
    { q:'La téléconsultation est-elle disponible ?', r:'Oui ! Vous pouvez consulter depuis n\'importe où en Côte d\'Ivoire par vidéo. Idéal pour le suivi de traitement.' },
    { q:'Les urgences sont-elles assurées la nuit ?', r:'Oui, notre service d\'urgences est ouvert 24h/24 et 7j/7. Une équipe médicale est toujours présente.' },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {FAQ.map((f, i) => (
        <div key={i} onClick={() => setOpen(open===i ? null : i)} style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,.07)', border:`1px solid ${open===i ? acc+'44' : 'transparent'}`, cursor:'pointer', transition:'border-color .2s' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px' }}>
            <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', flex:1, paddingRight:12 }}>{f.q}</div>
            <div style={{ fontSize:18, color:acc, transform:open===i?'rotate(45deg)':'none', transition:'transform .25s', flexShrink:0 }}>+</div>
          </div>
          {open===i && (
            <div style={{ padding:'0 18px 16px', fontSize:13, color:'#64748b', fontWeight:600, lineHeight:1.65 }}>{f.r}</div>
          )}
        </div>
      ))}
    </div>
  )
}
