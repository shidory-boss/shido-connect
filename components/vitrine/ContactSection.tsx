'use client';
import Link from 'next/link';
import { clinicConfig } from '@/lib/config';

export default function ContactSection() {
  return (
    <section id="contact" className="section-pad" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section-container">

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: clinicConfig.accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Nous trouver</p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Venez nous rendre visite</h2>
          <div className="gold-divider center" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

          {/* Infos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '📍', title: 'Adresse', value: clinicConfig.address, action: { label: 'Ouvrir Maps', href: clinicConfig.mapUrl } },
              { icon: '📞', title: 'Téléphone', value: clinicConfig.phone, action: { label: 'Appeler', href: `tel:${clinicConfig.phone}` } },
              { icon: '💬', title: 'WhatsApp', value: clinicConfig.whatsapp, action: { label: 'Message', href: `https://wa.me/${clinicConfig.whatsapp.replace(/\s/g, '')}` } },
              { icon: '✉️', title: 'Email', value: clinicConfig.email, action: { label: 'Écrire', href: `mailto:${clinicConfig.email}` } },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${clinicConfig.accent}15`, border: `0.5px solid ${clinicConfig.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{c.value}</div>
                </div>
                <a href={c.action.href} target="_blank" rel="noreferrer"
                  style={{ padding: '7px 14px', background: `${clinicConfig.accent}15`, border: `0.5px solid ${clinicConfig.accent}40`, borderRadius: 9, fontSize: 12, fontWeight: 600, color: clinicConfig.accent, textDecoration: 'none', flexShrink: 0, transition: 'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = clinicConfig.accent; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${clinicConfig.accent}15`; (e.currentTarget as HTMLElement).style.color = clinicConfig.accent; }}
                >{c.action.label}</a>
              </div>
            ))}

            {/* Horaires */}
            <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Horaires d'ouverture</h3>
              {clinicConfig.hours.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: i < clinicConfig.hours.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{h.days}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: clinicConfig.accent }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder + CTA */}
          <div>
            <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 16 }}>
              <div className="img-fallback" style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 48 }}>🗺️</span>
                <a href={clinicConfig.mapUrl} target="_blank" rel="noreferrer"
                  style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none' }}
                >Ouvrir Google Maps →</a>
              </div>
            </div>

            {/* CTA RDV */}
            <div style={{ background: `linear-gradient(135deg, ${clinicConfig.accentDark}, ${clinicConfig.accent})`, borderRadius: 'var(--radius-lg)', padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📅</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Réservez votre consultation</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>En ligne, rapide et sans attente inutile</p>
              <Link href="/rdv"
                style={{ display: 'inline-block', padding: '12px 32px', background: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, color: clinicConfig.accentDark, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
              >Prendre un RDV →</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){ #contact .section-container > div > div:first-child + div { margin-top:24px; } #contact .section-container > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
