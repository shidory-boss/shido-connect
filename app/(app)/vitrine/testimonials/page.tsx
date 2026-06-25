'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const TESTIMONIALS = [
  { id: 1, name: 'Awa Koné', date: '12 juin 2026', rating: 5, text: 'Service exceptionnel ! Le docteur a pris le temps de bien m\'expliquer mon traitement. Application très pratique pour les rendez-vous.', initials: 'AK', color: '#6366F1' },
  { id: 2, name: 'Moussa Diallo', date: '8 juin 2026', rating: 5, text: 'Très satisfait de la prise en charge. L\'équipe est professionnelle et attentionnée. Je recommande vivement cette clinique.', initials: 'MD', color: '#10B981' },
  { id: 3, name: 'Fatoumata Traoré', date: '3 juin 2026', rating: 4, text: 'Bonne expérience globale. L\'attente était un peu longue mais la consultation était de qualité. L\'application aide à suivre son dossier.', initials: 'FT', color: '#F59E0B' },
  { id: 4, name: 'Kouassi Bamba', date: '28 mai 2026', rating: 5, text: 'Personnel accueillant et compétent. Les résultats d\'analyses disponibles directement sur l\'appli, c\'est vraiment pratique !', initials: 'KB', color: '#EF4444' },
  { id: 5, name: 'Aminata Coulibaly', date: '20 mai 2026', rating: 5, text: 'Suivi excellent depuis 6 mois. Mon médecin connaît mon historique par cœur grâce au dossier numérique. Très moderne.', initials: 'AC', color: '#8B5CF6' },
  { id: 6, name: 'Issouf Ouédraogo', date: '15 mai 2026', rating: 3, text: 'Correct dans l\'ensemble. Quelques petits problèmes de communication au niveau de l\'accueil mais la qualité médicale est là.', initials: 'IO', color: '#0EA5E9' },
]

const DISTRIBUTION = [
  { stars: 5, pct: 80, color: '#10B981' },
  { stars: 4, pct: 15, color: '#6366F1' },
  { stars: 3, pct: 5, color: '#F59E0B' },
]

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#FBBF24' : 'var(--card-border)' }}>★</span>
      ))}
    </span>
  )
}

export default function TestimonialsPage() {
  const router = useRouter()
  const [reviewRating, setReviewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reviewRating === 0) return
    setSubmitted(true)
    setShowForm(false)
  }

  return (
    <div
      className="page-enter"
      style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 32 }}
    >
      {/* Header sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: '0 4px', lineHeight: 1 }}
          aria-label="Retour"
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
          Témoignages
        </div>
        <div style={{
          background: 'var(--acc, var(--accent))', color: '#fff',
          borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 700,
        }}>
          4.8 ★
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Distribution des notes */}
        <div
          className="acard"
          style={{ padding: '18px 16px', marginBottom: 24 }}
        >
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 12 }}>
            Distribution des avis
          </div>
          {DISTRIBUTION.map(({ stars, pct, color }) => (
            <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', width: 28, textAlign: 'right' }}>{stars}★</div>
              <div style={{ flex: 1, height: 8, borderRadius: 8, background: 'var(--card-border)', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: 8,
                  background: color,
                  transition: 'width 0.6s cubic-bezier(.4,0,.2,1)',
                }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 36 }}>{pct}%</div>
            </div>
          ))}
        </div>

        {/* Carrousel témoignages */}
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 12 }}>
          Ce que disent nos patients
        </div>
        <div
          className="stagger"
          style={{
            display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.id}
              className="card-enter"
              style={{
                flex: '0 0 280px', scrollSnapAlign: 'start',
                background: 'var(--card)', borderRadius: 'var(--radius, 16px)',
                border: '1px solid var(--card-border)',
                padding: '18px 16px',
                animationDelay: `${idx * 80}ms`,
              }}
            >
              {/* Avatar + étoiles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: t.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14, flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{t.name}</div>
                  <StarRating rating={t.rating} size={14} />
                </div>
              </div>

              {/* Citation */}
              <div style={{
                fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55,
                fontStyle: 'italic',
              }}>
                &ldquo;{t.text}&rdquo;
              </div>

              {/* Date */}
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 10, opacity: 0.7 }}>
                {t.date}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton donner son avis */}
        <div style={{ marginTop: 28 }}>
          {!showForm && !submitted && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius, 16px)',
                background: 'var(--acc, var(--accent))', color: '#fff',
                border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 15,
                transition: 'opacity .2s',
              }}
            >
              Donner mon avis
            </button>
          )}

          {submitted && (
            <div
              className="acard"
              style={{ padding: '20px 16px', textAlign: 'center' }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Merci pour votre avis !</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Votre témoignage aide d&apos;autres patients.</div>
            </div>
          )}

          {showForm && (
            <div
              className="acard card-enter"
              style={{ padding: '20px 16px' }}
            >
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 16 }}>
                Votre avis
              </div>
              <form onSubmit={handleSubmit}>
                {/* Étoiles cliquables */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Note *</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 32, color: star <= (hoverRating || reviewRating) ? '#FBBF24' : 'var(--card-border)',
                          padding: 0, transition: 'color .15s',
                        }}
                        aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Votre commentaire</div>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    rows={4}
                    style={{
                      width: '100%', borderRadius: 12,
                      border: '1px solid var(--card-border)',
                      background: 'var(--bg)', color: 'var(--text-primary)',
                      padding: '10px 12px', fontSize: 14, resize: 'none',
                      outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12,
                      background: 'transparent', border: '1px solid var(--card-border)',
                      cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600,
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={reviewRating === 0}
                    style={{
                      flex: 2, padding: '12px', borderRadius: 12,
                      background: reviewRating === 0 ? 'var(--card-border)' : 'var(--acc, var(--accent))',
                      color: '#fff', border: 'none', cursor: reviewRating === 0 ? 'not-allowed' : 'pointer',
                      fontSize: 14, fontWeight: 800, transition: 'background .2s',
                    }}
                  >
                    Envoyer mon avis
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
