'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'
const NAVY = '#0B1D35'
const NAVY2 = '#060F1C'

const SERVICES: Record<string, {
  label: string
  img: string
  color: string
  dark: string
  icon: string
  description: string
  details: string[]
  duration: string
  price: string
}> = {
  'consultation-generale': {
    label: 'Consultation Générale',
    img: '/images/Services/General Consultation mint green 800x800.png',
    color: ACC, dark: ACC2, icon: '🩺',
    description: 'Notre service de consultation générale vous offre un suivi médical complet et personnalisé. Nos médecins généralistes expérimentés prennent en charge toutes vos préoccupations de santé avec écoute et professionnalisme.',
    details: ['Diagnostic clinique complet', 'Prescription de médicaments', 'Ordonnances médicales', 'Suivi des maladies chroniques', 'Certificats médicaux', 'Orientation vers les spécialistes'],
    duration: '20 – 30 min', price: 'Sur devis',
  },
  'analyses-bilans': {
    label: 'Analyses & Bilans',
    img: '/images/Services/Analyses and Reports 800x800 style reference.png',
    color: NAVY, dark: NAVY2, icon: '🧪',
    description: 'Notre laboratoire d\'analyses médicales est équipé des technologies les plus récentes. Nous réalisons tous types d\'analyses biologiques avec des résultats rapides et fiables pour un suivi de santé optimal.',
    details: ['Analyses sanguines complètes', 'Bilans lipidiques et glycémiques', 'Tests de dépistage', 'Analyses urinaires', 'Résultats en 24-48h', 'Envoi des résultats par SMS'],
    duration: '15 – 20 min', price: 'Sur devis',
  },
  'radiologie-imagerie': {
    label: 'Radiologie & Imagerie',
    img: '/images/Services/Radiologie et Imagerie 800x800 style reference.png',
    color: ACC, dark: ACC2, icon: '🩻',
    description: 'Notre plateau technique d\'imagerie médicale dispose d\'équipements de dernière génération. Radios, échographies et scanners sont réalisés par des radiologues qualifiés pour des diagnostics précis et rapides.',
    details: ['Radiographie standard (radio)', 'Échographie abdominale & obstétricale', 'Scanner (TDM)', 'IRM sur demande', 'Interprétation immédiate', 'Compte-rendu disponible sous 2h'],
    duration: '30 – 60 min', price: 'Sur devis',
  },
  'pediatrie': {
    label: 'Pédiatrie',
    img: '/images/Services/Pediatrie 800x800 style reference.png',
    color: NAVY, dark: NAVY2, icon: '👶',
    description: 'Notre service de pédiatrie est dédié à la santé de vos enfants de la naissance à l\'adolescence. Nos pédiatres passionnés assurent un suivi personnalisé dans un environnement bienveillant et rassurant.',
    details: ['Suivi de croissance et développement', 'Vaccinations et carnet de santé', 'Consultation nourrisson', 'Maladies infantiles courantes', 'Nutrition pédiatrique', 'Urgences pédiatriques'],
    duration: '20 – 40 min', price: 'Sur devis',
  },
  'cardiologie': {
    label: 'Cardiologie',
    img: '/images/Services/Cardiologie 800x800 style reference.png',
    color: ACC, dark: ACC2, icon: '❤️',
    description: 'Notre service de cardiologie prend en charge toutes les pathologies cardiaques et vasculaires. Nos cardiologues utilisent les techniques diagnostiques les plus avancées pour protéger votre cœur.',
    details: ['Électrocardiogramme (ECG)', 'Échocardiographie', 'Holter cardiaque 24h', 'Test d\'effort', 'Hypertension artérielle', 'Suivi post-infarctus'],
    duration: '30 – 45 min', price: 'Sur devis',
  },
  'teleconsultation': {
    label: 'Téléconsultation',
    img: '/images/Services/Teleconsultation 800x800 style reference.png',
    color: NAVY, dark: NAVY2, icon: '🎥',
    description: 'Consultez un médecin depuis chez vous ou n\'importe où en Côte d\'Ivoire. Notre service de téléconsultation vous connecte en temps réel avec nos médecins via une interface sécurisée et simple d\'utilisation.',
    details: ['Consultation vidéo sécurisée', 'Disponible 7j/7 de 7h à 22h', 'Ordonnance électronique', 'Accessible depuis tout appareil', 'Suivi médical à distance', 'Idéal pour les zones éloignées'],
    duration: '15 – 25 min', price: 'Sur devis',
  },
  'hospitalisation': {
    label: 'Hospitalisation',
    img: '/images/Services/Hospitalisation 800x800 style reference.png',
    color: ACC, dark: ACC2, icon: '🏥',
    description: 'Notre service d\'hospitalisation offre des chambres confortables et un suivi médical continu 24h/24. Une équipe pluridisciplinaire dédiée assure votre rétablissement dans les meilleures conditions.',
    details: ['Chambres individuelles climatisées', 'Surveillance médicale 24h/24', 'Équipe soignante qualifiée', 'Restauration adaptée', 'Visites famille encadrées', 'Sortie accompagnée'],
    duration: 'Selon prescription', price: 'Sur devis',
  },
  'urgences': {
    label: 'Urgences 24h/24',
    img: '/images/Services/24-7 Emergency Room 800x800 style reference.png',
    color: NAVY, dark: NAVY2, icon: '🚑',
    description: 'Notre service d\'urgences est ouvert 7j/7, 24h/24 avec une équipe médicale toujours présente. Nous intervenons rapidement pour toute situation nécessitant une prise en charge immédiate.',
    details: ['Accueil immédiat sans rendez-vous', 'Médecin urgentiste disponible 24h/24', 'Salle de déchocage équipée', 'Ambulance et SAMU partenaire', 'Triage et priorisation rapide', 'Liaison avec les spécialistes'],
    duration: 'Immédiat', price: 'Sur devis',
  },
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const s = SERVICES[slug]

  if (!s) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, fontFamily:'Nunito,system-ui,sans-serif' }}>
        <div style={{ fontSize:64 }}>🔍</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', marginTop:16 }}>Service introuvable</div>
        <Link href="/home" style={{ marginTop:20, color:ACC, fontWeight:700, textDecoration:'none' }}>← Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        .rdv-btn { transition:transform .2s,box-shadow .2s; }
        .rdv-btn:active { transform:scale(.97); }
        .detail-item { transition:transform .2s; }
        .detail-item:active { transform:scale(.97); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:100 }}>

        {/* ── HERO ── */}
        <div style={{ position:'relative', height:300, overflow:'hidden' }}>
          <img src={s.img} alt={s.label} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg,rgba(6,15,28,.9) 0%,rgba(11,29,53,.75) 45%,${s.dark}CC 100%)` }} />
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:160, height:160, borderRadius:'50%', background:`${s.color}22`, pointerEvents:'none' }} />

          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 20px 28px' }}>
            <button onClick={() => router.back()} style={{ position:'absolute', top:52, left:20, width:40,height:40,borderRadius:13,background:'rgba(255,255,255,.18)',border:'1.5px solid rgba(255,255,255,.3)',color:'#fff',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)' }}>←</button>
            <div style={{ fontSize:36, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:11, fontWeight:800, color:'#a8edda', letterSpacing:'2px', textTransform:'uppercase', marginBottom:6 }}>Spécialité médicale</div>
            <div style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1.2 }}>{s.label}</div>
            <div style={{ display:'flex', gap:12, marginTop:12 }}>
              <div style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(10px)', borderRadius:10, padding:'6px 12px', fontSize:11, color:'#fff', fontWeight:700 }}>⏱ {s.duration}</div>
              <div style={{ background:'rgba(168,237,218,.2)', backdropFilter:'blur(10px)', borderRadius:10, padding:'6px 12px', fontSize:11, color:'#a8edda', fontWeight:700 }}>💰 {s.price}</div>
            </div>
          </div>
        </div>

        <div style={{ padding:'24px 20px 0' }}>

          {/* ── DESCRIPTION ── */}
          <div style={{ background:'#fff', borderRadius:20, padding:'20px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .05s both', boxShadow:'0 4px 16px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:12 }}>À propos de ce service</div>
            <div style={{ fontSize:13, color:'#475569', lineHeight:1.7, fontWeight:600 }}>{s.description}</div>
          </div>

          {/* ── CE QU'ON FAIT ── */}
          <div style={{ background:'#fff', borderRadius:20, padding:'20px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .1s both', boxShadow:'0 4px 16px rgba(0,0,0,.06)' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14 }}>Ce que nous proposons</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {s.details.map((d, i) => (
                <div key={i} className="detail-item" style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:12, background:`${s.color}0D`, border:`1px solid ${s.color}20` }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:`${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>✓</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ÉQUIPE ── */}
          <div style={{ background:`linear-gradient(135deg,${s.dark},${s.color})`, borderRadius:20, padding:'20px', marginBottom:16, animation:'slideUp .4s ease .15s both', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-20px', right:'-20px', width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
            <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:700, marginBottom:6 }}>Notre équipe</div>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff', lineHeight:1.3 }}>Des spécialistes qualifiés à votre service 7j/7</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', marginTop:8, fontWeight:600 }}>12+ médecins · 5 000+ patients traités · 15 ans d'expérience</div>
          </div>
        </div>

        {/* ── BOUTON RDV FIXE EN BAS ── */}
        <div style={{ position:'fixed', bottom:72, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, padding:'12px 20px', background:'linear-gradient(to top,#fff 70%,transparent)', zIndex:100 }}>
          <Link href={`/booking?service=${encodeURIComponent(s.label)}`} style={{ textDecoration:'none' }}>
            <button className="rdv-btn" style={{ width:'100%', padding:'16px', borderRadius:18, background:`linear-gradient(135deg,${s.dark},${s.color})`, border:'none', color:'#fff', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:`0 10px 32px ${s.color}55`, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
              📅 Prendre rendez-vous
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
