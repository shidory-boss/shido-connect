import type { PWAModuleManifest } from '@/lib/types'

// ─── CATALOGUE OFFICIEL DES MODULES PWA SHIDOOS ───────────────────────────────
// Chaque module déclaré ici est un atome. ShidoStudio les assemble.
// Un module absent d'ici n'existe pas dans l'écosystème.

export const PWA_MODULE_REGISTRY: Record<string, PWAModuleManifest> = {

  // ── RENDEZ-VOUS ─────────────────────────────────────────────────────────────
  pwa_booking: {
    key: 'pwa_booking',
    name: 'Prise de RDV',
    description: 'Le patient prend, modifie et annule ses rendez-vous en ligne.',
    icon: '📅',
    version: '1.0.0',
    price: 15000,
    avions: ['shido-medical', 'shido-biz', 'shido-vision'],
    avironModulePair: 'rdv',
    navItem: { label: 'RDV', href: '/booking', position: 2 },
    homeWidget: true,
    homeWidgetOrder: 1,
    homeWidgetSize: 'medium',
    settings: [
      { key: 'max_advance_days', type: 'number', label: 'Réserver jusqu\'à X jours à l\'avance', default: 30, min: 1, max: 90 },
      { key: 'show_doctor_photo', type: 'boolean', label: 'Afficher les photos des médecins', default: true },
      { key: 'allow_cancel', type: 'boolean', label: 'Autoriser l\'annulation par le patient', default: true },
      { key: 'cancel_delay_hours', type: 'number', label: 'Délai min avant annulation (heures)', default: 24, min: 1, max: 72 },
    ],
  },

  // ── FILE D'ATTENTE ──────────────────────────────────────────────────────────
  pwa_queue_status: {
    key: 'pwa_queue_status',
    name: 'File d\'attente',
    description: 'Position en temps réel dans la file. Check-in QR code à l\'arrivée.',
    icon: '🎫',
    version: '1.0.0',
    price: 8000,
    avions: ['shido-medical', 'shido-vision'],
    avironModulePair: 'queue',
    navItem: { label: 'Messages', href: '/chat', position: 3 }, // aliased → pwa_chat
    homeWidget: true,
    homeWidgetOrder: 2,
    homeWidgetSize: 'small',
    settings: [
      { key: 'show_estimated_wait', type: 'boolean', label: 'Afficher le temps d\'attente estimé', default: true },
      { key: 'enable_qr_checkin', type: 'boolean', label: 'Activer le check-in QR code', default: true },
      { key: 'refresh_interval_seconds', type: 'number', label: 'Rafraîchissement (secondes)', default: 30, min: 10, max: 120 },
    ],
  },

  // ── CHAT INTERNE ────────────────────────────────────────────────────────────
  pwa_chat: {
    key: 'pwa_chat',
    name: 'Messagerie',
    description: 'Canal direct patient ↔ clinique. Livraison de résultats, ordonnances, devis et factures.',
    icon: '💬',
    version: '1.0.0',
    price: 12000,
    avions: ['*'],
    avironModulePair: 'chat_interne',
    navItem: { label: 'Messages', href: '/chat', position: 4 },
    homeWidget: true,
    homeWidgetOrder: 3,
    homeWidgetSize: 'small',
    settings: [
      { key: 'allow_patient_create_thread', type: 'boolean', label: 'Le patient peut créer une conversation', default: true },
      { key: 'notification_sound', type: 'boolean', label: 'Son de notification nouveau message', default: true },
    ],
  },

  // ── MON DOSSIER ─────────────────────────────────────────────────────────────
  pwa_records: {
    key: 'pwa_records',
    name: 'Mon Dossier',
    description: 'Accès aux consultations récentes, ordonnances et résultats.',
    icon: '📋',
    version: '1.0.0',
    price: 10000,
    avions: ['shido-medical', 'shido-vision'],
    avironModulePair: 'patients',
    navItem: { label: 'Dossier', href: '/records', position: 5 },
    homeWidget: false,
    settings: [
      { key: 'show_consultations', type: 'boolean', label: 'Afficher les consultations', default: true },
      { key: 'show_prescriptions', type: 'boolean', label: 'Afficher les ordonnances', default: true },
      { key: 'show_lab_results', type: 'boolean', label: 'Afficher les résultats labo', default: true },
      { key: 'history_months', type: 'number', label: 'Historique visible (mois)', default: 12, min: 1, max: 36 },
    ],
  },

  // ── PAIEMENT ────────────────────────────────────────────────────────────────
  pwa_payment: {
    key: 'pwa_payment',
    name: 'Paiement en ligne',
    description: 'Payer les factures via Wave, Orange Money ou MTN MoMo.',
    icon: '💳',
    version: '1.0.0',
    price: 18000,
    avions: ['shido-medical', 'shido-biz', 'shido-vision'],
    avironModulePair: 'facturation',
    navItem: { label: 'Payer', href: '/payment', position: 6 },
    homeWidget: true,
    homeWidgetOrder: 4,
    homeWidgetSize: 'small',
    settings: [
      { key: 'wave_enabled', type: 'boolean', label: 'Activer Wave', default: true },
      { key: 'orange_money_enabled', type: 'boolean', label: 'Activer Orange Money', default: true },
      { key: 'mtn_momo_enabled', type: 'boolean', label: 'Activer MTN MoMo', default: false },
    ],
  },

  // ── DOCUMENTS ───────────────────────────────────────────────────────────────
  pwa_documents: {
    key: 'pwa_documents',
    name: 'Mes Documents',
    description: 'Télécharger ordonnances, bilans, certificats et images médicales.',
    icon: '📄',
    version: '1.0.0',
    price: 8000,
    avions: ['shido-medical', 'shido-vision'],
    avironModulePair: 'ordonnances',
    navItem: { label: 'Docs', href: '/documents', position: 7 },
    homeWidget: false,
    settings: [
      { key: 'allow_download', type: 'boolean', label: 'Autoriser le téléchargement PDF', default: true },
      { key: 'show_images', type: 'boolean', label: 'Afficher les images médicales', default: true },
    ],
  },

  // ── RAPPELS MÉDICAMENTS ─────────────────────────────────────────────────────
  pwa_medication_reminders: {
    key: 'pwa_medication_reminders',
    name: 'Rappels Médicaments',
    description: 'Alarmes personnalisées pour chaque traitement du patient.',
    icon: '💊',
    version: '1.0.0',
    price: 6000,
    avions: ['shido-medical'],
    avironModulePair: 'pharmacie',
    navItem: { label: 'Traitements', href: '/pharmacy', position: 8 },
    homeWidget: true,
    homeWidgetOrder: 5,
    homeWidgetSize: 'small',
    settings: [
      { key: 'default_reminder_minutes_before', type: 'number', label: 'Rappel X min avant la prise', default: 15, min: 0, max: 60 },
    ],
  },

  // ── TÉLÉCONSULTATION ────────────────────────────────────────────────────────
  pwa_teleconsult: {
    key: 'pwa_teleconsult',
    name: 'Téléconsultation',
    description: 'Consultation vidéo sécurisée depuis le téléphone du patient.',
    icon: '🎥',
    version: '1.0.0',
    price: 25000,
    avions: ['shido-medical', 'shido-vision'],
    avironModulePair: 'teleconsultation',
    navItem: { label: 'Téléconsult', href: '/teleconsult', position: 9 },
    homeWidget: false,
    settings: [
      { key: 'show_waiting_room', type: 'boolean', label: 'Afficher la salle d\'attente virtuelle', default: true },
    ],
  },

  // ── FIDÉLITÉ ────────────────────────────────────────────────────────────────
  pwa_loyalty: {
    key: 'pwa_loyalty',
    name: 'Programme Fidélité',
    description: 'Points cumulés, avantages et historique des récompenses.',
    icon: '⭐',
    version: '1.0.0',
    price: 10000,
    avions: ['shido-medical', 'shido-biz'],
    avironModulePair: 'fidelite_points',
    navItem: { label: 'Fidélité', href: '/feedback', position: 10 },
    homeWidget: true,
    homeWidgetOrder: 6,
    homeWidgetSize: 'small',
    settings: [
      { key: 'points_label', type: 'text', label: 'Nom des points', default: 'points' },
      { key: 'show_leaderboard', type: 'boolean', label: 'Afficher le classement', default: false },
    ],
  },

  // ── AVIS & FEEDBACK ─────────────────────────────────────────────────────────
  pwa_feedback: {
    key: 'pwa_feedback',
    name: 'Avis & Satisfaction',
    description: 'Donner un avis après chaque consultation. Aucun jumeau avion.',
    icon: '⭐',
    version: '1.0.0',
    price: 5000,
    avions: ['*'],
    navItem: { label: 'Avis', href: '/feedback', position: 11 },
    homeWidget: false,
    settings: [
      { key: 'ask_after_days', type: 'number', label: 'Demander un avis X jours après consultation', default: 1, min: 0, max: 7 },
      { key: 'show_public_reviews', type: 'boolean', label: 'Afficher les avis publics', default: true },
    ],
  },

}

// Helper — liste des modules avec navItem pour construire la bottom nav
export function getNavModules(activeKeys: string[]): PWAModuleManifest[] {
  return activeKeys
    .map(k => PWA_MODULE_REGISTRY[k])
    .filter(m => m && m.navItem)
    .sort((a, b) => (a.navItem!.position) - (b.navItem!.position))
}

// Helper — liste des modules avec homeWidget pour construire la page home
export function getHomeWidgets(activeKeys: string[]): PWAModuleManifest[] {
  return activeKeys
    .map(k => PWA_MODULE_REGISTRY[k])
    .filter(m => m && m.homeWidget)
    .sort((a, b) => (a.homeWidgetOrder || 99) - (b.homeWidgetOrder || 99))
}
