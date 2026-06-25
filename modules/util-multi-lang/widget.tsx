'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MultiLangWidget() {
  const [lang, setLang] = useState('FR');

  useEffect(() => {
    const stored = localStorage.getItem('sc_lang');
    if (stored) setLang(stored);
  }, []);

  return (
    <Link href="/util/language" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32, lineHeight: 1 }}>🌍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Multilingue</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {lang === 'FR' ? <><strong>FR</strong> | EN | Dioula | Bété</> : lang === 'EN' ? <>FR | <strong>EN</strong> | Dioula | Bété</> : <>FR | EN | Dioula | Bété</>}
          </div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  );
}
