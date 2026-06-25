'use client';
import { useRef, useState } from 'react';

export default function QrScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [detected, setDetected] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualResult, setManualResult] = useState('');
  const streamRef = useRef<MediaStream | null>(null);

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setDetected(false);
      // Simulation détection après 3s
      setTimeout(() => {
        setDetected(true);
      }, 3000);
    } catch {
      alert('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setDetected(false);
  };

  const handleManual = () => {
    if (manualCode.trim()) {
      setManualResult(`Code saisi : ${manualCode.trim()} — Patient trouvé ✅`);
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
        @keyframes scanLine {
          0% { top: 8px; }
          100% { top: calc(100% - 8px); }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .scan-line {
          position: absolute;
          left: 8px;
          right: 8px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--acc, #00b894), transparent);
          animation: scanLine 2s linear infinite alternate;
        }
        .corner {
          position: absolute;
          width: 22px;
          height: 22px;
          animation: cornerPulse 1.8s ease-in-out infinite;
        }
        .corner-tl { top: 0; left: 0; border-top: 3px solid var(--acc, #00b894); border-left: 3px solid var(--acc, #00b894); }
        .corner-tr { top: 0; right: 0; border-top: 3px solid var(--acc, #00b894); border-right: 3px solid var(--acc, #00b894); }
        .corner-bl { bottom: 0; left: 0; border-bottom: 3px solid var(--acc, #00b894); border-left: 3px solid var(--acc, #00b894); }
        .corner-br { bottom: 0; right: 0; border-bottom: 3px solid var(--acc, #00b894); border-right: 3px solid var(--acc, #00b894); }
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
          onClick={() => { stopCamera(); window.history.back(); }}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}
        >
          ←
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, flex: 1, textAlign: 'center' }}>Scanner QR</span>
        <span style={{ width: 28 }} />
      </div>

      <div style={{ padding: 16 }}>
        {/* Zone scan */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div
            style={{
              position: 'relative',
              width: 240,
              height: 240,
              borderRadius: 12,
              background: cameraActive ? 'transparent' : 'var(--bg2, #111)',
              overflow: 'hidden',
              boxShadow: '0 0 0 4px var(--card-border)',
            }}
          >
            {/* Video live */}
            <video
              ref={videoRef}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: cameraActive ? 'block' : 'none',
              }}
              muted
              playsInline
            />

            {/* Placeholder */}
            {!cameraActive && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, opacity: 0.3 }}>
                📷
              </div>
            )}

            {/* Coins viewfinder */}
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />

            {/* Scan line animé */}
            {cameraActive && !detected && <div className="scan-line" />}

            {/* Overlay détecté */}
            {detected && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,184,148,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
              }}>
                ✅
              </div>
            )}
          </div>
        </div>

        {/* Résultat détection */}
        {detected && (
          <div
            className="card-enter"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
              marginBottom: 14,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>QR Détecté ✅</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <div>Patient : <strong style={{ color: 'var(--text-primary)' }}>Jean Kouassi</strong></div>
              <div>RDV : <strong style={{ color: 'var(--text-primary)' }}>14:30</strong></div>
            </div>
          </div>
        )}

        {/* Bouton activer / arrêter */}
        {!cameraActive ? (
          <button
            onClick={activateCamera}
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
              marginBottom: 14,
            }}
          >
            📷 Activer la caméra
          </button>
        ) : (
          <button
            onClick={stopCamera}
            style={{
              width: '100%',
              padding: '13px 0',
              borderRadius: 'var(--radius)',
              background: 'var(--card)',
              color: 'var(--text-primary)',
              fontWeight: 800,
              fontSize: 15,
              border: '1px solid var(--card-border)',
              cursor: 'pointer',
              marginBottom: 14,
            }}
          >
            ⏹ Arrêter la caméra
          </button>
        )}

        {/* Saisie manuelle */}
        <div
          className="card-enter"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Saisir le code manuellement</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ex: RDV-20260624-001"
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--card-border)',
                background: 'var(--bg)',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleManual()}
            />
            <button
              onClick={handleManual}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                background: 'var(--acc)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
          </div>
          {manualResult && (
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>{manualResult}</div>
          )}
        </div>

        {/* Instructions */}
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>Comment bien scanner</div>
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '💡', text: 'Assurez-vous d\'être dans un endroit bien éclairé.' },
            { icon: '📐', text: 'Centrez le QR code dans le carré de scan.' },
            { icon: '📏', text: 'Maintenez le code à 15–20 cm de la caméra.' },
            { icon: '✋', text: 'Restez stable quelques secondes pour la détection.' },
          ].map((item) => (
            <div
              key={item.text}
              className="card-enter"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                padding: '11px 14px',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
