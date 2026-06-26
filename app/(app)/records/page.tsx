'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const ACC  = '#1D9E75'
const ACC2 = '#0F6E56'

type TabKey = 'resultats' | 'ordonnances' | 'imagerie'
type Doc = { id: string; icon: string; name: string; date: string; note: string; color: string }
type Metrics = { tension: string; rythme: string; glycemie: string; poids: string; temperature: string }

const DEMO_RESULTATS: Doc[] = [
  { id:'d1', icon:'🔬', name:'Numération Formule Sanguine', date:'12 Janv 2025', note:'PDF 2.3 MB', color:'#0B1D35' },
  { id:'d2', icon:'🧪', name:'Bilan Lipidique Complet',     date:'5 Déc 2024',  note:'PDF 1.8 MB', color:'#8B5CF6' },
  { id:'d3', icon:'🩸', name:'Test Paludisme Rapide',       date:'20 Nov 2024', note:'PDF 0.9 MB', color:'#EF4444' },
]
const DEMO_ORDO: Doc[] = [
  { id:'o1', icon:'💊', name:'Ordonnance Dr. Oulaï',  date:'12 Janv 2025', note:'PDF 0.5 MB', color:ACC },
  { id:'o2', icon:'💊', name:'Ordonnance Dr. Kouamé', date:'28 Nov 2024',  note:'PDF 0.4 MB', color:ACC2 },
]
const DEMO_IMAGERIE: Doc[] = [
  { id:'i1', icon:'🩻', name:'Radio Thorax Face',     date:'28 Nov 2024', note:'DICOM 14.2 MB', color:'#0EA5E9' },
  { id:'i2', icon:'🧬', name:'Scanner Cérébral IRM',  date:'2 Oct 2024',  note:'DICOM 38.7 MB', color:'#6366F1' },
]
const DEMO_METRICS: Metrics = { tension:'120/80', rythme:'72', glycemie:'94', poids:'68', temperature:'37.1' }

const STORE_KEY = (phone: string, k: string) => `sc_records_${phone}_${k}`

function loadDocs(phone: string, tab: TabKey): Doc[] {
  try { return JSON.parse(localStorage.getItem(STORE_KEY(phone, tab)) || '[]') } catch { return [] }
}
function saveDocs(phone: string, tab: TabKey, docs: Doc[]) {
  localStorage.setItem(STORE_KEY(phone, tab), JSON.stringify(docs))
}
function loadMetrics(phone: string): Metrics {
  try {
    const raw = localStorage.getItem(STORE_KEY(phone, 'metrics'))
    return raw ? JSON.parse(raw) : { tension:'', rythme:'', glycemie:'', poids:'', temperature:'' }
  } catch { return { tension:'', rythme:'', glycemie:'', poids:'', temperature:'' } }
}
function saveMetrics(phone: string, m: Metrics) {
  localStorage.setItem(STORE_KEY(phone, 'metrics'), JSON.stringify(m))
}

const ICONS = ['🔬','🧪','🩸','💊','🩻','🧬','📋','📄']

export default function RecordsPage() {
  const router = useRouter()
  const [mounted, setMounted]     = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [phone, setPhone]         = useState('')
  const [tab, setTab]             = useState<TabKey>('resultats')
  const [toast, setToast]         = useState('')

  // Données réelles (connecté)
  const [resultats, setResultats]     = useState<Doc[]>([])
  const [ordonnances, setOrdonnances] = useState<Doc[]>([])
  const [imagerie, setImagerie]       = useState<Doc[]>([])
  const [metrics, setMetrics]         = useState<Metrics>({ tension:'', rythme:'', glycemie:'', poids:'', temperature:'' })

  // UI états
  const [editMetrics, setEditMetrics]       = useState(false)
  const [metricsForm, setMetricsForm]       = useState<Metrics>(metrics)
  const [showAddDoc, setShowAddDoc]         = useState(false)
  const [newDoc, setNewDoc]                 = useState<Partial<Doc>>({ icon:'📋', name:'', date:'', note:'', color:ACC })
  const [editDoc, setEditDoc]               = useState<Doc | null>(null)

  useEffect(() => {
    setMounted(true)
    const raw = localStorage.getItem('sc_patient')
    const token = localStorage.getItem('sc_token')
    if (raw && token) {
      const p = JSON.parse(raw)
      const ph = p.phone || ''
      setPhone(ph)
      setIsLoggedIn(true)
      setResultats(loadDocs(ph, 'resultats'))
      setOrdonnances(loadDocs(ph, 'ordonnances'))
      setImagerie(loadDocs(ph, 'imagerie'))
      const m = loadMetrics(ph)
      setMetrics(m)
      setMetricsForm(m)
    }
  }, [])

  if (!mounted) return null

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const currentDocs = isLoggedIn
    ? (tab === 'resultats' ? resultats : tab === 'ordonnances' ? ordonnances : imagerie)
    : (tab === 'resultats' ? DEMO_RESULTATS : tab === 'ordonnances' ? DEMO_ORDO : DEMO_IMAGERIE)

  const setCurrentDocs = (docs: Doc[]) => {
    if (!isLoggedIn) return
    if (tab === 'resultats') { setResultats(docs); saveDocs(phone, 'resultats', docs) }
    else if (tab === 'ordonnances') { setOrdonnances(docs); saveDocs(phone, 'ordonnances', docs) }
    else { setImagerie(docs); saveDocs(phone, 'imagerie', docs) }
  }

  const saveMetricsForm = () => {
    setMetrics(metricsForm)
    saveMetrics(phone, metricsForm)
    setEditMetrics(false)
    showToast('✓ Données médicales mises à jour')
  }

  const addDoc = () => {
    if (!newDoc.name) return
    const doc: Doc = {
      id: Date.now().toString(),
      icon: newDoc.icon || '📋',
      name: newDoc.name!,
      date: newDoc.date || new Date().toLocaleDateString('fr-FR'),
      note: newDoc.note || '',
      color: ACC,
    }
    setCurrentDocs([...currentDocs, doc])
    setNewDoc({ icon:'📋', name:'', date:'', note:'', color:ACC })
    setShowAddDoc(false)
    showToast('✓ Document ajouté')
  }

  const saveEditDoc = () => {
    if (!editDoc) return
    setCurrentDocs(currentDocs.map(d => d.id === editDoc.id ? editDoc : d))
    setEditDoc(null)
    showToast('✓ Document modifié')
  }

  const deleteDoc = (id: string) => {
    setCurrentDocs(currentDocs.filter(d => d.id !== id))
    showToast('🗑 Document supprimé')
  }

  const displayMetrics = isLoggedIn ? metrics : DEMO_METRICS

  const GAUGE_MAX: Record<string, number> = { bpm:220, 'mg/dL':300, kg:200, '°C':42 }
  const metricCard = (icon: string, bg: string, label: string, val: string, unit: string) => {
    const empty = !val
    const numVal = parseFloat(val) || 0
    const max = GAUGE_MAX[unit] || 100
    const pct = Math.min((numVal / max) * 100, 100)
    return (
      <div style={{ background:bg, borderRadius:18, padding:'16px', border:'1.5px solid rgba(0,0,0,.05)', opacity:empty && isLoggedIn ? .5 : 1 }}>
        <div style={{ fontSize:24, marginBottom:8 }}>{icon}</div>
        <div style={{ fontSize:11, color:'#64748b', fontWeight:700, marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:20, fontWeight:900, color:'#0f172a', animation:'countUp .6s ease both' }}>
          {empty && isLoggedIn ? <span style={{fontSize:12,color:'#94a3b8'}}>—</span> : <>{val}<span style={{fontSize:11,fontWeight:600,color:'#94a3b8',marginLeft:2}}>{unit}</span></>}
        </div>
        {!empty && (
          <div style={{ marginTop:8, height:4, borderRadius:4, background:'rgba(0,0,0,.08)', overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:4,
              background:`linear-gradient(90deg,${ACC2},${ACC})`,
              // @ts-expect-error css var
              '--gauge-w': `${pct}%`,
              animation:'gaugeUp .9s cubic-bezier(.34,1.56,.64,1) .2s both',
              width:`${pct}%`,
            }} />
          </div>
        )}
      </div>
    )
  }

  const inp = (k: keyof Metrics, label: string, placeholder: string) => (
    <div>
      <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:5 }}>{label}</label>
      <input type="text" value={metricsForm[k]} onChange={e => setMetricsForm(p => ({ ...p, [k]: e.target.value }))} placeholder={placeholder}
        style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #e2e8f0', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', boxSizing:'border-box' as const, background:'#f8fafc' }} />
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes floatBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes toastIn    { from{opacity:0;transform:translateY(20px) scale(.95)} to{opacity:1;transform:none} }
        @keyframes toastBounce{ 0%{opacity:0;transform:translateX(-50%) translateY(-28px) scale(.85)} 60%{transform:translateX(-50%) translateY(6px) scale(1.04)} 80%{transform:translateX(-50%) translateY(-3px) scale(.98)} 100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }
        @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
        @keyframes gaugeUp    { from{width:0%} to{width:var(--gauge-w)} }
        @keyframes countUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .doc-row { transition:all .2s; }
        .doc-row:active { transform:scale(.98); }
        input:focus { border-color:${ACC}!important; box-shadow:0 0 0 3px rgba(29,158,117,.12)!important; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:80 }}>

        {toast && (
          <div style={{ position:'fixed', top:24, left:'50%', background:'#0f172a', color:'#fff', padding:'12px 24px', borderRadius:20, fontSize:13, fontWeight:700, zIndex:9999, animation:'toastBounce .5s cubic-bezier(.34,1.56,.64,1) both', whiteSpace:'nowrap', boxShadow:'0 8px 24px rgba(0,0,0,.25)' }}>
            {toast}
          </div>
        )}

        {/* HERO */}
        <div style={{ position:'relative', height:200, overflow:'hidden' }}>
          <Image src="/images/Services/Radiologie et Imagerie 800x800 style reference.png" alt="dossier" fill sizes="100vw" style={{ objectFit:'cover', objectPosition:'center' }} priority />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(6,15,28,.88) 0%,rgba(11,29,53,.75) 50%,rgba(15,110,86,.65) 100%)' }} />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 20px 20px' }}>
            <button onClick={() => router.back()} style={{ position:'absolute', top:48, left:20, width:40,height:40,borderRadius:13,background:'rgba(255,255,255,.18)',border:'1.5px solid rgba(255,255,255,.3)',color:'#fff',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(10px)' }}>←</button>
            <div style={{ fontSize:11, fontWeight:800, color:'#a8edda', letterSpacing:'2px', textTransform:'uppercase', marginBottom:4 }}>
              {isLoggedIn ? 'Votre espace santé' : 'Aperçu démo'}
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2 }}>Mon Dossier <span style={{ color:'#a8edda' }}>Santé</span></div>
          </div>
        </div>

        {/* BADGE DÉMO si pas connecté */}
        {!isLoggedIn && (
          <div style={{ margin:'12px 16px 0', background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:16, padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:20 }}>🔒</span>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:'#92400e' }}>Mode démo — données fictives</div>
              <div style={{ fontSize:11, color:'#78350f', fontWeight:600 }}>Connectez-vous pour gérer votre vrai dossier</div>
            </div>
          </div>
        )}

        <div style={{ padding:'16px 16px 0' }}>

          {/* TENSION + BOUTON MODIFIER */}
          <div style={{ background:`linear-gradient(135deg,${ACC2},${ACC})`, borderRadius:22, padding:'20px', marginBottom:12, position:'relative', overflow:'hidden', animation:'slideUp .4s ease .05s both', boxShadow:`0 12px 40px rgba(29,158,117,.35)` }}>
            <div style={{ position:'absolute', top:'-20px', right:'-20px', width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.1)', animation:'floatBob 4s ease-in-out infinite' }} />
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Tension Artérielle</div>
                <div style={{ fontSize:42, fontWeight:900, color:'#fff', lineHeight:1 }}>
                  {displayMetrics.tension || <span style={{ fontSize:18, opacity:.6 }}>— / —</span>}
                  {displayMetrics.tension && <span style={{ fontSize:16 }}> mmHg</span>}
                </div>
              </div>
              {isLoggedIn && (
                <button onClick={() => { setEditMetrics(!editMetrics); setMetricsForm(metrics) }} style={{ padding:'8px 14px', borderRadius:12, background:'rgba(255,255,255,.2)', border:'1.5px solid rgba(255,255,255,.4)', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', backdropFilter:'blur(8px)' }}>
                  {editMetrics ? '✕ Fermer' : '✏️ Modifier'}
                </button>
              )}
            </div>
          </div>

          {/* FORMULAIRE MÉTRIQUES */}
          {isLoggedIn && editMetrics && (
            <div style={{ background:'#fff', borderRadius:20, padding:'20px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', marginBottom:12, display:'flex', flexDirection:'column', gap:12, animation:'fadeIn .3s ease both' }}>
              <div style={{ fontSize:14, fontWeight:900, color:'#0f172a', marginBottom:2 }}>Mes données biométriques</div>
              {inp('tension', 'Tension (mmHg)', 'ex: 120/80')}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {inp('rythme', 'Rythme (bpm)', 'ex: 72')}
                {inp('glycemie', 'Glycémie (mg/dL)', 'ex: 94')}
                {inp('poids', 'Poids (kg)', 'ex: 68')}
                {inp('temperature', 'Température (°C)', 'ex: 37.1')}
              </div>
              <button onClick={saveMetricsForm} style={{ padding:'13px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', boxShadow:`0 8px 24px rgba(29,158,117,.4)` }}>
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* GRILLE 4 MÉTRIQUES */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14, animation:'slideUp .4s ease .1s both' }}>
            {metricCard('❤️', '#FEF2F2', 'Rythme cardiaque', displayMetrics.rythme, 'bpm')}
            {metricCard('🩸', '#FFF7ED', 'Glycémie', displayMetrics.glycemie, 'mg/dL')}
            {metricCard('⚖️', '#F0FDF4', 'Poids', displayMetrics.poids, 'kg')}
            {metricCard('🌡️', '#F5F3FF', 'Température', displayMetrics.temperature, '°C')}
          </div>

          {/* TABS */}
          <div style={{ background:'#fff', borderRadius:18, padding:'6px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, marginBottom:12, border:'1.5px solid #e2e8f0', animation:'slideUp .4s ease .15s both' }}>
            {([['resultats','🔬 Résultats'],['ordonnances','💊 Ordonnances'],['imagerie','🩻 Imagerie']] as const).map(([k,l]) => (
              <div key={k} onClick={() => { setTab(k); setShowAddDoc(false) }} style={{ padding:'10px 4px', borderRadius:12, textAlign:'center', cursor:'pointer', background:tab===k?`linear-gradient(135deg,${ACC2},${ACC})`:'transparent', color:tab===k?'#fff':'#64748b', fontSize:11, fontWeight:800, transition:'all .2s', boxShadow:tab===k?`0 4px 12px rgba(29,158,117,.3)`:'none' }}>
                {l}
              </div>
            ))}
          </div>

          {/* BOUTON AJOUTER (connecté seulement) */}
          {isLoggedIn && (
            <button onClick={() => setShowAddDoc(!showAddDoc)} style={{ width:'100%', padding:'13px', borderRadius:16, border:`2px dashed ${ACC}`, background:showAddDoc?`${ACC}10`:'transparent', color:ACC, fontSize:13, fontWeight:800, cursor:'pointer', marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .2s' }}>
              {showAddDoc ? '✕ Annuler' : '＋ Ajouter un document'}
            </button>
          )}

          {/* FORMULAIRE AJOUT */}
          {isLoggedIn && showAddDoc && (
            <div style={{ background:'#fff', borderRadius:18, padding:'18px', border:'1.5px solid #e2e8f0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', marginBottom:12, display:'flex', flexDirection:'column', gap:12, animation:'fadeIn .3s ease both' }}>
              <div style={{ fontSize:13, fontWeight:900, color:'#0f172a' }}>Nouveau document</div>
              <div>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:5 }}>Icône</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {ICONS.map(ic => (
                    <div key={ic} onClick={() => setNewDoc(p => ({ ...p, icon: ic }))} style={{ width:36, height:36, borderRadius:10, background:newDoc.icon===ic?`${ACC}22`:'#f1f5f9', border:`2px solid ${newDoc.icon===ic?ACC:'transparent'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, cursor:'pointer' }}>
                      {ic}
                    </div>
                  ))}
                </div>
              </div>
              {[
                { k:'name' as const, label:'Nom du document', placeholder:'Bilan sanguin...' },
                { k:'date' as const, label:'Date', placeholder:'ex: 25 Juin 2026' },
                { k:'note' as const, label:'Note (type, taille...)', placeholder:'ex: PDF 1.2 MB' },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input type="text" value={(newDoc[f.k] as string) || ''} onChange={e => setNewDoc(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.placeholder}
                    style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #e2e8f0', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', boxSizing:'border-box' as const, background:'#f8fafc' }} />
                </div>
              ))}
              <button onClick={addDoc} disabled={!newDoc.name} style={{ padding:'13px', borderRadius:14, border:'none', background:newDoc.name?`linear-gradient(135deg,${ACC2},${ACC})`:'#e2e8f0', color:newDoc.name?'#fff':'#94a3b8', fontSize:14, fontWeight:900, cursor:newDoc.name?'pointer':'not-allowed' }}>
                ✓ Ajouter
              </button>
            </div>
          )}

          {/* MODAL EDITION */}
          {editDoc && (
            <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:9000, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={() => setEditDoc(null)}>
              <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:480, background:'#fff', borderRadius:'24px 24px 0 0', padding:'24px 20px 36px', display:'flex', flexDirection:'column', gap:12, animation:'slideUp .3s ease both' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                  <div style={{ fontSize:15, fontWeight:900, color:'#0f172a' }}>Modifier le document</div>
                  <button onClick={() => setEditDoc(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#94a3b8' }}>✕</button>
                </div>
                {[
                  { k:'name' as keyof Doc, label:'Nom', placeholder:'Nom du document' },
                  { k:'date' as keyof Doc, label:'Date', placeholder:'ex: 25 Juin 2026' },
                  { k:'note' as keyof Doc, label:'Note', placeholder:'ex: PDF 1.2 MB' },
                ].map(f => (
                  <div key={f.k}>
                    <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.8px', display:'block', marginBottom:5 }}>{f.label}</label>
                    <input type="text" value={(editDoc[f.k] as string) || ''} onChange={e => setEditDoc(p => p ? { ...p, [f.k]: e.target.value } : null)} placeholder={f.placeholder}
                      style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #e2e8f0', fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600, color:'#0f172a', outline:'none', boxSizing:'border-box' as const, background:'#f8fafc' }} />
                  </div>
                ))}
                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                  <button onClick={() => { deleteDoc(editDoc.id); setEditDoc(null) }} style={{ flex:1, padding:'13px', borderRadius:14, border:'1.5px solid #fecaca', background:'#fff5f5', color:'#EF4444', fontSize:13, fontWeight:800, cursor:'pointer' }}>
                    🗑 Supprimer
                  </button>
                  <button onClick={saveEditDoc} style={{ flex:2, padding:'13px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${ACC2},${ACC})`, color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer' }}>
                    💾 Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LISTE DOCUMENTS */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, animation:'slideUp .4s ease .2s both' }}>
            {currentDocs.length === 0 ? (
              <div style={{ textAlign:'center', padding:'32px 20px', color:'#94a3b8', background:'#fff', borderRadius:18, border:'1.5px dashed #e2e8f0' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>📂</div>
                <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>Aucun document</div>
                <div style={{ fontSize:12, fontWeight:600 }}>Appuyez sur "Ajouter" pour déposer votre premier document</div>
              </div>
            ) : currentDocs.map((doc, i) => (
              <div key={doc.id || i} className="doc-row" style={{ background:'#fff', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, border:'1.5px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ width:46,height:46,borderRadius:14,background:(doc.color||ACC)+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>{doc.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.name}</div>
                  <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{doc.date}{doc.note ? ` · ${doc.note}` : ''}</div>
                </div>
                {isLoggedIn ? (
                  <button onClick={() => setEditDoc(doc)} style={{ width:38,height:38,borderRadius:12,background:'#f0faf6',border:'none',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    ✏️
                  </button>
                ) : (
                  <button onClick={() => showToast('🔒 Connectez-vous pour télécharger')} style={{ width:38,height:38,borderRadius:12,background:'#e1f5ee',border:'none',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    ⬇
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
