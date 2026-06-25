'use client';
import Link from 'next/link';

export default function UtilQrScannerWidget() {
  return (
    <Link href="/util/qr-scanner" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32 }}>📷</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Scanner QR</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Scanner un code patient ou RDV</div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  );
}
