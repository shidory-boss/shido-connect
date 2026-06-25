'use client';
import Link from 'next/link';

export default function UtilBarcodeWidget() {
  return (
    <Link href="/util/barcode" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32 }}>📊</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
            Scanner code-barres
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Identifier médicaments et produits
          </div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  );
}
