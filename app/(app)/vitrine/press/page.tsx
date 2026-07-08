'use client'

import { useRouter } from 'next/navigation'

const PRESS_ARTICLES = [
  {
    id: 1,
    media: 'Fraternité Matin',
    initials: 'FM',
    color: '#0066CC',
    title: 'ShidoConnect révolutionne la relation patient-médecin en Côte d\'Ivoire',
    excerpt: 'La startup abidjanaise ShidoConnect propose une application mobile qui permet aux patients de suivre leurs rendez-vous, consulter leurs ordonnances et communiquer avec leur médecin en temps réel.',
    date: '12 juin 2026',
    url: '#',
  },
  {
    id: 2,
    media: 'Le Nouveau Réveil',
    initials: 'NR',
    color: '#CC2200',
    title: 'Santé numérique : les cliniques ivoiriennes adoptent les outils connectés',
    excerpt: 'De plus en plus d\'établissements de santé en Côte d\'Ivoire s\'équipent de solutions numériques pour améliorer la qualité des soins. ShidoConnect figure parmi les pionniers de cette transformation.',
    date: '3 juin 2026',
    url: '#',
  },
  {
    id: 3,
    media: 'Jeune Afrique',
    initials: 'JA',
    color: '#006633',
    title: 'Les 10 startups africaines de la santé à suivre en 2026',
    excerpt: 'Notre sélection des acteurs les plus prometteurs de la healthtech africaine. ShidoConnect, avec sa suite complète de gestion médicale, se distingue par son ancrage local et son ambition continentale.',
    date: '20 mai 2026',
    url: '#',
  },
]

const MEDIA_LOGOS = [
  { name: 'Fraternité Matin', initials: 'FM', color: '#0066CC' },
  { name: 'Le Nouveau Réveil', initials: 'NR', color: '#CC2200' },
  { name: 'Jeune Afrique', initials: 'JA', color: '#006633' },
  { name: 'RFI Afrique', initials: 'RFI', color: '#FF6600' },
  { name: 'Africa News', initials: 'AN', color: '#9900CC' },
  { name: 'Business24', initials: 'B24', color: '#003399' },
]

export default function VitrinePressPage() {
  const router = useRouter()

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-primary)', padding: '0 4px' }}
        >←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Revue de presse</span>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Articles presse */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>Articles récents</div>
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PRESS_ARTICLES.map(article => (
              <div
                key={article.id}
                className="card-enter"
                style={{
                  background: 'var(--card)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--card-border)', padding: '14px',
                }}
              >
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  {/* Logo média */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: article.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12,
                  }}>{article.initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{article.media}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{article.date}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>
                  {article.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                  {article.excerpt}
                </div>
                <button style={{
                  width: '100%', padding: '9px',
                  borderRadius: 'var(--radius)', border: '1px solid var(--acc)',
                  background: 'transparent', color: 'var(--acc)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>Lire l'article</button>
              </div>
            ))}
          </div>
        </div>

        {/* Mentions */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 14 }}>Ils parlent de nous</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {MEDIA_LOGOS.map(media => (
              <div
                key={media.name}
                style={{
                  background: 'var(--card)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--card-border)',
                  padding: '14px 8px', textAlign: 'center',
                  cursor: 'pointer', transition: 'filter 0.2s',
                  filter: 'grayscale(1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(1)')}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, margin: '0 auto 6px',
                  background: media.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 11,
                }}>{media.initials}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{media.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
