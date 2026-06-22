'use client';
import { clinicConfig } from '@/lib/config';

export default function StatsBar() {
  return (
    <section style={{ background: `linear-gradient(135deg, ${clinicConfig.accentDark}, ${clinicConfig.accent})`, padding: '28px 0' }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${clinicConfig.stats.length}, 1fr)`, gap: 16, textAlign: 'center' }}>
          {clinicConfig.stats.map((s, i) => (
            <div key={i} style={{ padding: '8px 0', borderRight: i < clinicConfig.stats.length - 1 ? '0.5px solid rgba(255,255,255,0.2)' : 'none' }}>
              <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
