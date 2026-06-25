'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function UtilOfflineModeWidget() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Link href="/util/offline" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32 }}>📡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            Mode hors-ligne
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
              background: online ? '#dcfce7' : '#fee2e2',
              color: online ? '#16a34a' : '#dc2626',
            }}>
              {online ? 'Connecté' : 'Hors ligne'}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            L&apos;app fonctionne sans internet
          </div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  );
}
