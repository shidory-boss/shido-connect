'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useClinicConfig } from '@/lib/useClinicConfig'

/* ── Couleurs ── */
const ACC  = '#1D9E75'
const ACC2 = '#0F6E56'
const GOLD = '#C9A84C'

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
  { icon:'🩺', label:'Consultation Générale',  color:'#1D9E75', dark:'#0F6E56' },
  { icon:'🧪', label:'Analyses & Bilans',       color:'#F59E0B', dark:'#D97706' },
  { icon:'🩻', label:'Radiologie & Imagerie',   color:'#6366F1', dark:'#4338CA' },
  { icon:'👶', label:'Pédiatrie',               color:'#0B1D35', dark:'#060F1C' },
  { icon:'❤️', label:'Cardiologie',             color:'#EF4444', dark:'#B91C1C' },
  { icon:'🎥', label:'Téléconsultation',         color:'#0EA5E9', dark:'#0369A1' },
  { icon:'🏥', label:'Hospitalisation',          color:'#8B5CF6', dark:'#6D28D9' },
  { icon:'🚑', label:'Urgences 24h/24',         color:'#F97316', dark:'#C2410C' },
]

const TEAM = [
  { name:'Oria Care Aboubakar',  role:'Directeur Médical',       img: TEAM_IMGS[0], quote:'"La confiance et l\'écoute sont au cœur de notre engagement envers chaque patient."' },
  { name:'Dr. Coulibaly Fatou', role:'Médecin Spécialiste',      img: TEAM_IMGS[1], quote:'"Notre équipe s\'engage à offrir des soins de pointe dans un environnement chaleureux."' },
  { name:'Dr. Traoré Aminata',  role:'Pédiatre & Obstétricienne',img: TEAM_IMGS[2], quote:'"Chaque enfant mérite les meilleurs soins. C\'est notre mission quotidienne."' },
]

const TESTIMONIALS = [
  { name:'Kouamé Brice',    service:'Consultation générale', img:CLIENT_IMGS[0], text:'Service impeccable, médecin à l\'écoute. J\'ai reçu un diagnostic précis et un suivi personnalisé. Je recommande vivement ce cabinet.' },
  { name:'N\'Guessan Akissi',service:'Bilan de santé',       img:CLIENT_IMGS[1], text:'Une clinique moderne avec du matériel de pointe. Le personnel est professionnel et très accueillant. Bravo à toute l\'équipe !' },
  { name:'Diallo Mamadou',  service:'Pédiatrie',             img:CLIENT_IMGS[2], text:'Docteur Traoré est formidable avec les enfants. Ma fille attendait la consultation avec joie. Une médecine humaine et de qualité.' },
  { name:'Assi Marie-Claire',service:'Téléconsultation',     img:CLIENT_IMGS[3], text:'J\'ai pu consulter depuis Bouaké sans me déplacer. La téléconsultation fonctionne parfaitement. Une vraie innovation en Côte d\'Ivoire !' },
]

const STATS = [
  { value:'98%', label:'Satisfaction patients' },
  { value:'12+', label:'Médecins spécialistes' },
  { value:'5k+', label:'Patients traités' },
  { value:'15+', label:'Années d\'expérience' },
]

export default function VitrinePage() {
  const { config } = useClinicConfig()
  const [activeTestim, setActiveTestim]  = useState(0)
  const [scrollY, setScrollY]            = useState(0)
  const scrollRef                        = useRef<HTMLDivElement>(null)

  const acc  = config?.primary_color   || ACC
  const acc2 = config?.secondary_color || ACC2
  const name = config?.clinic_name     || 'Oria Care'

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrollY(el.scrollTop)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-rotate témoignages
  useEffect(() => {
    const t = setInterval(() => setActiveTestim(i => (i + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes heroFadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
        @keyframes shimmerTxt  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes floatBadge  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes scaleIn     { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes slideRight  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:none} }
        @keyframes pulse       { 0%,100%{box-shadow:0 0 0 0 rgba(29,158,117,.45)} 70%{box-shadow:0 0 0 12px rgba(29,158,117,0)} }
        .svc-card { transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s; }
        .svc-card:active { transform:scale(.95); }
        .team-card:hover .team-overlay { opacity:1!important; }
        .rdv-btn { transition:all .25s; }
        .rdv-btn:hover { transform:translateY(-2px); filter:brightness(1.07); }
        .rdv-btn:active { transform:scale(.96); }
      `}</style>

      <div ref={scrollRef} style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'Nunito,system-ui,sans-serif', overflowY:'auto', paddingBottom:80 }}>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <div style={{ position:'relative', height:520, overflow:'hidden' }}>
          {/* Photo */}
          <img
            src={HERO_IMG}
            alt="Clinique"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', transform:`scale(1.05) translateY(${scrollY * 0.15}px)`, transition:'transform .05s linear' }}
          />
          {/* Overlay gradient */}
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(10,22,40,.8) 60%, rgba(10,22,40,.96) 100%)` }} />
          {/* Orbes */}
          <div style={{ position:'absolute', top:40, right:-40, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle, ${acc}44, transparent)`, animation:'floatBadge 6s ease-in-out infinite' }} />

          {/* Contenu hero */}
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 22px 40px', zIndex:2 }}>
            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${acc}22`, backdropFilter:'blur(12px)', border:`1px solid ${acc}66`, borderRadius:20, padding:'6px 14px', marginBottom:16, width:'fit-content', animation:'floatBadge 3s ease-in-out infinite' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', animation:'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize:12, fontWeight:800, color:'#fff', letterSpacing:'.5px' }}>Ouvert maintenant — 7h à 20h</span>
            </div>

            <div style={{ fontSize:32, fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:12, animation:'heroFadeUp .7s ease .1s both' }}>
              Des soins<br/>
              <span style={{
                background:`linear-gradient(90deg,${acc} 0%,#4ade80 50%,${acc} 100%) 200% center / 200% auto`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text', animation:'shimmerTxt 3s linear infinite',
              }}>d&apos;Excellence</span><br/>
              pour votre famille
            </div>

            <div style={{ fontSize:14, color:'rgba(255,255,255,.78)', fontWeight:600, lineHeight:1.65, marginBottom:24, animation:'heroFadeUp .7s ease .2s both' }}>
              {name} — Médecine générale et spécialisée à Abidjan. Une équipe dévouée pour votre santé.
            </div>

            <div style={{ display:'flex', gap:10, animation:'heroFadeUp .7s ease .3s both' }}>
              <Link href="/booking" style={{ textDecoration:'none', flex:1 }}>
                <button className="rdv-btn" style={{ width:'100%', padding:'14px', borderRadius:16, background:`linear-gradient(135deg,${acc2},${acc})`, border:'none', color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:`0 10px 30px ${acc}55` }}>
                  📅 Prendre RDV
                </button>
              </Link>
              <Link href="/vitrine/services" style={{ textDecoration:'none', flex:1 }}>
                <button className="rdv-btn" style={{ width:'100%', padding:'14px', borderRadius:16, background:'rgba(255,255,255,.15)', border:'1.5px solid rgba(255,255,255,.4)', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', backdropFilter:'blur(10px)' }}>
                  Nos services →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STATS FLOTTANTES
        ══════════════════════════════════════════ */}
        <div style={{ margin:'-28px 16px 0', background:'#fff', borderRadius:24, padding:'20px 16px', boxShadow:'0 16px 48px rgba(0,0,0,.12)', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, position:'relative', zIndex:10, border:'1px solid rgba(255,255,255,.8)', animation:'scaleIn .5s ease .4s both' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:24, fontWeight:900, color:acc, letterSpacing:'-0.5px' }}>{s.value}</div>
              <div style={{ fontSize:11, color:'#64748b', fontWeight:700, marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            NOS SERVICES
        ══════════════════════════════════════════ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Ce que nous offrons</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a', lineHeight:1.2 }}>Nos Spécialités<br/>Médicales</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {SERVICES.map((s, i) => (
              <Link key={i} href="/vitrine/services" style={{ textDecoration:'none' }}>
                <div className="svc-card" style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 18px rgba(0,0,0,.08)', border:`1px solid ${s.color}18`, animation:`scaleIn .4s ease ${i*0.05+0.2}s both` }}>
                  <div style={{ background:`linear-gradient(135deg,${s.dark},${s.color})`, padding:'20px 16px 14px', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:'-20px', right:'-20px', width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,.12)' }} />
                    <div style={{ fontSize:32, position:'relative', zIndex:1 }}>{s.icon}</div>
                  </div>
                  <div style={{ padding:'12px 14px' }}>
                    <div style={{ fontSize:12, fontWeight:900, color:'#0f172a', lineHeight:1.3 }}>{s.label}</div>
                    <div style={{ fontSize:10, color:s.color, fontWeight:800, marginTop:6 }}>En savoir plus →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            CTA RENDEZ-VOUS
        ══════════════════════════════════════════ */}
        <div style={{ margin:'32px 20px 0' }}>
          <div style={{ background:`linear-gradient(135deg,${acc2},${acc})`, borderRadius:28, padding:'28px 24px', position:'relative', overflow:'hidden', boxShadow:`0 16px 48px ${acc}44` }}>
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
            <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
            <div style={{ position:'relative', zIndex:2 }}>
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.75)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>
                Consultation gratuite
              </div>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:10 }}>
                Votre santé, notre priorité absolue
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:600, lineHeight:1.6, marginBottom:20 }}>
                Prenez rendez-vous en ligne en moins de 2 minutes. Notre équipe vous accueille 7j/7 à Abidjan.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <Link href="/booking" style={{ textDecoration:'none', flex:1 }}>
                  <button className="rdv-btn" style={{ width:'100%', padding:'14px', borderRadius:16, background:'#fff', border:'none', color:acc2, fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:'0 8px 24px rgba(0,0,0,.2)' }}>
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

        {/* ══════════════════════════════════════════
            NOTRE ÉQUIPE
        ══════════════════════════════════════════ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Nos professionnels</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a', lineHeight:1.2 }}>L&apos;Équipe<br/>Médicale</div>
            <div style={{ fontSize:13, color:'#64748b', fontWeight:600, marginTop:8, lineHeight:1.6 }}>
              Des médecins expérimentés, dévoués et passionnés par l&apos;excellence des soins.
            </div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {TEAM.map((m, i) => (
              <div key={i} className="team-card" style={{ background:'#fff', borderRadius:24, overflow:'hidden', boxShadow:'0 8px 28px rgba(0,0,0,.1)', display:'flex', gap:0, animation:`slideRight .5s ease ${i*0.12+0.2}s both` }}>
                {/* Photo */}
                <div style={{ width:110, flexShrink:0, position:'relative', overflow:'hidden' }}>
                  <img src={m.img} alt={m.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  <div className="team-overlay" style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${acc2}cc,${acc}cc)`, opacity:0, transition:'opacity .3s' }} />
                </div>
                {/* Infos */}
                <div style={{ flex:1, padding:'18px 16px' }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'#0f172a', marginBottom:3 }}>{m.name}</div>
                  <div style={{ fontSize:11, fontWeight:800, color:acc, marginBottom:10, textTransform:'uppercase', letterSpacing:'.5px' }}>{m.role}</div>
                  <div style={{ fontSize:12, color:'#64748b', fontWeight:600, lineHeight:1.55, fontStyle:'italic' }}>{m.quote}</div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/vitrine/team" style={{ textDecoration:'none' }}>
            <button className="rdv-btn" style={{ width:'100%', marginTop:16, padding:'14px', borderRadius:18, background:'transparent', border:`2px solid ${acc}`, color:acc, fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
              Voir toute l&apos;équipe →
            </button>
          </Link>
        </div>

        {/* ══════════════════════════════════════════
            TÉMOIGNAGES
        ══════════════════════════════════════════ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Ils nous font confiance</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>Témoignages</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>

          {/* Carte active */}
          <div style={{ background:`linear-gradient(135deg,${acc2},${acc})`, borderRadius:28, padding:'28px 22px', position:'relative', overflow:'hidden', boxShadow:`0 16px 48px ${acc}44`, marginBottom:14 }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
            <div style={{ fontSize:40, color:'rgba(255,255,255,.25)', fontWeight:900, lineHeight:1, marginBottom:12 }}>"</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,.95)', fontWeight:600, lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>
              {TESTIMONIALS[activeTestim].text}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <img src={TESTIMONIALS[activeTestim].img} alt="" style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(255,255,255,.4)' }} />
              <div>
                <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{TESTIMONIALS[activeTestim].name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.75)', fontWeight:700 }}>{TESTIMONIALS[activeTestim].service}</div>
              </div>
              <div style={{ marginLeft:'auto', color:'#FFD700', fontSize:14 }}>★★★★★</div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
            {TESTIMONIALS.map((_, i) => (
              <div key={i} onClick={() => setActiveTestim(i)} style={{ width: i === activeTestim ? 24 : 8, height:8, borderRadius:4, background: i === activeTestim ? acc : '#e2e8f0', cursor:'pointer', transition:'all .3s' }} />
            ))}
          </div>

          <Link href="/vitrine/testimonials" style={{ textDecoration:'none' }}>
            <button className="rdv-btn" style={{ width:'100%', marginTop:14, padding:'14px', borderRadius:18, background:'transparent', border:`2px solid ${acc}`, color:acc, fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
              Tous les avis →
            </button>
          </Link>
        </div>

        {/* ══════════════════════════════════════════
            POURQUOI NOUS CHOISIR
        ══════════════════════════════════════════ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Nos engagements</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>Pourquoi nous<br/>choisir ?</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { icon:'🏆', title:'Excellence médicale',    desc:'Équipements modernes et médecins hautement qualifiés pour des diagnostics précis.', color:'#F59E0B' },
              { icon:'🤝', title:'Soins personnalisés',    desc:'Chaque patient est unique. Nous adaptons chaque traitement à votre situation.', color:'#1D9E75' },
              { icon:'📍', title:'Accessible à Abidjan',  desc:'Au cœur de la ville, parking disponible, accès facile en transport commun.', color:'#0B1D35' },
              { icon:'💳', title:'Tarifs transparents',   desc:'Des tarifs clairs affichés, sans surprises. Paiement Mobile Money accepté.', color:'#8B5CF6' },
            ].map((it, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:20, padding:'18px', display:'flex', gap:14, alignItems:'flex-start', boxShadow:'0 4px 16px rgba(0,0,0,.07)', border:`1px solid ${it.color}18`, animation:`scaleIn .4s ease ${i*0.08+0.2}s both` }}>
                <div style={{ width:50, height:50, borderRadius:16, background:`${it.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{it.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:4 }}>{it.title}</div>
                  <div style={{ fontSize:12, color:'#64748b', fontWeight:600, lineHeight:1.55 }}>{it.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Questions fréquentes</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>FAQ</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc2},${acc})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>

          <FaqSection acc={acc} />
        </div>

        {/* ══════════════════════════════════════════
            FOOTER CONTACT
        ══════════════════════════════════════════ */}
        <div style={{ margin:'36px 20px 0', background:`linear-gradient(155deg,#0a1628,#1a2d4a)`, borderRadius:28, padding:'32px 22px', position:'relative', overflow:'hidden' }}>
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
              <div style={{ fontSize:13, fontWeight:800, color:'rgba(255,255,255,.8)' }}>ShidoConnect · {name}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:600, marginTop:4 }}>Abidjan, Côte d&apos;Ivoire · Propulsé par ShidoOS</div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

/* ── Composant FAQ accordéon ── */
function FaqSection({ acc }: { acc: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const FAQ = [
    { q:'Comment prendre rendez-vous ?',         r:'Via l\'application en cliquant sur "Prendre RDV", ou par téléphone directement. Nous confirmeons votre RDV par SMS.' },
    { q:'Quels moyens de paiement acceptez-vous ?', r:'Espèces, Mobile Money (Orange Money, MTN MoMo, Wave) et cartes bancaires. Nous travaillons avec la CNAM et certaines mutuelles.' },
    { q:'La téléconsultation est-elle disponible ?', r:'Oui ! Vous pouvez consulter depuis n\'importe où en Côte d\'Ivoire par vidéo. Idéal pour le suivi de traitement et les consultations de contrôle.' },
    { q:'Les urgences sont-elles assurées la nuit ?', r:'Oui, notre service d\'urgences est ouvert 24h/24 et 7j/7. Une équipe médicale est toujours présente pour vous prendre en charge.' },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {FAQ.map((f, i) => (
        <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,.07)', border:`1px solid ${open===i ? acc+'44' : 'transparent'}`, cursor:'pointer', transition:'border-color .2s' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px' }}>
            <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', flex:1, paddingRight:12 }}>{f.q}</div>
            <div style={{ fontSize:18, color:acc, transform: open===i ? 'rotate(45deg)' : 'none', transition:'transform .25s', flexShrink:0 }}>+</div>
          </div>
          {open === i && (
            <div style={{ padding:'0 18px 16px', fontSize:13, color:'#64748b', fontWeight:600, lineHeight:1.65 }}>{f.r}</div>
          )}
        </div>
      ))}
    </div>
  )
}
