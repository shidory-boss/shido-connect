# MANIFESTE COMPLET — Oria Care PWA
## Sessions 2026-06-25 et 2026-06-26

> **But de ce document** : permettre à une nouvelle session Claude Code de comprendre l'état exact du projet, tout ce qui a été fait, tout ce qui reste, sans avoir à ré-explorer le code depuis zéro.

---

## 1. ARCHITECTURE GLOBALE DU PROJET

### Deux applications distinctes — NE JAMAIS MÉLANGER

| App | Rôle | Port local | URL publique |
|-----|------|-----------|-------------|
| `shido-medical` | Interface staff (médecins, secrétaires, admin Tauri desktop) | **3004** | Aucune (app locale) |
| `shido-connect` | PWA patients (ce dossier) | **3007** | `shido-connect.vercel.app` |
| Backend FastAPI | API partagée | **8001** | Aucune (local uniquement) |

### Lancer tous les services d'un coup
```bash
bash ~/Bureau/Applications/start-oria.sh
```
Ce script :
1. Tue les processus existants sur 8001, 3004, 3007
2. Lance le backend FastAPI dans `/tmp/backend.log`
3. Lance shido-medical (Next.js port 3004) dans `/tmp/medical.log`
4. Supprime `.next` de shido-connect (évite les stale chunks)
5. Lance shido-connect (Next.js port 3007) dans `/tmp/connect.log`

### Stack technique
- **Frontend** : Next.js 16 avec Turbopack
- **Backend** : FastAPI + SQLAlchemy
- **Base de données** : **SQLite** → `~/.local/share/shido-medical/db/shido_medical.db`
  - ⚠️ PAS PostgreSQL — le `.env` backend n'a PAS de `DATABASE_URL`
  - Erreur classique : aller modifier PostgreSQL et se demander pourquoi ça ne change pas
- **Service Worker (PWA)** : `next-pwa` v5, activé en prod uniquement (Vercel)

---

## 2. DÉPLOIEMENT VERCEL — ÉTAT COMPLET

### Infos Vercel
```
URL publique   : https://shido-connect.vercel.app
Repo GitHub    : shidory-boss/shido-connect
Branche        : main (auto-deploy à chaque push)
Vercel Team    : shidory-boss7
Project ID     : prj_hkz0vRicfG1G8PaN4cBE5wi9KFey
Plan           : Hobby
```

### Déploiement automatique
Chaque `git push origin main` depuis shido-connect déclenche un redéploiement Vercel (~2 min).

### Variables d'environnement Vercel — PROBLÈME CRITIQUE
Le `.env.local` local contient `NEXT_PUBLIC_AVION_API_URL=http://localhost:8001`.

**Sur Vercel, cette variable pointe encore vers localhost** → la PWA déployée sur les téléphones patients essaie de joindre `localhost:8001` de la machine du patient → **impossible** → toutes les fonctions nécessitant le backend échouent (prise de RDV, chargement des médecins, check-in file d'attente).

**Solution définitive à faire en priorité absolue :**
1. Exposer le backend publiquement (voir section 7)
2. Aller dans le **dashboard Vercel** → Projet shido-connect → Settings → Environment Variables
3. Ajouter/modifier : `NEXT_PUBLIC_AVION_API_URL` = URL publique du backend
4. Redéployer (Settings → Deployments → Redeploy, ou faire un push vide)

Note technique : même si `avion_api_url` est retourné par l'API `/pwa/config/public`, le backend retourne actuellement une chaîne vide pour ce champ (non configuré).

### Commits de la session (du plus récent au plus ancien)
```
620f036  fix(pwa): clientsClaim:true — forcer reload Android après update SW
ccbac49  fix(pwa): audit complet — branding Oria Care + bugs booking + CORS
6931c93  feat(animations): ECG hero+splash, particules login, ripple cards, jauges dossier
ad6fc7d  backup: état stable avant animations vivantes v2
8a5f0be  fix(chat): supprimer erreur visible quand backend indisponible
383e2c8  feat(records): dossier santé vide si connecté + tout modifiable + persistant localStorage
ffde77f  fix: type cast LocalPatient → any pour storage.setPatient
8e61701  feat(auth): auth locale offline + dossier médical persistant + profil éditable
ef5fdce  feat(teleconsult): 3 docteurs avec photos + noms réels
```

---

## 3. ÉTAT DE LA BASE DE DONNÉES SQLITE

### Médecins actifs (table `medical_users`)
```
id=2  : Jean Kouame       | DOCTOR | Medecine generale  | actif
id=4  : Yanick Oulaï      | DOCTOR | Médecine générale  | actif
id=5  : Franck Kouamé     | DOCTOR | Médecine interne   | actif
id=6  : Christy Onamon    | DOCTOR | Médecine générale  | actif
```

### Config PWA (table `pwa_configs`, id=1)
```
clinic_name  : Oria Care
short_name   : Oria Care
tagline      : Votre santé, notre priorité
logo_url     : /images/Logo Oria Care 192 par 192.png
accent_color : #1D9E75
avion_api_url: (vide — À REMPLIR avec URL publique backend)
```

---

## 4. TOUS LES BUGS CORRIGÉS DANS CES SESSIONS

### 4.1 Branding — remplacement "ShidoConnect"/"ShidoOS" → "Oria Care"
Fichiers modifiés dans le commit `ccbac49` :

| Fichier | Ce qui a été changé |
|---------|---------------------|
| `app/(auth)/login/page.tsx` | Footer "Propulsé par ShidoOS" → "Oria Care", fallback clinic_name |
| `app/(app)/profil/page.tsx` | Footer "© 2026 ShidoOS" → "Oria Care" |
| `app/(app)/home/page.tsx` | Footer "ShidoConnect · {name}" + "ShidoOS" |
| `app/(app)/vitrine/page.tsx` | Footer identique |
| `app/(app)/vitrine/press/page.tsx` | 3 mentions "ShidoConnect" dans textes presse |
| `app/(app)/vitrine/awards/page.tsx` | "Fondation ShidoMedical" dans historique |
| `app/(app)/util/share/page.tsx` | APP_TITLE, texte partage, label QR Code |
| `app/(app)/util/chat-support/page.tsx` | "Bot ShidoConnect" |
| `app/(app)/util/onboarding-tour/page.tsx` | "Installez ShidoConnect" |
| `app/(app)/util/widget-home/page.tsx` | Label widget + texte post-installation |
| `app/(app)/util/barcode/page.tsx` | "Patient ShidoConnect" |
| `app/(app)/util/notifications/page.tsx` | "Test ShidoConnect" |
| `app/(app)/referral/page.tsx` | Texte de parrainage |
| `app/(app)/doctor/[id]/page.tsx` | "Dr. Kouamé Shidory / PDG ShidoMedical" → "Dr. Kouamé Franck / Médecin Généraliste" |
| `core/PWAConfigContext.tsx` | DEFAULT_CONFIG : clinic_name, pwa_name |
| `app/(app)/notifications/page.tsx` | "Bienvenue chez ShidoConnect", "RDV avec Dr. Shidory" |

### 4.2 Login page (`app/(auth)/login/page.tsx`)
- **Champs pré-remplis supprimés** : `phone='0600000000'` et `password='demo1234'` → `''`
- Risque : n'importe qui pouvait se connecter avec les credentials de démo visibles

### 4.3 Profil page (`app/(app)/profil/page.tsx`)
- **Bug état `editing` non réinitialisé** : cliquer Menu → Santé → Urgence laissait le formulaire ouvert d'une section à l'autre, causant des modifications accidentelles
  - Fix : `onClick={() => { setSection(k); setEditing(false) }}`
- **Champ date de naissance** : `<input type="date">` remplacé par 3 `<select>` Jour/Mois/Année
  - ⚠️ Ce fix est dans le code local mais **PAS encore pushé sur Vercel** (commit manquant)

### 4.4 Queue page (`app/(app)/queue/page.tsx`) — bouton check-in
- **Avant** : page entièrement en lecture seule, message "Présentez-vous à l'accueil"
- **Après** : bouton "🎫 Rejoindre la file d'attente" → textarea pour saisir le motif → appel `queueApi.checkin({ reason })`
- Gestion d'erreur si backend indisponible
- ⚠️ Ce fix est dans le code local mais **PAS encore pushé sur Vercel**

### 4.5 Booking page (`app/(app)/booking/page.tsx`)
- **Date de naissance** : `<input type="date">` → 3 selects Jour/Mois/Année (pushé dans `ccbac49`)
- **Message d'erreur réseau** : "NetworkError" générique → "Connexion impossible au serveur. Vérifiez votre connexion et réessayez."
- **Médecins hardcodés supprimés** : l'ancien tableau DOCTORS (Dr. Kouamé Shidory, Dr. Segou Yan, Dr. Ahouéfa Koné, Dr. Bamba Oumar) a été remplacé par un fetch dynamique vers `/api/v1/appointments/public/doctors`
- **Bouton réessayer** : si la liste des médecins échoue, un bouton "🔄 Réessayer" apparaît

### 4.6 Backend CORS (`backend/app/main.py`)
- **Avant** : seuls `localhost:3000-3007` autorisés → tous les POST depuis Vercel bloqués (CORS 4xx)
- **Après** : `allow_origin_regex` étendu pour accepter :
  ```
  https://*.vercel.app
  https://*.shidoos.ci
  https://*.ngrok-free.app
  https://*.ngrok.io
  https://*.trycloudflare.com
  https://*.loca.lt
  ```
- `allowed_paths` : ajout de `/api/v1/pwa/` (endpoints publics sans auth)

### 4.7 Backend `pwa.py` (`avion_api_url`)
- Retourne maintenant `os.getenv("PUBLIC_AVION_API_URL", "")` au lieu d'une chaîne vide fixe
- Permet de configurer l'URL publique depuis une variable d'environnement backend

### 4.8 Service Worker PWA (`next.config.ts`)
- Ajout `clientsClaim: true` + `workboxOptions: { skipWaiting: true, clientsClaim: true }`
- **Avant** : les onglets Android déjà ouverts continuaient à servir l'ancien cache même après une mise à jour
- **Après** : le nouveau service worker prend effet immédiatement pour tous les onglets actifs

### 4.9 Turbopack root (`next.config.ts`)
- Ajout `turbopack: { root: __dirname }` pour éviter que Turbopack surveille tout `/home/boss-shidory/`
- Cause : un `package-lock.json` à la racine de `/home/boss-shidory/` trompait Turbopack
- Symptôme sans ce fix : rebuild constant, hot reload extrêmement lent, avertissement dans les logs

---

## 5. BUG ACTUEL — SÉLECTEUR DATE ANDROID (NON RÉSOLU)

### Symptôme exact
- **iPhone** : les 3 selects Jour/Mois/Année s'affichent et fonctionnent ✅
- **Android** (testé sur 2 téléphones différents, cache vidé, URL Vercel) : le calendrier natif Android s'ouvre encore ❌
- Le bug apparaît sur la page **booking** étape 0 (Identité) champ "Date de naissance"
- `clientsClaim: true` a été ajouté mais pas encore testé sur Android (commit `620f036` pas encore vérifié)

### Ce qu'on sait avec certitude
1. Le code local a bien les 3 `<select>` (vérifié par grep — aucun `type="date"` dans booking/page.tsx)
2. iPhone reçoit la bonne version → Vercel a bien déployé les changements
3. Même résultat sur 2 Android différents → pas un problème de cache individuel
4. Cache vidé manuellement → service worker éliminé

### Style actuel des selects dans booking (potentiel coupable)
```typescript
const inp: React.CSSProperties = {
  width:'100%', padding:'13px 14px', borderRadius:14,
  border:'1.5px solid #e2e8f0', fontSize:14,
  fontFamily:"'Josefin Sans','Nunito',sans-serif", fontWeight:600,
  color:'#0f172a', outline:'none', background:'#fff',
  boxSizing:'border-box',
}
const sel: React.CSSProperties = { ...inp, cursor:'pointer' }
// Pas de appearance:'none' explicite, mais pas de appearance:'auto' non plus
```

### Hypothèses classées par probabilité

**Hypothèse 1 (80%) — Déploiement Vercel pas encore propagé sur CDN Android**
Les CDN Vercel ont des edge nodes géographiques. Le déploiement peut prendre plus de temps à se propager sur certains nœuds. iPhone et Android peuvent frapper des edge nodes différents.
- Test : ouvrir `shido-connect.vercel.app/booking?nocache=1` sur Android Chrome
- Test 2 : ouvrir en navigation privée Android (nouveau contexte, pas de SW)

**Hypothèse 2 (15%) — Problème CSS `appearance` sur Android Chrome**
Sur Android Chrome, certaines propriétés CSS peuvent masquer un `<select>` ou le rendre non-interactif, révélant un comportement inattendu.
- Fix à essayer : ajouter explicitement `WebkitAppearance: 'menulist'` sur les selects de date

**Hypothèse 3 (5%) — Autre `type="date"` non détecté**
Il reste des `type="date"` dans d'autres fichiers (reminders, pdf-export, filters) mais pas dans le booking.

### Fix à appliquer en priorité dans la prochaine session

Dans `app/(app)/booking/page.tsx`, remplacer les 3 selects de date de naissance (lignes ~377-400) et ajouter un style dédié sans ambiguïté :

```typescript
// Style spécifique pour les selects date (force le comportement natif dropdown)
const selDate: React.CSSProperties = {
  width: '100%', padding: '13px 8px', borderRadius: 14,
  border: '1.5px solid #e2e8f0', fontSize: 14,
  fontFamily: "'Josefin Sans','Nunito',sans-serif", fontWeight: 600,
  color: '#0f172a', outline: 'none', background: '#fff',
  boxSizing: 'border-box' as const,
  cursor: 'pointer',
  WebkitAppearance: 'menulist' as any,
  appearance: 'auto' as any,
}
```

### Comment déboguer avec DevTools Android
1. Connecter le téléphone Android en USB
2. Sur le PC, ouvrir Chrome → `chrome://inspect/#devices`
3. Le téléphone apparaît si "Débogage USB" est activé (Paramètres → Options développeur)
4. Cliquer "inspect" sur l'onglet Vercel
5. Panneau Elements → inspecter le champ date → voir si `<select>` ou `<input>` est rendu

---

## 6. FIXES FAITS LOCALEMENT MAIS PAS ENCORE PUSHÉS SUR VERCEL

⚠️ Ces changements existent dans le code local mais **ne sont PAS sur GitHub/Vercel** :

| Fichier | Changement |
|---------|-----------|
| `app/(app)/profil/page.tsx` | Date de naissance : `type="date"` → 3 selects Jour/Mois/Année |
| `app/(app)/queue/page.tsx` | Bouton "Rejoindre la file d'attente" + formulaire motif + appel `checkin` |
| `app/(app)/queue/page.tsx` | Message "Présentez-vous à l'accueil" remplacé |
| `app/(auth)/login/page.tsx` | Champs vides (plus de demo credentials) |
| `app/(app)/notifications/page.tsx` | Textes Oria Care |
| `app/(app)/profil/page.tsx` | `editing` reset au changement de section |
| `app/(app)/profil/page.tsx` | Footer "Oria Care" |
| `core/PWAConfigContext.tsx` | DEFAULT_CONFIG "Oria Care" |

**Commande pour tout pousher en une fois :**
```bash
cd ~/Bureau/Applications/shido-connect
git add app/ core/ lib/ next.config.ts
git status  # vérifier que tout est là
git commit -m "fix(pwa): date selects profil + check-in queue + login vide + branding"
git push origin main
```

---

## 7. AUTRES `type="date"` RESTANTS DANS LA PWA

Ces fichiers ont encore des `<input type="date">` non remplacés (moins critiques car pages utilitaires) :

| Fichier | Contexte | Priorité |
|---------|----------|---------|
| `app/(app)/reminders/page.tsx:298` | Champ startDate pour rappel médicament | Moyenne |
| `app/(app)/util/filters/page.tsx:90,92` | Filtres dateFrom/dateTo | Basse |
| `app/(app)/util/pdf-export/page.tsx:45,50` | Export PDF plage de dates | Basse |

---

## 8. PROBLÈME PRINCIPAL QUI EMPÊCHE LA PRISE DE RDV

La chaîne complète d'une prise de RDV depuis Vercel :

```
Téléphone patient → Vercel PWA
  → fetch(`${sc_avion_url}/api/v1/appointments/public`, POST)
  → sc_avion_url = localStorage['sc_avion_url'] OU process.env.NEXT_PUBLIC_AVION_API_URL
  → Sur Vercel : NEXT_PUBLIC_AVION_API_URL = "http://localhost:8001" (dans le build)
  → Le téléphone essaie de joindre localhost:8001 de lui-même → FAIL
```

**Solution complète :**

Option A (temporaire, gratuit) — ngrok :
```bash
# Sur la machine locale
ngrok http 8001
# Donne une URL du type : https://abc123.ngrok-free.app
# Aller dans Vercel dashboard → Settings → Environment Variables
# Modifier NEXT_PUBLIC_AVION_API_URL = https://abc123.ngrok-free.app
# Redéployer
```

Option B (permanente) — VPS ou Cloudflare Tunnel :
```bash
# Cloudflare Tunnel (gratuit, permanent, pas besoin de VPS)
cloudflared tunnel --url http://localhost:8001
```

Option C — Modifier le DB directement pour que `avion_api_url` soit retourné :
```bash
python3 -c "
import sqlite3
conn = sqlite3.connect('/home/boss-shidory/.local/share/shido-medical/db/shido_medical.db')
conn.execute(\"UPDATE pwa_configs SET avion_api_url='https://TON-URL-ICI' WHERE id=1\")
conn.commit()
print('OK')
"
```

---

## 9. TESTS EFFECTUÉS — RÉSULTATS

| Test | Appareil | Résultat | Notes |
|------|---------|---------|-------|
| Affichage login | iPhone | ✅ | Oria Care, champs vides |
| Affichage login | Android | ✅ | Oria Care, champs vides |
| 3 selects date naissance (booking) | iPhone | ✅ | Fonctionne |
| 3 selects date naissance (booking) | Android | ❌ | Calendrier natif persist. |
| Liste médecins (booking étape 5) | iPhone | ⚠️ | Affiche mauvais noms (backend différent) |
| Liste médecins (booking étape 5) | Android | ⚠️ | Idem |
| Soumission RDV | iPhone | ❌ | "Load failed" (backend inaccessible) |
| Soumission RDV | Android | ❌ | Idem |
| Nom clinique "Oria Care" | iPhone + Android | ✅ | Correct partout |
| Logo Oria Care | iPhone + Android | ✅ | Correct |
| Service worker update Android | Android | ⏳ | `clientsClaim` pushé, pas encore retesté |
| 3 selects date naissance (profil) | Non testé | ⏳ | Fix en local, pas pushé |
| Check-in file d'attente | Non testé | ⏳ | Idem |

---

## 10. FICHIERS CRITIQUES À CONNAÎTRE

### PWA shido-connect
```
app/(auth)/login/page.tsx               ← Login, auth locale offline, particles burst
app/(app)/booking/page.tsx              ← Formulaire RDV 6 étapes ← BUG DATE ANDROID
app/(app)/profil/page.tsx               ← Profil + dossier médical 3 sections
app/(app)/queue/page.tsx                ← File d'attente + check-in (non pushé)
app/(app)/home/page.tsx                 ← Page accueil avec stats animées
app/(app)/notifications/page.tsx        ← Notifications (statiques pour l'instant)
app/(app)/reminders/page.tsx            ← Rappels médicaments
app/(app)/records/page.tsx              ← Dossier santé (résultats, ordonnances, imagerie)
app/(app)/chat/page.tsx                 ← Messages clinique
core/PWAConfigContext.tsx               ← Config clinique chargée au démarrage
lib/api.ts                              ← Tous les appels API + getBaseUrl()
lib/localAuth.ts                        ← Auth offline (stockage localStorage)
lib/storage.ts                          ← Gestion localStorage (token, patient, config)
lib/types.ts                            ← Types TypeScript partagés
next.config.ts                          ← Turbopack root + next-pwa + CSP headers
public/manifest.json                    ← Manifest PWA (nom, icônes, couleurs)
.env.local                              ← Variables d'env locales
```

### Backend shido-medical
```
backend/app/main.py                           ← CORS, startup, license check, whisper launch
backend/app/api/v1/routes/appointments.py     ← RDV publics + liste médecins publics
backend/app/api/v1/routes/pwa.py              ← Config PWA, modules, queue check-in/status
backend/app/api/v1/routes/queue.py            ← File d'attente (getStatus, checkin)
backend/app/core/database.py                  ← SQLite ou PostgreSQL selon DATABASE_URL
```

---

## 11. TÂCHES RESTANTES — BACKLOG COMPLET

### 🔴 Priorité absolue (bloque les tests sur mobile)
1. **Pousher les fixes locaux non pushés** (voir section 6)
2. **Exposer le backend publiquement** et configurer `NEXT_PUBLIC_AVION_API_URL` dans Vercel
3. **Déboguer le sélecteur date Android** — utiliser DevTools Android USB pour inspecter le DOM

### 🟠 Priorité haute (UX cassée)
4. **Confirmer que la prise de RDV fonctionne bout-en-bout** une fois le backend exposé
5. **Médecins sur Vercel** : vérifier que Jean/Yanick/Franck/Christy apparaissent bien une fois le backend correct connecté
6. **Remplacer les `type="date"` restants** dans reminders, filters, pdf-export

### 🟡 Priorité moyenne
7. **Vérifier avion_api_url retourné par l'API** (actuellement vide string) — mettre à jour en DB
8. **Tester le check-in file d'attente** depuis mobile
9. **Tester les notifications push** (permission navigateur)
10. **Page de confirmation RDV** (`/booking/confirm`) — vérifier qu'elle affiche bien les bonnes infos

### 🟢 Priorité basse (améliorations futures)
11. **AbonnementsView shido-medical** — refonte avec politique commerciale réelle
12. **Raccordement AbonnementsView ↔ LicenceView**
13. **Transcription audio longue durée** (page dédiée ≠ commandes ORIA)
14. **Traduction langues locales** (Dioula, Bété, Malinké...)
15. **Duplication licence → ShidoBiz + ShidoLearn**

---

## 12. COMMANDES DE RÉFÉRENCE

```bash
# ── Services ───────────────────────────────────────────────────
bash ~/Bureau/Applications/start-oria.sh          # Tout démarrer
tail -f /tmp/backend.log /tmp/connect.log          # Voir les logs
pkill -f uvicorn && pkill -f 'next dev'            # Tout arrêter

# ── Git / Vercel ───────────────────────────────────────────────
cd ~/Bureau/Applications/shido-connect
git add app/ core/ lib/ next.config.ts
git commit -m "fix: ..."
git push origin main                               # → déploie sur Vercel en 2 min

# ── Base de données ────────────────────────────────────────────
DB=~/.local/share/shido-medical/db/shido_medical.db

# Voir médecins
sqlite3 $DB "SELECT id, first_name, last_name, specialite FROM medical_users WHERE LOWER(role)='doctor';"

# Voir config PWA
sqlite3 $DB "SELECT clinic_name, logo_url, avion_api_url FROM pwa_configs WHERE id=1;"

# Mettre à jour l'URL backend public
sqlite3 $DB "UPDATE pwa_configs SET avion_api_url='https://TON-URL.ngrok-free.app' WHERE id=1;"

# ── Tester l'API backend ───────────────────────────────────────
curl http://localhost:8001/api/v1/appointments/public/doctors | python3 -m json.tool
curl http://localhost:8001/api/v1/pwa/config/public | python3 -m json.tool
curl -X POST http://localhost:8001/api/v1/pwa/queue/checkin \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "test"}'

# ── Exposer backend publiquement ──────────────────────────────
ngrok http 8001                                    # Copier l'URL HTTPS
# Puis : Vercel dashboard → Settings → Env vars → NEXT_PUBLIC_AVION_API_URL
```

---

## 13. RÈGLES DE CODE ABSOLUES (ne pas réinventer)

```
1. datetime.now(timezone.utc)       JAMAIS utcnow() — casse l'arithmétique timezone-aware
2. asyncio.to_thread()              Toute I/O bloquante dans un handler async
3. Path atomique                    write .tmp + replace() pour fichiers d'état critiques
4. Popen → atexit.register          Ne jamais laisser de processus GPU zombie
5. CORS backend                     Toujours inclure le domaine Vercel dans allow_origin_regex
6. SQLite (PAS PostgreSQL)          Ce projet n'a pas de DATABASE_URL dans .env
7. turbopack: { root: __dirname }   Obligatoire dans next.config.ts sinon rebuild loop
8. DEFAULT_CONFIG = "Oria Care"     Jamais "ShidoConnect" ou "ShidoOS"
9. Sélecteur de date                Toujours 3 selects Jour/Mois/Année — jamais input type="date"
10. appearance sur <select>         Ajouter WebkitAppearance:'menulist' pour compatibilité Android
```

---

*Généré le 2026-06-26 — dernière mise à jour après session audit complet PWA*
*Prochain objectif : pousher les fixes locaux + exposer backend + déboguer Android date select*
