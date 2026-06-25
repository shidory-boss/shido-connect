'use client'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const SPECS = [
  { icon:'🧠', name:'Neurologie', count:'2 médecins', color:'#0B1D35', bg:'##E8EDF5' },
  { icon:'❤️', name:'Cardiologie', count:'1 médecin', color:'#EF4444', bg:'#FFF1F2' },
  { icon:'👶', name:'Pédiatrie', count:'1 médecin', color:'#EC4899', bg:'#FDF2F8' },
  { icon:'🌿', name:'Dermatologie', count:'1 médecin', color:'#F59E0B', bg:'#FFFBEB' },
  { icon:'🤱', name:'Gynécologie', count:'1 médecin', color:'#8B5CF6', bg:'#F5F3FF' },
  { icon:'🔬', name:'Chirurgie', count:'1 médecin', color:'#64748B', bg:'#F8FAFC' },
  { icon:'🦷', name:'Dentisterie', count:'1 médecin', color:'#14B8A6', bg:'#F0FDFA' },
  { icon:'👁️', name:'Ophtalmologie', count:'1 médecin', color:'#0EA5E9', bg:'#F0F9FF' },
  { icon:'⚗️', name:'Endocrinologie', count:'1 médecin', color:'#D97706', bg:'#FFFBEB' },
  { icon:'🧘', name:'Psychiatrie', count:'1 médecin', color:'#7C3AED', bg:'#F5F3FF' },
]

export default function SpecialtiesPage() {
  const router = useRouter()
  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes cardPop {
          from { opacity:0; transform:scale(.9); }
          to   { opacity:1; transform:scale(1); }
        }
        .spec-card { cursor:pointer; transition:all .2s cubic-bezier(.34,1.56,.64,1); }
        .spec-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,.12) !important; }
        .spec-card:active { transform:scale(.95); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 24px', borderRadius:'0 0 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>Spécialités Médicales</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>{SPECS.length} spécialités disponibles</div>
            </div>
          </div>
        </div>

        <div style={{ padding:'20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {SPECS.map((s, i) => (
            <div key={i} className="spec-card" onClick={() => router.push(`/doctors?spec=${encodeURIComponent(s.name)}`)} style={{
              background:'#fff', borderRadius:20, padding:'20px 16px',
              border:`1.5px solid ${s.color}25`,
              boxShadow:`0 4px 16px ${s.color}15`,
              textAlign:'center',
              animation:`cardPop .4s cubic-bezier(.34,1.56,.64,1) ${i*0.05}s both`,
            }}>
              <div style={{ width:56,height:56,borderRadius:18,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,margin:'0 auto 12px',border:`1.5px solid ${s.color}25` }}>
                {s.icon}
              </div>
              <div style={{ fontSize:13, fontWeight:900, color:'#0f172a', marginBottom:4 }}>{s.name}</div>
              <div style={{ fontSize:11, color:s.color, fontWeight:700, padding:'3px 10px', borderRadius:10, background:`${s.color}15`, display:'inline-block' }}>
                {s.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
