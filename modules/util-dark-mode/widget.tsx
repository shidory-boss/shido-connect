'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DarkModeWidget() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('sc_theme');
    if (stored === 'dark') setTheme('dark');
    else setTheme('light');
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('sc_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  return (
    <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
      <span style={{ fontSize: 32, lineHeight: 1 }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Thème</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Basculer clair / sombre</div>
      </div>
      <button
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: theme === 'dark' ? 'var(--accent)' : 'var(--card-border)',
          borderRadius: 20,
          border: 'none',
          cursor: 'pointer',
          padding: '3px 4px',
          width: 52,
          justifyContent: theme === 'dark' ? 'flex-end' : 'flex-start',
          transition: 'background 0.2s',
        }}
        aria-label="Basculer thème"
      >
        <span style={{ fontSize: 16, display: 'block', lineHeight: 1 }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </button>
      <Link href="/util/theme" style={{ textDecoration: 'none' }}>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </Link>
    </div>
  );
}
