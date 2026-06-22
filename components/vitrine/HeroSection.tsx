'use client';
import Link from 'next/link';
import { clinicConfig } from '@/lib/config';

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
      background: clinicConfig.dark,
    }}>
      {/* Image hero avec overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(${clinicConfig.images.hero})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div className="img-fallback" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
      </div>

      {/* Overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.65) 60%, rgba(10,22,40,0.40) 100%)`,
      }} />

      {/* Orbes décoratifs */}
      <div style={{ position: 'absolute', top: '15%', right: '8%', width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle, ${clinicConfig.accent}18 0%, transparent 70%)`, zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${clinicConfig.gold}12 0%, transparent 70%)`, zIndex: 1, pointerEvents: 'none' }} />

      {/* Contenu */}
      <div className="section-container" style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 60 }}>
        <div style={{ maxWidth: 680 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px',
            background: `${clinicConfig.accent}20`,
            border: `0.5px solid ${clinicConfig.accent}50`,
            borderRadius: 20, marginBottom: 28,
            animation: 'fadeUp 0.5s ease both',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: clinicConfig.accent, animation: 'pulse-dot 2s ease infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: clinicConfig.accent }}>Clinique ouverte · Abidjan, Cocody</span>
          </div>

          {/* Titre */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.1, letterSpacing: '-1px',
            marginBottom: 20,
            animation: 'fadeUp 0.6s ease 0.1s both',
          }}>
            Votre santé,<br />
            <span style={{ background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              notre priorité.
            </span>
          </h1>

          {/* Sous-titre */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7, marginBottom: 40,
            maxWidth: 520,
            animation: 'fadeUp 0.6s ease 0.2s both',
          }}>
            {clinicConfig.tagline}. Consultations, urgences, laboratoire et maternité — tout en un seul endroit.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeUp 0.6s ease 0.3s both' }}>
            <Link href="/rdv"
              style={{ padding: '14px 32px', fontSize: 15, fontWeight: 700, borderRadius: 14, textDecoration: 'none' }}
              className="btn-accent"
            >Prendre un RDV →</Link>
            <Link href="/file"
              style={{ padding: '14px 28px', fontSize: 15, fontWeight: 600, borderRadius: 14, textDecoration: 'none', background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.20)', color: '#fff', backdropFilter: 'blur(10px)' }}
            >File d'attente</Link>
          </div>

          {/* Urgences badge */}
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeUp 0.6s ease 0.4s both' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1.5px solid #ef444460', animation: 'pulse-ring 1.5s ease-out infinite' }} />
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Urgences disponibles <strong style={{ color: '#fff' }}>24h/24 · 7j/7</strong> · {clinicConfig.phone}
            </span>
          </div>
        </div>

        {/* Card flottante stats */}
        <div style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: '28px 32px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
          animation: 'fadeUp 0.7s ease 0.5s both',
        }} className="hero-stats-card">
          {clinicConfig.stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: i % 2 === 0 ? clinicConfig.accent : clinicConfig.gold }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: 'float 2s ease-in-out infinite' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>Découvrir</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.8);opacity:0} }
        @media (max-width: 900px) { .hero-stats-card { display: none !important; } }
      `}</style>
    </section>
  );
}
