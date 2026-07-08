'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useClinicConfig } from '@/lib/useClinicConfig'
import { clinicConfig } from '@/chassis.config'

const HERO_IMG  = '/images/Hero Principal.png'

const SERVICES = [
  { icon:'🩺', title:'Consultation Générale',  desc:'Bilan complet, diagnostic, ordonnance personnalisée.',          price:'5 000 FCFA',      img: '/images/Services/General Consultation mint green 800x800.png',          color:'#1D9E75', blue:false },
  { icon:'👶', title:'Pédiatrie',               desc:'Soins enfants 0–16 ans, vaccinations et suivi de croissance.',  price:'6 000 FCFA',      img: '/images/Services/Pediatrie 800x800 style reference.png',                 color:'#0B1D35', blue:true  },
  { icon:'❤️', title:'Cardiologie',             desc:'ECG, bilan cardiaque, suivi hypertension et arythmies.',       price:'12 000 FCFA',     img: '/images/Services/Cardiologie 800x800 style reference.png',               color:'#1D9E75', blue:false },
  { icon:'🧠', title:'Neurologie',              desc:'Céphalées, vertiges, épilepsie et bilan neurologique.',        price:'15 000 FCFA',     img: '/images/Services/Neurologie 800x800 style reference.png',                color:'#0B1D35', blue:true  },
  { icon:'🧪', title:'Analyses Biologiques',    desc:'Bilan sanguin, glycémie, lipides, rénaux et hormonal.',        price:'dès 3 500 FCFA',  img: '/images/Services/Analyses and Reports 800x800 style reference.png',      color:'#1D9E75', blue:false },
  { icon:'🩻', title:'Radiologie & Imagerie',   desc:'Radio, échographie abdominale, obstétricale et pelvienne.',    price:'dès 8 000 FCFA',  img: '/images/Services/Radiologie et Imagerie 800x800 style reference.png',    color:'#0B1D35', blue:true  },
  { icon:'🎥', title:'Téléconsultation',         desc:'Consultez votre médecin par vidéo 7j/7, où que vous soyez.',  price:'4 000 FCFA',      img: '/images/Services/Teleconsultation 800x800 style reference.png',          color:'#1D9E75', blue:false },
  { icon:'🚑', title:'Urgences 24h/24',         desc:'Service d\'urgences permanent. Intervention rapide garantie.',price:'8 000 FCFA',      img: '/images/Services/24-7 Emergency Room 800x800 style reference.png',       color:'#0B1D35', blue:true  },
]

const STATS = [
  { label:'Satisfaction patients',    value:98 },
  { label:'Succès des interventions', value:96 },
  { label:'Satisfaction du personnel',value:94 },
  { label:'Taux de recommandation',   value:99 },
]

const TESTIMONIALS = [
  { name:'Kouamé Brice',      service:'Consultation générale', img:'/images/Témoignages clients/Photos témoignages clients 1.jpg', text:'Service impeccable, médecin à l\'écoute. Un diagnostic précis et un suivi personnalisé. Je recommande vivement.' },
  { name:'N\'Guessan Akissi', service:'Bilan de santé',        img:'/images/Témoignages clients/Photos témoignages clients 2.jpg', text:'Clinique moderne avec du matériel de pointe. Personnel professionnel et très accueillant. Bravo à toute l\'équipe !' },
  { name:'Diallo Mamadou',    service:'Pédiatrie',              img:'/images/Témoignages clients/Photos témoignages clients 3.jpg', text:'Docteur Traoré est formidable avec les enfants. Ma fille attendait la consultation avec joie. Médecine humaine et de qualité.' },
  { name:'Assi Marie-Claire', service:'Téléconsultation',       img:'/images/Témoignages clients/Photos témoignages clients 4.jpg', text:'J\'ai pu consulter depuis Bouaké sans me déplacer. La téléconsultation fonctionne parfaitement. Une vraie innovation !' },
  { name:'Touré Ibrahim',     service:'Cardiologie',             img:'/images/Témoignages clients/Photos témoignages clients 5.jpg', text:'Bilan cardiaque complet, médecin très sérieux. Les résultats m\'ont été expliqués clairement. Excellent cabinet.' },
  { name:'Bamba Aminata',     service:'Radiologie',              img:'/images/Témoignages clients/Photos témoignages clients 6.jpg', text:'Échographie rapide et professionnelle. L\'équipe est rassurante et compétente. Je reviens sans hésitation.' },
]

const FEATURED = [
  { img:'/images/Services/General Consultation mint green 800x800.png',       title:'Consultation & Suivi',      desc:'Nos médecins généralistes et spécialistes vous accompagnent à chaque étape de votre parcours de santé.',  tag:'Disponible aujourd\'hui', accent:'#1D9E75' },
  { img:'/images/Services/Radiologie et Imagerie 800x800 style reference.png', title:'Imagerie Médicale',          desc:'Radio, échographie, scanner — équipements modernes pour un diagnostic précis et rapide.',                   tag:'Haute technologie',        accent:'#0B1D35' },
  { img:'/images/Services/Teleconsultation 800x800 style reference.png',       title:'Téléconsultation',           desc:'Consultez depuis Abidjan, Bouaké ou n\'importe où en Côte d\'Ivoire par vidéo sécurisée.',                 tag:'Innovation numérique',     accent:'#1D9E75' },
  { img:'/images/Services/Hospitalisation 800x800 style reference.png',        title:'Urgences & Hospitalisation', desc:'Une équipe médicale disponible 24h/24 pour vous prendre en charge rapidement et efficacement.',             tag:'24h / 7j',                 accent:'#0B1D35' },
]

export default function VitrineServicesPage() {
  const router = useRouter()
  const { config } = useClinicConfig()
  const [activeTestim, setActiveTestim] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveTestim(i => (i + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const acc  = config?.primary_color   || '#1D9E75'
  const acc2 = config?.secondary_color || '#0F6E56'
  const BLUE = '#0B1D35'
  const BLUE2 = '#060F1C'

  return (
    <>
      <style>{`
        @keyframes heroFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes shimmerTxt { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes pulse      { 0%,100%{box-shadow:0 0 0 0 rgba(29,158,117,.45)} 70%{box-shadow:0 0 0 10px rgba(29,158,117,0)} }
        @keyframes scaleIn    { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .svc-card  { transition:transform .2s cubic-bezier(.34,1.56,.64,1); }
        .svc-card:active  { transform:scale(.96); }
        .feat-card { transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s; }
        .feat-card:active { transform:scale(.98); }
        .rdv-btn   { transition:all .22s; }
        .rdv-btn:hover  { transform:translateY(-2px); filter:brightness(1.08); }
        .rdv-btn:active { transform:scale(.96); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:100 }}>

        {/* ══════════════════════════════════════
            HERO — photo plein écran
        ══════════════════════════════════════ */}
        <div style={{ position:'relative', height:480, overflow:'hidden' }}>
          <Image src={HERO_IMG} alt="Services" fill sizes="100vw" style={{ objectFit:'cover', objectPosition:'center top' }} priority />
          {/* Overlay vert → bleu */}
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg,${acc2}99 0%,${BLUE2}cc 50%,rgba(10,22,40,.97) 100%)` }} />
          {/* Orbe */}
          <div style={{ position:'absolute', top:30, right:-50, width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle,${acc}44,transparent)`, animation:'floatBadge 7s ease-in-out infinite', pointerEvents:'none' }} />

          {/* Bouton retour */}
          <button onClick={() => router.back()} style={{ position:'absolute', top:52, left:20, zIndex:10, width:40, height:40, borderRadius:13, background:'rgba(255,255,255,.18)', border:'1.5px solid rgba(255,255,255,.3)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)' }}>←</button>

          {/* Contenu hero */}
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 22px 40px', zIndex:2 }}>
            {/* Badge animé */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${acc}22`, backdropFilter:'blur(12px)', border:`1px solid ${acc}66`, borderRadius:20, padding:'6px 14px', marginBottom:16, width:'fit-content', animation:'floatBadge 3s ease-in-out infinite' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', animation:'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#fff', letterSpacing:'.5px' }}>{config?.clinic_name || clinicConfig.name}</span>
            </div>

            <div style={{ fontSize:34, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:12, animation:'heroFadeUp .7s ease .1s both' }}>
              Nos Services<br/>
              <span style={{
                background:`linear-gradient(90deg,${acc} 0%,#60a5fa 50%,${acc} 100%) 200% center / 200% auto`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text', animation:'shimmerTxt 3s linear infinite',
              }}>Médicaux</span>
            </div>

            <div style={{ fontSize:14, color:'rgba(255,255,255,.8)', fontWeight:600, lineHeight:1.65, marginBottom:24, animation:'heroFadeUp .7s ease .2s both' }}>
              Des soins d&apos;excellence, une équipe dédiée — à Abidjan, pour vous.
            </div>

            {/* Stats hero */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, animation:'heroFadeUp .7s ease .3s both' }}>
              {[['10+','Services'],['24h/24','Urgences'],['98%','Satisfaction']].map(([v,l]) => (
                <div key={l} style={{ background:'rgba(255,255,255,.14)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.25)', borderRadius:16, padding:'12px 8px', textAlign:'center' }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{v}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', fontWeight:700, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            8 SERVICES — cartes photo en fond
        ══════════════════════════════════════ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Ce que nous offrons</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#0f172a', lineHeight:1.2 }}>Excellence en soins</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc},${BLUE})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="svc-card" style={{ borderRadius:22, overflow:'hidden', boxShadow:'0 8px 28px rgba(0,0,0,.15)', position:'relative', height:200, animation:`scaleIn .4s ease ${i*0.06}s both` }}>
                {/* Photo fond */}
                <Image src={s.img} alt={s.title} fill sizes="50vw" style={{ objectFit:'cover' }} />
                {/* Overlay dégradé vert ou bleu */}
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg,${s.color}55 0%,rgba(10,20,40,.85) 60%,rgba(10,20,40,.97) 100%)` }} />
                {/* Contenu */}
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'14px 14px' }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.75)', fontWeight:600, lineHeight:1.5, marginBottom:10 }}>{s.desc}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ fontSize:10, fontWeight:900, color: s.blue ? '#93c5fd' : '#6ee7b7' }}>{s.price}</div>
                    <Link href="/booking" style={{ textDecoration:'none' }}>
                      <button className="rdv-btn" style={{ padding:'5px 12px', borderRadius:10, background: s.blue ? `linear-gradient(135deg,${BLUE2},${BLUE})` : `linear-gradient(135deg,${acc2},${acc})`, border:'none', color:'#fff', fontSize:10, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif' }}>
                        RDV →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            STATS — barres animées
        ══════════════════════════════════════ */}
        <div style={{ margin:'36px 20px 0', background:'#fff', borderRadius:28, padding:'28px 22px', boxShadow:'0 8px 32px rgba(0,0,0,.08)' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Notre bilan</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>Nos services en chiffres</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc},${BLUE})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>{s.label}</div>
                  <div style={{ fontSize:14, fontWeight:900, color: i%2===0 ? acc : BLUE }}>{s.value}%</div>
                </div>
                <div style={{ height:9, background:'#f1f5f9', borderRadius:9, overflow:'hidden' }}>
                  <div style={{
                    height:'100%',
                    width:`${s.value}%`,
                    background: i%2===0 ? `linear-gradient(90deg,${acc2},${acc})` : `linear-gradient(90deg,${BLUE2},${BLUE})`,
                    borderRadius:9,
                    transition:`width 1.1s cubic-bezier(.4,0,.2,1) ${i*0.18}s`,
                    boxShadow: i%2===0 ? `0 0 12px ${acc}66` : `0 0 12px ${BLUE}66`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            TÉMOIGNAGES
        ══════════════════════════════════════ */}
        <div style={{ padding:'36px 20px 0' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:acc, letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Ils nous font confiance</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0f172a', lineHeight:1.2 }}>Des sourires pour toute la vie</div>
            <div style={{ width:48, height:3, background:`linear-gradient(90deg,${acc},${BLUE})`, borderRadius:2, margin:'12px auto 0' }} />
          </div>

          {/* Carte témoignage actif */}
          <div style={{ background:`linear-gradient(135deg,${acc2},${acc} 50%,${BLUE})`, borderRadius:28, padding:'28px 22px', position:'relative', overflow:'hidden', boxShadow:`0 16px 48px ${acc}44`, marginBottom:14 }}>
            <div style={{ position:'absolute', top:'-30px', right:'-30px', width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
            <div style={{ fontSize:44, color:'rgba(255,255,255,.2)', fontWeight:900, lineHeight:1, marginBottom:14 }}>"</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,.95)', fontWeight:600, lineHeight:1.75, marginBottom:20, fontStyle:'italic' }}>
              {TESTIMONIALS[activeTestim].text}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Image src={TESTIMONIALS[activeTestim].img} alt="" width={50} height={50} style={{ borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(255,255,255,.4)' }} />
              <div>
                <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{TESTIMONIALS[activeTestim].name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.75)', fontWeight:700 }}>{TESTIMONIALS[activeTestim].service}</div>
              </div>
              <div style={{ marginLeft:'auto', color:'#FFD700', fontSize:14 }}>★★★★★</div>
            </div>
          </div>

          {/* Dots navigation */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:4 }}>
            {TESTIMONIALS.map((_, i) => (
              <div key={i} onClick={() => setActiveTestim(i)} style={{ width:i===activeTestim?24:8, height:8, borderRadius:4, background:i===activeTestim?acc:'#e2e8f0', cursor:'pointer', transition:'all .3s' }} />
            ))}
          </div>

          {/* Mini cartes témoignages */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14 }}>
            {TESTIMONIALS.slice(0,4).map((t, i) => (
              <div key={i} onClick={() => setActiveTestim(i)} style={{ background: activeTestim===i ? `${acc}12` : '#fff', borderRadius:18, padding:'14px', border:`1.5px solid ${activeTestim===i ? acc+'44' : '#f1f5f9'}`, cursor:'pointer', transition:'all .2s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <Image src={t.img} alt="" width={34} height={34} style={{ borderRadius:'50%', objectFit:'cover' }} />
                  <div>
                    <div style={{ fontSize:11, fontWeight:900, color:'#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize:9, color:acc, fontWeight:800 }}>{t.service}</div>
                  </div>
                </div>
                <div style={{ fontSize:10, color:'#64748b', fontWeight:600, lineHeight:1.5 }}>{t.text.slice(0,55)}…</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════ */}
        <div style={{ margin:'36px 20px 0' }}>
          <div style={{ background:`linear-gradient(135deg,${acc2},${acc} 45%,${BLUE})`, borderRadius:28, padding:'30px 24px', position:'relative', overflow:'hidden', boxShadow:`0 16px 48px ${acc}44` }}>
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
            <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
            <div style={{ position:'relative', zIndex:2 }}>
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:8 }}>Sans attente</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.25, marginBottom:10 }}>Prenez rendez-vous en ligne</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:600, lineHeight:1.65, marginBottom:22 }}>
                En moins de 2 minutes depuis l&apos;application. Confirmé par SMS immédiatement.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <Link href="/booking" style={{ textDecoration:'none', flex:1 }}>
                  <button className="rdv-btn" style={{ width:'100%', padding:'14px', borderRadius:16, background:'#fff', border:'none', color:acc2, fontSize:14, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:'0 8px 24px rgba(0,0,0,.2)' }}>
                    📅 Prendre RDV
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

      </div>
    </>
  )
}
