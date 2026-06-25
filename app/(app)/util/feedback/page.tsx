'use client';
import { useState } from 'react';

const POINTS_FORTS = ['Accueil', 'Rapidité', 'Personnel', 'Propreté', 'Prix'];

export default function FeedbackPage() {
  const [step, setStep] = useState(1);
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const toggleChip = (chip: string) => {
    setSelected(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const progress = ((step - 1) / 3) * 100;

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, height: 56, background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)', display: 'flex',
        alignItems: 'center', gap: 12, padding: '0 16px', zIndex: 10
      }}>
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}
        >←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Votre avis</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--card-border)' }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'var(--acc, #22c55e)',
          transition: 'width 0.4s ease'
        }} />
      </div>

      <div style={{ padding: 16 }}>
        {/* Step 1 — Stars */}
        {step === 1 && (
          <div className="card-enter">
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Étape 1 / 3</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Satisfaction globale</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Comment évaluez-vous votre expérience ?</div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  onClick={() => setStars(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  style={{
                    fontSize: 40, cursor: 'pointer',
                    opacity: n <= (hovered || stars) ? 1 : 0.3,
                    transition: 'opacity 0.15s, transform 0.15s',
                    transform: n <= (hovered || stars) ? 'scale(1.15)' : 'scale(1)',
                    userSelect: 'none'
                  }}
                >⭐</span>
              ))}
            </div>
            <button
              onClick={() => stars > 0 && setStep(2)}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius, 12px)',
                background: stars > 0 ? 'var(--acc, #22c55e)' : 'var(--card-border)',
                color: stars > 0 ? '#fff' : 'var(--text-secondary)',
                border: 'none', cursor: stars > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 800, fontSize: 15, transition: 'background 0.2s'
              }}
            >Continuer</button>
          </div>
        )}

        {/* Step 2 — Points forts */}
        {step === 2 && (
          <div className="card-enter">
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Étape 2 / 3</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Points forts</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Qu&apos;est-ce qui vous a le plus satisfait ?</div>
            </div>
            <div className="stagger" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
              {POINTS_FORTS.map(chip => (
                <button
                  key={chip}
                  onClick={() => toggleChip(chip)}
                  style={{
                    padding: '10px 18px', borderRadius: 999,
                    border: selected.includes(chip) ? '2px solid var(--acc, #22c55e)' : '2px solid var(--card-border)',
                    background: selected.includes(chip) ? 'var(--acc, #22c55e)' : 'var(--card)',
                    color: selected.includes(chip) ? '#fff' : 'var(--text-primary)',
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >{chip}</button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius, 12px)',
                background: 'var(--acc, #22c55e)', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontWeight: 800, fontSize: 15
              }}
            >Continuer</button>
          </div>
        )}

        {/* Step 3 — Commentaire */}
        {step === 3 && (
          <div className="card-enter">
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Étape 3 / 3</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Votre commentaire</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Dites-nous tout, on lit chaque message.</div>
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={6}
              style={{
                width: '100%', padding: 14, borderRadius: 'var(--radius, 12px)',
                border: '1.5px solid var(--card-border)', background: 'var(--card)',
                color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit',
                resize: 'vertical', marginBottom: 24, boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <button
              onClick={() => setStep(4)}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius, 12px)',
                background: 'var(--acc, #22c55e)', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontWeight: 800, fontSize: 15
              }}
            >Envoyer mon avis</button>
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && (
          <div className="card-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 48 }}>
            <style>{`
              @keyframes successPop {
                0% { transform: scale(0); opacity: 0; }
                60% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
              }
              .success-pop {
                animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
              }
            `}</style>
            <div className="success-pop" style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#22c55e', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 36, marginBottom: 24
            }}>✓</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8, textAlign: 'center' }}>
              Merci pour votre avis !
            </div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 280 }}>
              Votre retour nous aide à améliorer notre service au quotidien.
            </div>
            <button
              onClick={() => window.history.back()}
              style={{
                marginTop: 40, padding: '14px 32px', borderRadius: 'var(--radius, 12px)',
                background: 'var(--card)', border: '1.5px solid var(--card-border)',
                color: 'var(--text-primary)', fontWeight: 800, fontSize: 15, cursor: 'pointer'
              }}
            >Retour à l&apos;accueil</button>
          </div>
        )}
      </div>
    </div>
  );
}
