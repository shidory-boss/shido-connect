# MANIFESTE ShidoConnect

**Le pont entre la clinique et le patient — dans sa poche**

---

## Pourquoi ShidoConnect existe

ShidoMedical est le cerveau de la clinique. Mais le patient, lui, n'y a pas accès.
Il arrive sans rendez-vous. Il attend sans savoir combien de temps. Il reçoit une ordonnance papier. Il rappelle pour avoir des résultats. Il passe sur WhatsApp, la clinique perd le fil.

ShidoConnect résout tout ça.

C'est la **face visible de la clinique pour le patient** — une PWA (Progressive Web App) installable sur le téléphone, sans passer par l'App Store. Elle est à la fois :

1. **Vitrine** — la clinique a une présence en ligne digne, professionnelle, qui inspire confiance
2. **Portail** — le patient peut prendre RDV, rejoindre la file, suivre son tour, tchatter avec la secrétaire, voir ses ordonnances
3. **Canal de fidélisation** — la clinique reste dans le téléphone du patient. Pour toujours.

---

## La doctrine ShidoConnect

**Un châssis. Des configurations.**
Exactement comme ShidoMedical est un châssis logiciel, ShidoConnect est un châssis PWA.
Un seul fichier à modifier par client : `chassis.config.ts`.
Le reste est générique, testé, prêt à déployer.

**Pas de WhatsApp. Pas de SMS perdu.**
La clinique contrôle toutes ses communications avec ses patients depuis ShidoConnect.
Le chat intégré remplace WhatsApp. Les notifications push remplacent les SMS.

**ORIA-first.**
Même côté patient, ORIA veille. Les données de la PWA alimentent le contexte ORIA de la clinique.
Chaque interaction patient est un signal pour ORIA : retards, plaintes, absences, habitudes.

**Local-first, cloud-ready.**
La PWA consomme l'API de ShidoMedical (localhost en développement, domaine en production).
Aucune dépendance à un service tiers non contrôlé.

---

## Ce que ShidoConnect n'est pas

- Ce n'est pas un réseau social
- Ce n'est pas un outil de téléconsultation vidéo (ShidoMedical gère ça)
- Ce n'est pas une application React Native / Flutter — c'est une PWA Next.js
- Ce n'est pas un projet spécifique à une clinique — c'est un châssis pour toutes

---

## Modules ShidoConnect

Les modules PWA sont activés par `chassis.config.ts → features`. Chaque module correspond à une page ou fonctionnalité dans la PWA. Ils sont vendus et activés depuis le Marketplace ShidoAdmin exactement comme les modules logiciel.

Voir la liste complète dans le Marketplace ShidoAdmin, catégorie "pwa_connect".

---

## Architecture technique

```
ShidoConnect (Next.js 14 PWA)
  Port         : 3007
  Config       : chassis.config.ts (un par client)
  API backend  : ShidoMedical (port 8001 en local, domaine en prod)
  Auth patient : SMS OTP (send-code → verify → JWT patient)
  Push notifs  : Web Push API (VAPID) via backend ShidoMedical
  Offline      : Service Worker via next-pwa (vitrine offline)
  Installable  : manifest.json + HTTPS → Add to Home Screen
```

---

*ShidoConnect — la clinique dans le téléphone du patient*
*Partie de l'écosystème ShidoOS — Boss Shidory*
