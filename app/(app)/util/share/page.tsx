'use client';
import { useState } from 'react';

const APP_URL = typeof window !== 'undefined' ? window.location.origin : 'https://app.shidoconnect.ci';
const APP_TITLE = 'ShidoConnect';
const APP_TEXT = 'Gérez votre santé facilement avec ShidoConnect — rendez-vous, résultats, ordonnances.';

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: APP_TITLE, text: APP_TEXT, url: APP_URL });
      } catch (_) {}
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const shareButtons = [
    {
      label: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(APP_TEXT + ' ' + APP_URL)}`, '_blank'),
    },
    {
      label: 'SMS',
      icon: '✉️',
      color: '#007AFF',
      action: () => window.open(`sms:?body=${encodeURIComponent(APP_TEXT + ' ' + APP_URL)}`, '_blank'),
    },
    {
      label: 'Email',
      icon: '📧',
      color: '#EA4335',
      action: () => window.open(`mailto:?subject=${encodeURIComponent(APP_TITLE)}&body=${encodeURIComponent(APP_TEXT + '\n\n' + APP_URL)}`, '_blank'),
    },
    {
      label: 'Facebook',
      icon: '📘',
      color: '#1877F2',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}`, '_blank'),
    },
    {
      label: 'Copier le lien',
      icon: '🔗',
      color: '#6B7280',
      action: copyLink,
    },
    {
      label: 'QR Code',
      icon: '📷',
      color: '#7C3AED',
      action: () => setShowQR(true),
    },
  ];

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', zIndex: 10 }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}>←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Partager</span>
        <span style={{ width: 22 }} />
      </div>

      <div style={{ padding: 16 }}>

        {/* Bouton principal */}
        <div className="card-enter" style={{ marginBottom: 20 }}>
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 'var(--radius)',
              background: 'var(--acc)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>📤</span> Partager l'app
          </button>
        </div>

        {/* Grille 2x3 */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {shareButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="card-enter"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                padding: '16px 12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                color: 'var(--text-primary)',
              }}
            >
              <span style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: btn.color + '22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                border: `1.5px solid ${btn.color}44`,
              }}>
                {btn.icon}
              </span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Toast copié */}
        {copied && (
          <div style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1a2e',
            color: '#fff',
            padding: '10px 22px',
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 14,
            zIndex: 999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            🔗 Lien copié !
          </div>
        )}

        {/* QR Code modal */}
        {showQR && (
          <div
            onClick={() => setShowQR(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--card)',
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                minWidth: 240,
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 16 }}>QR Code ShidoConnect</span>
              {/* QR placeholder */}
              <div style={{
                width: 160,
                height: 160,
                background: '#fff',
                borderRadius: 12,
                border: '2px solid var(--card-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, padding: 10 }}>
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} style={{
                      width: 14,
                      height: 14,
                      background: Math.random() > 0.5 ? '#1a1a2e' : 'transparent',
                      borderRadius: 2,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 10, color: '#888', position: 'absolute', bottom: 8, fontWeight: 700 }}>QR CODE</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>Scannez pour ouvrir l'application</span>
              <button
                onClick={() => setShowQR(false)}
                style={{ background: 'var(--bg2)', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                Fermer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
