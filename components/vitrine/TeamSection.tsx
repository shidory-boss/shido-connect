'use client';
import { useEffect, useState } from 'react';
import { clinicConfig } from '@/lib/config';

interface Doctor { id: number; first_name: string; last_name: string; specialite?: string; }

export default function TeamSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_MEDICAL_API || 'http://localhost:8001';
    fetch(`${api}/api/v1/appointments/public/doctors`)
      .then(r => r.json())
      .then(setDoctors)
      .catch(() => {});
  }, []);

  const COLORS = [clinicConfig.accent, clinicConfig.gold, '#378ADD', '#7C3AED', '#D85A30', '#EC4899'];

  return (
    <section id="equipe" className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="section-container">

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

          {/* Texte gauche */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: clinicConfig.accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Notre équipe</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 12 }}>
              Des médecins<br />
              <span style={{ color: clinicConfig.accent }}>à votre service</span>
            </h2>
            <div className="gold-divider" />
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>
              Notre équipe pluridisciplinaire combine expertise médicale et bienveillance humaine. Chaque médecin s'engage à vous offrir les meilleurs soins possibles.
            </p>

            {/* Stats équipe */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              {[
                { value: `${doctors.length || '15'}+`, label: 'Médecins actifs' },
                { value: '8',   label: 'Spécialités' },
                { value: '98%', label: 'Satisfaction' },
                { value: '24h', label: 'Disponibilité' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: i % 2 === 0 ? clinicConfig.accent : clinicConfig.gold }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <a href="/rdv"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 14, fontWeight: 700, borderRadius: 12, textDecoration: 'none' }}
              className="btn-accent"
            >Consulter un médecin →</a>
          </div>

          {/* Grille médecins */}
          <div>
            {doctors.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {doctors.slice(0, 4).map((d, i) => (
                  <div key={d.id} style={{
                    background: 'var(--bg-secondary)', border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '24px 20px', textAlign: 'center',
                    transition: 'all .2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COLORS[i % COLORS.length]; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}30, ${COLORS[i % COLORS.length]}15)`, border: `2px solid ${COLORS[i % COLORS.length]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>👨‍⚕️</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Dr. {d.first_name} {d.last_name}</div>
                    <div style={{ fontSize: 11, color: COLORS[i % COLORS.length], fontWeight: 600, marginTop: 4 }}>{d.specialite || 'Médecin Généraliste'}</div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback placeholder */
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="img-fallback" style={{ inset: 0, position: 'absolute' }} />
                <div style={{ textAlign: 'center', color: '#fff', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 48 }}>👨‍⚕️</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8, opacity: 0.8 }}>Notre équipe médicale</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){ #equipe .section-container > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
