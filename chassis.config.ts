/**
 * SHIIDOCONNECT — CHASSIS CONFIG
 * ═══════════════════════════════════════════════════════════════
 * CE FICHIER EST LE SEUL À MODIFIER POUR CHAQUE NOUVEAU CLIENT.
 * Tout le reste du châssis est générique et réutilisable.
 * ═══════════════════════════════════════════════════════════════
 */

export const clinicConfig = {
  // ── Identité ─────────────────────────────────────────────────
  name:       "Clinique Sainte-Marie",
  shortName:  "Ste-Marie",           // affiché dans l'app installée
  tagline:    "Votre santé, notre priorité depuis 1998",
  description:"Clinique médicale moderne à Cocody, Abidjan. Consultations, urgences, maternité, laboratoire.",

  // ── Contact & localisation ────────────────────────────────────
  address:    "Rue des Jardins, Cocody, Abidjan",
  city:       "Abidjan",
  phone:      "+225 07 XX XX XX XX",
  whatsapp:   "+225 07 XX XX XX XX",
  email:      "contact@clinique-saintemarie.ci",
  mapUrl:     "https://maps.google.com/?q=Cocody+Abidjan",

  // ── Horaires ──────────────────────────────────────────────────
  hours: [
    { days: "Lundi – Vendredi", time: "7h00 – 20h00" },
    { days: "Samedi",           time: "7h00 – 18h00" },
    { days: "Dimanche",         time: "8h00 – 14h00 (Urgences)" },
  ],

  // ── Couleurs — SEUL endroit où changer le thème ───────────────
  accent:      "#1D9E75",   // vert médical — couleur principale
  accentDark:  "#0F6E56",   // version foncée
  accentLight: "#E1F5EE",   // version claire (backgrounds)
  gold:        "#C9A84C",   // accent luxe (titres, séparateurs)
  dark:        "#0a1628",   // fond hero sombre

  // ── Backend Medical ───────────────────────────────────────────
  clinic_id: 3,             // ID de la clinique dans ShidoMedical

  // ── Modules actifs (déactiver = masquer la section) ───────────
  features: {
    rdv:       true,   // prise de RDV en ligne
    queue:     true,   // file d'attente depuis le téléphone
    chat:      true,   // chat patient ↔ secrétaire
    dossier:   true,   // espace patient (ordonnances, factures)
    tracking:  true,   // suivi numéro file en temps réel
  },

  // ── Contenu vitrine ───────────────────────────────────────────
  stats: [
    { value: "15+",  label: "Médecins spécialistes" },
    { value: "5000+",label: "Patients suivis" },
    { value: "24h",  label: "Urgences disponibles" },
    { value: "98%",  label: "Satisfaction patients" },
  ],

  services: [
    { icon: "🩺", name: "Médecine Générale",    desc: "Consultations, bilans, certificats" },
    { icon: "👶", name: "Pédiatrie",            desc: "Suivi de l'enfant de 0 à 16 ans" },
    { icon: "🤱", name: "Maternité & Gynéco",   desc: "CPN, accouchement, suivi grossesse" },
    { icon: "🔬", name: "Laboratoire",          desc: "Analyses sanguines et biologiques" },
    { icon: "🫁", name: "Pneumologie",          desc: "Asthme, infections respiratoires" },
    { icon: "💊", name: "Pharmacie",            desc: "Médicaments disponibles sur place" },
    { icon: "🩻", name: "Imagerie Médicale",    desc: "Échographie, radiographie" },
    { icon: "🏥", name: "Hospitalisation",      desc: "Chambres individuelles et collectives" },
  ],

  // ── Témoignages ───────────────────────────────────────────────
  testimonials: [
    { name: "Aminata K.", text: "Service impeccable, personnel attentionné. Je recommande vivement.", stars: 5 },
    { name: "Kouamé T.", text: "La prise de RDV en ligne est très pratique. Plus d'attente inutile.", stars: 5 },
    { name: "Dr. Sandrine A.", text: "Les équipements sont modernes et le cadre est très professionnel.", stars: 5 },
  ],

  // ── Images (chemin relatif dans /public/images/) ──────────────
  // Si le fichier n'existe pas → fallback dégradé élégant automatique
  images: {
    hero:       "/images/hero.jpg",          // plein écran page d'accueil
    about:      "/images/about.jpg",         // section "à propos"
    team:       "/images/team.jpg",          // photo équipe
    building:   "/images/building.jpg",      // facade clinique
    interior:   "/images/interior.jpg",      // salle d'attente ou couloir
  },
} as const;

export type ClinicConfig = typeof clinicConfig;
