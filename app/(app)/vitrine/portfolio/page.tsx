'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = 'Tout' | 'Chirurgie' | 'Consultations' | 'Prévention'

interface Project {
  id: number
  title: string
  category: Exclude<Category, 'Tout'>
  description: string
  longDescription: string
  results: string
  team: string
  gradient: string
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Programme chirurgie cardiaque',
    category: 'Chirurgie',
    description: 'Mise en place d\'un bloc opératoire de pointe pour les interventions cardiaques complexes.',
    longDescription: 'Notre programme de chirurgie cardiaque a été développé pour répondre aux besoins croissants de la région. Nous avons investi dans des équipements de dernière génération et formé une équipe pluridisciplinaire hautement spécialisée.',
    results: '150 interventions réussies, taux de réussite 98%, temps de récupération réduit de 30%.',
    team: 'Oria Care (chirurgien), Dr. Bamba (anesthésiste), 4 infirmiers spécialisés',
    gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
  },
  {
    id: 2,
    title: 'Téléconsultation rurale',
    category: 'Consultations',
    description: 'Extension des consultations médicales aux zones rurales via la télémédecine.',
    longDescription: 'Face aux difficultés d\'accès aux soins en zone rurale, nous avons déployé un système de téléconsultation permettant aux patients éloignés de bénéficier d\'un suivi médical de qualité sans se déplacer.',
    results: '500 patients ruraux connectés, économie moyenne de 2h de transport par consultation.',
    team: 'Dr. Ouattara (médecine générale), équipe IT, 2 infirmiers coordinateurs',
    gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
  },
  {
    id: 3,
    title: 'Campagne vaccinations scolaires',
    category: 'Prévention',
    description: 'Programme de vaccination ciblant 10 000 enfants dans les écoles primaires.',
    longDescription: 'En partenariat avec le ministère de la santé et les établissements scolaires, nous avons organisé des campagnes de vaccination massives pour protéger les enfants contre les maladies évitables.',
    results: '9 847 enfants vaccinés, couverture vaccinale passée de 62% à 89% sur la zone.',
    team: 'Dr. Diabaté (pédiatrie), 8 infirmiers vaccinateurs, 3 coordinateurs terrain',
    gradient: 'linear-gradient(135deg, #55efc4, #00b894)',
  },
  {
    id: 4,
    title: 'Chirurgie reconstructrice',
    category: 'Chirurgie',
    description: 'Unité dédiée à la chirurgie reconstructrice après accidents ou brûlures graves.',
    longDescription: 'Notre unité de chirurgie reconstructrice offre une prise en charge complète des patients victimes de traumatismes physiques importants, depuis l\'intervention chirurgicale jusqu\'à la réhabilitation psychologique.',
    results: '75 patients pris en charge, 95% satisfaits du résultat final, 3 prix nationaux obtenus.',
    team: 'Dr. Traoré (chirurgie plastique), psychologue, kinésithérapeute, 3 infirmiers',
    gradient: 'linear-gradient(135deg, #fd79a8, #e84393)',
  },
  {
    id: 5,
    title: 'Consultations prénatales +',
    category: 'Consultations',
    description: 'Suivi renforcé des grossesses à risque avec protocole personnalisé.',
    longDescription: 'Notre programme de consultations prénatales renforcées accompagne les futures mamans présentant des facteurs de risque (diabète gestationnel, hypertension, grossesse multiple) avec un suivi hebdomadaire personnalisé.',
    results: 'Réduction de 45% de la mortalité néonatale, 320 naissances accompagnées en 2024.',
    team: 'Dr. Coulibaly (gynécologie-obstétrique), sage-femme, nutritionniste',
    gradient: 'linear-gradient(135deg, #fdcb6e, #e17055)',
  },
  {
    id: 6,
    title: 'Dépistage diabète en entreprise',
    category: 'Prévention',
    description: 'Partenariat avec 12 entreprises locales pour le dépistage du diabète de type 2.',
    longDescription: 'Un programme innovant de prévention en milieu professionnel permettant de détecter précocement le diabète de type 2 et les facteurs de risque cardiovasculaires chez les actifs de 35-60 ans.',
    results: '2 400 salariés dépistés, 180 cas détectés précocement, prise en charge immédiate garantie.',
    team: 'Dr. N\'Guessan (endocrinologie), infirmière de santé au travail, diététicienne',
    gradient: 'linear-gradient(135deg, #74b9ff, #0984e3)',
  },
]

const CATEGORIES: Category[] = ['Tout', 'Chirurgie', 'Consultations', 'Prévention']

export default function PortfolioPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<Category>('Tout')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filtered = activeCategory === 'Tout'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory)

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            lineHeight: 1,
            padding: 0,
          }}
        >←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
          Nos réalisations
        </div>
        <div style={{ width: 28 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Filter tabs */}
        <div className="stagger" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                whiteSpace: 'nowrap',
                padding: '7px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: activeCategory === cat ? 'var(--acc)' : 'var(--card)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="card-enter"
              onClick={() => setSelectedProject(project)}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                cursor: 'pointer',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {/* Image placeholder */}
              <div style={{
                height: 90,
                background: project.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}>
                {project.category === 'Chirurgie' ? '🔬' : project.category === 'Consultations' ? '🩺' : '🛡️'}
              </div>

              <div style={{ padding: '10px 12px' }}>
                {/* Category badge */}
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: 'var(--acc)',
                  color: '#fff',
                  padding: '2px 7px',
                  borderRadius: 20,
                  display: 'inline-block',
                  marginBottom: 5,
                }}>{project.category}</span>

                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
                  {project.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {project.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--card)',
              borderRadius: '20px 20px 0 0',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '20px 16px',
            }}
          >
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: 'var(--card-border)', borderRadius: 2, margin: '0 auto 16px' }} />

            {/* Image */}
            <div style={{
              height: 120,
              background: selectedProject.gradient,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              marginBottom: 16,
            }}>
              {selectedProject.category === 'Chirurgie' ? '🔬' : selectedProject.category === 'Consultations' ? '🩺' : '🛡️'}
            </div>

            <span style={{
              fontSize: 11,
              fontWeight: 700,
              background: 'var(--acc)',
              color: '#fff',
              padding: '3px 9px',
              borderRadius: 20,
              display: 'inline-block',
              marginBottom: 8,
            }}>{selectedProject.category}</span>

            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', marginBottom: 10 }}>
              {selectedProject.title}
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
              {selectedProject.longDescription}
            </div>

            <div style={{
              background: 'var(--bg)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Résultats</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selectedProject.results}</div>
            </div>

            <div style={{
              background: 'var(--bg)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Équipe</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selectedProject.team}</div>
            </div>

            <button
              onClick={() => setSelectedProject(null)}
              style={{
                width: '100%',
                background: 'var(--acc)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '13px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}
