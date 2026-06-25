# ShidoConnect — Marketplace des Modules

> Chaque module = widget (card home) + page complète.
> Activables par clinique via ShidoStudio → publish → pwa_configs.active_modules[]

---

## ✅ MODULES CONSTRUITS (52)

### 🏥 Santé & Médical (15) — category: `core` / `care` / `finance` / `communication`

| Clé | Label | Icône | Route | Description |
|-----|-------|-------|-------|-------------|
| pwa_booking | Rendez-vous | 📅 | /booking | Prise et gestion RDV |
| pwa_queue_status | File d'attente | 🎫 | /queue | Position temps réel |
| pwa_records | Mon dossier | 📋 | /records | Historique médical complet |
| pwa_documents | Mes documents | 📄 | /documents | Ordonnances & résultats PDF |
| pwa_teleconsult | Téléconsultation | 🎥 | /teleconsult | Vidéo consultation |
| pwa_lab_results | Résultats labo | 🔬 | /lab-results | Analyses en temps réel |
| pwa_medication_reminders | Rappels médicaments | 💊 | /medication-reminders | Rappels de prise |
| pwa_pharmacy | Pharmacie | 🏪 | /pharmacy | Commander médicaments |
| pwa_emergency | Urgences / SOS | 🚨 | /emergency | Contact urgences + alerte SOS |
| pwa_payment | Paiements | 💳 | /payment | Factures Mobile Money |
| pwa_loyalty | Fidélité | ⭐ | /loyalty | Points et récompenses |
| pwa_referral | Parrainage | 🎁 | /referral | Parrainer un proche |
| pwa_chat | Messagerie | 💬 | /chat | Contact clinique direct + draft persisté |
| pwa_feedback | Avis & Satisfaction | ✍️ | /feedback | Avis post-consultation |
| pwa_notifications | Notifications | 🔔 | /notifications | Alertes et rappels |

### 🏪 Vitrine & Branding (16) — category: `vitrine`

| Clé | Label | Icône | Route | Fonctionnalités clés |
|-----|-------|-------|-------|---------------------|
| vitrine_hero | Section Hero | 🎯 | /vitrine/hero | Preview live, gradient animé, CTA éditables |
| vitrine_about | À propos | ℹ️ | /vitrine/about | Histoire, mission, valeurs chips |
| vitrine_services | Nos services | ⚙️ | /vitrine/services | Grille éditable, ajout/suppression dynamique |
| vitrine_gallery | Galerie photos | 🖼️ | /vitrine/gallery | Masonry 3 cols, lightbox, filtres catégories |
| vitrine_team | Notre équipe | 👥 | /vitrine/team | Cards membres, modal détail, lien RDV |
| vitrine_testimonials | Avis clients | ⭐ | /vitrine/testimonials | Rating distribution, carousel, formulaire avis |
| vitrine_partners | Partenaires | 🤝 | /vitrine/partners | Grille logos, hover accent |
| vitrine_faq | FAQ | ❓ | /vitrine/faq | Accordéon, recherche live, tabs catégories |
| vitrine_pricing | Nos tarifs | 💰 | /vitrine/pricing | 3 plans comparatifs, plan recommandé mis en avant |
| vitrine_awards | Certifications | 🏆 | /vitrine/awards | Timeline certifications, KPI animés compteur |
| vitrine_timeline | Notre histoire | 📅 | /vitrine/timeline | Timeline alternée, IntersectionObserver |
| vitrine_portfolio | Réalisations | 💼 | /vitrine/portfolio | Grid filtrable, modal détail projet |
| vitrine_blog | Blog | 📝 | /vitrine/blog | Recherche, catégories, modal article complet |
| vitrine_press | Presse | 📰 | /vitrine/press | Cards médias, logos grayscale→couleur hover |
| vitrine_video_bg | Vidéo présentation | 🎬 | /vitrine/video | Player simulé + embed YouTube/Vimeo |
| vitrine_countdown | Compte à rebours | ⏳ | /vitrine/countdown | Décompte live setInterval, date configurable |

### 🔧 Utilitaires Transversaux (21) — category: `util`

| Clé | Label | Icône | Route | Fonctionnalités clés |
|-----|-------|-------|-------|---------------------|
| util_notifications | Notifications push | 🔔 | /util/notifications | Permission API, test notif live |
| util_chat_support | Support client | 💬 | /util/chat-support | WhatsApp-style + bot quick reply + FAQ |
| util_feedback | Avis & Feedback | ✍️ | /util/feedback | Wizard 4 étapes, étoiles cliquables, successPop |
| util_contact | Contact | 📍 | /util/contact | Carte simulée, formulaire, réseaux sociaux |
| util_map | Carte interactive | 🗺️ | /util/map | GPS itinéraire, navigator.geolocation |
| util_qr_scanner | Scanner QR | 📷 | /util/qr-scanner | Viewfinder animé, getUserMedia caméra |
| util_barcode | Scanner code-barres | 📊 | /util/barcode | Scan line rouge animée, historique scans |
| util_offline_mode | Mode hors-ligne | 📡 | /util/offline | navigator.onLine live events, sync |
| util_multi_lang | Multilingue | 🌍 | /util/language | FR/EN actifs — Dioula/Bété/Baoulé bientôt |
| util_dark_mode | Thème | ☀️ | /util/theme | Previews thème, accent picker 8 couleurs, taille texte |
| util_accessibility | Accessibilité | ♿ | /util/accessibility | Taille texte, contraste élevé, animations réduites |
| util_share | Partager | 📤 | /util/share | navigator.share natif, 6 plateformes |
| util_pdf_export | Export PDF | 📄 | /util/pdf-export | 5 types docs, date range, loading simulé |
| util_calendar_sync | Sync Agenda | 📆 | /util/calendar | Google Calendar / Apple / Outlook |
| util_2fa | Double auth 2FA | 🔐 | /util/2fa | SMS / TOTP / Email flow complet |
| util_biometric | Biométrie | 👆 | /util/biometric | WebAuthn, empreinte animée pulsante |
| util_onboarding_tour | Guide démarrage | 🎯 | /util/onboarding-tour | 6 étapes, confetti CSS, persisté localStorage |
| util_search | Recherche globale | 🔍 | /util/search | Debounce 300ms, résultats groupés, recents |
| util_filter_sort | Filtres avancés | ⚙️ | /util/filters | Multi-critères, tri asc/desc, résultats live |
| util_infinite_scroll | Chargement infini | ♾️ | /util/infinite-scroll | IntersectionObserver, skeleton loader |
| util_widget_home | Widget écran d'accueil | 📱 | /util/widget-home | iOS/Android install steps, beforeinstallprompt |

---

## 📋 SECTEURS RESTANTS À CONSTRUIRE (145 modules)

### 🛒 E-Commerce & Retail (20) — category: `ecom`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| ecom_catalog | Catalogue produits | 🛍️ | Catalogue avec filtres, recherche, tri |
| ecom_product_detail | Fiche produit | 📦 | Galerie, variantes (taille/couleur), stock |
| ecom_cart | Panier | 🛒 | Panier d'achat, quantités, total |
| ecom_checkout | Commande | 💳 | Tunnel commande, adresse, paiement |
| ecom_payment | Paiement | 💰 | Mobile Money MTN/Orange, carte, virement |
| ecom_orders | Mes commandes | 📋 | Suivi statut commandes client |
| ecom_wishlist | Favoris | ❤️ | Liste de souhaits, partage |
| ecom_reviews | Avis produits | ⭐ | Notes, commentaires, photos |
| ecom_promo | Promotions | 🏷️ | Codes promo, coupons, réductions |
| ecom_flash_sale | Ventes flash | ⚡ | Compte à rebours + stock limité visible |
| ecom_bundle | Packs & Bundles | 📦 | Offres groupées, prix réduit |
| ecom_loyalty | Fidélité | 🌟 | Programme points, paliers, récompenses |
| ecom_referral_code | Parrainage | 🎁 | Code parrainage, suivi gains |
| ecom_affiliate | Affiliés | 🔗 | Réseau affiliés, dashboard commissions |
| ecom_returns | Retours & SAV | 🔄 | Demande retour, suivi remboursement |
| ecom_stock_alert | Alerte stock | 🔔 | Notification retour en stock |
| ecom_size_guide | Guide des tailles | 📏 | Tableau tailles, mesures |
| ecom_compare | Comparateur | ⚖️ | Comparer 2-3 produits côte à côte |
| ecom_recently_viewed | Récemment vu | 👁️ | Historique produits consultés |
| ecom_subscription | Abonnement livraison | 🔄 | Commande récurrente hebdo/mensuel |

### 🔍 SEO & Marketing Digital (15) — category: `seo`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| seo_landing | Landing page SEO | 🎯 | Page optimisée conversion |
| seo_sitemap | Sitemap dynamique | 🗺️ | Génération automatique XML |
| seo_schema | Schémas JSON-LD | 📊 | LocalBusiness, Product, FAQ... |
| seo_og_preview | Open Graph | 📱 | Prévisualisation partage réseaux |
| seo_analytics | Analytics dashboard | 📈 | Visites, conversions, bounce rate |
| seo_heatmap | Carte de chaleur | 🔥 | Visualisation zones de clics |
| seo_ab_test | Test A/B | 🧪 | Comparer 2 versions de page |
| seo_popup_lead | Pop-up capture | 📧 | Capture email avec incentive |
| seo_exit_intent | Exit intent | 🚪 | Pop-up intention de sortie |
| seo_newsletter | Newsletter | 📨 | Inscription, gestion listes |
| seo_cookie_banner | Cookies RGPD | 🍪 | Bannière consentement conforme |
| seo_breadcrumb | Fil d'Ariane | 🔗 | Navigation structurée SEO |
| seo_canonical | URLs canoniques | 🔗 | Gestion doublons de contenu |
| seo_redirect | Redirections | ↗️ | Gestionnaire 301/302 |
| seo_perf_monitor | Performance | ⚡ | LCP, CLS, FID monitoring |

### 🚗 Transport & Logistique (14) — category: `transport`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| transport_booking | Réservation trajet | 🚗 | Réserver véhicule / course |
| transport_tracking | Tracking GPS | 📍 | Suivi position temps réel |
| transport_driver | Interface chauffeur | 👨‍💼 | App dédiée chauffeur |
| transport_fleet | Gestion flotte | 🚌 | Vue d'ensemble véhicules |
| transport_route | Calcul itinéraire | 🗺️ | Route + estimation durée/prix |
| transport_invoice | Facturation course | 🧾 | Reçu automatique par email |
| transport_rating | Notation | ⭐ | Note chauffeur + passager |
| transport_SOS | SOS trajet | 🆘 | Bouton urgence pendant trajet |
| transport_schedule | Horaires | 🕐 | Bus, taxi collectif, minibus |
| transport_cargo | Suivi fret | 📦 | Tracking colis et marchandises |
| transport_warehouse | Entrepôt | 🏭 | Gestion stock entrepôt |
| transport_dispatch | Dispatch auto | 🎯 | Attribution automatique courses |
| transport_zone_pricing | Tarifs par zone | 💰 | Prix selon zones géographiques |
| transport_surge | Tarif dynamique | 📈 | Majoration heures de pointe |

### 🏗️ BTP & Immobilier (16) — category: `btp`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| btp_project_tracker | Suivi chantier | 🏗️ | Phases, jalons, avancement % |
| btp_workers | Équipes terrain | 👷 | Gestion équipes et rôles |
| btp_materials | Matériaux | 🧱 | Stock et approvisionnement |
| btp_daily_report | Rapport journalier | 📋 | Compte-rendu chantier quotidien |
| btp_photos | Photos chantier | 📷 | Horodaté, géolocalisé, annoté |
| btp_blueprint | Plans PDF | 📐 | Visualisation et annotation plans |
| btp_budget | Suivi budget | 💰 | Dépenses vs prévisionnel |
| btp_incidents | Incidents sécurité | ⚠️ | Déclaration accidents et risques |
| btp_attendance | Pointage ouvriers | ✅ | QR code entrée/sortie chantier |
| btp_equipment | Engins & matériel | 🚜 | Suivi utilisation et maintenance |
| immo_listing | Annonces immo | 🏠 | Catalogue biens à vendre/louer |
| immo_virtual_tour | Visite virtuelle | 🥽 | Tour 360° immersif |
| immo_mortgage_calc | Calculateur prêt | 🧮 | Simulation crédit immobilier |
| immo_rent_tracker | Suivi loyers | 💳 | Quittances et historique paiements |
| immo_tenant_portal | Espace locataire | 🔑 | Demandes, documents, contacts |
| immo_visit_booking | RDV visite | 📅 | Réserver une visite de bien |

### 🍽️ Restauration & Food (14) — category: `food`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| food_menu | Menu digital QR | 🍽️ | Carte numérique, descriptions, photos |
| food_order_table | Commande à table | 🪑 | Commande via numéro de table |
| food_delivery | Livraison | 🚴 | Commande + suivi livraison |
| food_pickup | Click & Collect | 🏪 | Commande + retrait en boutique |
| food_reservation | Réservation table | 📅 | Réserver + préférences |
| food_kitchen | Interface cuisine | 👨‍🍳 | Tickets et file de préparation |
| food_allergens | Allergènes | ⚠️ | Info allergènes, régimes spéciaux |
| food_loyalty | Fidélité tampons | 🎖️ | Carte fidélité numérique |
| food_rating | Avis expérience | ⭐ | Notes plats et service |
| food_daily_special | Plat du jour | 🌟 | Suggestions et menus du jour |
| food_catering | Traiteur événement | 🎪 | Devis et commandes traiteur |
| food_subscription | Abonnement repas | 🔄 | Formule hebdo ou mensuelle |
| food_inventory | Stocks cuisine | 📦 | Gestion ingrédients et alertes |
| food_waiter | App serveur | 📱 | Prise de commande en salle |

### 🎓 Éducation & Formation (15) — category: `edu`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| edu_courses | Catalogue cours | 📚 | Formations en ligne ou présentiel |
| edu_player | Lecteur vidéo | ▶️ | Player avec reprise de progression |
| edu_quiz | Quiz & QCM | 🧩 | Tests interactifs avec score |
| edu_certificate | Certificat | 🎓 | Génération certificat PDF signé |
| edu_progress | Progression | 📊 | Tableau de bord apprenant |
| edu_live_class | Classe virtuelle | 🎥 | Cours live vidéo |
| edu_homework | Devoirs | 📝 | Exercices et rendu |
| edu_grades | Bulletin de notes | 📋 | Notes et appréciations |
| edu_attendance | Présences | ✅ | Assiduité élèves + parents |
| edu_parent_portal | Espace parents | 👨‍👩‍👧 | Suivi scolaire complet |
| edu_schedule | Emploi du temps | 📅 | Planning cours hebdomadaire |
| edu_library | Bibliothèque | 📖 | Ressources et documents |
| edu_forum | Forum apprenants | 💬 | Discussions par cours |
| edu_flashcards | Mémos révision | 🃏 | Flashcards + répétition espacée |
| edu_ai_tutor | Tuteur IA | 🤖 | Questions/réponses IA (ORIA) |

### 💼 RH & Entreprise (13) — category: `hr`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| hr_leave | Congés & absences | 🏖️ | Demande, validation, solde |
| hr_payslip | Fiches de paie | 💰 | Bulletins salaire PDF |
| hr_attendance | Pointage | ⏰ | Entrée/sortie, heures supp |
| hr_onboarding | Onboarding | 🎯 | Intégration nouveaux employés |
| hr_org_chart | Organigramme | 🗂️ | Structure hiérarchique |
| hr_tasks | Tâches équipes | ✅ | To-do collaboratif |
| hr_announcements | Annonces internes | 📢 | Communications RH |
| hr_expenses | Notes de frais | 🧾 | Soumission et validation |
| hr_performance | Évaluation | 📈 | Entretiens et objectifs |
| hr_recruitment | Recrutement | 👥 | Offres et candidatures internes |
| hr_training | Plan formation | 🎓 | Formations et certifications |
| hr_directory | Annuaire employés | 📒 | Répertoire et contacts |
| hr_poll | Sondages internes | 📊 | Votes et enquêtes |

### 🏋️ Sport, Bien-être & Beauté (13) — category: `sport`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| sport_booking | Réservation séance | 🏋️ | Cours, coach, créneau |
| sport_trainer | Profil coach | 👨‍🏫 | Bio, spécialités, programmes |
| sport_workout | Suivi entraînement | 💪 | Sessions, exercices, sets |
| sport_nutrition | Plan nutritionnel | 🥗 | Repas, macros, hydratation |
| sport_progress_photo | Photos progression | 📷 | Avant/après horodaté |
| sport_leaderboard | Classement | 🏆 | Challenges et gamification |
| sport_class_schedule | Planning cours | 📅 | Cours collectifs + inscription |
| sport_membership | Abonnement salle | 💳 | Gestion membership |
| beauty_booking | RDV beauté | 💅 | Salon, spa, esthétique, massage |
| beauty_catalog | Prestations & prix | 💄 | Menu complet tarifs |
| beauty_stylist | Profil praticien | ✂️ | Coiffeur, esthéticienne, agenda |
| beauty_before_after | Avant/après | 🖼️ | Galerie résultats clients |
| beauty_loyalty | Fidélité beauté | 💎 | Tampons et récompenses |

### 🏦 Finance & Paiement (12) — category: `fin`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| fin_wallet | Portefeuille | 👛 | Solde, recharge, historique |
| fin_transfer | Virement | 💸 | Transfert entre utilisateurs |
| fin_mobile_money | Mobile Money | 📱 | MTN MoMo / Orange Money |
| fin_invoice | Factures | 🧾 | Génération PDF, envoi email |
| fin_receipt | Reçus paiement | 📄 | Confirmations transactions |
| fin_budget_tracker | Suivi budget | 📊 | Dépenses vs revenus |
| fin_savings_goal | Objectifs épargne | 🏦 | Cagnotte avec progression |
| fin_loan | Micro-crédit | 💰 | Demande et suivi remboursement |
| fin_history | Historique | 📋 | Toutes transactions filtrables |
| fin_qr_pay | Paiement QR | 📷 | Scanner QR pour payer |
| fin_split | Partage dépenses | ÷ | Split entre membres groupe |
| fin_tax | Déclaration fiscale | 📑 | Simplifié pour indépendants |

### 🌍 Communauté & Social (12) — category: `social`

| Clé | Label | Icône | Description |
|-----|-------|-------|-------------|
| social_feed | Fil d'actualité | 📰 | Posts, likes, commentaires |
| social_chat | Messagerie 1-1 | 💬 | Chat privé persisté |
| social_group_chat | Chat groupe | 👥 | Messagerie de groupe |
| social_forum | Forum | 🗣️ | Discussions thématiques |
| social_events | Événements | 🎪 | Agenda communautaire + RSVP |
| social_marketplace_p2p | Petites annonces | 🛒 | Annonces entre membres |
| social_directory | Annuaire membres | 📒 | Profils et contacts |
| social_poll | Sondages | 📊 | Votes communauté |
| social_leaderboard | Classement | 🏆 | Points et badges |
| social_referral | Parrainage | 🎁 | Programme de parrainage |
| social_live | Live streaming | 📡 | Diffusion en direct |
| social_stories | Stories | 📸 | Contenu éphémère 24h |

---

## 📊 Tableau de bord marketplace

| Statut | Secteurs | Modules |
|--------|---------|---------|
| ✅ Construits | Santé, Vitrine, Utilitaires | **52** |
| 🔜 À construire | E-com, SEO, Transport, BTP, Food, Edu, RH, Sport, Finance, Social | **145** |
| **TOTAL** | **13 secteurs** | **197** |

---

## 🏗️ Architecture technique

```
shido-connect/
├── modules/
│   ├── {key}/
│   │   └── widget.tsx     ← card home (lazy loaded via dynamic())
│   ├── index.tsx          ← WIDGET_MAP (clé → composant)
│   └── registry.ts        ← ALL_MODULES (metadata complète)
└── app/(app)/
    └── {route}/
        └── page.tsx       ← page complète du module
```

**Ajouter un module = 3 fichiers + 2 lignes dans les registres.**

### Flux activation

```
ShidoStudio → POST /api/v1/pwa/config/publish (X-Admin-Key)
  → pwa_configs.active_modules[] mis à jour
  → ShidoConnect GET /pwa/modules/active
  → ModuleWidget render via WIDGET_MAP[key]
```
