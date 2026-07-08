'use client';
import { useEffect, useState } from 'react';

const STEPS = [
  { id: 1, icon: '👤', title: 'Profil complet', description: 'Renseignez votre nom, photo et coordonnées pour un meilleur suivi médical.' },
  { id: 2, icon: '📅', title: 'Premier rendez-vous', description: 'Prenez votre premier rendez-vous avec un médecin en quelques secondes.' },
  { id: 3, icon: '🔔', title: 'Activer les notifications', description: 'Autorisez les notifications pour recevoir vos rappels de RDV et résultats.' },
  { id: 4, icon: '📱', title: 'Télécharger l\'app', description: 'Installez ShidoConnect sur votre téléphone pour un accès hors-ligne.' },
  { id: 5, icon: '👥', title: 'Partager à un proche', description: 'Invitez un membre de votre famille à rejoindre la plateforme.' },
  { id: 6, icon: '🌐', title: 'Découvrir tous les services', description: 'Explorez téléconsultation, ordonnances, analyses et bien plus.' },
];

const KEY = 'sc_tour_done';

function loadDone(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveDone(ids: number[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export default function OnboardingTourPage() {
  const [done, setDone] = useState<number[]>([]);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setDone(loadDone());
  }, []);

  const markDone = (id: number) => {
    setDone(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveDone(next);
      if (next.length === STEPS.length) setConfetti(true);
      return next;
    });
  };

  const pct = Math.round((done.length / STEPS.length) * 100);

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}>←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Guide de démarrage</div>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ padding: 16 }}>
        {/* Progress bar */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 16, border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{done.length}/{STEPS.length} étapes complétées</span>
            <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 8, background: 'var(--bg2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 8, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Confetti + Félicitations */}
        {confetti && (
          <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--card)', borderRadius: 'var(--radius)', padding: '20px 16px', marginBottom: 16, textAlign: 'center', border: '1px solid var(--card-border)' }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: -10,
                left: `${Math.random() * 100}%`,
                width: 8,
                height: 8,
                borderRadius: 2,
                background: ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD'][i % 6],
                animation: `fall ${1 + Math.random()}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }} />
            ))}
            <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Félicitations !</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Vous avez complété tout le guide de démarrage.</div>
          </div>
        )}

        {/* Steps */}
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS.map(step => {
            const isDone = done.includes(step.id);
            return (
              <div key={step.id} className="card-enter" style={{
                background: 'var(--card)',
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
                border: `1px solid ${isDone ? 'var(--accent)' : 'var(--card-border)'}`,
                opacity: isDone ? 0.85 : 1,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: isDone ? 'var(--accent)' : 'var(--bg2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isDone ? 18 : 20,
                  flexShrink: 0,
                  color: isDone ? '#fff' : undefined,
                }}>
                  {isDone ? '✓' : step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                    {step.id}. {step.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{step.description}</div>
                  <button
                    onClick={() => markDone(step.id)}
                    style={{
                      marginTop: 10,
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      background: isDone ? 'var(--bg2)' : 'var(--accent)',
                      color: isDone ? 'var(--text-secondary)' : '#fff',
                    }}
                  >
                    {isDone ? 'Annuler' : 'Marquer fait'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to { transform: translateY(300px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
