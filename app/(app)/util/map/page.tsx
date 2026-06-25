'use client';

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Abidjan,Côte+d\'Ivoire';
const FULL_ADDRESS = 'Boulevard Latrille, Cocody, Abidjan, Côte d\'Ivoire';

const transportCards = [
  {
    icon: '🚗',
    label: 'Voiture',
    desc: 'Prenez le Boulevard Latrille, parking disponible sur place. Accès facile depuis l\'autoroute.',
  },
  {
    icon: '🚌',
    label: 'Bus',
    desc: 'Lignes SOTRA 88 et 47. Arrêt "Cocody Centre" à 200m. Fréquence toutes les 15min.',
  },
  {
    icon: '🚶',
    label: 'À pied',
    desc: 'Depuis la station de bus Cocody : 3 minutes à pied, suivre les panneaux "Clinique".',
  },
];

export default function MapPage() {
  const openMaps = () => {
    window.open(GOOGLE_MAPS_URL, '_blank');
  };

  const openDirections = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const url = `https://www.google.com/maps/dir/${latitude},${longitude}/Abidjan,Côte+d'Ivoire`;
          window.open(url, '_blank');
        },
        () => {
          window.open(GOOGLE_MAPS_URL, '_blank');
        }
      );
    } else {
      window.open(GOOGLE_MAPS_URL, '_blank');
    }
  };

  return (
    <div
      className="page-enter"
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        fontFamily: 'Nunito, system-ui, sans-serif',
        color: 'var(--text-primary)',
      }}
    >
      <style>{`
        @keyframes pulseLux {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; box-shadow: 0 0 0 0 rgba(46,160,67,0.6); }
          50% { transform: translate(-50%, -50%) scale(1.18); opacity: 1; box-shadow: 0 0 0 14px rgba(46,160,67,0); }
        }
        .map-pin {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 22px;
          height: 22px;
          background: #2ea043;
          border: 3px solid #fff;
          border-radius: 50%;
          animation: pulseLux 1.6s ease-in-out infinite;
        }
        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: 56,
          background: 'var(--card)',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 16px',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}
        >
          ←
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, flex: 1, textAlign: 'center' }}>Localisation</span>
        <span style={{ width: 28 }} />
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        {/* Map simulée */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 280,
            borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, #1a3a1a 0%, #0d2b1a 40%, #143322 100%)',
            overflow: 'hidden',
            marginBottom: 12,
          }}
        >
          <div className="grid-lines" />
          {/* Faux labels de rue */}
          <span style={{ position: 'absolute', top: 60, left: 30, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Bd Latrille</span>
          <span style={{ position: 'absolute', bottom: 80, right: 30, fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Rue du Commerce</span>
          <span style={{ position: 'absolute', top: 120, right: 50, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Av. Chardy</span>
          <div className="map-pin" />
        </div>

        {/* Adresse */}
        <div
          className="card-enter"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius)',
            padding: '12px 14px',
            marginBottom: 12,
            fontSize: 14,
            color: 'var(--text-secondary)',
          }}
        >
          📍 {FULL_ADDRESS}
        </div>

        {/* Boutons */}
        <button
          onClick={openMaps}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 'var(--radius)',
            background: 'var(--acc)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          🗺️ Ouvrir dans Maps
        </button>

        <button
          onClick={openDirections}
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: 'var(--radius)',
            background: 'var(--card)',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: 15,
            border: '1px solid var(--card-border)',
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          📍 Itinéraire depuis ma position
        </button>

        {/* Comment venir */}
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Comment venir</div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {transportCards.map((t) => (
            <div
              key={t.label}
              className="card-enter"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 26 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
