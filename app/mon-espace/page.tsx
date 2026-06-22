'use client';
import { useEffect, useState, useRef } from 'react';
import PWANav from '@/components/layout/PWANav';
import PWAFooter from '@/components/layout/PWAFooter';
import { clinicConfig } from '@/lib/config';
import { CLINIC_ID } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001';

interface Rdv { id: number; scheduled_at: string; reason: string; status: string; doctor_name?: string; }
interface ChatMsg { id: number; role: 'patient' | 'staff'; content: string; created_at: string; }

type Tab = 'rdv' | 'chat';

export default function MonEspacePage() {
  const [auth, setAuth]         = useState<{ token: string; name: string } | null>(null);
  const [phone, setPhone]       = useState('');
  const [code, setCode]         = useState('');
  const [step, setStep]         = useState<'phone' | 'code'>('phone');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError]     = useState('');
  const [tab, setTab]           = useState<Tab>('rdv');
  const [rdvs, setRdvs]         = useState<Rdv[]>([]);
  const [msgs, setMsgs]         = useState<ChatMsg[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [sending, setSending]   = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('connect_token');
    const name  = localStorage.getItem('connect_name');
    if (saved && name) setAuth({ token: saved, name });
  }, []);

  useEffect(() => {
    if (auth) { fetchRdvs(); fetchMsgs(); }
  }, [auth]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const sendCode = async () => {
    setAuthLoading(true); setAuthError('');
    try {
      const r = await fetch(`${API}/api/v1/patient/auth/send-code`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, clinic_id: CLINIC_ID }),
      });
      if (r.ok) setStep('code');
      else { const e = await r.json(); setAuthError(e.detail || 'Erreur'); }
    } catch { setAuthError('Connexion impossible'); }
    setAuthLoading(false);
  };

  const verifyCode = async () => {
    setAuthLoading(true); setAuthError('');
    try {
      const r = await fetch(`${API}/api/v1/patient/auth/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, clinic_id: CLINIC_ID }),
      });
      if (r.ok) {
        const d = await r.json();
        localStorage.setItem('connect_token', d.token);
        localStorage.setItem('connect_name',  d.patient_name || phone);
        setAuth({ token: d.token, name: d.patient_name || phone });
      } else { const e = await r.json(); setAuthError(e.detail || 'Code invalide'); }
    } catch { setAuthError('Connexion impossible'); }
    setAuthLoading(false);
  };

  const fetchRdvs = async () => {
    if (!auth) return;
    const r = await fetch(`${API}/api/v1/patient/appointments?clinic_id=${CLINIC_ID}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    }).catch(() => null);
    if (r?.ok) setRdvs(await r.json());
  };

  const fetchMsgs = async () => {
    if (!auth) return;
    const r = await fetch(`${API}/api/v1/patient/chat?clinic_id=${CLINIC_ID}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    }).catch(() => null);
    if (r?.ok) setMsgs(await r.json());
  };

  const sendMsg = async () => {
    if (!msgInput.trim() || !auth) return;
    setSending(true);
    const r = await fetch(`${API}/api/v1/patient/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ content: msgInput, clinic_id: CLINIC_ID }),
    }).catch(() => null);
    if (r?.ok) { setMsgInput(''); fetchMsgs(); }
    setSending(false);
  };

  const logout = () => {
    localStorage.removeItem('connect_token');
    localStorage.removeItem('connect_name');
    setAuth(null); setRdvs([]); setMsgs([]);
  };

  const rdvStatusColor = (s: string) => s === 'confirmed' ? clinicConfig.accent : s === 'pending' ? '#f59e0b' : s === 'cancelled' ? 'var(--error-color)' : 'var(--text-secondary)';
  const rdvStatusLabel = (s: string) => s === 'confirmed' ? 'Confirmé' : s === 'pending' ? 'En attente' : s === 'cancelled' ? 'Annulé' : s;

  const inp: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', outline: 'none' };

  /* ─── Auth screens ─── */
  if (!auth) return (
    <>
      <PWANav />
      <main style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>🔐</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>Mon espace patient</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Connexion sécurisée par SMS</p>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28, boxShadow: 'var(--shadow-md)' }}>
            {step === 'phone' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Numéro de téléphone</label>
                  <input type="tel" value={phone} placeholder="+225 07 XX XX XX XX"
                    onChange={e => setPhone(e.target.value)} style={inp}
                    onFocus={e => { e.currentTarget.style.borderColor = clinicConfig.accent; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                    onKeyDown={e => { if (e.key === 'Enter' && phone) sendCode(); }}
                  />
                </div>
                {authError && <p style={{ fontSize: 12, color: 'var(--error-color)' }}>{authError}</p>}
                <button onClick={sendCode} disabled={!phone || authLoading}
                  style={{ width: '100%', padding: '13px', fontSize: 14, fontWeight: 700, borderRadius: 12 }}
                  className="btn-accent"
                >{authLoading ? 'Envoi...' : 'Recevoir le code SMS →'}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Code envoyé au <strong style={{ color: 'var(--text-primary)' }}>{phone}</strong>
                </p>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Code à 6 chiffres</label>
                  <input type="text" value={code} placeholder="000000" maxLength={6}
                    onChange={e => setCode(e.target.value)} style={{ ...inp, textAlign: 'center', fontSize: 24, letterSpacing: '8px', fontWeight: 700 }}
                    onFocus={e => { e.currentTarget.style.borderColor = clinicConfig.accent; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                    onKeyDown={e => { if (e.key === 'Enter' && code.length === 6) verifyCode(); }}
                  />
                </div>
                {authError && <p style={{ fontSize: 12, color: 'var(--error-color)' }}>{authError}</p>}
                <button onClick={verifyCode} disabled={code.length < 4 || authLoading}
                  style={{ width: '100%', padding: '13px', fontSize: 14, fontWeight: 700, borderRadius: 12 }}
                  className="btn-accent"
                >{authLoading ? 'Vérification...' : 'Se connecter ✓'}</button>
                <button onClick={() => { setStep('phone'); setCode(''); setAuthError(''); }}
                  style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 13 }}>
                  ← Changer de numéro
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <PWAFooter />
    </>
  );

  /* ─── Espace patient connecté ─── */
  return (
    <>
      <PWANav />
      <main style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingTop: 80 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>Bonjour, {auth.name} 👋</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{clinicConfig.name}</p>
            </div>
            <button onClick={logout}
              style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', border: '0.5px solid var(--border)', color: 'var(--text-tertiary)', borderRadius: 10, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              Déconnexion
            </button>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { icon: '📅', label: 'Nouveau RDV', href: '/rdv', accent: clinicConfig.accent },
              { icon: '🎫', label: 'Rejoindre la file', href: '/file', accent: clinicConfig.gold },
            ].map(a => (
              <a key={a.href} href={a.href}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'var(--card-bg)', border: `0.5px solid ${a.accent}30`, borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.accent; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${a.accent}30`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${a.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{a.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{a.label}</span>
              </a>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-tertiary)', borderRadius: 12, padding: 4 }}>
            {([['rdv', '📅 Mes rendez-vous'], ['chat', '💬 Messages']] as const).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: '10px', background: tab === t ? 'var(--card-bg)' : 'transparent', border: tab === t ? '0.5px solid var(--border)' : 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: tab === t ? 'var(--text-primary)' : 'var(--text-tertiary)', cursor: 'pointer', transition: 'all .2s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab: RDV */}
          {tab === 'rdv' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rdvs.length === 0 ? (
                <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Aucun rendez-vous trouvé</p>
                  <a href="/rdv" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: 'none' }} className="btn-accent">Prendre un RDV</a>
                </div>
              ) : rdvs.map(rdv => (
                <div key={rdv.id} style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{rdv.reason}</div>
                      {rdv.doctor_name && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Dr. {rdv.doctor_name}</div>}
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                        {new Date(rdv.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {new Date(rdv.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: rdvStatusColor(rdv.status), background: `${rdvStatusColor(rdv.status)}15`, padding: '4px 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                      {rdvStatusLabel(rdv.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Chat */}
          {tab === 'chat' && (
            <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              {/* Messages */}
              <div style={{ height: 360, overflowY: 'auto', padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {msgs.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13, margin: 'auto' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
                    <p>Envoyez un message à notre équipe.</p>
                    <p style={{ fontSize: 11, marginTop: 4 }}>Nous répondons généralement dans la journée.</p>
                  </div>
                )}
                {msgs.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'patient' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: m.role === 'patient' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'patient' ? `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})` : 'var(--bg-secondary)', border: m.role === 'staff' ? '0.5px solid var(--border)' : 'none' }}>
                      {m.role === 'staff' && <div style={{ fontSize: 10, fontWeight: 700, color: clinicConfig.accent, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Secrétariat</div>}
                      <p style={{ fontSize: 13, color: m.role === 'patient' ? '#fff' : 'var(--text-primary)', lineHeight: 1.5 }}>{m.content}</p>
                      <div style={{ fontSize: 10, color: m.role === 'patient' ? 'rgba(255,255,255,0.5)' : 'var(--text-tertiary)', marginTop: 3, textAlign: 'right' }}>
                        {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              {/* Input */}
              <div style={{ padding: '12px 16px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
                <input type="text" value={msgInput} placeholder="Votre message..."
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text-primary)', outline: 'none' }}
                />
                <button onClick={sendMsg} disabled={!msgInput.trim() || sending}
                  style={{ width: 42, height: 42, borderRadius: 10, background: clinicConfig.accent, border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: msgInput.trim() ? 1 : 0.5 }}>
                  ➤
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <PWAFooter />
    </>
  );
}
