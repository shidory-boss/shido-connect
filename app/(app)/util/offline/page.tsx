'use client';
import { useState, useEffect } from 'react';

const OFFLINE_DATA = [
  { label: 'Rendez-vous', icon: '📅', size: '1.2 Mo' },
  { label: 'Dossiers patients', icon: '🗂️', size: '4.8 Mo' },
  { label: 'Ordonnances', icon: '📋', size: '0.9 Mo' },
  { label: 'Médicaments', icon: '💊', size: '2.1 Mo' },
];

const HOW_STEPS = [
  { icon: '📥', title: 'Téléchargement auto', desc: 'Vos données sont synchronisées en arrière-plan dès que vous êtes connecté.' },
  { icon: '💾', title: 'Stockage local sécurisé', desc: 'Les données sont chiffrées et stockées directement sur votre appareil.' },
  { icon: '🔄', title: 'Sync intelligente', desc: 'À la reconnexion, seules les modifications sont envoyées pour économiser la data.' },
];

function formatDate(d: Date) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function OfflinePage() {
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date(Date.now() - 7 * 60 * 1000));
  const [syncing, setSyncing] = useState(false);

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

  const handleSync = () => {
    if (syncing || !online) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date());
    }, 2000);
  };

  return (
    <div
      className="page-enter"
      style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}
    >
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; display: inline-block; }
      `}</style>

      {/* Header */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 10, height: 56,
          background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}
        >
          ←
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Mode hors-ligne</span>
        <span style={{ width: 22 }} />
      </div>

      <div style={{ padding: 16 }}>

        {/* Status card */}
        <div
          className="card-enter"
          style={{
            background: online ? '#f0fdf4' : '#fef2f2',
            border: `1.5px solid ${online ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: 'var(--radius, 12px)', padding: '20px 18px',
            marginBottom: 20, textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 8 }}>{online ? '🟢' : '🔴'}</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: online ? '#16a34a' : '#dc2626', marginBottom: 4 }}>
            {online ? 'Connecté à internet' : 'Mode hors-ligne actif'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {online
              ? "Toutes les fonctionnalités sont disponibles"
              : "Les données en cache restent accessibles"}
          </div>
        </div>

        {/* Données synchronisées */}
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>Données synchronisées</div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {OFFLINE_DATA.map((item, i) => (
            <div
              key={i}
              className="card-enter"
              style={{
                background: 'var(--card)', borderRadius: 'var(--radius, 12px)',
                padding: '12px 14px', border: '1px solid var(--card-border)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{item.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--bg2, #f3f4f6)', padding: '3px 8px', borderRadius: 99 }}>
                {item.size}
              </span>
            </div>
          ))}
        </div>

        {/* Dernière synchronisation */}
        <div
          className="card-enter"
          style={{
            background: 'var(--card)', borderRadius: 'var(--radius, 12px)',
            padding: '14px 16px', border: '1px solid var(--card-border)', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Dernière synchronisation</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatDate(lastSync)}</div>
          </div>
          <span style={{ fontSize: 20 }}>🕐</span>
        </div>

        {/* Bouton sync */}
        <button
          onClick={handleSync}
          disabled={!online || syncing}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 'var(--radius, 12px)',
            border: 'none', cursor: online && !syncing ? 'pointer' : 'not-allowed',
            fontWeight: 800, fontSize: 15, marginBottom: 24,
            background: online ? 'var(--acc, #6366f1)' : 'var(--card)',
            color: online ? '#fff' : 'var(--text-secondary)',
            opacity: syncing ? 0.8 : 1, transition: 'all .2s',
          }}
        >
          {syncing ? <span className="spin">🔄</span> : '🔄'} Synchroniser maintenant
        </button>

        {/* Comment ça marche */}
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>Comment ça marche</div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HOW_STEPS.map((step, i) => (
            <div
              key={i}
              className="card-enter"
              style={{
                background: 'var(--card)', borderRadius: 'var(--radius, 12px)',
                padding: '14px 16px', border: '1px solid var(--card-border)',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: 'var(--bg2, #f3f4f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
