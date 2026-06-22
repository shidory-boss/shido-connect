'use client';
import { useEffect, useState } from 'react';
import PWANav from '@/components/layout/PWANav';
import PWAFooter from '@/components/layout/PWAFooter';
import { clinicConfig } from '@/lib/config';
import { CLINIC_ID } from '@/lib/api';

interface Doctor { id: number; first_name: string; last_name: string; specialite?: string; }

const API = process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001';

const MOTIFS = [
  { icon: '🤒', label: 'Fièvre / Infection' },
  { icon: '💊', label: 'Renouvellement ordonnance' },
  { icon: '🩺', label: 'Consultation de routine' },
  { icon: '🤰', label: 'Suivi grossesse (CPN)' },
  { icon: '👶', label: 'Pédiatrie' },
  { icon: '🩸', label: 'Bilan sanguin' },
  { icon: '🦷', label: 'Douleur / Urgence' },
  { icon: '📋', label: 'Certificat médical' },
];

export default function RdvPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [step,    setStep]    = useState(1);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patient_name: '', patient_phone: '', reason: '', doctor_id: 0,
    date: '', heure: '',
  });

  useEffect(() => {
    fetch(`${API}/api/v1/appointments/public/doctors`)
      .then(r => r.json()).then(setDoctors).catch(() => {});
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const scheduled_at = new Date(`${form.date}T${form.heure}:00`).toISOString();
      const body = {
        patient_name:  form.patient_name,
        patient_phone: form.patient_phone,
        reason:        form.reason,
        doctor_id:     form.doctor_id || undefined,
        scheduled_at,
        clinic_id:     CLINIC_ID,
      };
      const r = await fetch(`${API}/api/v1/appointments/public`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (r.ok) setDone(true);
      else { const e = await r.json(); alert(e.detail || 'Erreur serveur'); }
    } catch { alert('Connexion impossible au serveur'); }
    setLoading(false);
  };

  const inp: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', outline: 'none', transition: 'border .2s' };

  if (done) return (
    <>
      <PWANav />
      <main style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(29,158,117,0.35)' }}>✅</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Demande envoyée !</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.7 }}>Votre demande de rendez-vous a été transmise à notre secrétariat. Nous vous contacterons rapidement pour confirmer l'heure.</p>
          <a href="/" style={{ padding: '12px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }} className="btn-accent">Retour à l'accueil</a>
        </div>
      </main>
      <PWAFooter />
    </>
  );

  return (
    <>
      <PWANav />
      <main style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingTop: 80 }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>Prendre un rendez-vous</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Simple, rapide, sans application</p>
            <div className="gold-divider center" style={{ marginTop: 14 }} />
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
            {['Vos infos', 'Motif', 'Médecin & Date'].map((s, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ height: 3, width: '100%', borderRadius: 2, background: i + 1 <= step ? `linear-gradient(90deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})` : 'var(--border)', transition: 'all .3s' }} />
                <span style={{ fontSize: 10, color: i + 1 <= step ? clinicConfig.accent : 'var(--text-tertiary)', fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28, boxShadow: 'var(--shadow-md)' }}>

            {/* Step 1 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>👤 Vos coordonnées</h2>
                {[
                  { key: 'patient_name',  label: 'Nom complet *',  placeholder: 'Ex: Aminata Coulibaly', type: 'text' },
                  { key: 'patient_phone', label: 'Téléphone *',     placeholder: 'Ex: 07 XX XX XX XX',   type: 'tel' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]} placeholder={f.placeholder}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={inp}
                      onFocus={e => { e.currentTarget.style.borderColor = clinicConfig.accent; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                    />
                  </div>
                ))}
                <button onClick={() => { if (form.patient_name && form.patient_phone) setStep(2); }}
                  disabled={!form.patient_name || !form.patient_phone}
                  style={{ width: '100%', padding: '13px', marginTop: 4, fontSize: 14, fontWeight: 700, borderRadius: 12, opacity: form.patient_name && form.patient_phone ? 1 : 0.5 }}
                  className="btn-accent"
                >Suivant →</button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>📋 Motif de consultation</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                  {MOTIFS.map(m => (
                    <button key={m.label} onClick={() => setForm({ ...form, reason: m.label })}
                      style={{ padding: '10px 12px', background: form.reason === m.label ? clinicConfig.accentLight : 'var(--bg-secondary)', border: `1.5px solid ${form.reason === m.label ? clinicConfig.accent : 'var(--border)'}`, borderRadius: 10, fontSize: 13, color: form.reason === m.label ? clinicConfig.accentDark : 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}
                    >{m.icon} {m.label}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', background: 'var(--bg-tertiary)', border: '0.5px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 12, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>← Retour</button>
                  <button onClick={() => { if (form.reason) setStep(3); }} disabled={!form.reason}
                    style={{ flex: 2, padding: '12px', fontSize: 14, fontWeight: 700, borderRadius: 12, opacity: form.reason ? 1 : 0.5 }}
                    className="btn-accent"
                  >Suivant →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>🗓️ Médecin & Horaire</h2>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Médecin (optionnel)</label>
                  <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: Number(e.target.value) })} style={{ ...inp }}>
                    <option value={0}>— Pas de préférence —</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}{d.specialite ? ` · ${d.specialite}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date souhaitée *</label>
                  <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    style={inp}
                    onFocus={e => { e.currentTarget.style.borderColor = clinicConfig.accent; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Heure souhaitée *</label>
                  <select value={form.heure} onChange={e => setForm({ ...form, heure: e.target.value })} style={inp}>
                    <option value="">— Choisir une heure —</option>
                    {['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Récap */}
                {form.date && form.heure && (
                  <div style={{ background: clinicConfig.accentLight, border: `0.5px solid ${clinicConfig.accent}40`, borderRadius: 12, padding: '14px 16px' }}>
                    {[
                      ['Patient',  form.patient_name],
                      ['Motif',    form.reason],
                      ['Date',     `${new Date(form.date).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })} à ${form.heure}`],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>{k}</span>
                        <span style={{ fontWeight: 600, color: clinicConfig.accentDark }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', background: 'var(--bg-tertiary)', border: '0.5px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 12, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>← Retour</button>
                  <button onClick={submit} disabled={loading || !form.date || !form.heure}
                    style={{ flex: 2, padding: '13px', fontSize: 14, fontWeight: 700, borderRadius: 12, opacity: (!form.date || !form.heure) ? 0.5 : 1 }}
                    className="btn-accent"
                  >{loading ? 'Envoi...' : 'Confirmer le RDV ✓'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <PWAFooter />
    </>
  );
}
