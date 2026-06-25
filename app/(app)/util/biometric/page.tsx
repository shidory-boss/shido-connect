'use client';
import { useState, useEffect } from 'react';

type Status = 'idle' | 'activating' | 'done' | 'error';

export default function BiometricPage() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && !!window.PublicKeyCredential && !!navigator.credentials);
  }, []);

  const activate = async () => {
    setStatus('activating');
    try {
      // Simulate navigator.credentials.create flow
      await new Promise(r => setTimeout(r, 1800));
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const advantages = [
    { icon: '⚡', label: 'Connexion instantanée', desc: 'Accédez à votre compte en une seconde' },
    { icon: '🔒', label: 'Sécurité maximale', desc: 'Vos données biométriques restent sur l\'appareil' },
    { icon: '🚫', label: 'Pas besoin de mot de passe', desc: 'Authentification sans rien retenir' },
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
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Authentification biométrique</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: 16 }}>
        {supported === null && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 14 }}>Vérification...</div>
        )}

        {supported === false && (
          <div className="card-enter" style={{
            background: 'var(--card)', borderRadius: 'var(--radius)',
            border: '1px solid var(--card-border)', padding: 32,
            textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>Non supporté</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Votre appareil ne supporte pas encore cette fonctionnalité.<br />
              Essayez sur un appareil mobile récent.
            </div>
          </div>
        )}

        {supported === true && (
          <>
            {/* Activation principale */}
            <div className="card-enter" style={{
              background: 'var(--card)', borderRadius: 'var(--radius)',
              border: '1px solid var(--card-border)', padding: '32px 20px',
              textAlign: 'center', marginBottom: 16,
            }}>
              {status === 'done' ? (
                <>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Biométrie activée !</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Vous pouvez maintenant vous connecter avec votre empreinte ou Face ID</div>
                </>
              ) : (
                <>
                  {/* Cercles concentriques pulsants */}
                  <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 24px' }}>
                    <style>{`
                      @keyframes pulse-ring {
                        0% { transform: scale(1); opacity: 0.6; }
                        100% { transform: scale(1.5); opacity: 0; }
                      }
                      .bio-ring-1 { animation: pulse-ring 2s ease-out infinite; }
                      .bio-ring-2 { animation: pulse-ring 2s ease-out 0.5s infinite; }
                      .bio-ring-3 { animation: pulse-ring 2s ease-out 1s infinite; }
                    `}</style>
                    <div className="bio-ring-1" style={{
                      position: 'absolute', inset: 0,
                      borderRadius: '50%', border: '2px solid var(--acc,#0B1D35)',
                      opacity: status === 'activating' ? 0.6 : 0,
                    }} />
                    <div className="bio-ring-2" style={{
                      position: 'absolute', inset: 10,
                      borderRadius: '50%', border: '2px solid var(--acc,#0B1D35)',
                      opacity: status === 'activating' ? 0.4 : 0,
                    }} />
                    <div className="bio-ring-3" style={{
                      position: 'absolute', inset: 20,
                      borderRadius: '50%', border: '2px solid var(--acc,#0B1D35)',
                      opacity: status === 'activating' ? 0.2 : 0,
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 52,
                    }}>
                      👆
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>
                    {status === 'activating' ? 'Activation...' : 'Biométrie disponible'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                    {status === 'activating' ? 'Posez votre doigt sur le capteur' : 'Activez Touch ID ou Face ID pour accéder rapidement'}
                  </div>
                  <button onClick={activate} disabled={status === 'activating'} style={{
                    background: 'var(--acc,#0B1D35)', color: '#fff',
                    border: 'none', borderRadius: 14, padding: '14px 36px',
                    fontWeight: 800, fontSize: 16, cursor: status === 'activating' ? 'not-allowed' : 'pointer',
                    opacity: status === 'activating' ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                  }}>
                    {status === 'activating' ? 'Activation...' : 'Activer Touch ID / Face ID'}
                  </button>
                  {status === 'error' && (
                    <div style={{ fontSize: 13, color: '#EF4444', marginTop: 12 }}>
                      Échec de l&apos;activation. Réessayez.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Avantages */}
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Avantages</div>
            <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {advantages.map((a, i) => (
                <div key={i} className="card-enter" style={{
                  background: 'var(--card)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--card-border)', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 24 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
