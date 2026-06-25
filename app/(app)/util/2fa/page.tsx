'use client';
import { useState, useEffect } from 'react';

type Method = 'sms' | 'totp' | 'email';
type Step = 'idle' | 'phone' | 'otp' | 'done';

export default function TwoFAPage() {
  const [enabled, setEnabled] = useState(false);
  const [method, setMethod] = useState<Method>('sms');
  const [step, setStep] = useState<Step>('idle');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    const val = localStorage.getItem('sc_2fa_enabled');
    setEnabled(val === 'true');
  }, []);

  const toggleMaster = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('sc_2fa_enabled', String(next));
    if (!next) setStep('idle');
  };

  const sendCode = () => {
    if (!phone.trim()) return;
    setStep('otp');
    setOtpError('');
  };

  const verifyOtp = () => {
    if (otp.length !== 6) { setOtpError('Entrez les 6 chiffres du code'); return; }
    setStep('done');
    setEnabled(true);
    localStorage.setItem('sc_2fa_enabled', 'true');
  };

  const methods: { id: Method; icon: string; label: string; desc: string }[] = [
    { id: 'sms', icon: '📱', label: 'SMS', desc: 'Code par message texte' },
    { id: 'totp', icon: '🔑', label: 'Application TOTP', desc: 'Google Authenticator, Authy...' },
    { id: 'email', icon: '📧', label: 'Email', desc: 'Code envoyé par e-mail' },
  ];

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        height: 56, background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
      }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}>←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Double authentification</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: 16 }}>
        {/* Status card */}
        <div className="card-enter" style={{
          background: 'var(--card)', borderRadius: 'var(--radius)',
          border: '1px solid var(--card-border)', padding: 24,
          marginBottom: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{enabled ? '✅' : '⚠️'}</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
            {enabled ? '2FA Activée' : '2FA Désactivée'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {enabled
              ? 'Votre compte est protégé par la double authentification'
              : 'Activez la 2FA pour sécuriser votre compte'}
          </div>
          {/* Toggle master */}
          <button onClick={toggleMaster} style={{
            background: enabled ? 'rgba(239,68,68,0.1)' : 'var(--acc,#0B1D35)',
            color: enabled ? '#EF4444' : '#fff',
            border: enabled ? '1.5px solid rgba(239,68,68,0.3)' : 'none',
            borderRadius: 14, padding: '12px 28px',
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>
            {enabled ? 'Désactiver la 2FA' : 'Activer la 2FA'}
          </button>
        </div>

        {/* Méthodes */}
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Méthode</div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {methods.map(m => (
            <div key={m.id} className="card-enter" onClick={() => { setMethod(m.id); setStep('idle'); }} style={{
              background: 'var(--card)', borderRadius: 'var(--radius)',
              border: method === m.id ? '2px solid var(--acc,#0B1D35)' : '1px solid var(--card-border)',
              padding: '14px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.desc}</div>
              </div>
              {method === m.id && <span style={{ color: 'var(--acc,#0B1D35)', fontWeight: 800 }}>✓</span>}
            </div>
          ))}
        </div>

        {/* Flow SMS */}
        {method === 'sms' && !enabled && (
          <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Activation par SMS</div>
            {step === 'idle' && (
              <>
                <input
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1px solid var(--card-border)', background: 'var(--bg2,var(--bg))',
                    color: 'var(--text-primary)', fontSize: 15, marginBottom: 12,
                    boxSizing: 'border-box',
                  }}
                />
                <button onClick={sendCode} disabled={!phone.trim()} style={{
                  width: '100%', background: 'var(--acc,#0B1D35)', color: '#fff',
                  border: 'none', borderRadius: 12, padding: '13px 0',
                  fontWeight: 700, fontSize: 15, cursor: phone.trim() ? 'pointer' : 'not-allowed',
                  opacity: phone.trim() ? 1 : 0.6,
                }}>
                  Envoyer le code
                </button>
              </>
            )}
            {step === 'otp' && (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  Code envoyé au {phone}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Code à 6 chiffres"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: otpError ? '1.5px solid #EF4444' : '1px solid var(--card-border)',
                    background: 'var(--bg2,var(--bg))', color: 'var(--text-primary)',
                    fontSize: 20, textAlign: 'center', letterSpacing: 8,
                    marginBottom: 8, boxSizing: 'border-box',
                  }}
                />
                {otpError && <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 8 }}>{otpError}</div>}
                <button onClick={verifyOtp} style={{
                  width: '100%', background: 'var(--acc,#0B1D35)', color: '#fff',
                  border: 'none', borderRadius: 12, padding: '13px 0',
                  fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}>
                  Vérifier
                </button>
              </>
            )}
            {step === 'done' && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>2FA Activée !</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Votre compte est maintenant sécurisé</div>
              </div>
            )}
          </div>
        )}

        {/* Info sécurité */}
        <div className="card-enter" style={{
          background: 'rgba(59,130,246,0.07)', borderRadius: 'var(--radius)',
          border: '1px solid rgba(59,130,246,0.2)', padding: 16,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            La 2FA ajoute une couche de sécurité supplémentaire à votre compte. Même si quelqu&apos;un obtient votre mot de passe, il ne pourra pas accéder à votre compte sans le second facteur.
          </div>
        </div>
      </div>
    </div>
  );
}
