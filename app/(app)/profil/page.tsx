'use client'
import { clinicConfig } from '@/chassis.config'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { localAuth, type LocalPatient } from '@/lib/localAuth'
import { bookingApi } from '@/lib/api'

const ACC = clinicConfig.accent
const ACC2 = clinicConfig.accentDark

export default function ProfilPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [patient, setPatient] = useState<LocalPatient | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<LocalPatient>>({})
  const [saved, setSaved] = useState(false)
  const [section, setSection] = useState<'menu' | 'rdv' | 'sante' | 'urgence'>('menu')
  const [rdvList, setRdvList] = useState<any[]>([])
  const [rdvLoading, setRdvLoading] = useState(false)

  useEffect(() => {
    if (section === 'rdv') {
      setRdvLoading(true)
      bookingApi.getMyAppointments().then(list => setRdvList(list)).catch(() => {}).finally(() => setRdvLoading(false))
    }
  }, [section])

  useEffect(() => {
    setMounted(true)
    const raw = localStorage.getItem('sc_patient')
    if (raw) {
      const p = JSON.parse(raw) as LocalPatient
      setPatient(p)
      setForm(p)
    }
  }, [])

  if (!mounted) return null

  const token = localStorage.getItem('sc_token')
  if (!token || !patient) {
    return (
      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px', textAlign:'center' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔐</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', marginBottom:8 }}>Connexion requise</div>
        <div style={{ fontSize:14, color:'#64748b', fontWeight:600, marginBottom:28 }}>Connectez-vous pour accéder à votre espace personnel</div>
        <Link href="/login" style={{ padding:'15px 40px', borderRadius:18, background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', textDecoration:'none', fontSize:15, fontWeight:800, boxShadow:`0 10px 32px rgba(29,158,117,.4)` }}>
          Se connecter
        </Link>
      </div>
    )
  }

  const name = `${patient.first_name} ${patient.last_name}`
  const initials = `${patient.first_name?.[0] || '?'}${patient.last_name?.[0] || ''}`.toUpperCase()

  const logout = () => {
    localStorage.removeItem('sc_token')
    localStorage.removeItem('sc_patient')
    router.push('/login')
  }

  const saveProfile = () => {
    const updated = localAuth.updatePatient(patient.phone, form)
    if (updated) {
      setPatient(updated)
      localStorage.setItem('sc_patient', JSON.stringify(updated))
    }
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (key: keyof LocalPatient, label: string, placeholder: string, type = 'text') => (
    <div key={key}>
      <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:5 }}>{label}</label>
      <input
        type={type}
        value={(form[key] as string) || ''}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:'1.5px solid #e2e8f0', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', boxSizing:'border-box' as const, background:'#f8fafc' }}
      />
    </div>
  )

  const select = (key: keyof LocalPatient, label: string, options: { value: string; label: string }[]) => (
    <div key={key}>
      <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:5 }}>{label}</label>
      <select
        value={(form[key] as string) || ''}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:'1.5px solid #e2e8f0', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', boxSizing:'border-box' as const, background:'#f8fafc', appearance:'none' as const }}
      >
        <option value="">— Choisir —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  const MENU = [
    { icon:'❤️', label:'Mon Dossier Santé',         href:'/records',       bg:'#EEF9F5', color:ACC },
    { icon:'📅', label:'Mes Rendez-vous',            href:'/booking',       bg:'#FFF0F5', color:'#EC4899' },
    { icon:'💬', label:'Messages clinique',          href:'/chat',          bg:'#E8EDF5', color:'#0B1D35' },
    { icon:'💊', label:'Rappels médicaments',        href:'/reminders',     bg:'#FFFBEE', color:'#F59E0B' },
    { icon:'📄', label:'Résultats & Ordonnances',    href:'/records',       bg:'#F0FFF8', color:'#10B981' },
    { icon:'🔔', label:'Notifications',              href:'/notifications', bg:'#FFF5F5', color:'#EF4444' },
  ]

  const infoRow = (icon: string, label: string, value: string) => value ? (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
      <span style={{ fontSize:18, width:28, textAlign:'center' }}>{icon}</span>
      <div>
        <div style={{ fontSize:11, color:'#94a3b8', fontWeight:700 }}>{label}</div>
        <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{value}</div>
      </div>
    </div>
  ) : null

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 0 rgba(29,158,117,.4)} 50%{box-shadow:0 0 0 12px rgba(29,158,117,0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes toastBounce { 0%{opacity:0;transform:translateX(-50%) translateY(-28px) scale(.85)} 60%{transform:translateX(-50%) translateY(6px) scale(1.04)} 80%{transform:translateX(-50%) translateY(-3px) scale(.98)} 100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }
        .menu-item { cursor:pointer; transition:all .2s; }
        .menu-item:active { transform:scale(.97) translateX(3px); }
        input:focus, select:focus { border-color:${ACC}!important; box-shadow:0 0 0 3px rgba(29,158,117,.12)!important; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {/* HERO */}
        <div style={{ position:'relative', height:280, overflow:'hidden' }}>
          <Image src="/images/Hero 2.png" alt="profil" fill sizes="100vw" style={{ objectFit:'cover', objectPosition:'center top' }} priority />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(6,15,28,.82) 0%,rgba(11,29,53,.7) 40%,rgba(15,110,86,.75) 100%)' }} />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', paddingBottom:44, textAlign:'center' }}>
            <div style={{ width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,.15)',border:'3px solid rgba(255,255,255,.35)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:900,color:'#fff',marginBottom:12,animation:'glow 2.5s ease-in-out infinite' }}>
              {initials}
            </div>
            <div style={{ fontSize:22,fontWeight:900,background:'linear-gradient(90deg,#fff 30%,#a8edda 50%,#fff 70%) 0 0 / 200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite' }}>
              {name}
            </div>
            <div style={{ fontSize:12,color:'rgba(255,255,255,.65)',fontWeight:600,marginTop:4 }}>{patient.phone}</div>
          </div>
        </div>

        {/* TOAST */}
        {saved && (
          <div style={{ position:'fixed',top:20,left:'50%',background:ACC,color:'#fff',padding:'12px 24px',borderRadius:16,fontSize:13,fontWeight:800,zIndex:9999,boxShadow:'0 8px 32px rgba(29,158,117,.5)',animation:'toastBounce .5s cubic-bezier(.34,1.56,.64,1) both',whiteSpace:'nowrap' }}>
            ✓ Profil mis à jour
          </div>
        )}

        <div style={{ padding:'0 16px' }}>

          {/* NAV TABS */}
          <div style={{ display:'flex', gap:6, margin:'16px 0', background:'#fff', borderRadius:18, padding:5, boxShadow:'0 4px 16px rgba(0,0,0,.06)', border:'1.5px solid #e2e8f0' }}>
            {([['menu','📋 Menu'],['rdv','📅 RDV'],['sante','❤️ Santé'],['urgence','🚨 Urgence']] as const).map(([k,label]) => (
              <button key={k} onClick={() => { setSection(k); setEditing(false) }} style={{ flex:1, padding:'9px 4px', borderRadius:12, border:'none', fontSize:11, fontWeight:800, cursor:'pointer', background:section===k?`linear-gradient(135deg,${ACC2},${ACC})`:'transparent', color:section===k?'#fff':'#64748b', transition:'all .2s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── SECTION MENU ── */}
          {section === 'menu' && (
            <>
              {/* Bouton modifier */}
              <button onClick={() => setEditing(!editing)} style={{ width:'100%', padding:'14px', borderRadius:18, border:`2px solid ${ACC}`, background:editing?`linear-gradient(135deg,${ACC2},${ACC})`:'transparent', color:editing?'#fff':ACC, fontSize:14, fontWeight:800, cursor:'pointer', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .25s' }}>
                {editing ? '✕ Annuler les modifications' : '✏️ Modifier mon profil'}
              </button>

              {editing && (
                <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', marginBottom:12, display:'flex', flexDirection:'column', gap:14, animation:'slideUp .3s ease both' }}>
                  <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:4 }}>Informations personnelles</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {field('first_name', 'Prénom', 'Konan')}
                    {field('last_name', 'Nom', 'Kouassi')}
                  </div>
                  {field('email', 'Email', 'konan@email.com', 'email')}
                  <div>
                    <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:5 }}>Date de naissance</label>
                    <div style={{ display:'grid', gridTemplateColumns:'2fr 3fr 2fr', gap:8 }}>
                      <select
                        value={form.birth_date ? String(form.birth_date).split('-')[2] : ''}
                        onChange={e => { const [y,m] = form.birth_date ? String(form.birth_date).split('-') : ['1990','01']; if(e.target.value) setForm(prev=>({...prev,birth_date:`${y||'1990'}-${m||'01'}-${e.target.value}`})) }}
                        style={{ width:'100%', padding:'13px 10px', borderRadius:14, border:'1.5px solid #e2e8f0', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', background:'#f8fafc', appearance:'none' as const }}
                      >
                        <option value="">Jour</option>
                        {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={String(d).padStart(2,'0')}>{d}</option>)}
                      </select>
                      <select
                        value={form.birth_date ? String(form.birth_date).split('-')[1] : ''}
                        onChange={e => { const [y,,d] = form.birth_date ? String(form.birth_date).split('-') : ['1990','01','01']; if(e.target.value) setForm(prev=>({...prev,birth_date:`${y||'1990'}-${e.target.value}-${d||'01'}`})) }}
                        style={{ width:'100%', padding:'13px 8px', borderRadius:14, border:'1.5px solid #e2e8f0', fontSize:13, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', background:'#f8fafc', appearance:'none' as const }}
                      >
                        <option value="">Mois</option>
                        {['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'].map((m,i)=><option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>)}
                      </select>
                      <select
                        value={form.birth_date ? String(form.birth_date).split('-')[0] : ''}
                        onChange={e => { const [,m,d] = form.birth_date ? String(form.birth_date).split('-') : ['1990','01','01']; if(e.target.value) setForm(prev=>({...prev,birth_date:`${e.target.value}-${m||'01'}-${d||'01'}`})) }}
                        style={{ width:'100%', padding:'13px 8px', borderRadius:14, border:'1.5px solid #e2e8f0', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', background:'#f8fafc', appearance:'none' as const }}
                      >
                        <option value="">Année</option>
                        {Array.from({length:100},(_,i)=>new Date().getFullYear()-i).map(y=><option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  {select('gender', 'Genre', [{ value:'M', label:'Homme' }, { value:'F', label:'Femme' }])}
                  <button onClick={saveProfile} style={{ width:'100%', padding:'14px', borderRadius:16, border:'none', background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', boxShadow:`0 8px 24px rgba(29,158,117,.4)` }}>
                    💾 Enregistrer
                  </button>
                </div>
              )}

              <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,.06)', border:'1.5px solid #e2e8f0', animation:'slideUp .3s ease .1s both' }}>
                {MENU.map((item, i) => (
                  <Link key={i} href={item.href} style={{ textDecoration:'none' }}>
                    <div className="menu-item" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderBottom:i<MENU.length-1?'1px solid #f1f5f9':'none' }}>
                      <div style={{ width:44,height:44,borderRadius:14,background:item.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{item.icon}</div>
                      <div style={{ flex:1, fontSize:14, fontWeight:700, color:'#0f172a' }}>{item.label}</div>
                      <div style={{ color:'#cbd5e1', fontSize:16 }}>→</div>
                    </div>
                  </Link>
                ))}
                <div className="menu-item" onClick={logout} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px' }}>
                  <div style={{ width:44,height:44,borderRadius:14,background:'#FFF0F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>🔴</div>
                  <div style={{ flex:1, fontSize:14, fontWeight:700, color:'#EF4444' }}>Se déconnecter</div>
                </div>
              </div>
            </>
          )}

          {/* ── SECTION RDV ── */}
          {section === 'rdv' && (
            <div style={{ animation:'slideUp .3s ease both' }}>
              <Link href="/booking" style={{ textDecoration:'none' }}>
                <button style={{ width:'100%', padding:'14px', borderRadius:18, border:'none', background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', marginBottom:14, boxShadow:`0 8px 24px rgba(29,158,117,.35)` }}>
                  ➕ Prendre un nouveau rendez-vous
                </button>
              </Link>
              {rdvLoading && (
                <div style={{ textAlign:'center', padding:30, color:'#94a3b8', fontSize:13, fontWeight:700 }}>Chargement…</div>
              )}
              {!rdvLoading && rdvList.length === 0 && (
                <div style={{ background:'#fff', borderRadius:20, padding:'28px 20px', textAlign:'center', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)' }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>📅</div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#0f172a', marginBottom:6 }}>Aucun rendez-vous</div>
                  <div style={{ fontSize:12, color:'#94a3b8', fontWeight:600 }}>Prenez votre premier rendez-vous en ligne</div>
                </div>
              )}
              {!rdvLoading && rdvList.map((rdv: any) => {
                const statusColor = rdv.status === 'confirmed' ? '#10B981' : rdv.status === 'cancelled' ? '#EF4444' : '#F59E0B'
                const statusLabel = rdv.status === 'confirmed' ? '✅ Confirmé' : rdv.status === 'cancelled' ? '❌ Annulé' : '⏳ En attente'
                const dateStr = rdv.date ? new Date(rdv.date + 'T12:00').toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' }) : '—'
                return (
                  <div key={rdv.id} style={{ background:'#fff', borderRadius:18, padding:'16px 18px', marginBottom:10, border:'1.5px solid #e2e8f0', boxShadow:'0 4px 12px rgba(0,0,0,.05)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', textTransform:'capitalize' }}>{dateStr}</div>
                      <span style={{ fontSize:11, fontWeight:800, color:statusColor, background:`${statusColor}15`, padding:'3px 10px', borderRadius:20 }}>{statusLabel}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:16 }}>🕐</span>
                      <span style={{ fontSize:13, fontWeight:700, color:'#475569' }}>{rdv.time || '—'}</span>
                    </div>
                    {rdv.doctor_name && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:16 }}>👨‍⚕️</span>
                        <span style={{ fontSize:13, fontWeight:700, color:'#475569' }}>{rdv.doctor_name}</span>
                      </div>
                    )}
                    {rdv.service && (
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:16 }}>📋</span>
                        <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>{rdv.service}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── SECTION SANTÉ ── */}
          {section === 'sante' && (
            <div style={{ animation:'slideUp .3s ease both' }}>
              {!editing ? (
                <>
                  <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', marginBottom:12 }}>
                    <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:12 }}>Informations médicales</div>
                    {infoRow('🩸', 'Groupe sanguin', patient.blood_type || '')}
                    {infoRow('📏', 'Taille', patient.height ? patient.height + ' cm' : '')}
                    {infoRow('⚖️', 'Poids', patient.weight ? patient.weight + ' kg' : '')}
                    {infoRow('⚠️', 'Allergies', patient.allergies || '')}
                    {infoRow('🏥', 'Maladies chroniques', patient.chronic_conditions || '')}
                    {infoRow('💊', 'Médicaments actuels', patient.current_medications || '')}
                    {!patient.blood_type && !patient.allergies && (
                      <div style={{ textAlign:'center', padding:'20px 0', color:'#94a3b8', fontSize:13, fontWeight:700 }}>
                        <div style={{ fontSize:36, marginBottom:8 }}>📋</div>
                        Aucune donnée médicale encore.<br/>Remplis ton dossier pour un meilleur suivi.
                      </div>
                    )}
                  </div>
                  <button onClick={() => setEditing(true)} style={{ width:'100%', padding:'14px', borderRadius:18, border:`2px solid ${ACC}`, background:'transparent', color:ACC, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    ✏️ Remplir mon dossier médical
                  </button>
                </>
              ) : (
                <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:4 }}>Données médicales</div>
                  {select('blood_type', 'Groupe sanguin', [
                    { value:'A+', label:'A+' }, { value:'A-', label:'A-' },
                    { value:'B+', label:'B+' }, { value:'B-', label:'B-' },
                    { value:'AB+', label:'AB+' }, { value:'AB-', label:'AB-' },
                    { value:'O+', label:'O+' }, { value:'O-', label:'O-' },
                  ])}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {field('height', 'Taille (cm)', 'ex: 175')}
                    {field('weight', 'Poids (kg)', 'ex: 70')}
                  </div>
                  {field('allergies', 'Allergies', 'Pénicilline, arachides...')}
                  {field('chronic_conditions', 'Maladies chroniques', 'Diabète, hypertension...')}
                  {field('current_medications', 'Médicaments actuels', 'Metformine 500mg...')}
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={() => setEditing(false)} style={{ flex:1, padding:'13px', borderRadius:14, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:800, cursor:'pointer' }}>
                      Annuler
                    </button>
                    <button onClick={saveProfile} style={{ flex:2, padding:'13px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', boxShadow:`0 8px 24px rgba(29,158,117,.4)` }}>
                      💾 Enregistrer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SECTION URGENCE ── */}
          {section === 'urgence' && (
            <div style={{ animation:'slideUp .3s ease both' }}>
              {/* Carte urgence hors-ligne */}
              <div style={{ background:`linear-gradient(135deg,${ACC2},${ACC})`, borderRadius:20, padding:'20px', marginBottom:12, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.1)' }} />
                <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Carte d&apos;urgence</div>
                <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:4 }}>{name}</div>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:12 }}>
                  {patient.blood_type && <div style={{ background:'rgba(255,255,255,.2)', backdropFilter:'blur(8px)', borderRadius:10, padding:'6px 14px', fontSize:13, fontWeight:800, color:'#fff' }}>🩸 {patient.blood_type}</div>}
                  {patient.allergies && <div style={{ background:'rgba(255,100,100,.3)', backdropFilter:'blur(8px)', borderRadius:10, padding:'6px 14px', fontSize:12, fontWeight:700, color:'#fff' }}>⚠️ {patient.allergies}</div>}
                  {!patient.blood_type && <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', fontWeight:600 }}>Groupe sanguin non renseigné</div>}
                </div>
              </div>

              {!editing ? (
                <>
                  <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', marginBottom:12 }}>
                    <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:12 }}>Contact d&apos;urgence</div>
                    {infoRow('👤', 'Nom du contact', patient.emergency_contact_name || '')}
                    {infoRow('📞', 'Téléphone d\'urgence', patient.emergency_contact_phone || '')}
                    {!patient.emergency_contact_name && (
                      <div style={{ textAlign:'center', padding:'16px 0', color:'#94a3b8', fontSize:13, fontWeight:700 }}>
                        <div style={{ fontSize:32, marginBottom:6 }}>🚨</div>
                        Aucun contact d&apos;urgence défini
                      </div>
                    )}
                  </div>
                  <button onClick={() => setEditing(true)} style={{ width:'100%', padding:'14px', borderRadius:18, border:`2px solid ${ACC}`, background:'transparent', color:ACC, fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    ✏️ Définir mon contact d&apos;urgence
                  </button>
                </>
              ) : (
                <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', display:'flex', flexDirection:'column', gap:14 }}>
                  {field('emergency_contact_name', 'Nom du contact d\'urgence', 'Maman Aya...')}
                  {field('emergency_contact_phone', 'Téléphone d\'urgence', '07 XX XX XX XX', 'tel')}
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={() => setEditing(false)} style={{ flex:1, padding:'13px', borderRadius:14, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:800, cursor:'pointer' }}>
                      Annuler
                    </button>
                    <button onClick={saveProfile} style={{ flex:2, padding:'13px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', boxShadow:`0 8px 24px rgba(29,158,117,.4)` }}>
                      💾 Enregistrer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ textAlign:'center', padding:'20px 0', animation:'slideUp .4s ease .3s both' }}>
            <div style={{ fontSize:12, fontWeight:800, color:ACC }}>ShidoConnect</div>
            <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600, marginTop:2 }}>© 2026 ShidoOS · Côte d&apos;Ivoire</div>
          </div>
        </div>
      </div>
    </>
  )
}
