'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { publicAppointmentApi } from '@/lib/api'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const CRENEAUX = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00']

type Doctor = { id: number; first_name: string; last_name: string; specialite?: string }

export default function TeleconsultPage() {
  const router = useRouter()
  const [doctors, setDoctors]         = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
  const [selectedDate, setSelectedDate]     = useState('')
  const [selectedSlot, setSelectedSlot]     = useState('')
  const [calendar, setCalendar]             = useState<string[]>([])

  useEffect(() => {
    const days: string[] = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (d.getDay() !== 0) days.push(d.toISOString().split('T')[0])
    }
    setCalendar(days)
    publicAppointmentApi.getDoctors()
      .then(list => setDoctors(list))
      .catch(() => setDoctors([
        { id: 1, first_name: 'Jean', last_name: 'Kouamé', specialite: 'Médecine générale' },
      ]))
  }, [])

  const fmtDate = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso + 'T12:00:00')
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const canBook = selectedDoctor !== null && selectedDate && selectedSlot

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.6)} 50%{box-shadow:0 0 0 8px rgba(74,222,128,0)} }
        @keyframes ctaglow { from{box-shadow:0 8px 24px rgba(29,158,117,.5)} to{box-shadow:0 8px 40px rgba(29,158,117,.8)} }
        .doc-card { cursor:pointer; transition:all .2s cubic-bezier(.34,1.56,.64,1); }
        .doc-card:active { transform:scale(.97); }
        .slot-btn { cursor:pointer; transition:all .18s; }
        .slot-btn:active { transform:scale(.93); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:100 }}>

        {/* HEADER */}
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 28px', borderRadius:'0 0 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>Téléconsultation</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>Consultez depuis chez vous, en vidéo</div>
            </div>
          </div>
          <div style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', borderRadius:16, padding:'12px 16px', display:'inline-flex', alignItems:'center', gap:8 }}>
            <span style={{ width:10,height:10,borderRadius:'50%',background:'#4ade80',display:'inline-block',animation:'pulseDot 1.5s ease-in-out infinite' }}/>
            <span style={{ color:'#fff', fontSize:13, fontWeight:800 }}>Connexion sécurisée · Vidéo HD</span>
          </div>
        </div>

        <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* ÉTAPE 1 — MÉDECIN */}
          <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', animation:'slideUp .35s ease .05s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:26,height:26,borderRadius:8,background:ACC+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:ACC }}>1</span>
              Choisir un médecin
            </div>
            {doctors.length === 0 ? (
              <div style={{ textAlign:'center', padding:16, color:'#94a3b8', fontSize:13, fontWeight:700 }}>⏳ Chargement...</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {doctors.map(d => {
                  const name = `Dr. ${d.first_name} ${d.last_name}`.trim()
                  const isActive = selectedDoctor === d.id
                  return (
                    <div key={d.id} className="doc-card" onClick={() => { setSelectedDoctor(d.id); setSelectedDate(''); setSelectedSlot('') }} style={{
                      display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:16,
                      border:`1.5px solid ${isActive ? ACC : '#e2e8f0'}`,
                      background: isActive ? ACC+'0e' : '#f8fafc',
                    }}>
                      <div style={{ width:50,height:50,borderRadius:16,background:isActive?ACC+'22':'#e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0,position:'relative' }}>
                        👨‍⚕️
                        <span style={{ position:'absolute',bottom:1,right:1,width:12,height:12,borderRadius:'50%',background:'#4ade80',border:'2px solid #fff',animation:'pulseDot 1.5s ease-in-out infinite' }}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:'#0f172a' }}>{name}</div>
                        <div style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>{d.specialite || 'Médecin généraliste'}</div>
                        <div style={{ fontSize:11, fontWeight:800, color:'#4ade80', marginTop:2 }}>✓ Disponible en téléconsult</div>
                      </div>
                      {isActive ? (
                        <div style={{ width:28,height:28,borderRadius:'50%',background:ACC,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:900,flexShrink:0 }}>✓</div>
                      ) : (
                        <div style={{ width:28,height:28,borderRadius:'50%',background:'#f1f5f9',border:'1.5px solid #e2e8f0',flexShrink:0 }}/>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ÉTAPE 2 — DATE */}
          {selectedDoctor !== null && (
            <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', animation:'slideUp .3s ease both' }}>
              <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:26,height:26,borderRadius:8,background:'#0B1D3518',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#0B1D35' }}>2</span>
                Choisir une date
              </div>
              <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
                {calendar.slice(0, 12).map(day => {
                  const parts = fmtDate(day).split(' ')
                  const isActive = selectedDate === day
                  return (
                    <button key={day} className="slot-btn" onClick={() => { setSelectedDate(day); setSelectedSlot('') }} style={{
                      flexShrink:0, padding:'10px 12px', borderRadius:14, cursor:'pointer', textAlign:'center',
                      border:`1.5px solid ${isActive ? '#0B1D35' : '#e2e8f0'}`,
                      background: isActive ? '#0B1D35' : '#f8fafc',
                      color: isActive ? '#fff' : '#0f172a',
                      minWidth:62,
                    }}>
                      <div style={{ fontSize:10, fontWeight:700, opacity:.85 }}>{parts[0]}</div>
                      <div style={{ fontSize:16, fontWeight:900 }}>{parts[1]}</div>
                      <div style={{ fontSize:10, fontWeight:600, opacity:.8 }}>{parts[2]}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — CRÉNEAU */}
          {selectedDate && (
            <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', animation:'slideUp .3s ease both' }}>
              <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:6, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:26,height:26,borderRadius:8,background:'#8B5CF618',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#8B5CF6' }}>3</span>
                Choisir un créneau
              </div>
              <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:12 }}>
                Horaires disponibles le {fmtDate(selectedDate)}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {CRENEAUX.map(h => (
                  <button key={h} className="slot-btn" onClick={() => setSelectedSlot(h)} style={{
                    padding:'11px 4px', borderRadius:12, cursor:'pointer', fontSize:13, fontWeight:800, textAlign:'center',
                    border:`1.5px solid ${selectedSlot===h ? '#8B5CF6' : '#e2e8f0'}`,
                    background: selectedSlot===h ? '#8B5CF6' : '#f8fafc',
                    color: selectedSlot===h ? '#fff' : '#475569',
                  }}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ZONE RURALE */}
          <div style={{ background:'#FFFBEB', border:'1.5px solid #FDE68A', borderRadius:18, padding:'16px', animation:'slideUp .4s ease .2s both' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <span style={{ fontSize:22 }}>🗺️</span>
              <div>
                <div style={{ fontSize:13, fontWeight:900, color:'#92400E' }}>Accessible depuis les zones rurales</div>
                <div style={{ fontSize:12, color:'#78350F', fontWeight:600, marginTop:4, lineHeight:1.6 }}>
                  Bouaké · Korhogo · Yamoussoukro · Daloa · San-Pédro<br/>
                  <strong>Connexion 2G optimisée</strong> pour zones à faible réseau
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CTA FIXE */}
        {canBook && (
          <div style={{ position:'fixed', bottom:72, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:420, padding:'0 20px', boxSizing:'border-box', zIndex:400, animation:'slideUp .3s ease both' }}>
            <button onClick={() => router.push('/teleconsult/call')} style={{
              width:'100%', padding:'17px',
              background:`linear-gradient(135deg,${ACC2},${ACC})`,
              border:'none', borderRadius:18, fontSize:15, fontWeight:900,
              color:'#fff', cursor:'pointer',
              boxShadow:`0 10px 32px rgba(29,158,117,.45)`,
              animation:'ctaglow 2s ease-in-out infinite alternate',
            }}>
              🎥 Démarrer la téléconsultation →
            </button>
            <div style={{ textAlign:'center', marginTop:8, fontSize:11, color:'#64748b', fontWeight:700 }}>
              {fmtDate(selectedDate)} à {selectedSlot} · {doctors.find(d => d.id === selectedDoctor) ? `Dr. ${doctors.find(d => d.id === selectedDoctor)!.last_name}` : ''}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
