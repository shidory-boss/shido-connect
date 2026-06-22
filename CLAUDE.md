# CLAUDE.md — ShidoConnect PWA Châssis
**Pour tout Claude qui travaille sur ce projet**

---

## 0. LIRE LE MANIFESTE EN PREMIER

`MANIFESTE.md` dans ce dossier — doctrine du projet.
Ce CLAUDE.md est le manuel d'exécution.

---

## 1. QU'EST-CE QUE SHIDOCONNECT

ShidoConnect est le **châssis PWA de ShidoOS** — la face patient de ShidoMedical.
C'est une Next.js 14 PWA installable sur téléphone, vitrine luxe + portail patient.

**Un seul fichier change par client : `chassis.config.ts`.**
Tout le reste est générique et réutilisable.

---

## 2. CARTOGRAPHIE DU PROJET

```
/home/boss-shidory/Bureau/Applications/shido-connect/
  chassis.config.ts          ← SEUL fichier à modifier par client
  .env.local                 ← NEXT_PUBLIC_MEDICAL_API, NEXT_PUBLIC_CLINIC_ID, PORT
  app/
    page.tsx                 ← vitrine principale (assemblage sections)
    layout.tsx               ← metadata PWA + CSS vars
    globals.css              ← variables CSS ShidoOS + classes utilitaires
    rdv/page.tsx             ← wizard RDV 3 étapes
    file/page.tsx            ← file d'attente + suivi temps réel
    mon-espace/page.tsx      ← auth SMS + mes RDV + chat
  components/
    layout/PWANav.tsx        ← navigation scroll-aware + glass morphism
    layout/PWAFooter.tsx     ← footer 4 colonnes
    vitrine/
      HeroSection.tsx, StatsBar.tsx, ServicesSection.tsx
      TeamSection.tsx, TestimonialsSection.tsx, ContactSection.tsx
  lib/
    api.ts                   ← axios instance + CLINIC_ID + token injection
    config.ts                ← re-export de chassis.config.ts
  public/
    manifest.json            ← PWA manifest
    icons/                   ← icon-192x192.png + icon-512x512.png
    images/                  ← images client (hero.jpg, about.jpg...)
  start.sh                   ← ./start.sh → port 3007
```

---

## 3. RÈGLES ABSOLUES

### 3.1 CSS — JAMAIS de hex en dur dans les composants
- `var(--accent)`, `var(--accent-dark)`, `var(--accent-light)`
- `var(--gold)`, `var(--dark)`, `var(--card-bg)`, `var(--border)`
- Exception autorisée : `clinicConfig.accent` (vient du config)

### 3.2 Config — TOUT vient de chassis.config.ts
Jamais de texte clinique, couleur, ID, ou URL en dur dans les composants.
Toujours lire depuis `clinicConfig` importé de `@/lib/config`.

### 3.3 API — TOUT passe par l'API ShidoMedical
- URL : `process.env.NEXT_PUBLIC_MEDICAL_API`
- clinic_id : `CLINIC_ID` depuis `@/lib/api`
- Auth patient : token dans `localStorage('connect_token')`
- Jamais de `clinic_id = 3` en dur dans un composant

### 3.4 Modules — features.xxx de chassis.config.ts
Avant d'afficher une feature avancée, vérifier `clinicConfig.features.xxx`.
Si désactivé → masquer silencieusement.

### 3.5 PWA — toujours dark mode ready
Les composants répondent à `[data-theme="dark"]`. Pas de fond blanc hard-codé.

---

## 4. DÉMARRER UN NOUVEAU CLIENT (30 minutes)

```bash
cp -r shido-connect/ shido-connect-[nomclient]/
cd shido-connect-[nomclient]/
# 1. Modifier chassis.config.ts (nom, couleur, services, stats, horaires)
# 2. Modifier .env.local (API_URL, CLINIC_ID)
# 3. Ajouter public/images/ (hero.jpg, team.jpg...)
# 4. ./start.sh
```

---

## 5. ARCHITECTURE NOTIFICATIONS FILE (20min avant le tour)

- Patient rejoint la file → `requestNotificationPermission()` → push token enregistré via `POST /queue/subscribe`
- APScheduler backend : toutes les 60s → si `position <= 3` → envoie push via VAPID
- Service Worker ShidoConnect : capte le push → affiche notification native même si PWA fermée
- Secrétaire peut aussi notifier manuellement : `POST /queue/notify/{ticket}`

---

## 6. MODULES PWA — voir Marketplace ShidoAdmin catégorie "pwa_connect"

30 modules disponibles. Activés dans `chassis.config.ts → features`.
Les modules désactivés sont masqués silencieusement.

---

## 7. LIVRAISON

1. `npx tsc --noEmit` → 0 erreur
2. `npm run build` → pas d'erreur de build
3. Tous les composants lisent depuis `clinicConfig` — aucun texte clinique en dur
4. Jamais committer sans accord de Boss

---

## 8. CE QU'ON NE FAIT JAMAIS

- Texte ou URL clinique en dur (tout dans `chassis.config.ts`)
- Hex color en dur dans les composants (CSS vars ou `clinicConfig.accent`)
- Appel API sans `CLINIC_ID`
- `show_widget`, mockups ou diagrammes — texte/markdown uniquement
- Committer sans validation Boss

---

*ShidoConnect v1 — 22 Juin 2026 — ShidoOS de Boss Shidory*
