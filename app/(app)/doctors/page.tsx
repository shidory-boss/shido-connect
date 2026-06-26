'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const DOCTOR_PHOTOS: Record<string, string> = {
  'Yanick':  '/images/Docteurs/Docteur africain 600x800.png',
  'Franck':  '/images/Docteurs/Docteur africain final 600x800.png',
  'Christy': '/images/Docteurs/Femme docteur 600x800 final.png',
  'Jean':    '/images/Docteurs/Docteur africain final 600x800.png',
}

type Doctor = { id: number; first_name: string; last_name: string; specialite?: string; img?: string }

const getPhoto = (d: Doctor) => d.img || DOCTOR_PHOTOS[d.first_name] || null

export default function DoctorsPage() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true); setError(false)
    try {
      const base = (typeof window !== 'undefined' && localStorage.getItem('sc_avion_url'))
        || process.env.NEXT_PUBLIC_AVION_API_URL
        || 'http://localhost:8001'
      const r = await fetch(`${base}/api/v1/appointments/public/doctors`)
      if (!r.ok) throw new Error()
      const list = await r.json()
      setDoctors(Array.isArray(list) ? list : [])
    } catch { setError(true) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = doctors.filter(d =>
    `${d.first_name} ${d.last_name} ${d.specialite || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(52,201,139,.6)} 50%{box-shadow:0 0 0 6px rgba(52,201,139,0)} }
        .doc-card{cursor:pointer;transition:all .2s cubic-bezier(.34,1.56,.64,1)}
        .doc-card:active{transform:scale(.96)!important}
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 24px', borderRadius:'0 0 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>Nos Médecins</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>
                {loading ? 'Chargement...' : `${filtered.length} médecin${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>🔍</div>
            <input type="text" placeholder="Rechercher un médecin ou spécialité..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:'100%', padding:'13px 16px 13px 42px', borderRadius:14, border:'none', background:'rgba(255,255,255,.95)', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', boxSizing:'border-box', boxShadow:'0 4px 16px rgba(0,0,0,.12)' }}
            />
          </div>
        </div>

        {/* CONTENU */}
        <div style={{ padding:'16px 20px' }}>
          {loading && (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#94a3b8' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>⏳</div>
              <div style={{ fontSize:14, fontWeight:700 }}>Chargement des médecins...</div>
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign:'center', padding:'60px 20px' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>⚠️</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#ef4444', marginBottom:16 }}>Impossible de joindre le serveur</div>
              <button onClick={load} style={{ padding:'12px 24px', borderRadius:14, background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', border:'none', fontSize:14, fontWeight:800, cursor:'pointer' }}>
                🔄 Réessayer
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && search && (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#94a3b8', fontSize:14, fontWeight:600 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
              Aucun médecin trouvé pour "{search}"
            </div>
          )}

          {!loading && !error && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {filtered.map((d, i) => {
                const name = `Dr. ${d.first_name} ${d.last_name}`
                const photo = getPhoto(d)
                return (
                  <Link key={d.id} href={`/doctor/${d.id}`} style={{ textDecoration:'none', animation:`slideUp .4s cubic-bezier(.34,1.56,.64,1) ${i*0.06}s both` }}>
                    <div className="doc-card" style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)' }}>
                      {/* Photo */}
                      <div style={{ height:110, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                        {photo
                          ? <img src={photo} alt={d.first_name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
                          : <div style={{ fontSize:48 }}>👨‍⚕️</div>
                        }
                        <div style={{ position:'absolute', top:10, right:10, width:10, height:10, borderRadius:'50%', background:'#10b981', border:'2px solid #fff', animation:'pulseDot 1.5s ease-in-out infinite' }} />
                      </div>
                      {/* Info */}
                      <div style={{ padding:'12px' }}>
                        <div style={{ fontSize:13, fontWeight:900, color:'#0f172a', lineHeight:1.3 }}>{name}</div>
                        <div style={{ fontSize:11, color:'#64748b', fontWeight:600, marginTop:2 }}>{d.specialite || 'Médecin généraliste'}</div>
                        <div style={{ marginTop:8, padding:'7px 10px', borderRadius:10, background:`${ACC}15`, textAlign:'center', fontSize:11, fontWeight:800, color:ACC2 }}>
                          Prendre RDV →
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
