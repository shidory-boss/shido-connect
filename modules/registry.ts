// Registre central — chaque module = { key, label, icon, color, path, widget }
// Chaque clinique active/désactive librement via PWAConfig.active_modules[]

export interface PWAModule {
  key: string
  label: string
  icon: string
  color: string       // couleur accent du module
  gradient: string    // gradient card
  path: string        // route dans l'app
  description: string // affiché dans le home
  category: 'core' | 'care' | 'finance' | 'communication' | 'extra' | 'vitrine' | 'util'
  isPremium?: boolean
}

export const ALL_MODULES: PWAModule[] = [
  // ── CORE ──────────────────────────────────────────────
  { key:'pwa_booking',             label:'Rendez-vous',          icon:'📅', color:'#1D9E75', gradient:'linear-gradient(135deg,#1D9E75,#0F6E56)', path:'/booking',              description:'Prendre et gérer vos RDV',           category:'core' },
  { key:'pwa_queue_status',        label:'File d\'attente',       icon:'🎫', color:'#378ADD', gradient:'linear-gradient(135deg,#378ADD,#1D4ED8)', path:'/queue',                description:'Suivre votre position en temps réel', category:'core' },
  { key:'pwa_records',             label:'Mon dossier',           icon:'📋', color:'#7C3AED', gradient:'linear-gradient(135deg,#7C3AED,#5B21B6)', path:'/records',              description:'Historique médical complet',           category:'care' },
  { key:'pwa_documents',           label:'Mes documents',         icon:'📄', color:'#0891B2', gradient:'linear-gradient(135deg,#0891B2,#164E63)', path:'/documents',            description:'Ordonnances & résultats PDF',          category:'care' },
  // ── CARE ──────────────────────────────────────────────
  { key:'pwa_teleconsult',         label:'Téléconsultation',      icon:'🎥', color:'#DC2626', gradient:'linear-gradient(135deg,#DC2626,#991B1B)', path:'/teleconsult',          description:'Consulter en vidéo depuis chez vous',  category:'care' },
  { key:'pwa_lab_results',         label:'Résultats labo',        icon:'🔬', color:'#059669', gradient:'linear-gradient(135deg,#059669,#064E3B)', path:'/lab-results',          description:'Résultats d\'analyses en temps réel',  category:'care' },
  { key:'pwa_medication_reminders',label:'Rappels médicaments',   icon:'💊', color:'#D97706', gradient:'linear-gradient(135deg,#D97706,#92400E)', path:'/medication-reminders', description:'Rappels de prise de médicaments',     category:'care' },
  { key:'pwa_pharmacy',            label:'Pharmacie',             icon:'🏪', color:'#16A34A', gradient:'linear-gradient(135deg,#16A34A,#14532D)', path:'/pharmacy',             description:'Commander vos médicaments',            category:'care' },
  { key:'pwa_emergency',           label:'Urgences / SOS',        icon:'🚨', color:'#EF4444', gradient:'linear-gradient(135deg,#EF4444,#B91C1C)', path:'/emergency',            description:'Contact urgences & SOS clinique',     category:'care' },
  // ── FINANCE ───────────────────────────────────────────
  { key:'pwa_payment',             label:'Paiements',             icon:'💳', color:'#F59E0B', gradient:'linear-gradient(135deg,#F59E0B,#B45309)', path:'/payment',              description:'Factures et paiements Mobile Money',  category:'finance' },
  { key:'pwa_loyalty',             label:'Fidélité',              icon:'⭐', color:'#FBBF24', gradient:'linear-gradient(135deg,#FBBF24,#D97706)', path:'/loyalty',              description:'Vos points et récompenses',           category:'finance' },
  { key:'pwa_referral',            label:'Parrainage',            icon:'🎁', color:'#EC4899', gradient:'linear-gradient(135deg,#EC4899,#BE185D)', path:'/referral',             description:'Parrainer un proche, gagner des points',category:'finance' },
  // ── COMMUNICATION ─────────────────────────────────────
  { key:'pwa_chat',                label:'Messagerie',            icon:'💬', color:'#8B5CF6', gradient:'linear-gradient(135deg,#8B5CF6,#6D28D9)', path:'/chat',                 description:'Contacter la clinique directement',   category:'communication' },
  { key:'pwa_feedback',            label:'Avis & Satisfaction',   icon:'✍️', color:'#6366F1', gradient:'linear-gradient(135deg,#6366F1,#4338CA)', path:'/feedback',             description:'Donner votre avis post-consultation', category:'communication' },
  { key:'pwa_notifications',       label:'Notifications',         icon:'🔔', color:'#14B8A6', gradient:'linear-gradient(135deg,#14B8A6,#0F766E)', path:'/notifications',        description:'Toutes vos alertes et rappels',       category:'communication' },
  // ── VITRINE ───────────────────────────────────────────
  { key:'vitrine_hero',            label:'Section Hero',          icon:'🎯', color:'#6366F1', gradient:'linear-gradient(135deg,#6366F1,#4338CA)', path:'/vitrine/hero',            description:'Bannière principale de la vitrine',    category:'vitrine', isPremium:false },
  { key:'vitrine_about',           label:'À propos',              icon:'🏥', color:'#0891B2', gradient:'linear-gradient(135deg,#0891B2,#164E63)', path:'/vitrine/about',           description:'Présentation de la structure',         category:'vitrine', isPremium:false },
  { key:'vitrine_services',        label:'Nos services',          icon:'⚕️', color:'#1D9E75', gradient:'linear-gradient(135deg,#1D9E75,#0F6E56)', path:'/vitrine/services',        description:'Liste des services proposés',          category:'vitrine', isPremium:false },
  { key:'vitrine_gallery',         label:'Galerie photos',        icon:'🖼️', color:'#7C3AED', gradient:'linear-gradient(135deg,#7C3AED,#5B21B6)', path:'/vitrine/gallery',         description:'Galerie d\'images de la structure',   category:'vitrine', isPremium:false },
  { key:'vitrine_team',            label:'Notre équipe',          icon:'👨‍⚕️', color:'#2563EB', gradient:'linear-gradient(135deg,#2563EB,#1E40AF)', path:'/vitrine/team',            description:'Présentation de l\'équipe médicale',  category:'vitrine', isPremium:false },
  { key:'vitrine_testimonials',    label:'Témoignages',           icon:'💬', color:'#D97706', gradient:'linear-gradient(135deg,#D97706,#92400E)', path:'/vitrine/testimonials',    description:'Avis et témoignages des patients',    category:'vitrine', isPremium:false },
  { key:'vitrine_partners',        label:'Partenaires',           icon:'🤝', color:'#059669', gradient:'linear-gradient(135deg,#059669,#064E3B)', path:'/vitrine/partners',        description:'Logos et liens des partenaires',      category:'vitrine', isPremium:false },
  { key:'vitrine_faq',             label:'FAQ',                   icon:'❓', color:'#F59E0B', gradient:'linear-gradient(135deg,#F59E0B,#B45309)', path:'/vitrine/faq',             description:'Questions fréquemment posées',        category:'vitrine', isPremium:false },
  { key:'vitrine_pricing',         label:'Tarifs',                icon:'💰', color:'#16A34A', gradient:'linear-gradient(135deg,#16A34A,#14532D)', path:'/vitrine/pricing',         description:'Grille tarifaire des consultations',  category:'vitrine', isPremium:false },
  { key:'vitrine_awards',          label:'Récompenses',           icon:'🏆', color:'#FBBF24', gradient:'linear-gradient(135deg,#FBBF24,#D97706)', path:'/vitrine/awards',          description:'Prix, distinctions et accréditations', category:'vitrine', isPremium:false },
  { key:'vitrine_timeline',        label:'Notre histoire',        icon:'📅', color:'#8B5CF6', gradient:'linear-gradient(135deg,#8B5CF6,#6D28D9)', path:'/vitrine/timeline',        description:'Chronologie et jalons de la structure', category:'vitrine', isPremium:false },
  { key:'vitrine_portfolio',       label:'Portfolio',             icon:'📁', color:'#EC4899', gradient:'linear-gradient(135deg,#EC4899,#BE185D)', path:'/vitrine/portfolio',       description:'Réalisations et cas cliniques',       category:'vitrine', isPremium:false },
  { key:'vitrine_blog',            label:'Blog / Actualités',     icon:'📰', color:'#6366F1', gradient:'linear-gradient(135deg,#6366F1,#4338CA)', path:'/vitrine/blog',            description:'Articles et actualités de la structure', category:'vitrine', isPremium:false },
  { key:'vitrine_press',           label:'Revue de presse',       icon:'📢', color:'#DC2626', gradient:'linear-gradient(135deg,#DC2626,#991B1B)', path:'/vitrine/press',           description:'Mentions et articles de presse',     category:'vitrine', isPremium:false },
  { key:'vitrine_video_bg',        label:'Vidéo d\'ambiance',     icon:'🎬', color:'#0F172A', gradient:'linear-gradient(135deg,#334155,#0F172A)', path:'/vitrine/video-bg',        description:'Fond vidéo animé pour la vitrine',   category:'vitrine', isPremium:false },
  { key:'vitrine_countdown',       label:'Compte à rebours',      icon:'⏳', color:'#EF4444', gradient:'linear-gradient(135deg,#EF4444,#B91C1C)', path:'/vitrine/countdown',       description:'Minuteur pour événement ou ouverture', category:'vitrine', isPremium:false },
  // ── UTIL ──────────────────────────────────────────────
  { key:'util_notifications',    label:'Notifications push',     icon:'🔔', color:'#3B82F6', gradient:'linear-gradient(135deg,#3B82F6,#1D4ED8)', path:'/util/notifications',    description:'Gestion des notifications push',             category:'util' },
  { key:'util_chat_support',     label:'Chat support',           icon:'💬', color:'#8B5CF6', gradient:'linear-gradient(135deg,#8B5CF6,#6D28D9)', path:'/util/chat-support',     description:'Chat en direct avec le support',              category:'util' },
  { key:'util_feedback',         label:'Feedback',               icon:'✍️', color:'#6366F1', gradient:'linear-gradient(135deg,#6366F1,#4338CA)', path:'/util/feedback',         description:'Collecter les retours utilisateurs',          category:'util' },
  { key:'util_contact',          label:'Contact',                icon:'📞', color:'#0EA5E9', gradient:'linear-gradient(135deg,#0EA5E9,#0284C7)', path:'/util/contact',          description:'Formulaire de contact rapide',                category:'util' },
  { key:'util_map',              label:'Carte & itinéraire',     icon:'🗺️', color:'#14B8A6', gradient:'linear-gradient(135deg,#14B8A6,#0F766E)', path:'/util/map',              description:'Localisation et itinéraire vers la clinique', category:'util' },
  { key:'util_qr_scanner',       label:'Scanner QR',             icon:'📷', color:'#64748B', gradient:'linear-gradient(135deg,#64748B,#334155)', path:'/util/qr-scanner',       description:'Scanner un QR code depuis l\'app',            category:'util' },
  { key:'util_barcode',          label:'Code-barres',            icon:'📊', color:'#475569', gradient:'linear-gradient(135deg,#475569,#1E293B)', path:'/util/barcode',          description:'Lecture de codes-barres produits/ordonnances', category:'util' },
  { key:'util_offline_mode',     label:'Mode hors-ligne',        icon:'📶', color:'#94A3B8', gradient:'linear-gradient(135deg,#94A3B8,#64748B)', path:'/util/offline-mode',     description:'Accès aux données sans connexion',            category:'util' },
  { key:'util_multi_lang',       label:'Multi-langue',           icon:'🌍', color:'#2563EB', gradient:'linear-gradient(135deg,#2563EB,#1E40AF)', path:'/util/multi-lang',       description:'Basculer la langue de l\'interface',          category:'util' },
  { key:'util_dark_mode',        label:'Mode sombre',            icon:'🌙', color:'#1E293B', gradient:'linear-gradient(135deg,#334155,#0F172A)', path:'/util/dark-mode',        description:'Activer/désactiver le thème sombre',          category:'util' },
  { key:'util_accessibility',    label:'Accessibilité',          icon:'♿', color:'#7C3AED', gradient:'linear-gradient(135deg,#7C3AED,#5B21B6)', path:'/util/accessibility',    description:'Options d\'accessibilité (taille, contraste)',  category:'util' },
  { key:'util_share',            label:'Partage',                icon:'📤', color:'#0891B2', gradient:'linear-gradient(135deg,#0891B2,#164E63)', path:'/util/share',            description:'Partager documents et informations',          category:'util' },
  { key:'util_pdf_export',       label:'Export PDF',             icon:'📑', color:'#DC2626', gradient:'linear-gradient(135deg,#DC2626,#991B1B)', path:'/util/pdf-export',       description:'Exporter n\'importe quelle vue en PDF',       category:'util' },
  { key:'util_calendar_sync',    label:'Sync agenda',            icon:'📆', color:'#1D9E75', gradient:'linear-gradient(135deg,#1D9E75,#0F6E56)', path:'/util/calendar-sync',    description:'Synchroniser les RDV avec l\'agenda natif',   category:'util' },
  { key:'util_2fa',              label:'Double authentification',icon:'🔐', color:'#4F46E5', gradient:'linear-gradient(135deg,#4F46E5,#3730A3)', path:'/util/2fa',              description:'Activer la 2FA pour sécuriser le compte',     category:'util', isPremium:true },
  { key:'util_biometric',        label:'Biométrie',              icon:'👆', color:'#0F766E', gradient:'linear-gradient(135deg,#0F766E,#134E4A)', path:'/util/biometric',        description:'Connexion par empreinte ou Face ID',          category:'util', isPremium:true },
  { key:'util_onboarding_tour',  label:'Visite guidée',          icon:'🧭', color:'#F59E0B', gradient:'linear-gradient(135deg,#F59E0B,#B45309)', path:'/util/onboarding-tour',  description:'Tour interactif de l\'application',           category:'util' },
  { key:'util_search',           label:'Recherche globale',      icon:'🔍', color:'#6366F1', gradient:'linear-gradient(135deg,#6366F1,#4338CA)', path:'/util/search',           description:'Rechercher dans tout le contenu de l\'app',  category:'util' },
  { key:'util_filter_sort',      label:'Filtres & tri',          icon:'⚙️', color:'#64748B', gradient:'linear-gradient(135deg,#64748B,#334155)', path:'/util/filter-sort',      description:'Filtres et tri avancés sur les listes',       category:'util' },
  { key:'util_infinite_scroll',  label:'Défilement infini',      icon:'♾️', color:'#8B5CF6', gradient:'linear-gradient(135deg,#8B5CF6,#6D28D9)', path:'/util/infinite-scroll',  description:'Chargement continu des listes longues',       category:'util' },
  { key:'util_widget_home',      label:'Widget accueil',         icon:'🏠', color:'#14B8A6', gradient:'linear-gradient(135deg,#14B8A6,#0F766E)', path:'/util/widget-home',      description:'Widget personnalisable sur l\'écran d\'accueil', category:'util' },
]

export function getModule(key: string): PWAModule | undefined {
  return ALL_MODULES.find(m => m.key === key)
}

export function getActiveModules(activeKeys: string[]): PWAModule[] {
  return activeKeys
    .map(k => ALL_MODULES.find(m => m.key === k))
    .filter(Boolean) as PWAModule[]
}
