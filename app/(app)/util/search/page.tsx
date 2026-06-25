'use client';
import { useEffect, useRef, useState } from 'react';

const SEARCHES_KEY = 'sc_searches';

const MOCK_DATA = [
  { category: 'RDV', icon: '📅', title: 'Rendez-vous du 15 juillet', path: '/booking' },
  { category: 'RDV', icon: '📅', title: 'Rendez-vous annulé — Dr Kouassi', path: '/booking' },
  { category: 'Médecins', icon: '👨‍⚕️', title: 'Dr. Kouassi Amed — Cardiologue', path: '/booking/new' },
  { category: 'Médecins', icon: '👩‍⚕️', title: 'Dr. Traoré Fatou — Généraliste', path: '/booking/new' },
  { category: 'Services', icon: '🔬', title: 'Analyse de sang complète', path: '/lab-results' },
  { category: 'Services', icon: '📞', title: 'Téléconsultation disponible', path: '/teleconsult' },
  { category: 'Documents', icon: '📄', title: 'Ordonnance du 10 juin 2026', path: '/records' },
  { category: 'Documents', icon: '📋', title: 'Résultats radiologie', path: '/records' },
];

const SUGGESTIONS = [
  { icon: '📅', label: 'RDV', path: '/booking' },
  { icon: '👨‍⚕️', label: 'Médecins', path: '/booking/new' },
  { icon: '🌐', label: 'Services', path: '/teleconsult' },
  { icon: '📄', label: 'Documents', path: '/records' },
];

function loadSearches(): string[] {
  try { return JSON.parse(localStorage.getItem(SEARCHES_KEY) || '[]'); } catch { return []; }
}
function saveSearch(q: string) {
  const prev = loadSearches().filter(s => s !== q);
  localStorage.setItem(SEARCHES_KEY, JSON.stringify([q, ...prev].slice(0, 8)));
}
function removeSearch(q: string) {
  localStorage.setItem(SEARCHES_KEY, JSON.stringify(loadSearches().filter(s => s !== q)));
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof MOCK_DATA>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setRecents(loadSearches());
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query.trim()) { setResults([]); return; }
    timerRef.current = setTimeout(() => {
      const q = query.toLowerCase();
      setResults(MOCK_DATA.filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)));
      saveSearch(query.trim());
      setRecents(loadSearches());
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const grouped = results.reduce<Record<string, typeof MOCK_DATA>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1, flexShrink: 0 }}>←</button>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher RDV, médecins, services..."
          style={{
            flex: 1,
            height: 36,
            borderRadius: 10,
            border: '1px solid var(--card-border)',
            background: 'var(--bg2)',
            padding: '0 12px',
            fontSize: 14,
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'Nunito,system-ui,sans-serif',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>✕</button>
        )}
      </div>

      <div style={{ padding: 16 }}>
        {/* Suggestions rapides */}
        {!query && (
          <>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Suggestions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {SUGGESTIONS.map(s => (
                <a key={s.label} href={s.path} style={{ textDecoration: 'none' }}>
                  <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{s.label}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Récentes */}
            {recents.length > 0 && (
              <>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recherches récentes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {recents.map(r => (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 20, padding: '5px 12px' }}>
                      <span style={{ fontSize: 13, cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => setQuery(r)}>{r}</span>
                      <span style={{ fontSize: 11, cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => { removeSearch(r); setRecents(loadSearches()); }}>✕</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Résultats */}
        {query && (
          <div className="stagger">
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', fontSize: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                Aucun résultat pour "{query}"
              </div>
            ) : (
              Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map((item, i) => (
                      <a key={i} href={item.path} style={{ textDecoration: 'none' }}>
                        <div className="card-enter acard" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                          <span style={{ fontSize: 22 }}>{item.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{item.path}</div>
                          </div>
                          <span style={{ color: 'var(--accent)', fontSize: 16 }}>›</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
