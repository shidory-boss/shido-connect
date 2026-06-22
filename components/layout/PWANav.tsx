'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clinicConfig } from '@/lib/config';

const NAV_LINKS = [
  { href: '/',           label: 'Accueil'    },
  { href: '/#services',  label: 'Services'   },
  { href: '/#equipe',    label: 'Équipe'     },
  { href: '/#contact',   label: 'Contact'    },
];

export default function PWANav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  const bg = scrolled || !isHome
    ? 'rgba(10,22,40,0.97)'
    : 'transparent';
  const borderColor = scrolled || !isHome ? 'rgba(255,255,255,0.08)' : 'transparent';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: bg, backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `0.5px solid ${borderColor}`,
        transition: 'all 0.3s ease',
        padding: '0 24px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 12px rgba(29,158,117,0.4)', flexShrink: 0,
          }}>🏥</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              {clinicConfig.name}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              Clinique · Abidjan 🇨🇮
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              style={{
                padding: '7px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500,
                color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >{l.label}</Link>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/mon-espace"
            style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#fff', textDecoration: 'none', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
          >Mon espace</Link>
          <Link href="/rdv"
            style={{ padding: '8px 18px', background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`, border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(29,158,117,0.40)', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >Prendre RDV</Link>

          {/* Burger mobile */}
          <button onClick={() => setOpen(!open)}
            style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', display: 'none', color: '#fff', fontSize: 16 }}
            className="show-mobile"
          >{open ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 190,
          background: 'rgba(10,22,40,0.98)', backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 32px 40px',
          animation: 'fadeIn 0.2s ease',
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ fontSize: 28, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}
            >{l.label}</Link>
          ))}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/rdv" onClick={() => setOpen(false)}
              style={{ padding: '14px', background: `linear-gradient(135deg, ${clinicConfig.accent}, ${clinicConfig.accentDark})`, borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', textDecoration: 'none', textAlign: 'center' }}
            >Prendre un RDV →</Link>
            <Link href="/file" onClick={() => setOpen(false)}
              style={{ padding: '14px', background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#fff', textDecoration: 'none', textAlign: 'center' }}
            >File d'attente</Link>
            <Link href="/mon-espace" onClick={() => setOpen(false)}
              style={{ padding: '14px', background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#fff', textDecoration: 'none', textAlign: 'center' }}
            >Mon espace</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: flex !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  );
}
