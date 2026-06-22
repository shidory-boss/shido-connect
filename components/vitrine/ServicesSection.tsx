'use client';
import { clinicConfig } from '@/lib/config';

export default function ServicesSection() {
  return (
    <section id="services" className="section-pad" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: clinicConfig.accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>
            Ce que nous offrons
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Nos spécialités médicales
          </h2>
          <div className="gold-divider center" />
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Une prise en charge complète pour toute la famille, par des médecins expérimentés et passionnés.
          </p>
        </div>

        {/* Grille services */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {clinicConfig.services.map((s, i) => (
            <div key={i}
              style={{
                background: 'var(--card-bg)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                transition: 'all 0.25s ease',
                cursor: 'default',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 16px 40px rgba(29,158,117,0.12)';
                el.style.borderColor = `${clinicConfig.accent}50`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--border)';
              }}
            >
              {/* Orbe décoratif */}
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${clinicConfig.accent}08`, pointerEvents: 'none' }} />

              <div style={{ fontSize: 36, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{s.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: clinicConfig.accent }}>
                En savoir plus <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="/rdv"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', fontSize: 15, fontWeight: 700, borderRadius: 14, textDecoration: 'none' }}
            className="btn-accent"
          >Consulter un spécialiste →</a>
        </div>
      </div>
    </section>
  );
}
