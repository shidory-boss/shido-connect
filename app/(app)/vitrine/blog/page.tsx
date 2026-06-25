'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Tous', 'Santé', 'Prévention', 'Conseils', 'Actualités']

const ARTICLES = [
  {
    id: 1,
    title: 'Comment prévenir les maladies cardiovasculaires',
    excerpt: 'Les maladies cardiovasculaires restent la première cause de mortalité en Afrique de l\'Ouest. Découvrez nos conseils pratiques pour protéger votre cœur au quotidien.',
    content: `Les maladies cardiovasculaires touchent chaque année des millions de personnes en Afrique de l'Ouest. Pourtant, de nombreux facteurs de risque peuvent être contrôlés grâce à des habitudes de vie saines.\n\n**Alimentation équilibrée**\nPrivilégiez les fruits, légumes, céréales complètes et protéines maigres. Réduisez la consommation de sel, de graisses saturées et de sucres raffinés.\n\n**Activité physique régulière**\n30 minutes de marche rapide par jour suffisent à réduire significativement le risque cardiovasculaire. L'important est la régularité.\n\n**Contrôle du stress**\nLe stress chronique est un facteur de risque majeur. Techniques de relaxation, sommeil suffisant et relations sociales épanouissantes contribuent à protéger votre cœur.\n\n**Suivi médical**\nUn bilan cardiovasculaire annuel est recommandé à partir de 40 ans, ou plus tôt en cas d'antécédents familiaux. N'attendez pas les symptômes pour consulter.`,
    category: 'Prévention',
    date: '15 juin 2026',
    author: 'Dr. Aminata Koné',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
  },
  {
    id: 2,
    title: 'Paludisme : reconnaître les signes et agir vite',
    excerpt: 'Le paludisme demeure l\'une des principales causes de mortalité infantile. Savoir reconnaître les premiers symptômes peut sauver une vie.',
    content: `Le paludisme est transmis par la piqûre d'un moustique Anophèles femelle infecté par le parasite Plasmodium. En Côte d'Ivoire, c'est l'une des maladies les plus fréquentes.\n\n**Symptômes à surveiller**\nFièvre élevée (souvent 38,5°C et plus), frissons intenses, maux de tête, douleurs musculaires, nausées et vomissements. Chez l'enfant, une fièvre inexpliquée doit toujours alerter.\n\n**Quand consulter en urgence**\nSi la fièvre s'accompagne de convulsions, de difficultés respiratoires, de pâleur extrême ou de troubles de la conscience, rendez-vous immédiatement aux urgences.\n\n**Prévention**\nMoustiquaires imprégnées, répulsifs, évacuation des eaux stagnantes et traitement préventif pour les femmes enceintes sont les piliers de la prévention.\n\n**Traitement**\nDes traitements efficaces existent. Plus la prise en charge est rapide, meilleur est le pronostic. Ne tardez pas à consulter.`,
    category: 'Santé',
    date: '8 juin 2026',
    author: 'Dr. Ibrahima Diallo',
    gradient: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
  },
  {
    id: 3,
    title: 'Bien dormir pour mieux vivre : les règles d\'hygiène du sommeil',
    excerpt: 'Un sommeil de qualité est indispensable à votre santé physique et mentale. Nos conseils pour retrouver un sommeil réparateur.',
    content: `Le sommeil occupe un tiers de notre vie et joue un rôle fondamental dans notre santé. Pourtant, beaucoup d'entre nous négligent cette fonction vitale.\n\n**Pourquoi le sommeil est essentiel**\nPendant le sommeil, le corps se répare, le cerveau consolide les apprentissages et le système immunitaire se renforce. Un manque chronique de sommeil augmente le risque de diabète, d'obésité, de dépression et de maladies cardiovasculaires.\n\n**Règles d'hygiène du sommeil**\n- Couchez-vous et levez-vous à des heures régulières\n- Évitez les écrans 1 heure avant le coucher\n- Créez un environnement sombre, calme et frais\n- Évitez caféine et alcool en soirée\n- Pratiquez une activité physique, mais pas trop tard\n\n**Quand consulter**\nSi vos troubles du sommeil persistent plus de 3 semaines, consultez un médecin. Des solutions efficaces existent : thérapie cognitivo-comportementale, relaxation, et dans certains cas, traitements médicamenteux adaptés.`,
    category: 'Conseils',
    date: '1 juin 2026',
    author: 'Dr. Marie-Claire Ouédraogo',
    gradient: 'linear-gradient(135deg, #A8EDEA, #FED6E3)',
  },
  {
    id: 4,
    title: 'Notre clinique obtient la certification ISO 9001',
    excerpt: 'Nous sommes fiers d\'annoncer l\'obtention de la certification internationale ISO 9001, gage de notre engagement pour la qualité des soins.',
    content: `C'est avec une immense fierté que nous vous annonçons l'obtention de la certification ISO 9001:2015, après 18 mois d'un travail rigoureux de l'ensemble de nos équipes.\n\n**Qu'est-ce que la certification ISO 9001 ?**\nIl s'agit d'une norme internationale qui certifie qu'une organisation dispose d'un système de management de la qualité efficace. Pour un établissement de santé, cela garantit des processus optimisés, une traçabilité totale et une amélioration continue des pratiques.\n\n**Ce que cela change pour vous**\nCette certification est avant tout une reconnaissance pour nos patients. Elle atteste que chaque aspect de votre parcours de soins — de l'accueil à la sortie — répond aux plus hauts standards de qualité et de sécurité.\n\n**Nos engagements**\nNous nous engageons à maintenir et améliorer continuellement ce niveau d'excellence. La certification sera renouvelée tous les 3 ans lors d'audits externes. Merci à toute notre équipe pour ce résultat exceptionnel.`,
    category: 'Actualités',
    date: '20 mai 2026',
    author: 'Direction',
    gradient: 'linear-gradient(135deg, #F093FB, #F5576C)',
  },
]

export default function VitrineBlogPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [selectedArticle, setSelectedArticle] = useState<typeof ARTICLES[0] | null>(null)

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'Tous' || a.category === activeCategory
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

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
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Blog</span>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 14px', borderRadius: 'var(--radius)',
            border: '1px solid var(--card-border)', background: 'var(--card)',
            color: 'var(--text-primary)', fontSize: 14, marginBottom: 14,
            outline: 'none',
          }}
        />

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20,
                border: '1px solid var(--card-border)',
                background: activeCategory === cat ? 'var(--acc)' : 'var(--card)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400,
                cursor: 'pointer',
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="stagger">
          {filtered.map(article => (
            <div
              key={article.id}
              className="card-enter"
              onClick={() => setSelectedArticle(article)}
              style={{
                background: 'var(--card)', borderRadius: 'var(--radius)',
                border: '1px solid var(--card-border)', overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {/* Image placeholder */}
              <div style={{
                height: 80, background: article.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 28 }}>📝</span>
              </div>
              <div style={{ padding: '10px 10px 12px' }}>
                <span style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 10,
                  background: 'var(--acc)', color: '#fff', marginBottom: 6,
                }}>{article.category}</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>
                  {article.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 8 }}>
                  {article.excerpt.substring(0, 80)}...
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{article.date}</span>
                  <span style={{ fontSize: 12, color: 'var(--acc)', fontWeight: 700 }}>Lire →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', fontSize: 14 }}>
            Aucun article trouvé
          </div>
        )}
      </div>

      {/* Modal article */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxHeight: '90vh', overflowY: 'auto',
              background: 'var(--bg)', borderRadius: '20px 20px 0 0',
              padding: '20px 16px 40px',
            }}
          >
            <div style={{ width: 40, height: 4, background: 'var(--card-border)', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ height: 140, background: selectedArticle.gradient, borderRadius: 'var(--radius)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 48 }}>📝</span>
            </div>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700,
              padding: '3px 10px', borderRadius: 10,
              background: 'var(--acc)', color: '#fff', marginBottom: 10,
            }}>{selectedArticle.category}</span>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.3 }}>
              {selectedArticle.title}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Par {selectedArticle.author} · {selectedArticle.date}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
