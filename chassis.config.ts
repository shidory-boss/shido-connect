/**
 * SHIDOCONNECT — CHASSIS CONFIG
 * ═══════════════════════════════════════════════════════════════
 * CE FICHIER EST LA SEULE SOURCE DE VÉRITÉ POUR LE DÉPLOIEMENT.
 *
 * Pour une nouvelle clinique :
 *   1. Copier le dossier shido-connect/
 *   2. Modifier .env.local (CLINIC_ID + API + ACCENT_COLOR + NOM)
 *   3. npm run build → déployer
 *
 * Toutes les autres données (logo, textes, services, témoignages,
 * horaires, features) viennent de l'API ShidoMedical via :
 *   GET /api/v1/pwa/config/{clinic_id}
 * ═══════════════════════════════════════════════════════════════
 */

export const clinicConfig = {
  // ── Identification (obligatoire — vient du .env.local) ───────
  clinic_id: Number(process.env.NEXT_PUBLIC_CLINIC_ID ?? 1),

  // ── Couleurs de démarrage (remplacées par l'API dès le 1er chargement) ──
  // Utilisées uniquement avant que l'API réponde (flash initial)
  accent:      process.env.NEXT_PUBLIC_ACCENT_COLOR ?? '#1D9E75',
  accentDark:  process.env.NEXT_PUBLIC_ACCENT_DARK  ?? '#0F6E56',
  accentLight: process.env.NEXT_PUBLIC_ACCENT_LIGHT ?? '#E1F5EE',
  gold:        process.env.NEXT_PUBLIC_GOLD_COLOR   ?? '#C9A84C',
  dark:        '#0a1628',  // fond hero sombre — identique pour tous

  // ── Infos de base (remplacées par l'API) ────────────────────
  name:        process.env.NEXT_PUBLIC_CLINIC_NAME  ?? 'Clinique',
  shortName:   process.env.NEXT_PUBLIC_CLINIC_SHORT ?? 'Clinique',
  tagline:     process.env.NEXT_PUBLIC_TAGLINE      ?? 'Votre santé, notre priorité',
  description: process.env.NEXT_PUBLIC_DESCRIPTION  ?? 'Clinique médicale moderne.',
  address:     process.env.NEXT_PUBLIC_ADDRESS      ?? '',
  city:        process.env.NEXT_PUBLIC_CITY         ?? 'Abidjan',
  phone:       process.env.NEXT_PUBLIC_PHONE        ?? '',
  whatsapp:    process.env.NEXT_PUBLIC_WHATSAPP     ?? '',
  email:       process.env.NEXT_PUBLIC_EMAIL        ?? '',
  mapUrl:      process.env.NEXT_PUBLIC_MAP_URL      ?? '',

  // ── Données vitrine de secours (remplacées par l'API) ────────
  // Utilisées uniquement si l'API est indisponible ET aucun cache
  hours: [
    { days: 'Lundi – Vendredi', time: '7h00 – 20h00' },
    { days: 'Samedi',           time: '7h00 – 18h00' },
    { days: 'Dimanche',         time: '8h00 – 14h00 (Urgences)' },
  ],
  stats: [
    { value: '10+', label: 'Médecins' },
    { value: '24h', label: 'Urgences' },
    { value: '98%', label: 'Satisfaction' },
    { value: '100%', label: 'Digital' },
  ],
  services: [
    { icon: '🩺', name: 'Médecine Générale',  desc: 'Consultations et bilans' },
    { icon: '👶', name: 'Pédiatrie',          desc: 'Suivi de l\'enfant' },
    { icon: '🔬', name: 'Laboratoire',        desc: 'Analyses biologiques' },
    { icon: '🚨', name: 'Urgences',           desc: '24h/24 — 7j/7' },
  ],
  testimonials: [
    { name: 'Patient', text: 'Service excellent.', stars: 5 },
  ],
  images: {
    hero:     process.env.NEXT_PUBLIC_HERO_IMAGE  ?? '/images/hero.jpg',
    about:    process.env.NEXT_PUBLIC_ABOUT_IMAGE ?? '/images/about.jpg',
    team:     process.env.NEXT_PUBLIC_TEAM_IMAGE  ?? '/images/team.jpg',
    building: '/images/building.jpg',
    interior: '/images/interior.jpg',
  },

  // ── Features actives par défaut ────────────────────────────────
  // Remplacées par les features enregistrées en DB via l'API
  features: {
    rdv:       true,
    queue:     true,
    chat:      true,
    dossier:   true,
    tracking:  true,
  },
} as const;

export type ClinicConfig = typeof clinicConfig;
