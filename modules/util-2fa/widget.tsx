'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Util2FAWidget() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const val = localStorage.getItem('sc_2fa_enabled');
    setEnabled(val === 'true');
  }, []);

  return (
    <Link href="/util/2fa" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32 }}>🔐</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
            Double authentification
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Sécurisez votre compte
          </div>
        </div>
        {enabled !== null && (
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 20,
            background: enabled ? 'rgba(5,150,105,0.12)' : 'rgba(239,68,68,0.12)',
            color: enabled ? '#059669' : '#EF4444',
            marginRight: 4,
          }}>
            {enabled ? 'Actif' : 'Inactif'}
          </span>
        )}
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  );
}
