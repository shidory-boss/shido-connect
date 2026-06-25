'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACC  = '#1D9E75'
const ACC2 = '#0F6E56'

type ReminderTime = { id: string; time: string }
type Reminder = {
  id: string
  name: string
  dose: string
  color: string
  times: ReminderTime[]
  days: string[]
  active: boolean
  startDate: string
  notes: string
}

const PILL_COLORS = ['#EF4444','#F59E0B','#0B1D35','#8B5CF6','#EC4899','#14B8A6','#F97316','#6366F1']
const JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const JOURS_FULL = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

const uid = () => Math.random().toString(36).slice(2, 9)

const EMPTY_REMINDER: Omit<Reminder,'id'> = {
  name: '', dose: '', color: PILL_COLORS[0], times: [{ id: uid(), time: '08:00' }],
  days: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], active: true, startDate: '', notes: '',
}

function PillIcon({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="10" cy="16" rx="8" ry="5" fill={color} opacity=".9"/>
      <ellipse cx="22" cy="16" rx="8" ry="5" fill={color} opacity=".6"/>
      <rect x="10" y="11" width="12" height="10" fill={color} opacity=".75"/>
      <line x1="16" y1="11" x2="16" y2="21" stroke="white" strokeWidth="1.5" opacity=".5"/>
    </svg>
  )
}

function TimeTag({ time, onRemove }: { time: ReminderTime; onRemove: () => void }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:20, background:'#f0faf6', border:`1.5px solid ${ACC}44`, fontSize:13, fontWeight:800, color:ACC2 }}>
      ⏰ {time.time}
      <button onClick={onRemove} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:14, padding:'0 2px', lineHeight:1 }}>×</button>
    </div>
  )
}

export default function RemindersPage() {
  const router = useRouter()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState<Omit<Reminder,'id'>>({ ...EMPTY_REMINDER, times:[{id:uid(),time:'08:00'}] })
  const [editId, setEditId]       = useState<string | null>(null)
  const [newTime, setNewTime]     = useState('08:00')

  useEffect(() => {
    const saved = localStorage.getItem('sc_reminders')
    if (saved) setReminders(JSON.parse(saved))
  }, [])

  const save = (list: Reminder[]) => {
    setReminders(list)
    localStorage.setItem('sc_reminders', JSON.stringify(list))
  }

  const openNew = () => {
    setEditId(null)
    setForm({ ...EMPTY_REMINDER, times:[{id:uid(),time:'08:00'}] })
    setShowForm(true)
  }

  const openEdit = (r: Reminder) => {
    setEditId(r.id)
    setForm({ name:r.name, dose:r.dose, color:r.color, times:r.times, days:r.days, active:r.active, startDate:r.startDate, notes:r.notes })
    setShowForm(true)
  }

  const submitForm = () => {
    if (!form.name.trim() || form.times.length === 0) return
    if (editId) {
      save(reminders.map(r => r.id === editId ? { ...form, id: editId } : r))
    } else {
      save([...reminders, { ...form, id: uid() }])
    }
    setShowForm(false)
  }

  const deleteReminder = (id: string) => {
    save(reminders.filter(r => r.id !== id))
  }

  const toggleActive = (id: string) => {
    save(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const toggleDay = (d: string) => {
    setForm(f => ({
      ...f,
      days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d],
    }))
  }

  const addTime = () => {
    if (!newTime) return
    setForm(f => ({ ...f, times: [...f.times, { id: uid(), time: newTime }] }))
  }

  const removeTime = (tid: string) => {
    setForm(f => ({ ...f, times: f.times.filter(t => t.id !== tid) }))
  }

  const inp: React.CSSProperties = {
    width:'100%', padding:'12px 14px', borderRadius:14, border:'1.5px solid #e2e8f0',
    fontSize:14, fontFamily:'Nunito,sans-serif', fontWeight:600,
    color:'#0f172a', outline:'none', background:'#fff', boxSizing:'border-box',
  }

  const nextDose = (r: Reminder) => {
    if (!r.active || r.times.length === 0) return null
    const sorted = [...r.times].sort((a, b) => a.time.localeCompare(b.time))
    const now = new Date()
    const nowStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    const next = sorted.find(t => t.time > nowStr)
    return next ? `Prochaine : ${next.time}` : `Demain : ${sorted[0].time}`
  }

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes popUp   { 0%{opacity:0;transform:translateY(100%)} 100%{opacity:1;transform:none} }
        input:focus,select:focus,textarea:focus { border-color:${ACC}!important; box-shadow:0 0 0 3px ${ACC}22; }
      `}</style>

      <div style={{ minHeight:'100vh', background:'#f0faf6', fontFamily:'Nunito,system-ui,sans-serif', paddingBottom:100 }}>

        {/* HEADER */}
        <div style={{ background:`linear-gradient(160deg,${ACC2},${ACC})`, padding:'52px 20px 28px', borderRadius:'0 0 28px 28px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-20px', right:'-20px', width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <button onClick={() => router.back()} style={{ width:40,height:40,borderRadius:12,background:'rgba(255,255,255,.2)',border:'none',color:'#fff',fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>←</button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff' }}>💊 Rappels médicaments</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.75)', fontWeight:600 }}>{reminders.filter(r=>r.active).length} rappel{reminders.filter(r=>r.active).length>1?'s':''} actif{reminders.filter(r=>r.active).length>1?'s':''}</div>
            </div>
            <button onClick={openNew} style={{ padding:'10px 18px', borderRadius:14, background:'rgba(255,255,255,.22)', border:'1.5px solid rgba(255,255,255,.4)', color:'#fff', fontSize:13, fontWeight:900, cursor:'pointer' }}>
              + Ajouter
            </button>
          </div>
        </div>

        <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>

          {/* LISTE VIDE */}
          {reminders.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 20px', animation:'fadeIn .4s ease' }}>
              <div style={{ fontSize:64, marginBottom:16 }}>💊</div>
              <div style={{ fontSize:18, fontWeight:900, color:'#0f172a', marginBottom:8 }}>Aucun rappel configuré</div>
              <div style={{ fontSize:13, color:'#64748b', fontWeight:600, lineHeight:1.7, marginBottom:24 }}>
                Ajoutez vos médicaments pour recevoir des rappels aux bons moments et ne plus oublier vos prises.
              </div>
              <button onClick={openNew} style={{ padding:'14px 32px', borderRadius:18, background:`linear-gradient(135deg,${ACC2},${ACC})`, border:'none', color:'#fff', fontSize:15, fontWeight:900, cursor:'pointer', boxShadow:`0 8px 24px ${ACC}44` }}>
                + Ajouter mon premier médicament
              </button>
            </div>
          )}

          {/* CARTES RAPPELS */}
          {reminders.map((r, i) => {
            const next = nextDose(r)
            return (
              <div key={r.id} style={{ background:'#fff', borderRadius:20, padding:'18px', border:`1.5px solid ${r.active ? r.color+'33' : '#e2e8f0'}`, boxShadow:`0 4px 20px ${r.active ? r.color+'18' : 'rgba(0,0,0,.04)'}`, animation:`slideUp .35s ease ${i*0.07}s both`, opacity: r.active ? 1 : .65 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                  {/* Icône */}
                  <div style={{ width:52,height:52,borderRadius:16,background:r.color+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <PillIcon color={r.color} size={30} />
                  </div>
                  {/* Infos */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                      <div style={{ fontSize:15, fontWeight:900, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</div>
                      {/* Toggle */}
                      <div onClick={() => toggleActive(r.id)} style={{ flexShrink:0, width:44,height:24,borderRadius:12,background:r.active?ACC:'#e2e8f0',cursor:'pointer',position:'relative',transition:'background .2s' }}>
                        <div style={{ position:'absolute',top:2,left:r.active?22:2,width:20,height:20,borderRadius:'50%',background:'#fff',boxShadow:'0 2px 4px rgba(0,0,0,.2)',transition:'left .2s' }}/>
                      </div>
                    </div>
                    {r.dose && <div style={{ fontSize:12, color:'#64748b', fontWeight:600, marginTop:2 }}>{r.dose}</div>}
                    {/* Heures */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                      {r.times.map(t => (
                        <span key={t.id} style={{ padding:'4px 10px', borderRadius:20, background:r.color+'18', fontSize:12, fontWeight:800, color:r.color }}>⏰ {t.time}</span>
                      ))}
                    </div>
                    {/* Jours */}
                    <div style={{ display:'flex', gap:4, marginTop:8 }}>
                      {JOURS.map(j => (
                        <span key={j} style={{ width:26,height:26,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:900,background:r.days.includes(j)?r.color+'22':'#f1f5f9',color:r.days.includes(j)?r.color:'#94a3b8' }}>{j}</span>
                      ))}
                    </div>
                    {next && r.active && (
                      <div style={{ marginTop:8, fontSize:11, fontWeight:800, color:ACC }}>🕐 {next}</div>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display:'flex', gap:8, marginTop:14, paddingTop:12, borderTop:'1px solid #f1f5f9' }}>
                  <button onClick={() => openEdit(r)} style={{ flex:1, padding:'9px', borderRadius:12, background:'#f8fafc', border:'1.5px solid #e2e8f0', fontSize:12, fontWeight:800, color:'#475569', cursor:'pointer' }}>
                    ✏️ Modifier
                  </button>
                  <button onClick={() => deleteReminder(r.id)} style={{ padding:'9px 16px', borderRadius:12, background:'#FFF5F5', border:'1.5px solid #FECACA', fontSize:12, fontWeight:800, color:'#EF4444', cursor:'pointer' }}>
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FORMULAIRE MODAL */}
      {showForm && (
        <>
          {/* Overlay plein écran pour le fond sombre */}
          <div onClick={() => setShowForm(false)} style={{ position:'fixed', inset:0, zIndex:800, background:'rgba(0,0,0,.45)', backdropFilter:'blur(4px)' }} />
          {/* Conteneur centrage — left:0/right:0/margin:auto fiable sur position:fixed */}
          <div style={{ position:'fixed', bottom:0, left:0, right:0, margin:'0 auto', width:'100%', maxWidth:420, zIndex:801, background:'#fff', borderRadius:'24px 24px 0 0', padding:'0 0 40px', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 -8px 40px rgba(0,0,0,.2)', animation:'popUp .35s cubic-bezier(.34,1.56,.64,1) both' }}>
            {/* Handle */}
            <div style={{ display:'flex', justifyContent:'center', padding:'14px 0 4px' }}>
              <div style={{ width:40,height:4,borderRadius:2,background:'#e2e8f0' }}/>
            </div>
            <div style={{ padding:'8px 20px 0' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div style={{ fontSize:17, fontWeight:900, color:'#0f172a' }}>{editId ? '✏️ Modifier' : '+ Nouveau rappel'}</div>
                <button onClick={() => setShowForm(false)} style={{ width:32,height:32,borderRadius:10,background:'#f1f5f9',border:'none',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b' }}>×</button>
              </div>

              {/* Nom du médicament */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.7px', display:'block', marginBottom:7 }}>Nom du médicament *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Ex: Paracétamol, Amoxicilline…" style={inp} />
              </div>

              {/* Dosage */}
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.7px', display:'block', marginBottom:7 }}>Dosage / Forme</label>
                <input value={form.dose} onChange={e => setForm(f => ({...f, dose:e.target.value}))} placeholder="Ex: 500mg · 1 comprimé" style={inp} />
              </div>

              {/* Couleur */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.7px', display:'block', marginBottom:10 }}>Couleur</label>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {PILL_COLORS.map(c => (
                    <div key={c} onClick={() => setForm(f => ({...f, color:c}))} style={{ width:34,height:34,borderRadius:'50%',background:c,cursor:'pointer',border:form.color===c?`3px solid #0f172a`:'3px solid transparent',transform:form.color===c?'scale(1.15)':'scale(1)',transition:'all .15s',boxShadow:`0 2px 8px ${c}66` }}/>
                  ))}
                </div>
              </div>

              {/* Horaires */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.7px', display:'block', marginBottom:10 }}>Heures de prise *</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:10 }}>
                  {form.times.map(t => (
                    <TimeTag key={t.id} time={t} onRemove={() => removeTime(t.id)} />
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={{ ...inp, flex:1 }} />
                  <button onClick={addTime} style={{ padding:'11px 18px', borderRadius:14, background:ACC, border:'none', color:'#fff', fontSize:14, fontWeight:900, cursor:'pointer', flexShrink:0 }}>
                    + Ajouter
                  </button>
                </div>
              </div>

              {/* Jours */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.7px', display:'block', marginBottom:10 }}>Jours de la semaine</label>
                <div style={{ display:'flex', gap:6 }}>
                  {JOURS.map((j, i) => {
                    const isOn = form.days.includes(j)
                    return (
                      <div key={j} onClick={() => toggleDay(j)} style={{ flex:1, padding:'8px 2px', borderRadius:12, textAlign:'center', cursor:'pointer', border:`1.5px solid ${isOn ? form.color : '#e2e8f0'}`, background:isOn?form.color:'#f8fafc', transition:'all .18s' }}>
                        <div style={{ fontSize:9, fontWeight:900, color:isOn?'#fff':'#94a3b8' }}>{j}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Date de début */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.7px', display:'block', marginBottom:7 }}>Date de début (optionnel)</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({...f, startDate:e.target.value}))} style={inp} />
              </div>

              {/* Notes */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.7px', display:'block', marginBottom:7 }}>Notes (optionnel)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes:e.target.value}))} placeholder="Ex: À prendre avec de la nourriture…" rows={2} style={{ ...inp, resize:'none' }} />
              </div>

              {/* Bouton */}
              <button onClick={submitForm} disabled={!form.name.trim() || form.times.length === 0} style={{
                width:'100%', padding:'16px',
                background: form.name.trim() && form.times.length > 0 ? `linear-gradient(135deg,${ACC2},${ACC})` : '#e2e8f0',
                border:'none', borderRadius:18, fontSize:15, fontWeight:900,
                color: form.name.trim() && form.times.length > 0 ? '#fff' : '#94a3b8',
                cursor: form.name.trim() && form.times.length > 0 ? 'pointer' : 'not-allowed',
                boxShadow: form.name.trim() ? `0 8px 24px ${ACC}44` : 'none',
              }}>
                {editId ? '✅ Enregistrer les modifications' : '✅ Créer le rappel'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
