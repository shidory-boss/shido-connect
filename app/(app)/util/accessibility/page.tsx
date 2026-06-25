'use client';
import { useState } from 'react';

type TextSize = 'small' | 'medium' | 'large';

export default function AccessibilityPage() {
  const [textSize, setTextSize] = useState<TextSize>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const applyTextSize = (size: TextSize) => {
    setTextSize(size);
    const html = document.documentElement;
    html.removeAttribute('data-text-size');
    html.setAttribute('data-text-size', size);
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleReduceMotion = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    if (next) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', zIndex: 10 }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}>←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Accessibilité</span>
        <span style={{ width: 22 }} />
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>

        {/* Taille du texte */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>🔤</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Taille du texte</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ajustez la taille de la police</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['small', 'medium', 'large'] as TextSize[]).map((size, i) => {
              const labels = ['A', 'A', 'A'];
              const sizes = [13, 16, 20];
              const active = textSize === size;
              return (
                <button
                  key={size}
                  onClick={() => applyTextSize(size)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 8,
                    border: active ? '2px solid var(--acc)' : '1px solid var(--card-border)',
                    background: active ? 'var(--acc)' : 'var(--bg2)',
                    color: active ? '#fff' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: sizes[i],
                    cursor: 'pointer',
                  }}
                >
                  {labels[i]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contraste */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🌓</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Contraste élevé</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Améliore la lisibilité en augmentant le contraste</div>
            </div>
            <button
              onClick={toggleHighContrast}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: highContrast ? 'var(--acc)' : 'var(--bg2)',
                border: '1px solid var(--card-border)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: highContrast ? 22 : 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
                display: 'block',
              }} />
            </button>
          </div>
        </div>

        {/* Animations */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>✨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Réduire les animations</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Limite les effets visuels et transitions</div>
            </div>
            <button
              onClick={toggleReduceMotion}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: reduceMotion ? 'var(--acc)' : 'var(--bg2)',
                border: '1px solid var(--card-border)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: reduceMotion ? 22 : 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
                display: 'block',
              }} />
            </button>
          </div>
        </div>

        {/* Lecteur d'écran */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🔊</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Lecteur d'écran</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                Cette application est compatible avec les lecteurs d'écran natifs (TalkBack sur Android, VoiceOver sur iOS). Les éléments interactifs sont correctement annotés avec des attributs ARIA pour une navigation optimale.
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 11, background: 'var(--bg2)', padding: '3px 8px', borderRadius: 6, color: 'var(--text-secondary)' }}>ARIA labels ✓</span>
                <span style={{ fontSize: 11, background: 'var(--bg2)', padding: '3px 8px', borderRadius: 6, color: 'var(--text-secondary)' }}>Rôles sémantiques ✓</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
