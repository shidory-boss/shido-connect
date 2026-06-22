'use client';
import { useEffect, useState, useRef } from 'react';
import PWANav from '@/components/layout/PWANav';
import PWAFooter from '@/components/layout/PWAFooter';
import { clinicConfig } from '@/lib/config';
import { CLINIC_ID } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001';

interface QueueStatus { position: number; total: number; estimated_wait: number; status: string; ticket: string; }

export default function FilePage() {
  const [mode, setMode]       = useState<'join' | 'track'>('join');
  const [form, setForm]       = useState({ name: '', phone: '' });
  const [ticket, setTicket]   = useState<string | null>(null);
  const [status, setStatus]   = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [trackInput, setTrackInput] = useState('');

  const joinQueue = async () => {
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API}/api/v1/queue/join`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_name: form.name, patient_phone: form.phone, clinic_id: CLINIC_ID }),
      });
      if (r.ok) {
        const d = await r.json();
        const t = d.ticket || d.queue_number;
        setTicket(t);
        localStorage.setItem('connect_ticket', t);
        setMode('track');
      } else { const e = await r.json(); setError(e.detail || 'Erreur serveur'); }
    } catch { setError('Connexion impossible'); }
    setLoading(false);
  };

  const fetchStatus = async (t: string) => {
    try {
      const r = await fetch(`${API}/api/v1/queue/status/${t}?clinic_id=${CLINIC_ID}`);
      if (r.ok) setStatus(await r.json());
    } catch { /* ignore */ }
  };

  useEffect(() => {
    const saved = localStorage.getItem('connect_ticket');
    if (saved) { setTicket(saved); setMode('track'); }
  }, []);

  useEffect(() => {
    if (mode === 'track' && ticket) {
      fetchStatus(ticket);
      pollRef.current = setInterval(() => fetchStatus(ticket), 15000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [mode, ticket]);

  const leaveQueue = async () => {
    if (!ticket) return;
    await fetch(`${API}/api/v1/queue/leave/${ticket}`, { method: 'DELETE' }).catch(() => {});
    localStorage.removeItem('connect_ticket');
    setTicket(null); setStatus(null); setMode('join'); setForm({ name: '', phone: '' });
  };

  const inp: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', outline: 'none' };

  const statusColor = (s?: string) => s === 'called' ? '#f59e0b' : s === 'done' ? clinicConfig.accent : 'var(--text-secondary)';
  const statusLabel = (s?: string) => s === 'waiting' ? 'En attente' : s === 'called' ? '🔔 Vous êtes appelé !' : s === 'done' ? 'Consultation terminée' : s || 'En attente';

  return (
    <>
      <PWANav />
      <main style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingTop: 80 }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 20px' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>File d'attente</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Rejoignez la file sans vous déplacer</p>
            <div className="gold-divider center" style={{ marginTop: 14 }} />
          </div>

          {mode === 'join' && (
            <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28, boxShadow: 'var(--shadow-md)' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>👤 Rejoindre la file</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                {[
                  { key: 'name',  label: 'Nom complet *',  placeholder: 'Ex: Kouamé Assi', type: 'text' },
                  { key: 'phone', label: 'Téléphone *',     placeholder: '+225 07 XX XX XX XX', type: 'tel' },
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
              </div>
              {error && <p style={{ fontSize: 12, color: 'var(--error-color)', marginBottom: 12 }}>{error}</p>}
              <button onClick={joinQueue} disabled={loading || !form.name || !form.phone}
                style={{ width: '100%', padding: '13px', fontSize: 14, fontWeight: 700, borderRadius: 12, opacity: (form.name && form.phone) ? 1 : 0.5 }}
                className="btn-accent"
              >{loading ? 'Inscription...' : 'Rejoindre la file →'}</button>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '0.5px solid var(--border)' }}>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10, textAlign: 'center' }}>Déjà un ticket ?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={trackInput} onChange={e => setTrackInput(e.target.value)}
                    placeholder="Numéro de ticket (ex: A042)" style={{ ...inp, flex: 1 }} />
                  <button onClick={() => { if (trackInput) { setTicket(trackInput); setMode('track'); } }}
                    style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', border: '0.5px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Suivre
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'track' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Ticket card */}
              <div style={{ background: `linear-gradient(135deg, ${clinicConfig.accentDark}, ${clinicConfig.accent})`, borderRadius: 'var(--radius-xl)', padding: 28, textAlign: 'center', boxShadow: '0 8px 40px rgba(29,158,117,0.3)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Votre ticket</p>
                <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '4px', marginBottom: 4 }}>{ticket}</div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{clinicConfig.name}</p>
              </div>

              {/* Status */}
              {status ? (
                <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24, boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Statut en direct</h3>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>↻ màj auto 15s</span>
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 700, color: statusColor(status.status), marginBottom: 16, padding: '10px 16px', background: `${statusColor(status.status)}15`, borderRadius: 8, textAlign: 'center' }}>
                    {statusLabel(status.status)}
                  </div>

                  {/* Progress bar */}
                  {status.status === 'waiting' && status.total > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        <span>Position dans la file</span>
                        <span style={{ fontWeight: 700, color: clinicConfig.accent }}>{status.position} / {status.total}</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(5, ((status.total - status.position + 1) / status.total) * 100)}%`, background: `linear-gradient(90deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`, borderRadius: 4, transition: 'width 1s' }} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Position',        value: `#${status.position}` },
                      { label: 'Attente estimée', value: `~${status.estimated_wait || '?'} min` },
                      { label: 'Total en file',   value: `${status.total} personnes` },
                      { label: 'Statut',          value: statusLabel(status.status) },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 3 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-xl)', padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Chargement du statut...</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => fetchStatus(ticket!)}
                  style={{ flex: 1, padding: '12px', background: `${clinicConfig.accent}15`, border: `0.5px solid ${clinicConfig.accent}40`, color: clinicConfig.accent, borderRadius: 12, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  ↻ Actualiser
                </button>
                <button onClick={leaveQueue}
                  style={{ flex: 1, padding: '12px', background: 'var(--error-bg)', border: '0.5px solid var(--error-color)', color: 'var(--error-color)', borderRadius: 12, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  Quitter la file
                </button>
              </div>

              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' }}>
                Gardez cette page ouverte pour être notifié quand votre tour arrive
              </p>
            </div>
          )}
        </div>
      </main>
      <PWAFooter />
    </>
  );
}
