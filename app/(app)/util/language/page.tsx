'use client';
import { useEffect, useState } from 'react';

const LANGUAGES = [
  { code: 'FR', flag: '🇫🇷', native: 'Français', french: 'Français', available: true },
  { code: 'EN', flag: '🇬🇧', native: 'English', french: 'Anglais', available: true },
  { code: 'DIO', flag: '🇨🇮', native: 'Jula', french: 'Dioula', available: false },
  { code: 'BET', flag: '🇨🇮', native: 'Bété', french: 'Bété', available: false },
  { code: 'BAO', flag: '🇨🇮', native: 'Baoulé', french: 'Baoulé', available: false },
  { code: 'DID', flag: '🇨🇮', native: 'Dida', french: 'Dida', available: false },
  { code: 'WOL', flag: '🇸🇳', native: 'Wolof', french: 'Wolof', available: false },
];

export default function LanguagePage() {
  const [selected, setSelected] = useState('FR');

  useEffect(() => {
    const stored = localStorage.getItem('sc_lang');
    if (stored) setSelected(stored);
  }, []);

  function selectLang(code: string) {
    setSelected(code);
    localStorage.setItem('sc_lang', code);
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}>←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Langue / Language</div>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ padding: 16 }}>
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="card-enter"
              onClick={() => lang.available && selectLang(lang.code)}
              style={{
                background: 'var(--card)',
                borderRadius: 'var(--radius)',
                border: selected === lang.code ? '2px solid var(--accent)' : '1px solid var(--card-border)',
                padding: '14px 12px',
                cursor: lang.available ? 'pointer' : 'default',
                opacity: lang.available ? 1 : 0.65,
                position: 'relative',
              }}
            >
              {!lang.available && (
                <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 10, fontWeight: 700, background: 'var(--accent)', color: '#fff', borderRadius: 6, padding: '2px 6px' }}>
                  Bientôt
                </span>
              )}
              <div style={{ fontSize: 28, marginBottom: 6 }}>{lang.flag}</div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{lang.native}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lang.french}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            La traduction complète en langues locales arrive bientôt !
          </p>
        </div>
      </div>
    </div>
  );
}
