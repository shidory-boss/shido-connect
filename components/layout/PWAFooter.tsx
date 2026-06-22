'use client';
import Link from 'next/link';
import { clinicConfig } from '@/lib/config';

export default function PWAFooter() {
  return (
    <footer style={{ background: clinicConfig.dark, color: '#fff', paddingTop: 64, paddingBottom: 32 }}>
      <div className="section-container">

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 48, borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏥</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{clinicConfig.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Abidjan · Côte d'Ivoire</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 20 }}>
              {clinicConfig.tagline}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'WhatsApp', icon: '💬', href: `https://wa.me/${clinicConfig.whatsapp.replace(/\s/g,'')}` },
                { label: 'Appel',   icon: '📞', href: `tel:${clinicConfig.phone}` },
                { label: 'Email',   icon: '✉️', href: `mailto:${clinicConfig.email}` },
              ].map(s => (
                <a key={s.label} href={s.href}
                  style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none', transition: 'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(29,158,117,0.25)'; (e.currentTarget as HTMLElement).style.borderColor = clinicConfig.accent; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  title={s.label}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: clinicConfig.gold, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Navigation</h4>
            {[
              { href: '/',           label: 'Accueil' },
              { href: '/#services',  label: 'Nos services' },
              { href: '/#equipe',    label: 'Notre équipe' },
              { href: '/rdv',        label: 'Prendre un RDV' },
              { href: '/file',       label: 'File d\'attente' },
              { href: '/mon-espace', label: 'Mon espace patient' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: 10, transition: 'color .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Contact & horaires */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: clinicConfig.gold, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Contact</h4>
            {[
              { icon: '📍', text: clinicConfig.address },
              { icon: '📞', text: clinicConfig.phone },
              { icon: '✉️', text: clinicConfig.email },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{c.text}</span>
              </div>
            ))}
          </div>

          {/* Horaires */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: clinicConfig.gold, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Horaires</h4>
            {clinicConfig.hours.map((h, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{h.days}</div>
                <div style={{ fontSize: 12, color: clinicConfig.accent }}>{h.time}</div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(29,158,117,0.12)', border: `0.5px solid ${clinicConfig.accent}40`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: clinicConfig.accent }}>🚨 Urgences 24h/24</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{clinicConfig.phone}</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} {clinicConfig.name} — Tous droits réservés
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            Propulsé par
            <span style={{ color: clinicConfig.accent, fontWeight: 700 }}>ShidoOS</span>
            · Made in Côte d'Ivoire 🇨🇮
          </div>
        </div>
      </div>
    </footer>
  );
}
