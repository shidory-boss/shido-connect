'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UtilBiometricWidget() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && !!window.PublicKeyCredential);
  }, []);

  return (
    <Link href="/util/biometric" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32 }}>👆</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
            Biométrie
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Face ID / Empreinte digitale
          </div>
        </div>
        {supported !== null && (
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 20,
            background: supported ? 'rgba(5,150,105,0.12)' : 'rgba(100,116,139,0.12)',
            color: supported ? '#059669' : '#64748b',
            marginRight: 4,
          }}>
            {supported ? 'Supporté' : 'Non supporté'}
          </span>
        )}
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  );
}
