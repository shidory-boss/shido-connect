'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACC = '#1D9E75'
const ACC2 = '#0F6E56'

const OPERATORS = [
  { key:'om', name:'Orange Money', emoji:'🟠', color:'#FF6600', bg:'#FFF3EC' },
  { key:'wave', name:'Wave', emoji:'🔵', color:'#1BC8FF', bg:'#EDF9FF' },
  { key:'mtn', name:'MTN MoMo', emoji:'🟡', color:'#FFCC00', bg:'#FFFAEB' },
  { key:'moov', name:'Moov Money', emoji:'💙', color:'#0066CC', bg:'#EEF5FF' },
]

export default function PaymentPage() {
  const router = useRouter()
  const [operator, setOperator] = useState('')
  const [phone, setPhone] = useState('')
  const [threeTimes, setThreeTimes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ref, setRef] = useState('')

  useEffect(() => {
    setRef('SHD-' + new Date().getFullYear() + '-' + (Math.floor(10000 + Math.random() * 90000)))
  }, [])

  const pay = async () => {
    if (!operator) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 2200))
    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <>
      <style>{`
        @keyframes pop {
          from { opacity:0; transform:scale(0); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }
      `}</style>
      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px', textAlign:'center' }}>

        {/* Cercle succès */}
        <div style={{
          width:100, height:100, borderRadius:'50%',
          background:`linear-gradient(135deg,#f59e0b,${ACC})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:44, marginBottom:24,
          animation:'pop .6s cubic-bezier(.34,1.56,.64,1) both',
          boxShadow:`0 16px 48px rgba(29,158,117,.4)`,
        }}>✅</div>

        <div style={{ fontSize:24, fontWeight:900, color:'#0f172a', marginBottom:8, animation:'slideUp .4s ease .2s both' }}>
          Paiement Réussi !
        </div>
        <div style={{ fontSize:13, color:'#64748b', fontWeight:600, animation:'slideUp .4s ease .3s both' }}>
          Votre consultation a été confirmée
        </div>

        {/* Card récap */}
        <div style={{ background:'#fff', borderRadius:20, padding:'20px', marginTop:24, width:'100%', maxWidth:360, border:'1.5px solid #e2e8f0', boxShadow:'0 8px 32px rgba(0,0,0,.08)', animation:'slideUp .4s ease .4s both', textAlign:'left' }}>
          {[
            { label:'Montant payé', val:'25 000 FCFA', bold:true },
            { label:'Via', val:OPERATORS.find(o=>o.key===operator)?.name || 'Mobile Money' },
            { label:'Référence', val:ref },
            { label:'Statut', val:'✅ Confirmé', green:true },
          ].map((r,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:i<3?'1px solid #f1f5f9':'none' }}>
              <span style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>{r.label}</span>
              <span style={{ fontSize:13, fontWeight:r.bold?900:700, color:(r as any).green?ACC:'#0f172a' }}>{r.val}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop:16, fontSize:13, color:ACC, fontWeight:800, cursor:'pointer', animation:'slideUp .4s ease .5s both' }}>
          📄 Télécharger le reçu
        </div>

        <button onClick={() => router.push('/home')} style={{
          marginTop:24, padding:'16px 40px', borderRadius:18,
          background:`linear-gradient(135deg,${ACC2},${ACC})`,
          border:'none', color:'#fff', fontSize:15, fontWeight:900, cursor:'pointer',
          boxShadow:`0 10px 32px rgba(29,158,117,.4)`,
          animation:'slideUp .4s ease .6s both',
        }}>
          🏠 Retour à l&apos;accueil
        </button>
      </div>
    </>
  )

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
        @keyframes spin { to { transform:rotate(360deg); } }
        .op-card { cursor:pointer; transition:all .2s cubic-bezier(.34,1.56,.64,1); }
        .op-card:active { transform:scale(.96); }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:40 }}>

        {/* HEADER */}
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 24px', borderRadius:'0 0 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>Paiement</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>Mobile Money sécurisé</div>
            </div>
          </div>
        </div>

        <div style={{ padding:'20px' }}>

          {/* RÉCAP */}
          <div style={{ background:'#fff', borderRadius:20, padding:'20px', marginBottom:20, border:'1.5px solid #e2e8f0', display:'flex', alignItems:'center', gap:14, boxShadow:'0 4px 16px rgba(0,0,0,.06)', animation:'slideUp .4s ease .05s both' }}>
            <div style={{ width:56,height:56,borderRadius:16,background:`linear-gradient(135deg,${ACC2},${ACC})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0,boxShadow:`0 6px 18px rgba(29,158,117,.3)` }}>🏥</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:'#64748b', fontWeight:700 }}>Consultation médicale</div>
              <div style={{ fontSize:26, fontWeight:900, color:'#0f172a' }}>25 000 FCFA</div>
            </div>
          </div>

          {/* OPÉRATEURS */}
          <div style={{ marginBottom:20, animation:'slideUp .4s ease .1s both' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:14 }}>Choisir votre opérateur</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {OPERATORS.map(op => (
                <div key={op.key} className="op-card" onClick={() => setOperator(op.key)} style={{
                  padding:'14px 16px', borderRadius:16, display:'flex', alignItems:'center', gap:14,
                  border:`2px solid ${operator===op.key ? op.color : '#e2e8f0'}`,
                  background: operator===op.key ? op.bg : '#fff',
                  boxShadow: operator===op.key ? `0 6px 20px ${op.color}30` : '0 2px 8px rgba(0,0,0,.04)',
                  transition:'all .2s',
                }}>
                  <div style={{ width:46,height:46,borderRadius:14,background:`${op.color}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0 }}>{op.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{op.name}</div>
                    <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>Paiement instantané</div>
                  </div>
                  <div style={{ width:24,height:24,borderRadius:'50%',border:`2px solid ${operator===op.key?op.color:'#cbd5e1'}`,background:operator===op.key?op.color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    {operator===op.key && <div style={{width:10,height:10,borderRadius:'50%',background:'#fff'}}/>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NUMÉRO */}
          <div style={{ marginBottom:20, animation:'slideUp .4s ease .15s both' }}>
            <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:8 }}>Numéro Mobile Money</label>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ padding:'14px 14px', borderRadius:14, background:'#f1f5f9', border:'1.5px solid #e2e8f0', fontSize:14, fontWeight:800, color:'#475569', flexShrink:0 }}>🇨🇮 +225</div>
              <input
                type="tel"
                placeholder="07 XX XX XX XX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ flex:1, padding:'14px 16px', borderRadius:14, border:'1.5px solid #e2e8f0', fontSize:15, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', background:'#fff', minWidth:0 }}
              />
            </div>
          </div>

          {/* 3× SANS FRAIS */}
          <div onClick={() => setThreeTimes(!threeTimes)} style={{
            background: threeTimes ? '#E0F2FE' : '#fff',
            border:`2px solid ${threeTimes ? '#0EA5E9' : '#e2e8f0'}`,
            borderRadius:18, padding:'16px', marginBottom:28, cursor:'pointer',
            display:'flex', alignItems:'center', gap:14,
            boxShadow: threeTimes ? '0 6px 20px rgba(14,165,233,.2)' : '0 2px 8px rgba(0,0,0,.04)',
            transition:'all .2s',
            animation:'slideUp .4s ease .2s both',
          }}>
            <div style={{ fontSize:28 }}>🔄</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:900, color:'#0f172a' }}>Payer en 3 fois sans frais</div>
              <div style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>3 × 8 334 FCFA · disponible</div>
            </div>
            <div style={{ padding:'4px 10px', borderRadius:8, background:'#0B1D3520', fontSize:12, fontWeight:800, color:'#0B1D35', flexShrink:0 }}>3×</div>
          </div>

          {/* CTA */}
          <button onClick={pay} disabled={!operator || loading} style={{
            width:'100%', padding:'18px',
            background: !operator ? '#e2e8f0' : `linear-gradient(135deg,${ACC2},${ACC})`,
            border:'none', borderRadius:18,
            fontSize:16, fontWeight:900,
            color: !operator ? '#94a3b8' : '#fff',
            cursor: !operator ? 'not-allowed' : 'pointer',
            animation: operator ? 'ctaglow 2s ease-in-out infinite alternate' : 'none',
            display:'flex', alignItems:'center', justifyContent:'center', gap:12,
          }}>
            {loading
              ? <><span style={{ width:20,height:20,border:'3px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin .8s linear infinite' }}/> Traitement en cours...</>
              : `💳 Payer ${threeTimes ? '3 × 8 334' : '25 000'} FCFA`
            }
          </button>

          <div style={{ textAlign:'center', marginTop:14, fontSize:11, color:'#94a3b8', fontWeight:600 }}>
            🔒 Paiement sécurisé · SSL · Aucune donnée stockée
          </div>
        </div>
      </div>
    </>
  )
}
