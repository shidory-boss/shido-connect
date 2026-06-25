'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACC  = '#1D9E75'
const ACC2 = '#0F6E56'
const BLUE = '#0B1D35'
const BLUE2 = '#060F1C'
const HERO_IMG = '/images/Hero 2.png'

/* ─── DONNÉES CÔTE D'IVOIRE ─── */
const VILLES = ['Abidjan','Bouaké','Daloa','Korhogo','Yamoussoukro','San-Pédro','Man','Divo','Gagnoa','Abengourou']

const COMMUNES_PAR_VILLE: Record<string, string[]> = {
  Abidjan:       ['Abobo','Adjamé','Anyama','Attécoubé','Bingerville','Cocody','Koumassi','Marcory','Plateau','Port-Bouët','Songon','Treichville','Yopougon'],
  Bouaké:        ['Bouaké Centre','Dar Es Salam','Koko','N\'Gattakro','Nimbo'],
  Daloa:         ['Daloa Centre','Lobia','Résidentiel','Kennedy'],
  Korhogo:       ['Korhogo Centre','Sinistré','Quartier Cissé','Résidentiel'],
  Yamoussoukro:  ['Centre','Dioulakro','Millionnaire','Habitat','Résidentiel'],
  'San-Pédro':   ['San-Pédro Centre','Lac','Bardot','Plage','Cité'],
  Man:           ['Man Centre','Dompleu','Résidentiel','Lycée'],
  Divo:          ['Divo Centre','Résidentiel','Cité'],
  Gagnoa:        ['Gagnoa Centre','Bahi','Résidentiel'],
  Abengourou:    ['Abengourou Centre','Résidentiel','Cité'],
}

const QUARTIERS: Record<string, string[]> = {
  // Abidjan
  Cocody:['Angré','Riviera 1','Riviera 2','Riviera 3','Riviera Palmeraie','2 Plateaux','2 Plateaux Vallon','Attoban','Danga','Faya','Bonoumin','Ambassades'],
  Yopougon:['Maroc','Wassakara','Niangon','Niangon Nord','Sideci','Selmer','Toit Rouge','Ananeraie','Banco','Millionnaire','Azito'],
  Marcory:['Zone 4','Anoumabo','Résidentiel','Biétry'],
  Koumassi:['Remblais','Grand Campement','Sicogi'],
  Treichville:['Avenue 12','Avenue 17','Gare Lagune'],
  Abobo:['Abobo Gare','Avocatier','Belleville','PK18','Sagbé','Anador'],
  Adjamé:['Liberté','Williamsville','220 Logements','Bracodi'],
  Plateau:['Centre','Indénié','Commerce'],
  'Port-Bouët':['Vridi','Gonzagueville','Aéroport','Jean Folly'],
  Attécoubé:['Locodjro','Agban','Santé'],
  Bingerville:['Centre','Eloka'],
  Anyama:['Centre','RAN'],
  Songon:['Centre','Kassemblé'],
}
const ASSURANCES = [
  {id:'cmu',label:'CMU (Couverture Maladie Universelle)'},
  {id:'mugef',label:'MUGEFCI'},
  {id:'cnam',label:'CNAM'},
  {id:'axa',label:'AXA Assurances CI'},
  {id:'nsia',label:'NSIA Vie'},
  {id:'allianz',label:'Allianz CI'},
  {id:'saham',label:'Saham / Sanlam'},
  {id:'atl',label:'Atlantique Assurances'},
  {id:'colina',label:'Colina'},
  {id:'autre',label:'Autre assurance'},
  {id:'aucune',label:'Pas d\'assurance'},
]
const GROUPES_SANGUINS = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Inconnu']
const ALLERGIES_COURANTES = ['Pénicilline','Amoxicilline','Sulfamides','Anti-inflammatoires (AINS)','Aspirine','Latex','Iode / Produits de contraste','Arachides','Fruits de mer']
const MALADIES_CHRONIQUES = ['Hypertension artérielle (HTA)','Diabète type 2','Drépanocytose','Asthme','VIH/SIDA','Tuberculose','Hépatite B','Hépatite C','Insuffisance rénale','Paludisme chronique','Ulcère gastrique','Épilepsie']
const MOTIFS = [
  {icon:'🩺',label:'Consultation générale'},
  {icon:'💊',label:'Suivi traitement'},
  {icon:'🔬',label:'Résultats examens'},
  {icon:'📋',label:'Renouvellement ordonnance'},
  {icon:'🤒',label:'Urgence / Douleur aiguë'},
  {icon:'💉',label:'Vaccination'},
  {icon:'🤰',label:'Suivi grossesse'},
  {icon:'👶',label:'Pédiatrie'},
]
const DOCTORS = [
  {id:1, name:'Dr. Kouamé Shidory', spec:'Neurologie', emoji:'👨‍⚕️'},
  {id:2, name:'Dr. Segou Yan', spec:'Cardiologie', emoji:'👩‍⚕️'},
  {id:3, name:'Dr. Ahouéfa Koné', spec:'Pédiatrie', emoji:'👩‍⚕️'},
  {id:4, name:'Dr. Bamba Oumar', spec:'Médecine générale', emoji:'👨‍⚕️'},
]
const CRENEAUX = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00','15:30','16:00']

const STEPS = [
  { title:'Identité',     icon:'👤', desc:'Informations personnelles' },
  { title:'Localisation', icon:'📍', desc:'Ville, commune & quartier' },
  { title:'Santé',        icon:'🩺', desc:'Assurance & groupe sanguin' },
  { title:'Antécédents',  icon:'📋', desc:'Maladies & traitements' },
  { title:'Urgence',      icon:'🚨', desc:'Contact en cas d\'urgence' },
  { title:'Rendez-vous',  icon:'📅', desc:'Médecin, date & heure' },
]

type Form = {
  first_name: string; last_name: string; phone: string; email: string
  date_of_birth: string; gender: string
  ville: string; commune: string; quartier: string
  ville_autre: string; commune_autre: string; quartier_autre: string
  assurance: string; blood_group: string; allergies: string[]
  chronic_diseases: string[]; current_treatments: string
  emergency_contact: string; emergency_phone: string
  motif: string; doctor_id: number | null; rdv_date: string; rdv_time: string
}

const EMPTY: Form = {
  first_name:'', last_name:'', phone:'', email:'',
  date_of_birth:'', gender:'',
  ville:'', commune:'', quartier:'',
  ville_autre:'', commune_autre:'', quartier_autre:'',
  assurance:'', blood_group:'Inconnu', allergies:[],
  chronic_diseases:[], current_treatments:'',
  emergency_contact:'', emergency_phone:'',
  motif:'', doctor_id:null, rdv_date:'', rdv_time:'',
}

type Doctor = { id: number; first_name: string; last_name: string; specialite?: string }

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [form, setForm]       = useState<Form>(EMPTY)
  const [calendar, setCalendar] = useState<string[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS.map(d => ({ id: d.id, first_name: d.name.split(' ')[1] || d.name, last_name: d.name.split(' ')[2] || '', specialite: d.spec })))
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const sc = localStorage.getItem('sc_patient')
    if (sc) {
      const p = JSON.parse(sc)
      setForm(f => ({ ...f, first_name: p.first_name||'', last_name: p.last_name||'', phone: p.phone||'' }))
    }
    const days: string[] = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (d.getDay() !== 0) days.push(d.toISOString().split('T')[0])
    }
    setCalendar(days)
    // Charger les vrais médecins depuis le backend
    const baseUrl = (typeof window !== 'undefined' && localStorage.getItem('sc_avion_url')) || 'http://localhost:8001'
    fetch(`${baseUrl}/api/v1/appointments/public/doctors`)
      .then(r => r.ok ? r.json() : [])
      .then((list: {id:number;first_name:string;last_name:string;specialite?:string}[]) => { if (list.length > 0) setDoctors(list) })
      .catch(() => {})
  }, [])

  // Sanitisation — supprime balises HTML et caractères dangereux
  const sanitize = (v: string) => v.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').slice(0, 200)
  const sanitizePhone = (v: string) => v.replace(/[^0-9+\s\-()]/g, '').slice(0, 20)
  const sanitizeEmail = (v: string) => v.replace(/[^a-zA-Z0-9@._\-+]/g, '').slice(0, 100)

  const set = (k: keyof Form, v: any) => {
    if (typeof v === 'string') {
      if (k === 'phone' || k === 'emergency_phone') v = sanitizePhone(v)
      else if (k === 'email') v = sanitizeEmail(v)
      else v = sanitize(v)
    }
    setForm(f => ({ ...f, [k]: v }))
  }

  const toggleList = (k: 'allergies' | 'chronic_diseases', val: string) => {
    setForm(f => {
      const arr = f[k] as string[]
      return { ...f, [k]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  const isValidPhone = (p: string) => /^(\+?225)?[\s\-]?[0-9\s\-]{8,14}$/.test(p.trim())
  const isValidEmail = (e: string) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const canNext = () => {
    if (step === 0) return (
      form.first_name.trim().length >= 2 &&
      form.last_name.trim().length >= 2 &&
      isValidPhone(form.phone) &&
      isValidEmail(form.email)
    )
    if (step === 5) return !!form.motif && form.doctor_id !== null && !!form.rdv_date && !!form.rdv_time
    return true
  }

  const next = async () => {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return }

    setSubmitting(true)
    setSubmitError('')
    try {
      const doctorObj = doctors.find(d => d.id === form.doctor_id)
      const doctorName = doctorObj ? `Dr. ${doctorObj.first_name} ${doctorObj.last_name}`.trim() : ''
      const scheduledAt = form.rdv_date && form.rdv_time ? `${form.rdv_date}T${form.rdv_time}:00` : ''
      const cfg = typeof window !== 'undefined' ? (() => { try { return JSON.parse(localStorage.getItem('sc_config') || 'null') } catch { return null } })() : null
      const clinicId = cfg?.clinic_id ?? null
      const finalCity    = form.ville    === 'Autre' ? form.ville_autre    : form.ville
      const finalCommune = form.commune  === 'Autre' ? form.commune_autre  : form.commune
      const finalQuartier= form.quartier === 'Autre' ? form.quartier_autre : form.quartier

      const baseUrl2 = (typeof window !== 'undefined' && localStorage.getItem('sc_avion_url')) || 'http://localhost:8001'
      const resp = await fetch(`${baseUrl2}/api/v1/appointments/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name:        `${form.first_name} ${form.last_name}`.trim(),
          patient_phone:       form.phone,
          doctor_id:           form.doctor_id,
          reason:              form.motif,
          scheduled_at:        scheduledAt,
          clinic_id:           clinicId,
          patient_blood_group: form.blood_group !== 'Inconnu' ? form.blood_group : undefined,
          patient_insurance:   form.assurance || undefined,
          patient_city:        finalCity || undefined,
          patient_commune:     finalCommune || undefined,
          patient_quartier:    finalQuartier || undefined,
        }),
      })
      if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error(e.detail || `Erreur ${resp.status}`) }
      const result = await resp.json()

      localStorage.setItem('sc_booking_data', JSON.stringify({
        ...form,
        allergies:        form.allergies.join(', '),
        chronic_diseases: form.chronic_diseases.join(', '),
        doctor_name:      doctorName,
        appointment_id:   result.id,
      }))
      router.push('/booking/confirm')
    } catch (e: any) {
      setSubmitError(e.message || 'Erreur lors de l\'envoi. Réessayez.')
      setSubmitting(false)
    }
  }

  const inp: React.CSSProperties = {
    width:'100%', padding:'13px 14px', borderRadius:14,
    border:'1.5px solid #e2e8f0', fontSize:14,
    fontFamily:"'Josefin Sans','Nunito',sans-serif", fontWeight:600,
    color:'#0f172a', outline:'none', background:'#fff',
    boxSizing:'border-box',
  }
  const sel: React.CSSProperties = { ...inp, cursor:'pointer' }
  const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase' as const, letterSpacing:'.7px', display:'block', marginBottom:7 }

  const cardStyle: React.CSSProperties = {
    background:'#fff', borderRadius:22, padding:'20px',
    border:'1.5px solid #f1f5f9', boxShadow:'0 4px 20px rgba(0,0,0,.07)',
  }
  const cardTitle = (color: string, icon: string, text: string) => (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
      <div style={{ width:36, height:36, borderRadius:11, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{icon}</div>
      <div style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>{text}</div>
    </div>
  )

  const chip = (active: boolean, color = ACC): React.CSSProperties => ({
    padding:'7px 12px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer',
    border:`1.5px solid ${active ? color : '#e2e8f0'}`,
    background: active ? color + '18' : '#fff',
    color: active ? color : '#64748b',
    transition:'all .18s',
  })

  const communes  = form.ville && form.ville !== 'Autre' ? (COMMUNES_PAR_VILLE[form.ville] || []) : []
  const quartiers = form.commune && form.commune !== 'Autre' ? (QUARTIERS[form.commune] || []) : []

  const fmtDate = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short' })
  }

  return (
    <>
      <style>{`
        @keyframes slideUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes heroFadeUp{ from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes floatBadge{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(29,158,117,.5)} 70%{box-shadow:0 0 0 8px rgba(29,158,117,0)} }
        input:focus,select:focus,textarea:focus { border-color:${ACC} !important; box-shadow:0 0 0 3px ${ACC}22; }
        .chip-btn { transition:all .18s cubic-bezier(.34,1.56,.64,1); }
        .chip-btn:active { transform:scale(.94); }
        .step-dot { transition:all .3s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:"'Josefin Sans','Nunito',system-ui,sans-serif", paddingBottom:130 }}>

        {/* ══ HERO ══ */}
        <div style={{ position:'relative', height:300, overflow:'hidden' }}>
          <img src={HERO_IMG} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 20%' }} />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg,${ACC2}cc 0%,${BLUE2}cc 50%,rgba(10,20,40,.96) 100%)` }} />

          {/* Bouton retour */}
          <button onClick={() => step > 0 ? setStep(s=>s-1) : router.back()} style={{ position:'absolute', top:52, left:20, zIndex:10, width:40, height:40, borderRadius:13, background:'rgba(255,255,255,.18)', border:'1.5px solid rgba(255,255,255,.3)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)' }}>←</button>

          {/* Contenu hero */}
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 22px 28px', zIndex:2 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${ACC}22`, backdropFilter:'blur(12px)', border:`1px solid ${ACC}55`, borderRadius:20, padding:'5px 13px', marginBottom:12, width:'fit-content', animation:'floatBadge 3s ease-in-out infinite' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', animation:'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize:10, fontWeight:700, color:'#fff', letterSpacing:'.5px' }}>Disponible aujourd&apos;hui — 7h à 20h</span>
            </div>
            <div style={{ fontSize:28, fontWeight:700, color:'#fff', lineHeight:1.15, marginBottom:6, animation:'heroFadeUp .6s ease both' }}>
              Prendre<br/>
              <span style={{ color:'#4ade80' }}>Rendez-vous</span>
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.75)', fontWeight:600, animation:'heroFadeUp .6s ease .1s both' }}>
              Consultation en ligne — confirmée par SMS
            </div>
          </div>
        </div>

        {/* ══ STEP INDICATOR ══ */}
        <div style={{ margin:'-22px 16px 0', background:'#fff', borderRadius:22, padding:'18px 16px', boxShadow:'0 12px 40px rgba(0,0,0,.12)', position:'relative', zIndex:10 }}>
          {/* Barre de progression */}
          <div style={{ display:'flex', gap:4, marginBottom:14 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i <= step ? `linear-gradient(90deg,${ACC},${BLUE})` : '#f1f5f9', transition:'background .4s' }} />
            ))}
          </div>
          {/* Étapes cliquables */}
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            {STEPS.map((s, i) => (
              <div key={i} className="step-dot" onClick={() => i < step && setStep(i)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor: i < step ? 'pointer' : 'default' }}>
                <div style={{
                  width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14,
                  background: i < step ? `linear-gradient(135deg,${ACC2},${ACC})` : i === step ? `linear-gradient(135deg,${BLUE2},${BLUE})` : '#f1f5f9',
                  boxShadow: i === step ? `0 4px 14px ${BLUE}55` : i < step ? `0 4px 14px ${ACC}44` : 'none',
                  color: i <= step ? '#fff' : '#94a3b8',
                }}>
                  {i < step ? '✓' : s.icon}
                </div>
                <div style={{ fontSize:9, fontWeight:700, color: i === step ? BLUE : i < step ? ACC : '#94a3b8', letterSpacing:'.3px' }}>{s.title}</div>
              </div>
            ))}
          </div>
          {/* Info étape active */}
          <div style={{ marginTop:12, padding:'10px 14px', borderRadius:12, background:`linear-gradient(135deg,${BLUE}12,${ACC}10)`, border:`1px solid ${BLUE}22` }}>
            <div style={{ fontSize:12, fontWeight:700, color:BLUE }}>
              {STEPS[step].icon} <strong>{STEPS[step].title}</strong> — {STEPS[step].desc}
            </div>
          </div>
        </div>

        {/* CONTENU */}
        <div style={{ padding:'16px 16px 0', animation:'slideUp .35s ease both' }} key={step}>

          {/* ÉTAPE 0 — IDENTITÉ */}
          {step === 0 && (
            <div style={cardStyle}>
              {cardTitle(ACC, '👤', 'Informations personnelles')}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={lbl}>Prénom *</label>
                  <input value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="Aminata" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Nom *</label>
                  <input value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Coulibaly" style={inp} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <label style={lbl}>Téléphone *</label>
                <input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="07 XX XX XX XX" type="tel" style={inp} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
                <div>
                  <label style={lbl}>Date de naissance</label>
                  <input type="date" value={form.date_of_birth} onChange={e=>set('date_of_birth',e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Genre</label>
                  <select value={form.gender} onChange={e=>set('gender',e.target.value)} style={sel}>
                    <option value="">--</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 1 — LOCALISATION */}
          {step === 1 && (
            <div style={cardStyle}>
              {cardTitle(BLUE, '📍', 'Localisation')}

              {/* VILLE */}
              <div style={{ marginBottom:14 }}>
                <label style={lbl}>Ville</label>
                <select value={form.ville} onChange={e=>{ set('ville',e.target.value); set('commune',''); set('quartier','') }} style={sel}>
                  <option value="">-- Choisir une ville --</option>
                  {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                  <option value="Autre">Autre ville…</option>
                </select>
                {form.ville === 'Autre' && (
                  <input value={form.ville_autre} onChange={e=>set('ville_autre',e.target.value)}
                    placeholder="Saisir votre ville" style={{ ...inp, marginTop:8 }} />
                )}
              </div>

              {/* COMMUNE */}
              <div style={{ marginBottom:14, opacity: form.ville ? 1 : .45, pointerEvents: form.ville ? 'auto' : 'none' }}>
                <label style={lbl}>Commune</label>
                <select value={form.commune} onChange={e=>{ set('commune',e.target.value); set('quartier','') }}
                  style={sel} disabled={!form.ville}>
                  <option value="">-- Choisir une commune --</option>
                  {communes.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="Autre">Autre commune…</option>
                </select>
                {form.commune === 'Autre' && (
                  <input value={form.commune_autre} onChange={e=>set('commune_autre',e.target.value)}
                    placeholder="Saisir votre commune" style={{ ...inp, marginTop:8 }} />
                )}
              </div>

              {/* QUARTIER */}
              <div style={{ opacity: form.commune ? 1 : .45, pointerEvents: form.commune ? 'auto' : 'none' }}>
                <label style={lbl}>Quartier</label>
                <select value={form.quartier} onChange={e=>set('quartier',e.target.value)}
                  style={sel} disabled={!form.commune}>
                  <option value="">-- Choisir un quartier --</option>
                  {quartiers.map(q => <option key={q} value={q}>{q}</option>)}
                  {form.commune && <option value="Autre">Autre quartier…</option>}
                </select>
                {form.quartier === 'Autre' && (
                  <input value={form.quartier_autre} onChange={e=>set('quartier_autre',e.target.value)}
                    placeholder="Saisir votre quartier" style={{ ...inp, marginTop:8 }} />
                )}
              </div>

              {!form.ville && (
                <div style={{ marginTop:14, padding:'12px 14px', borderRadius:14, background:'#f0faf6', fontSize:12, color:ACC, fontWeight:700 }}>
                  💡 Commencez par choisir votre ville
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 2 — SANTÉ */}
          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={cardStyle}>
                {cardTitle(ACC, '🩺', 'Assurance & Groupe sanguin')}
                <div style={{ marginBottom:14 }}>
                  <label style={lbl}>Assurance maladie</label>
                  <select value={form.assurance} onChange={e=>set('assurance',e.target.value)} style={sel}>
                    <option value="">-- Choisir --</option>
                    {ASSURANCES.map(a => <option key={a.id} value={a.label}>{a.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Groupe sanguin</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {GROUPES_SANGUINS.map(g => (
                      <button key={g} className="chip-btn" onClick={() => set('blood_group', g)} style={chip(form.blood_group === g)}>
                        {g === 'Inconnu' ? '❓ Inconnu' : `🩸 ${g}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={cardStyle}>
                {cardTitle('#EF4444', '⚠️', 'Allergies connues')}
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {ALLERGIES_COURANTES.map(a => (
                    <button key={a} className="chip-btn" onClick={() => toggleList('allergies', a)} style={chip(form.allergies.includes(a), '#EF4444')}>
                      {a}
                    </button>
                  ))}
                </div>
                {form.allergies.length > 0 && (
                  <div style={{ marginTop:10, fontSize:11, color:'#EF4444', fontWeight:700 }}>
                    ✓ {form.allergies.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — ANTÉCÉDENTS */}
          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={cardStyle}>
                {cardTitle('#F59E0B', '🏥', 'Maladies chroniques')}
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {MALADIES_CHRONIQUES.map(m => (
                    <button key={m} className="chip-btn" onClick={() => toggleList('chronic_diseases', m)} style={chip(form.chronic_diseases.includes(m), '#F59E0B')}>
                      {m}
                    </button>
                  ))}
                </div>
                {form.chronic_diseases.length > 0 && (
                  <div style={{ marginTop:10, fontSize:11, color:'#F59E0B', fontWeight:700 }}>
                    ✓ {form.chronic_diseases.join(', ')}
                  </div>
                )}
              </div>
              <div style={cardStyle}>
                {cardTitle('#8B5CF6', '💊', 'Traitements en cours')}
                <textarea
                  value={form.current_treatments}
                  onChange={e => set('current_treatments', e.target.value)}
                  placeholder="Ex: Amlodipine 5mg, Metformine 500mg..."
                  rows={3}
                  style={{ ...inp, resize:'none' }}
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 4 — URGENCE */}
          {step === 4 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={cardStyle}>
                {cardTitle('#EF4444', '🚨', "Contact d'urgence")}
                <div style={{ marginBottom:14 }}>
                  <label style={lbl}>Nom du contact</label>
                  <input value={form.emergency_contact} onChange={e=>set('emergency_contact',e.target.value)} placeholder="Nom complet" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Téléphone urgence</label>
                  <input value={form.emergency_phone} onChange={e=>set('emergency_phone',e.target.value)} placeholder="07 XX XX XX XX" type="tel" style={inp} />
                </div>
              </div>
              <div style={{ padding:'14px', borderRadius:16, background:'#FFF5F5', border:'1.5px solid #FECACA', fontSize:12, color:'#EF4444', fontWeight:700 }}>
                ℹ️ Cette personne sera contactée en cas d&apos;urgence. Étape optionnelle mais fortement recommandée.
              </div>
            </div>
          )}

          {/* ÉTAPE 5 — RENDEZ-VOUS */}
          {step === 5 && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

              {/* Motif */}
              <div style={cardStyle}>
                {cardTitle(ACC, '🩺', 'Motif de consultation')}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {MOTIFS.map(m => (
                    <button key={m.label} className="chip-btn" onClick={() => set('motif', m.label)} style={{
                      padding:'10px 10px', borderRadius:14, textAlign:'left', cursor:'pointer',
                      border:`1.5px solid ${form.motif === m.label ? ACC : '#e2e8f0'}`,
                      background: form.motif === m.label ? ACC + '12' : '#fff',
                      display:'flex', alignItems:'center', gap:8,
                    }}>
                      <span style={{ fontSize:18 }}>{m.icon}</span>
                      <span style={{ fontSize:11, fontWeight:700, color: form.motif === m.label ? ACC : '#475569' }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Médecin */}
              <div style={cardStyle}>
                {cardTitle(BLUE, '👨‍⚕️', 'Choisir un médecin')}
                {doctors.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'20px', color:'#94a3b8', fontSize:13, fontWeight:700 }}>⏳ Chargement des médecins...</div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {doctors.map(d => {
                      const fullName = `Dr. ${d.first_name} ${d.last_name}`.trim()
                      const isActive = form.doctor_id === d.id
                      return (
                        <button key={d.id} className="chip-btn" onClick={() => set('doctor_id', d.id)} style={{
                          padding:'12px 14px', borderRadius:14, cursor:'pointer',
                          display:'flex', alignItems:'center', gap:12,
                          border:`1.5px solid ${isActive ? ACC : '#e2e8f0'}`,
                          background: isActive ? ACC + '12' : '#fff',
                        }}>
                          <div style={{ width:44, height:44, borderRadius:14, background: isActive ? ACC+'22' : '#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                            👨‍⚕️
                          </div>
                          <div style={{ textAlign:'left', flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>{fullName}</div>
                            <div style={{ fontSize:11, fontWeight:600, color:'#64748b' }}>{d.specialite || 'Médecin généraliste'}</div>
                          </div>
                          {isActive && <span style={{ fontSize:18, color:ACC }}>✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Date */}
              <div style={cardStyle}>
                {cardTitle(ACC, '📆', 'Date du rendez-vous')}
                <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
                  {calendar.slice(0, 10).map(day => {
                    const parts = fmtDate(day).split(' ')
                    return (
                      <button key={day} className="chip-btn" onClick={() => { set('rdv_date', day); set('rdv_time','') }} style={{
                        flexShrink:0, padding:'10px 12px', borderRadius:14, cursor:'pointer', textAlign:'center',
                        border:`1.5px solid ${form.rdv_date === day ? ACC : '#e2e8f0'}`,
                        background: form.rdv_date === day ? ACC : '#fff',
                        color: form.rdv_date === day ? '#fff' : '#0f172a',
                        minWidth:66,
                      }}>
                        <div style={{ fontSize:10, fontWeight:700, opacity:.85 }}>{parts[0]}</div>
                        <div style={{ fontSize:16, fontWeight:900 }}>{parts[1]}</div>
                        <div style={{ fontSize:10, fontWeight:600, opacity:.8 }}>{parts[2]}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Créneau */}
              {form.rdv_date && (
                <div style={{ ...cardStyle, animation:'fadeIn .3s ease' }}>
                  {cardTitle(BLUE, '🕐', 'Créneau horaire')}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {CRENEAUX.map(h => (
                      <button key={h} className="chip-btn" onClick={() => set('rdv_time', h)} style={{
                        padding:'10px 4px', borderRadius:12, cursor:'pointer', fontSize:12, fontWeight:800, textAlign:'center',
                        border:`1.5px solid ${form.rdv_time === h ? ACC : '#e2e8f0'}`,
                        background: form.rdv_time === h ? ACC : '#fff',
                        color: form.rdv_time === h ? '#fff' : '#0f172a',
                      }}>
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ══ CTA FIXE ══ */}
        <div style={{ position:'fixed', bottom:70, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:420, padding:'0 16px', boxSizing:'border-box', zIndex:400 }}>
          <div style={{ background:'rgba(248,250,252,.95)', backdropFilter:'blur(16px)', borderRadius:22, padding:'12px', boxShadow:'0 -4px 32px rgba(0,0,0,.1)', border:'1px solid rgba(255,255,255,.8)' }}>
            {submitError && (
              <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:12, padding:'9px 14px', marginBottom:10, fontSize:12, fontWeight:700, color:'#DC2626', textAlign:'center' }}>
                ⚠️ {submitError}
              </div>
            )}
            <button onClick={next} disabled={!canNext() || submitting} style={{
              width:'100%', padding:'16px',
              background: canNext() && !submitting
                ? `linear-gradient(135deg,${ACC2},${ACC} 50%,${BLUE})`
                : '#e2e8f0',
              border:'none', borderRadius:16, fontSize:14, fontWeight:700,
              color: canNext() && !submitting ? '#fff' : '#94a3b8',
              cursor: canNext() && !submitting ? 'pointer' : 'not-allowed',
              boxShadow: canNext() && !submitting ? `0 8px 28px ${ACC}55` : 'none',
              transition:'all .25s', letterSpacing:'.3px',
              fontFamily:"'Josefin Sans','Nunito',sans-serif",
            }}>
              {submitting ? '⏳ Envoi en cours...' : step < STEPS.length - 1
                ? `Suivant — ${STEPS[step+1].title} ${STEPS[step+1].icon}`
                : '✅ Confirmer le rendez-vous'
              }
            </button>
            <div style={{ textAlign:'center', marginTop:7, fontSize:10, color:'#94a3b8', fontWeight:700 }}>
              {canNext()
                ? `${STEPS.length - step - 1} étape${STEPS.length-step-1>1?'s':''} restante${STEPS.length-step-1>1?'s':''}`
                : 'Remplissez les champs obligatoires *'
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
