'use client';
import { useEffect, useState } from 'react';

const THEMES = [
  {
    id: 'light',
    icon: '☀️',
    name: 'Clair',
    desc: 'Interface lumineuse',
    bg: '#ffffff',
    card: '#f5f5f5',
    accent: '#2563eb',
    text: '#1a1a1a',
  },
  {
    id: 'dark',
    icon: '🌙',
    name: 'Sombre',
    desc: 'Confort nocturne',
    bg: '#0f0f13',
    card: '#1c1c24',
    accent: '#6366f1',
    text: '#e8e8f0',
  },
  {
    id: 'auto',
    icon: '🔄',
    name: 'Automatique',
    desc: 'Suit le système',
    bg: 'linear-gradient(135deg,#fff 50%,#0f0f13 50%)',
    card: '#888',
    accent: '#2563eb',
    text: '#555',
  },
];

const ACCENT_COLORS = [
  '#2563eb', '#6366f1', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
];

const TEXT_SIZES = [
  { label: 'Petit', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Grand', value: '18px' },
];

export default function ThemePage() {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedAccent, setSelectedAccent] = useState('#2563eb');
  const [selectedSize, setSelectedSize] = useState('16px');

  useEffect(() => {
    setSelectedTheme(localStorage.getItem('sc_theme') || 'light');
    setSelectedAccent(localStorage.getItem('sc_accent') || '#2563eb');
    setSelectedSize(localStorage.getItem('sc_text_size') || '16px');
  }, []);

  function applyTheme(id: string) {
    setSelectedTheme(id);
    localStorage.setItem('sc_theme', id);
    if (id !== 'auto') {
      document.documentElement.setAttribute('data-theme', id);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }

  function applyAccent(color: string) {
    setSelectedAccent(color);
    localStorage.setItem('sc_accent', color);
    document.documentElement.style.setProperty('--accent', color);
  }

  function applySize(size: string) {
    setSelectedSize(size);
    localStorage.setItem('sc_text_size', size);
    document.documentElement.style.fontSize = size;
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}>←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Apparence</div>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ padding: 16 }}>
        {/* Theme cards */}
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thème</div>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
          {THEMES.map((t) => (
            <div
              key={t.id}
              className="card-enter"
              onClick={() => applyTheme(t.id)}
              style={{
                background: 'var(--card)',
                borderRadius: 'var(--radius)',
                border: selectedTheme === t.id ? '2px solid var(--accent)' : '1px solid var(--card-border)',
                padding: '12px 10px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {selectedTheme === t.id && (
                <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 12, color: 'var(--accent)', fontWeight: 800 }}>✓</span>
              )}
              {/* Mini preview */}
              <div style={{ borderRadius: 6, overflow: 'hidden', marginBottom: 8, height: 48, background: t.id === 'auto' ? 'linear-gradient(135deg,#fff 50%,#0f0f13 50%)' : t.bg, border: '1px solid rgba(0,0,0,0.1)' }}>
                <div style={{ height: 12, background: t.card, borderBottom: `1px solid rgba(0,0,0,0.08)` }} />
                <div style={{ padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ height: 4, borderRadius: 2, background: t.text, opacity: 0.4, width: '70%' }} />
                  <div style={{ height: 4, borderRadius: 2, background: t.accent, width: '40%' }} />
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 12, textAlign: 'center' }}>{t.icon} {t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Text size */}
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Taille du texte</div>
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 8 }}>
          {TEXT_SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => applySize(s.value)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                border: selectedSize === s.value ? '2px solid var(--accent)' : '1px solid var(--card-border)',
                background: selectedSize === s.value ? 'var(--accent)' : 'var(--bg2)',
                color: selectedSize === s.value ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: s.value,
                fontFamily: 'inherit',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Accent colors */}
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Couleur accent</div>
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => applyAccent(color)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: color,
                  border: selectedAccent === color ? '3px solid var(--text-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  outline: selectedAccent === color ? `2px solid ${color}` : 'none',
                  outlineOffset: 2,
                  boxSizing: 'border-box',
                }}
                aria-label={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
