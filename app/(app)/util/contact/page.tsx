'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', objet: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    borderRadius: 'var(--radius, 12px)',
    border: '1.5px solid var(--card-border)',
    background: 'var(--bg2, var(--card))',
    color: 'var(--text-primary)', fontSize: 14,
    fontFamily: 'inherit', boxSizing: 'border-box',
    outline: 'none', marginBottom: 12
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, height: 56, background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)', display: 'flex',
        alignItems: 'center', gap: 12, padding: '0 16px', zIndex: 10
      }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}
        >←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Contact & Localisation</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Coordonnées */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius, 12px)', border: '1px solid var(--card-border)', padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Coordonnées</div>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="tel:+2250700000000" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--text-primary)' }}>
              <span style={{ fontSize: 22 }}>📞</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Téléphone</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>+225 07 00 00 00 00</div>
              </div>
            </a>
            <a href="mailto:contact@shidomedical.ci" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--text-primary)' }}>
              <span style={{ fontSize: 22 }}>📧</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Email</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>contact@shidomedical.ci</div>
              </div>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>🕐</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Horaires</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Lu–Ve 8h–18h &nbsp;|&nbsp; Sa 8h–13h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte simulée */}
        <div
          className="card-enter"
          onClick={() => window.open('https://www.google.com/maps/search/Abidjan+Côte+d%27Ivoire', '_blank')}
          style={{
            borderRadius: 'var(--radius, 12px)', overflow: 'hidden',
            height: 180, cursor: 'pointer', position: 'relative',
            background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 50%, #86efac 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 8, userSelect: 'none'
          }}
        >
          <span style={{ fontSize: 48 }}>📍</span>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Voir sur la carte</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Abidjan, Côte d&apos;Ivoire</div>
        </div>

        {/* Formulaire */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius, 12px)', border: '1px solid var(--card-border)', padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Nous écrire</div>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Message envoyé !</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Nous vous répondrons dans les 24h.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                style={inputStyle}
                placeholder="Votre nom"
                value={form.nom}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                required
              />
              <input
                style={inputStyle}
                type="email"
                placeholder="Votre email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                style={inputStyle}
                placeholder="Objet"
                value={form.objet}
                onChange={e => setForm(f => ({ ...f, objet: e.target.value }))}
                required
              />
              <textarea
                style={{ ...inputStyle, resize: 'vertical', marginBottom: 16 }}
                placeholder="Votre message..."
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                required
              />
              <button
                type="submit"
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: 'var(--radius, 12px)',
                  background: 'var(--acc, #22c55e)', color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontWeight: 800, fontSize: 15
                }}
              >Envoyer</button>
            </form>
          )}
        </div>

        {/* Réseaux sociaux */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius, 12px)', border: '1px solid var(--card-border)', padding: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>Retrouvez-nous</div>
          <div className="stagger" style={{ display: 'flex', gap: 12 }}>
            <a
              href="https://wa.me/2250700000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, padding: '14px 8px', borderRadius: 'var(--radius, 12px)',
                background: '#dcfce7', color: '#16a34a', textDecoration: 'none',
                fontWeight: 700, fontSize: 12
              }}
            >
              <span style={{ fontSize: 28 }}>💬</span>
              WhatsApp
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, padding: '14px 8px', borderRadius: 'var(--radius, 12px)',
                background: '#dbeafe', color: '#1d4ed8', textDecoration: 'none',
                fontWeight: 700, fontSize: 12
              }}
            >
              <span style={{ fontSize: 28 }}>📘</span>
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, padding: '14px 8px', borderRadius: 'var(--radius, 12px)',
                background: '#fce7f3', color: '#db2777', textDecoration: 'none',
                fontWeight: 700, fontSize: 12
              }}
            >
              <span style={{ fontSize: 28 }}>📸</span>
              Instagram
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
