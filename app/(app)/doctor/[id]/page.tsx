'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const DOCTORS_DATA: Record<string, any> = {
  '1': { name:'Dr. Kouamé Shidory', spec:'Neurologue', title:'PDG ShidoMedical', price:'25 000', patients:'1 200+', exp:'12 ans', rating:'5.0', about:'Spécialiste en neurologie clinique avec 12 ans d\'expérience. Diplômé de l\'Université Félix Houphouët-Boigny d\'Abidjan et formé à Paris. Expert dans le traitement des AVC, épilepsies et migraines.', color:'#0B1D35', emoji:'👨‍⚕️' },
  '2': { name:'Dr. Segou Yan', spec:'Cardiologue', title:'Cardiologue Senior', price:'20 000', patients:'850+', exp:'8 ans', rating:'4.9', about:'Cardiologue expérimenté spécialisé dans les maladies cardiovasculaires. Formé au CHU de Cocody. Spécialisé dans l\'insuffisance cardiaque et l\'hypertension.', color:'#8B5CF6', emoji:'👩‍⚕️' },
  '3': { name:'Dr. Aminata Coulibaly', spec:'Pédiatre', title:'Pédiatre Référente', price:'18 000', patients:'2 100+', exp:'10 ans', rating:'4.8', about:'Pédiatre avec expertise en maladies tropicales de l\'enfant et nutrition pédiatrique. Référente vaccination région Abidjan Est.', color:'#EC4899', emoji:'👩‍⚕️' },
  '4': { name:'Dr. Kouassi Brou', spec:'Dermatologue', title:'Dermatologue', price:'22 000', patients:'680+', exp:'6 ans', rating:'4.7', about:'Dermatologue spécialisé dans les dermatoses tropicales et la dermatologie esthétique. Traitement acné, eczéma, vitiligo.', color:'#F59E0B', emoji:'👨‍⚕️' },
  '5': { name:'Dr. Fatoumata Diallo', spec:'Gynécologue', title:'Gynécologue Obstétricienne', price:'28 000', patients:'1 500+', exp:'15 ans', rating:'4.9', about:'Gynécologue obstétricienne avec 15 ans d\'expérience. Spécialisée dans le suivi de grossesse et les pathologies gynécologiques.', color:'#EC4899', emoji:'👩‍⚕️' },
  '6': { name:'Dr. Ibrahim Koné', spec:'Dentiste', title:'Chirurgien Dentiste', price:'15 000', patients:'920+', exp:'7 ans', rating:'4.8', about:'Chirurgien dentiste spécialisé en implantologie et orthodontie. Traitement des caries, soins de racine, prothèses.', color:'#14B8A6', emoji:'👨‍⚕️' },
}

const DAYS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const TIME_SLOTS = ['08:00','08:30','09:00','09:30','12:00','12:30','13:00','14:30','15:00','16:00','17:00','19:00']

export default function DoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params?.id || '1')
  const doc = DOCTORS_DATA[id] || DOCTORS_DATA['1']

  const [mode, setMode] = useState<'presentiel'|'tele'>('presentiel')
  const [days, setDays] = useState<Array<{label:string,num:number,active:boolean}>>([])
  const [slot, setSlot] = useState('')

  useEffect(() => {
    const now = new Date()
    setDays(Array.from({length:7}, (_,i) => {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      return { label:DAYS_FR[d.getDay()], num:d.getDate(), active:i===0 }
    }))
  }, [])

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes ctaglow {
          from { box-shadow:0 10px 32px rgba(29,158,117,.5); }
          to   { box-shadow:0 10px 48px rgba(29,158,117,.8),0 0 60px rgba(77,212,160,.3); }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(52,201,139,.6); }
          50%      { box-shadow:0 0 0 6px rgba(52,201,139,0); }
        }
        .slot-btn { cursor:pointer; transition:all .2s; }
        .slot-btn:hover { transform:translateY(-2px); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:100 }}>

        {/* HERO */}
        <div style={{
          background:`linear-gradient(160deg,${ACC2},${doc.color}cc)`,
          padding:'52px 20px 32px',
          position:'relative', overflow:'hidden',
          borderRadius:'0 0 32px 32px',
        }}>
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.1)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-30px', left:'-30px', width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,.06)', pointerEvents:'none' }} />

          <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20 }}>←</button>

          <div style={{ textAlign:'center' }}>
            <div style={{ width:90,height:90,borderRadius:'50%',background:doc.color+'33',border:'3px solid rgba(255,255,255,.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:44,margin:'0 auto 12px',boxShadow:'0 8px 32px rgba(0,0,0,.2)' }}>
              {doc.emoji}
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', textShadow:'0 2px 12px rgba(0,0,0,.2)' }}>{doc.name}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:600, marginTop:4 }}>{doc.spec}</div>
            <div style={{ fontSize:11, color:'#f0d060', fontWeight:800, marginTop:2, letterSpacing:'.5px' }}>✨ {doc.title}</div>
            <div style={{ marginTop:12, fontSize:22, fontWeight:900, color:'#fff' }}>{doc.price} FCFA</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>par consultation</div>

            <div style={{ display:'flex', gap:12, marginTop:18, justifyContent:'center' }}>
              <button style={{ padding:'11px 20px',borderRadius:14,background:'rgba(255,255,255,.2)',border:'1.5px solid rgba(255,255,255,.4)',color:'#fff',fontSize:13,fontWeight:800,cursor:'pointer' }}>
                📞 Appel
              </button>
              <button onClick={() => router.push('/chat')} style={{ padding:'11px 20px',borderRadius:14,background:'rgba(255,255,255,.9)',border:'none',color:ACC2,fontSize:13,fontWeight:800,cursor:'pointer' }}>
                💬 Message
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ margin:'0 20px', marginTop:'-18px', background:'#fff', borderRadius:20, padding:'18px 20px', display:'grid', gridTemplateColumns:'1fr 1px 1fr 1px 1fr', alignItems:'center', boxShadow:'0 8px 32px rgba(0,0,0,.08)', animation:'slideUp .4s ease .1s both' }}>
          {[
            { val:doc.patients, label:'Patients' },
            null,
            { val:doc.exp, label:'Expérience' },
            null,
            { val:'⭐ '+doc.rating, label:'Note' },
          ].map((s,i) => s === null
            ? <div key={i} style={{ height:40, background:'#e2e8f0', width:1 }} />
            : <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:900, color:ACC }}>{s.val}</div>
                <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700 }}>{s.label}</div>
              </div>
          )}
        </div>

        <div style={{ padding:'20px 20px 0' }}>

          {/* À PROPOS */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .15s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:8 }}>À propos</div>
            <div style={{ fontSize:13, color:'#475569', fontWeight:600, lineHeight:1.7 }}>{doc.about}</div>
          </div>

          {/* MODE */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .2s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:12 }}>Type de consultation</div>
            <div style={{ display:'flex', gap:10 }}>
              {[{k:'presentiel' as const, l:'En Personne', ic:'🏥'},{k:'tele' as const, l:'En Ligne', ic:'📱'}].map(({k,l,ic}) => (
                <div key={k} onClick={() => setMode(k)} style={{
                  flex:1, padding:'12px', borderRadius:14, textAlign:'center', cursor:'pointer',
                  border:`2px solid ${mode===k ? ACC : '#e2e8f0'}`,
                  background: mode===k ? '#e1f5ee' : '#f8fafc',
                  fontSize:13, fontWeight:800, color: mode===k ? ACC2 : '#64748b',
                  transition:'all .2s',
                }}>
                  {ic} {l}
                </div>
              ))}
            </div>
          </div>

          {/* CALENDRIER */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .25s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14 }}>Choisir une date</div>
            <div style={{ overflowX:'auto', scrollbarWidth:'none' }}>
              <div style={{ display:'flex', gap:10, width:'max-content' }}>
                {days.map((d,i) => (
                  <div key={i} onClick={() => setDays(ds => ds.map((x,j) => ({...x,active:j===i})))} style={{
                    width:52,height:68,borderRadius:16,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',
                    background: d.active ? `linear-gradient(135deg,${ACC2},${ACC})` : '#f8fafc',
                    border: d.active ? 'none' : '1.5px solid #e2e8f0',
                    boxShadow: d.active ? `0 8px 20px rgba(29,158,117,.4)` : 'none',
                    transition:'all .2s',
                  }}>
                    <div style={{ fontSize:10, fontWeight:700, color:d.active?'rgba(255,255,255,.8)':'#94a3b8', marginBottom:4 }}>{d.label}</div>
                    <div style={{ fontSize:18, fontWeight:900, color:d.active?'#fff':'#334155' }}>{d.num}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CRÉNEAUX */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .3s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:12 }}>Créneaux disponibles</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {TIME_SLOTS.map(s => (
                <div key={s} className="slot-btn" onClick={() => setSlot(s)} style={{
                  padding:'11px 8px', borderRadius:12, textAlign:'center',
                  border:`2px solid ${slot===s ? ACC : '#e2e8f0'}`,
                  background: slot===s ? `linear-gradient(135deg,${ACC2},${ACC})` : '#f8fafc',
                  fontSize:13, fontWeight:800, color: slot===s ? '#fff' : '#334155',
                  boxShadow: slot===s ? `0 4px 14px rgba(29,158,117,.4)` : 'none',
                  transition:'all .2s',
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* AVIS */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:20, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .35s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14 }}>Avis patients</div>
            {[
              { initials:'KA', color:'#0B1D35', name:'Kouamé Assi', note:'⭐⭐⭐⭐⭐', text:'Excellent médecin, très attentionné et professionnel. Je recommande vivement.' },
              { initials:'FD', color:'#EC4899', name:'Fatoumata D.', note:'⭐⭐⭐⭐⭐', text:'Consultation très rassurante. Explications claires et diagnostic rapide.' },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', gap:12, marginBottom:i===0?14:0 }}>
                <div style={{ width:40,height:40,borderRadius:'50%',background:r.color+'22',border:`2px solid ${r.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:r.color,flexShrink:0 }}>{r.initials}</div>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>{r.name}</span>
                    <span style={{ fontSize:11 }}>{r.note}</span>
                  </div>
                  <div style={{ fontSize:12, color:'#64748b', fontWeight:600, lineHeight:1.6 }}>{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA FIXE */}
        <div style={{ position:'fixed', bottom:80, left:'50%', transform:'translateX(-50%)', width:'calc(100% - 40px)', maxWidth:380 }}>
          <button onClick={() => router.push('/booking')} style={{
            width:'100%', padding:'18px',
            background:`linear-gradient(135deg,${ACC2},${ACC})`,
            border:'none', borderRadius:18,
            fontSize:16, fontWeight:900, color:'#fff',
            cursor:'pointer', animation:'ctaglow 2s ease-in-out infinite alternate',
          }}>
            🗓 Prendre Rendez-vous
          </button>
        </div>
      </div>
    </>
  )
}
