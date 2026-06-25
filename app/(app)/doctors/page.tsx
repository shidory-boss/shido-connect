'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const ALL_DOCTORS = [
  { id:1, name:'Dr. Kouamé Shidory', spec:'Neurologie', emoji:'👨‍⚕️', rating:5.0, avail:'Disponible', price:'25 000', exp:'12 ans', color:'#0B1D35' },
  { id:2, name:'Dr. Segou Yan', spec:'Cardiologie', emoji:'👩‍⚕️', rating:4.9, avail:'Disponible', price:'20 000', exp:'8 ans', color:'#8B5CF6' },
  { id:3, name:'Dr. Aminata Coulibaly', spec:'Pédiatrie', emoji:'👩‍⚕️', rating:4.8, avail:'Disponible', price:'18 000', exp:'10 ans', color:'#EC4899' },
  { id:4, name:'Dr. Kouassi Brou', spec:'Dermatologie', emoji:'👨‍⚕️', rating:4.7, avail:'Demain', price:'22 000', exp:'6 ans', color:'#F59E0B' },
  { id:5, name:'Dr. Fatoumata Diallo', spec:'Gynécologie', emoji:'👩‍⚕️', rating:4.9, avail:'Disponible', price:'28 000', exp:'15 ans', color:'#EC4899' },
  { id:6, name:'Dr. Ibrahim Koné', spec:'Dentisterie', emoji:'👨‍⚕️', rating:4.8, avail:'Disponible', price:'15 000', exp:'7 ans', color:'#14B8A6' },
]

const SPECS = ['Tous','Neurologie','Cardiologie','Pédiatrie','Dermatologie','Gynécologie','Dentisterie']

export default function DoctorsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeSpec, setActiveSpec] = useState('Tous')

  const filtered = ALL_DOCTORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.spec.toLowerCase().includes(search.toLowerCase())
    const matchSpec = activeSpec === 'Tous' || d.spec === activeSpec
    return matchSearch && matchSpec
  })

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 0 rgba(52,201,139,.6); }
          50%      { box-shadow:0 0 0 6px rgba(52,201,139,0); }
        }
        .doc-card { cursor:pointer; transition:all .2s cubic-bezier(.34,1.56,.64,1); }
        .doc-card:active { transform:scale(.96) !important; }
        .spec-chip { cursor:pointer; transition:all .2s; white-space:nowrap; }
        .spec-chip:active { transform:scale(.95); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{
          background:`linear-gradient(160deg,${ACC2},${ACC})`,
          padding:'52px 20px 24px',
          borderRadius:'0 0 28px 28px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>Nos Spécialistes</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>{filtered.length} médecin{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>🔍</div>
            <input
              type="text"
              placeholder="Rechercher un médecin ou spécialité..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width:'100%', padding:'13px 16px 13px 42px',
                borderRadius:14, border:'none',
                background:'rgba(255,255,255,.95)',
                fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600,
                color:'#0f172a', outline:'none', boxSizing:'border-box' as const,
                boxShadow:'0 4px 16px rgba(0,0,0,.12)',
              }}
            />
          </div>
        </div>

        {/* CHIPS SPÉCIALITÉS */}
        <div style={{ overflowX:'auto', padding:'16px 20px 0', scrollbarWidth:'none' }}>
          <div style={{ display:'flex', gap:8, width:'max-content' }}>
            {SPECS.map(s => (
              <div key={s} className="spec-chip" onClick={() => setActiveSpec(s)} style={{
                padding:'8px 16px', borderRadius:20,
                background: activeSpec===s ? `linear-gradient(135deg,${ACC2},${ACC})` : '#fff',
                color: activeSpec===s ? '#fff' : '#475569',
                fontSize:13, fontWeight:800,
                border: activeSpec===s ? 'none' : '1.5px solid #e2e8f0',
                boxShadow: activeSpec===s ? `0 4px 12px rgba(29,158,117,.4)` : '0 2px 6px rgba(0,0,0,.04)',
              }}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* GRILLE MÉDECINS */}
        <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {filtered.map((d, i) => (
            <Link key={d.id} href={`/doctor/${d.id}`} style={{ textDecoration:'none', animation:`slideUp .4s cubic-bezier(.34,1.56,.64,1) ${i*0.06}s both` }}>
              <div className="doc-card" style={{
                background:'#fff', borderRadius:20, overflow:'hidden',
                border:'1.5px solid #e2e8f0',
                boxShadow:'0 4px 16px rgba(0,0,0,.06)',
              }}>
                {/* Photo */}
                <div style={{
                  height:90, background:`linear-gradient(135deg,${d.color}22,${d.color}44)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:44, position:'relative',
                }}>
                  {d.emoji}
                  <div style={{
                    position:'absolute', top:10, right:10,
                    width:10, height:10, borderRadius:'50%',
                    background: d.avail==='Disponible' ? '#10b981' : '#f59e0b',
                    border:'2px solid #fff',
                    animation: d.avail==='Disponible' ? 'pulseDot 1.5s ease-in-out infinite' : 'none',
                  }}/>
                </div>
                {/* Info */}
                <div style={{ padding:'12px' }}>
                  <div style={{ fontSize:13, fontWeight:900, color:'#0f172a', lineHeight:1.3 }}>{d.name}</div>
                  <div style={{ fontSize:11, color:'#64748b', fontWeight:600, marginTop:2 }}>{d.spec}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
                    <div style={{ fontSize:11, fontWeight:800, color:'#f59e0b' }}>⭐ {d.rating}</div>
                    <div style={{ fontSize:10, fontWeight:800, color:ACC, background:'#e1f5ee', padding:'3px 8px', borderRadius:8 }}>{d.price} FCFA</div>
                  </div>
                  <div style={{ marginTop:8, padding:'7px 10px', borderRadius:10, background:`${ACC}15`, textAlign:'center', fontSize:11, fontWeight:800, color:ACC2 }}>
                    Voir →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#94a3b8', fontSize:14, fontWeight:600 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            Aucun médecin trouvé pour "{search || activeSpec}"
          </div>
        )}
      </div>
    </>
  )
}
