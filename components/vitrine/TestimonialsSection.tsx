'use client';
import { clinicConfig } from '@/lib/config';

export default function TestimonialsSection() {
  return (
    <section style={{ background: clinicConfig.dark, padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
      {/* Orbe déco */}
      <div style={{ position: 'absolute', top: '30%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${clinicConfig.accent}10 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: clinicConfig.accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Ils nous font confiance</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Ce que disent nos patients</h2>
          <div className="gold-divider center" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {clinicConfig.testimonials.map((t, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '0.5px solid rgba(255,255,255,0.10)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 24px',
            }}>
              {/* Étoiles */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} style={{ color: clinicConfig.gold, fontSize: 16 }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Patient vérifié</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
