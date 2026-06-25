'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TeamMember {
  id: string
  firstName: string
  lastName: string
  title: string
  specialty: string
  bio: string
  available: boolean
  specialties: string[]
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    firstName: 'Amara',
    lastName: 'Koné',
    title: 'Médecin généraliste',
    specialty: 'Médecine générale',
    bio: 'Dr Koné exerce depuis plus de 15 ans en médecine générale. Passionné par la médecine préventive, il accompagne ses patients avec rigueur et bienveillance.',
    available: true,
    specialties: ['Médecine générale', 'Pédiatrie', 'Médecine du voyage'],
  },
  {
    id: '2',
    firstName: 'Émilie',
    lastName: 'Yao',
    title: 'Gynécologue-obstétricienne',
    specialty: 'Gynécologie',
    bio: 'Dr Yao est spécialisée en gynécologie et obstétrique depuis 10 ans. Elle assure un suivi personnalisé de la grossesse et de la santé féminine.',
    available: true,
    specialties: ['Gynécologie', 'Obstétrique', 'Planification familiale'],
  },
  {
    id: '3',
    firstName: 'Issouf',
    lastName: 'Traoré',
    title: 'Cardiologue',
    specialty: 'Cardiologie',
    bio: 'Dr Traoré est cardiologue interventionnel, formé à Paris et Abidjan. Il prend en charge les maladies cardiovasculaires avec une approche holistique.',
    available: false,
    specialties: ['Cardiologie', 'Échocardiographie', 'Holter ECG'],
  },
  {
    id: '4',
    firstName: 'Carine',
    lastName: 'Bamba',
    title: 'Pédiatre',
    specialty: 'Pédiatrie',
    bio: 'Dr Bamba accompagne les enfants de la naissance à l\'adolescence. Elle est reconnue pour sa douceur et sa capacité à mettre les jeunes patients à l\'aise.',
    available: true,
    specialties: ['Pédiatrie générale', 'Néonatologie', 'Vaccination'],
  },
]

function getInitials(member: TeamMember) {
  return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
}

const GRADIENT_PALETTES = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
]

export default function VitrineTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMember, setNewMember] = useState({ firstName: '', lastName: '', title: '', specialty: '' })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleAddMember = () => {
    if (!newMember.firstName || !newMember.lastName) return
    const member: TeamMember = {
      id: Date.now().toString(),
      ...newMember,
      bio: `${newMember.title} au sein de notre équipe.`,
      available: true,
      specialties: [newMember.specialty],
    }
    setMembers(prev => [...prev, member])
    setNewMember({ firstName: '', lastName: '', title: '', specialty: '' })
    setShowAddForm(false)
  }

  return (
    <div
      className="page-enter"
      style={{ minHeight: '100vh', background: 'var(--bg)' }}
    >
      {/* Header sticky */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '14px 18px',
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 20,
            color: 'var(--text-primary)',
            padding: '4px 8px',
            borderRadius: 8,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
          Notre équipe
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto' }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, textAlign: 'center' }}>
          Des professionnels qualifiés à votre service
        </p>

        {/* Grille 2 colonnes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          marginBottom: 20,
        }}>
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="card-enter"
              onClick={() => setSelectedMember(member)}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: 'var(--card)',
                borderRadius: 'var(--radius)',
                border: `1.5px solid ${hoveredId === member.id ? 'var(--accent)' : 'var(--card-border)'}`,
                padding: '16px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                transform: hoveredId === member.id ? 'translateY(-3px)' : 'none',
                transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                boxShadow: hoveredId === member.id ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
                animationDelay: `${idx * 80}ms`,
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: GRADIENT_PALETTES[idx % GRADIENT_PALETTES.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 800,
                color: '#fff',
                margin: '0 auto 10px',
              }}>
                {getInitials(member)}
              </div>

              {/* Nom */}
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>
                Dr {member.lastName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                {member.title}
              </div>

              {/* Badge disponibilité */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                color: member.available ? 'var(--success-color, #22c55e)' : 'var(--error-color, #ef4444)',
                background: member.available ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                borderRadius: 20,
                padding: '3px 8px',
              }}>
                {member.available ? '🟢' : '🔴'} {member.available ? 'Disponible' : 'Absent'}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton Ajouter */}
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            padding: '14px',
            border: '2px dashed var(--card-border)',
            borderRadius: 'var(--radius)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          + Ajouter un membre
        </button>

        {/* Formulaire ajout */}
        {showAddForm && (
          <div style={{
            marginTop: 16,
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius)',
            padding: 16,
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 12 }}>
              Nouveau membre
            </div>
            {[
              { key: 'firstName', label: 'Prénom' },
              { key: 'lastName', label: 'Nom' },
              { key: 'title', label: 'Titre / Fonction' },
              { key: 'specialty', label: 'Spécialité' },
            ].map(field => (
              <input
                key={field.key}
                placeholder={field.label}
                value={newMember[field.key as keyof typeof newMember]}
                onChange={e => setNewMember(prev => ({ ...prev, [field.key]: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: 8,
                  border: '1px solid var(--card-border)',
                  borderRadius: 8,
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  boxSizing: 'border-box',
                }}
              />
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={handleAddMember}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal détail */}
      {selectedMember && (
        <div
          onClick={() => setSelectedMember(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--card)',
              borderRadius: '20px 20px 0 0',
              padding: '24px 20px',
              width: '100%',
              maxWidth: 500,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            {/* Handle */}
            <div style={{
              width: 40,
              height: 4,
              background: 'var(--card-border)',
              borderRadius: 2,
              margin: '-8px auto 20px',
            }} />

            {/* Avatar grand */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: GRADIENT_PALETTES[members.indexOf(selectedMember) % GRADIENT_PALETTES.length],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              margin: '0 auto 16px',
            }}>
              {getInitials(selectedMember)}
            </div>

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)' }}>
                Dr {selectedMember.firstName} {selectedMember.lastName}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                {selectedMember.title}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                color: selectedMember.available ? 'var(--success-color, #22c55e)' : 'var(--error-color, #ef4444)',
                background: selectedMember.available ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                borderRadius: 20,
                padding: '4px 10px',
                marginTop: 8,
              }}>
                {selectedMember.available ? '🟢 Disponible' : '🔴 Absent'}
              </div>
            </div>

            {/* Bio */}
            <div style={{
              background: 'var(--bg)',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 14,
            }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Biographie
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                {selectedMember.bio}
              </p>
            </div>

            {/* Spécialités */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Spécialités
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedMember.specialties.map(s => (
                  <span key={s} style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--accent)',
                    background: 'rgba(var(--accent-rgb, 99,102,241),0.1)',
                    borderRadius: 20,
                    padding: '4px 10px',
                    border: '1px solid var(--accent)',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link href="/booking" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                padding: '14px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                Prendre RDV →
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
