'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { publicAppointmentApi } from '@/lib/api'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const DOCTOR_PHOTOS: Record<string, string> = {
  'Yanick':  '/images/Docteurs/Docteur africain 600x800.png',
  'Franck':  '/images/Docteurs/Docteur africain final 600x800.png',
  'Christy': '/images/Docteurs/Femme docteur 600x800 final.png',
  'Jean':    '/images/Docteurs/Docteur africain final 600x800.png',
}

const DAYS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const TIME_SLOTS = ['08:00','08:30','09:00','09:30','12:00','12:30','13:00','14:30','15:00','16:00','17:00','19:00']

type Doctor = { id: number; first_name: string; last_name: string; specialite?: string; img?: string }

const FALLBACK_DOCTORS: Doctor[] = [
  { id:1, first_name:'Yanick',  last_name:'Oulaï',   specialite:'Directeur Médical' },
  { id:2, first_name:'Franck',  last_name:'Kouamé',  specialite:'Médecin Spécialiste' },
  { id:3, first_name:'Christy', last_name:'Onamon',  specialite:'Pédiatre & Obstétricienne' },
]

export default function DoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params?.id || '')

  const fallback = FALLBACK_DOCTORS.find(d => String(d.id) === id) || FALLBACK_DOCTORS[0] || null
  const [doctor, setDoctor] = useState<Doctor | null>(fallback)
  const [mode, setMode] = useState<'presentiel'|'tele'>('presentiel')
  const [days, setDays] = useState<Array<{label:string;num:number;active:boolean}>>([])
  const [slot, setSlot] = useState('')

  useEffect(() => {
    const now = new Date()
    setDays(Array.from({length:7}, (_,i) => {
      const d = new Date(now); d.setDate(now.getDate() + i)
      return { label:DAYS_FR[d.getDay()], num:d.getDate(), active:i===0 }
    }))
  }, [])

  useEffect(() => {
    if (!id) return
    publicAppointmentApi.getDoctors()
      .then(list => {
        if (Array.isArray(list) && list.length > 0) {
          const found = list.find(d => String(d.id) === id)
          if (found) setDoctor(found as Doctor)
        }
      })
      .catch(() => {})
  }, [id])

  const photo = doctor ? (doctor.img || DOCTOR_PHOTOS[doctor.first_name] || null) : null
  const name  = doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : ''

  if (!doctor) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0faf6', fontFamily:'Nunito,sans-serif', padding:24 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:36, marginBottom:12 }}>⚠️</div>
        <div style={{ fontSize:14, fontWeight:700, color:'#ef4444', marginBottom:16 }}>Médecin introuvable</div>
        <button onClick={() => router.back()} style={{ padding:'12px 24px', borderRadius:14, background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', border:'none', fontSize:14, fontWeight:800, cursor:'pointer' }}>← Retour</button>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes ctaglow { from{box-shadow:0 10px 32px rgba(29,158,117,.5)} to{box-shadow:0 10px 48px rgba(29,158,117,.8),0 0 60px rgba(77,212,160,.3)} }
        .slot-btn{cursor:pointer;transition:all .2s}
        .slot-btn:hover{transform:translateY(-2px)}
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:120 }}>

        {/* HERO */}
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 32px', position:'relative', overflow:'hidden', borderRadius:'0 0 32px 32px' }}>
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.1)', pointerEvents:'none' }} />
          <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20 }}>←</button>
          <div style={{ textAlign:'center' }}>
            <div style={{ width:100, height:100, borderRadius:'50%', overflow:'hidden', border:'3px solid rgba(255,255,255,.5)', margin:'0 auto 12px', boxShadow:'0 8px 32px rgba(0,0,0,.2)', background:'#e1f5ee', position:'relative' }}>
              {photo
                ? <Image src={photo} alt={doctor.first_name} fill sizes="100px" unoptimized={photo.startsWith('http')} style={{ objectFit:'cover', objectPosition:'top' }} />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44 }}>👨‍⚕️</div>
              }
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', textShadow:'0 2px 12px rgba(0,0,0,.2)' }}>{name}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:600, marginTop:4 }}>{doctor.specialite || 'Médecin généraliste'}</div>
            <div style={{ display:'flex', gap:12, marginTop:18, justifyContent:'center' }}>
              <button onClick={() => router.push('/chat')} style={{ padding:'11px 20px',borderRadius:14,background:'rgba(255,255,255,.9)',border:'none',color:ACC2,fontSize:13,fontWeight:800,cursor:'pointer' }}>
                💬 Message
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding:'20px 20px 0' }}>

          {/* MODE */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .1s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:12 }}>Type de consultation</div>
            <div style={{ display:'flex', gap:10 }}>
              {[{k:'presentiel' as const, l:'En Personne', ic:'🏥'},{k:'tele' as const, l:'En Ligne', ic:'📱'}].map(({k,l,ic}) => (
                <div key={k} onClick={() => setMode(k)} style={{ flex:1, padding:'12px', borderRadius:14, textAlign:'center', cursor:'pointer', border:`2px solid ${mode===k ? ACC : '#e2e8f0'}`, background: mode===k ? '#e1f5ee' : '#f8fafc', fontSize:13, fontWeight:800, color: mode===k ? ACC2 : '#64748b', transition:'all .2s' }}>
                  {ic} {l}
                </div>
              ))}
            </div>
          </div>

          {/* CALENDRIER */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .15s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14 }}>Choisir une date</div>
            <div style={{ overflowX:'auto', scrollbarWidth:'none' }}>
              <div style={{ display:'flex', gap:10, width:'max-content' }}>
                {days.map((d,i) => (
                  <div key={i} onClick={() => setDays(ds => ds.map((x,j) => ({...x,active:j===i})))} style={{ width:52,height:68,borderRadius:16,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer', background: d.active ? `linear-gradient(135deg,${ACC2},${ACC})` : '#f8fafc', border: d.active ? 'none' : '1.5px solid #e2e8f0', boxShadow: d.active ? `0 8px 20px rgba(29,158,117,.4)` : 'none', transition:'all .2s' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:d.active?'rgba(255,255,255,.8)':'#94a3b8', marginBottom:4 }}>{d.label}</div>
                    <div style={{ fontSize:18, fontWeight:900, color:d.active?'#fff':'#334155' }}>{d.num}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CRÉNEAUX */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .2s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:12 }}>Créneaux disponibles</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {TIME_SLOTS.map(s => (
                <div key={s} className="slot-btn" onClick={() => setSlot(s)} style={{ padding:'11px 8px', borderRadius:12, textAlign:'center', border:`2px solid ${slot===s ? ACC : '#e2e8f0'}`, background: slot===s ? `linear-gradient(135deg,${ACC2},${ACC})` : '#f8fafc', fontSize:13, fontWeight:800, color: slot===s ? '#fff' : '#334155', boxShadow: slot===s ? `0 4px 14px rgba(29,158,117,.4)` : 'none', transition:'all .2s' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CTA FIXE */}
        <div style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 40px)', maxWidth:380 }}>
          <button onClick={() => router.push(`/booking?doctor_id=${id}`)} style={{ width:'100%', padding:'18px', background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', borderRadius:18, fontSize:16, fontWeight:900, color:'#fff', cursor:'pointer', animation:'ctaglow 2s ease-in-out infinite alternate' }}>
            🗓 Prendre Rendez-vous
          </button>
        </div>
      </div>
    </>
  )
}
