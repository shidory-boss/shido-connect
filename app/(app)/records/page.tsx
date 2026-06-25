'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

type TabKey = 'resultats' | 'ordonnances' | 'imagerie'

const RESULTATS = [
  { icon:'🔬', name:'Numération Formule Sanguine', date:'12 Janv 2025', size:'PDF 2.3 MB', color:'#0B1D35' },
  { icon:'🧪', name:'Bilan Lipidique Complet', date:'5 Déc 2024', size:'PDF 1.8 MB', color:'#8B5CF6' },
  { icon:'🩸', name:'Test Paludisme Rapide', date:'20 Nov 2024', size:'PDF 0.9 MB', color:'#EF4444' },
]

const ORDONNANCES = [
  { icon:'💊', name:'Ordonnance Dr. Shidory', date:'12 Janv 2025', size:'PDF 0.5 MB' },
  { icon:'💊', name:'Ordonnance Dr. Yan', date:'28 Nov 2024', size:'PDF 0.4 MB' },
]

const IMAGERIE = [
  { icon:'🩻', name:'Radio Thorax Face', date:'28 Nov 2024', size:'DICOM 14.2 MB', color:'#0EA5E9' },
  { icon:'🧬', name:'Scanner Cérébral IRM', date:'2 Oct 2024', size:'DICOM 38.7 MB', color:'#6366F1' },
]

export default function RecordsPage() {
  const router = useRouter()
  const [tab, setTab] = useState<TabKey>('resultats')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const tabData = { resultats: RESULTATS, ordonnances: ORDONNANCES, imagerie: IMAGERIE }
  const current = tabData[tab]

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes floatBob {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
        @keyframes toastIn {
          from { opacity:0; transform:translateY(20px) scale(.95); }
          to   { opacity:1; transform:none; }
        }
        .dl-btn { cursor:pointer; transition:all .2s; }
        .dl-btn:active { transform:scale(.93); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {/* Toast */}
        {toast && (
          <div style={{ position:'fixed', bottom:100, left:'50%', transform:'translateX(-50%)', background:'#0f172a', color:'#fff', padding:'12px 24px', borderRadius:20, fontSize:13, fontWeight:700, zIndex:9999, animation:'toastIn .3s ease', whiteSpace:'nowrap', boxShadow:'0 8px 24px rgba(0,0,0,.25)' }}>
            {toast}
          </div>
        )}

        {/* HERO PHOTO */}
        <div style={{ position:'relative', height:220, overflow:'hidden' }}>
          <img
            src="/images/Services/Radiologie et Imagerie 800x800 style reference.png"
            alt="dossier"
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(6,15,28,.88) 0%,rgba(11,29,53,.75) 50%,rgba(15,110,86,.65) 100%)' }} />
          <div style={{ position:'absolute', top:'-20px', right:'-20px', width:140, height:140, borderRadius:'50%', background:'rgba(29,158,117,.15)', pointerEvents:'none' }} />

          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 20px 24px' }}>
            <button onClick={() => router.back()} style={{ position:'absolute', top:48, left:20, width:40,height:40,borderRadius:13,background:'rgba(255,255,255,.18)',border:'1.5px solid rgba(255,255,255,.3)',color:'#fff',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)' }}>←</button>
            <div style={{ fontSize:11, fontWeight:800, color:ACC, letterSpacing:'2px', textTransform:'uppercase', marginBottom:6 }}>Espace santé</div>
            <div style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.15 }}>Mon Dossier<br/><span style={{ color:ACC }}>Santé</span></div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', fontWeight:600, marginTop:6 }}>Résultats · Ordonnances · Imagerie</div>
          </div>
        </div>

        <div style={{ padding:'20px 20px 0' }}>

          {/* CARTE TENSION PRINCIPALE */}
          <div style={{ background:`linear-gradient(135deg,${ACC2},${ACC})`, borderRadius:22, padding:'22px', marginBottom:16, position:'relative', overflow:'hidden', animation:'slideUp .4s ease .05s both', boxShadow:`0 12px 40px rgba(29,158,117,.35)` }}>
            <div style={{ position:'absolute', top:'-20px', right:'-20px', width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.1)', animation:'floatBob 4s ease-in-out infinite' }} />
            <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Tension Artérielle</div>
            <div style={{ fontSize:48, fontWeight:900, color:'#fff', lineHeight:1 }}>120<span style={{fontSize:22}}>/</span>80</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:600, marginTop:6 }}>mmHg · Normal ✓ · Mesuré hier</div>
          </div>

          {/* GRILLE 4 MÉTRIQUES */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16, animation:'slideUp .4s ease .1s both' }}>
            {[
              { icon:'❤️', bg:'#FEF2F2', iconBg:'#EF444420', label:'Rythme Cardiaque', val:'72', unit:'bpm', status:'Normal', statusC:'#10b981' },
              { icon:'🩸', bg:'#FFF7ED', iconBg:'#F9730820', label:'Glycémie', val:'94', unit:'mg/dL', status:'Normal', statusC:'#10b981' },
              { icon:'⚖️', bg:'##E8EDF5', iconBg:'#0B1D3520', label:'Poids', val:'68', unit:'kg', status:'Idéal', statusC:'#10b981' },
              { icon:'🌡️', bg:'#F5F3FF', iconBg:'#8B5CF620', label:'Température', val:'37.1', unit:'°C', status:'Normal', statusC:'#10b981' },
            ].map((m,i) => (
              <div key={i} style={{ background:m.bg, borderRadius:18, padding:'16px', border:'1.5px solid rgba(0,0,0,.05)', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ width:36,height:36,borderRadius:10,background:m.iconBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,marginBottom:10 }}>{m.icon}</div>
                <div style={{ fontSize:11, color:'#64748b', fontWeight:700, marginBottom:4 }}>{m.label}</div>
                <div style={{ fontSize:22, fontWeight:900, color:'#0f172a' }}>{m.val}<span style={{fontSize:11,fontWeight:600,color:'#94a3b8',marginLeft:2}}>{m.unit}</span></div>
                <div style={{ fontSize:10, fontWeight:800, color:m.statusC, marginTop:4 }}>✓ {m.status}</div>
              </div>
            ))}
          </div>

          {/* MÉDICAMENTS */}
          <div style={{ background:'#fff', borderRadius:18, padding:'18px', marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .15s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14 }}>Médicaments du jour 💊</div>
            {[
              { icon:'💊', name:'Paracétamol 500mg', dose:'2 comprimés · Matin & Soir', time:'20:00', urgent:true },
              { icon:'🧴', name:'Vitamine D3 · 1000 UI', dose:'1 capsule · Le matin', time:'08:00', urgent:false },
            ].map((m,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:i===0?12:0, padding:'12px', borderRadius:14, background:m.urgent?'#fffbee':'#f0faf6', border:`1.5px solid ${m.urgent?'#fde68a':'#d1fae5'}` }}>
                <div style={{ fontSize:28 }}>{m.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>{m.name}</div>
                  <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{m.dose}</div>
                </div>
                <div style={{ padding:'5px 10px', borderRadius:10, background:m.urgent?'#FEF3C7':'#D1FAE5', fontSize:12, fontWeight:800, color:m.urgent?'#D97706':'#059669', flexShrink:0 }}>
                  {m.time}
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ background:'#fff', borderRadius:18, padding:'6px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, marginBottom:16, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .2s both' }}>
            {([['resultats','🔬 Résultats'],['ordonnances','💊 Ordonnances'],['imagerie','🩻 Imagerie']] as const).map(([k,l]) => (
              <div key={k} onClick={() => setTab(k)} style={{
                padding:'10px 4px', borderRadius:12, textAlign:'center', cursor:'pointer',
                background: tab===k ? `linear-gradient(135deg,${ACC2},${ACC})` : 'transparent',
                color: tab===k ? '#fff' : '#64748b',
                fontSize:11, fontWeight:800,
                transition:'all .2s',
                boxShadow: tab===k ? `0 4px 12px rgba(29,158,117,.3)` : 'none',
              }}>
                {l}
              </div>
            ))}
          </div>

          {/* LISTE DOCUMENTS */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, animation:'slideUp .4s ease .25s both' }}>
            {current.map((doc: any, i: number) => (
              <div key={i} style={{ background:'#fff', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, border:'1.5px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ width:46,height:46,borderRadius:14,background:(doc.color||ACC)+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>{doc.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.name}</div>
                  <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{doc.date} · {doc.size}</div>
                </div>
                <button className="dl-btn" onClick={() => showToast(`⬇ Téléchargement de "${doc.name}" simulé`)} style={{ width:38,height:38,borderRadius:12,background:'#e1f5ee',border:'none',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  ⬇
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
