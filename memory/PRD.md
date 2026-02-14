# ORSO RS - Product Requirements Document

## Original Problem Statement
Site internet pour une conciergerie locative en Corse appelée ORSO RS. Minimaliste, élégant. Couleurs: #2e2e2e (gris foncé presque noir) & blanc. Moteur de réservation connecté à Beds24 API (pas d'iframe). Trois catégories de logements: VUE MER / PLAGE A PIEDS / PIEDS DANS L'EAU. Site multilingue FR/EN/ES/IT.

## User Personas
1. **Voyageurs haut de gamme** - Recherchent des locations de vacances premium en Corse du Sud
2. **Propriétaires** - Souhaitent confier leur bien à une conciergerie de luxe
3. **Administrateur** - Gère les propriétés et le contenu du site

## Core Requirements
- Design minimaliste et élégant (#2e2e2e + blanc)
- Moteur de réservation connecté à Beds24 API V2
- Trois catégories: Vue Mer, Plage à Pieds, Pieds dans l'Eau
- Logements "vitrine" (sans réservation en ligne)
- Site multilingue (FR/EN/ES/IT)
- Page services (ORSO Essentiel, ORSO Premium)
- Formulaire de contact
- Espace admin pour gérer propriétés et images du site

## What's Been Implemented (Feb 14, 2026)

### Backend (FastAPI)
- ✅ API REST complète avec endpoints /api/
- ✅ **Intégration Beds24 API V2 complète:**
  - Synchronisation des propriétés avec includeAllRooms
  - Récupération des room_ids dynamiquement
  - Calendrier de disponibilité en temps réel
  - Prix dynamiques via /inventory/rooms/offers
  - Rafraîchissement automatique du token (retry on 401)
  - **Création de réservation via API Beds24**
- ✅ Gestion propriétés (CRUD)
- ✅ **Système de réservation complet avec création dans Beds24**
- ✅ Formulaire de contact (envoi email via Resend)
- ✅ Upload d'images (/api/upload/image)
- ✅ API de gestion des images du site **par page**
- ✅ **API include_hidden pour l'admin** (retourne toutes les propriétés)
- ✅ **Authentification admin via API** (mot de passe sécurisé en variable d'environnement)
- ✅ **Synchronisation automatique Beds24 (APScheduler, toutes les heures)**

### Frontend (React)
- ✅ Design minimaliste avec fonts Cormorant Garamond + Manrope
- ✅ Homepage avec hero, search bar, catégories (images dynamiques)
- ✅ Page Propriétés avec filtres par catégorie
- ✅ **Page Détail Propriété avec flux de réservation complet:**
  - Calendrier avec dates bloquées de Beds24
  - Prix calculés en temps réel
  - Indicateur de chargement des disponibilités
  - Message pour propriétés non connectées
  - Indicateur "Dates disponibles - Prix garanti"
  - **Formulaire de réservation avec confirmation**
- ✅ Formulaire de contact intégré pour propriétés vitrine
- ✅ Lien admin discret dans le footer
- ✅ Page Services (ORSO Essentiel / Premium) **avec images configurables**
- ✅ Page Contact avec formulaire
- ✅ Internationalisation i18n (FR/EN/ES/IT)

### SEO/GEO Optimisé pour la Corse
- ✅ **Meta tags complets** (title, description, keywords, robots)
- ✅ **Open Graph** pour partage Facebook/LinkedIn
- ✅ **Twitter Cards** pour partage Twitter
- ✅ **Geo tags** pour SEO local (FR-2A, Porto-Vecchio)
- ✅ **Balises hreflang** pour multilingue (fr, en, es, it)
- ✅ **Données structurées Schema.org:**
  - Organization
  - LocalBusiness
  - LodgingBusiness
  - BreadcrumbList
  - FAQPage

### Admin Panel (/admin - mot de passe: orso2024)
- ✅ Tableau de bord avec statistiques **(5 stats: Total, Beds24, Visibles, Masquées, Vitrines)**
- ✅ **Propriétés masquées visibles** avec badge "Masqué" et fond grisé
- ✅ Gestion des propriétés (ajouter, modifier, supprimer)
- ✅ Synchronisation Beds24
- ✅ Gestion des images des propriétés
- ✅ Gestion de la visibilité et catégories
- ✅ **Gestion des images du site par page:**
  - Accueil (6 images)
  - Services (2 images)
  - Contact (1 image)
  - Propriétés (1 image)
- ✅ Upload d'images par drag-and-drop

### Integrations
- ✅ **Beds24 API V2** - Intégration complète:
  - Propriétés avec rooms
  - Disponibilités en temps réel
  - Prix dynamiques
  - Token auto-refresh
  - **Création de réservations**
- ⏳ Resend emails (clé API non fournie - logs only)
- ✅ Stripe (via Beds24 - configuré côté Beds24)

## Prioritized Backlog

### P0 (Critical) - COMPLÉTÉ ✅
- [x] Moteur de réservation fonctionnel avec Beds24
- [x] Affichage propriétés avec filtres
- [x] Design conforme (#2e2e2e + blanc)
- [x] Espace admin complet
- [x] Gestion des images du site
- [x] Upload d'images par drag-and-drop
- [x] Calendrier avec disponibilités temps réel
- [x] Prix dynamiques depuis Beds24
- [x] **Propriétés masquées visibles dans l'admin**
- [x] **Gestion des images par page (Accueil, Services, Contact, Propriétés)**

### P1 (Important) - COMPLÉTÉ ✅
- [x] Propriétés vitrine - Formulaire de contact intégré
- [x] Lien admin dans le footer
- [x] **Flux de réservation complet avec création dans Beds24**
- [x] **Synchronisation automatique Beds24 (toutes les heures)**
- [ ] Configuration Resend pour emails réels
- [ ] Sécuriser mot de passe admin (variable d'environnement)

### P2 (Nice to have)
- [ ] Optimisation SEO/GEO pour la Corse
- [ ] Carte interactive Google Maps
- [ ] Avis clients / témoignages
- [ ] Blog / Actualités

## Technical Stack
- **Backend**: FastAPI, MongoDB, Motor, APScheduler
- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Integrations**: Beds24 API V2, Resend (email), Stripe (via Beds24)
- **i18n**: react-i18next
- **File Upload**: Images stockées dans /app/backend/uploads/
- **Auto-Sync**: APScheduler pour synchronisation automatique Beds24

## Admin Credentials
- URL: /admin (ou cliquer sur "Admin" dans le footer)
- Mot de passe: orso2024

## Configuration Auto-Sync
- Intervalle: 1 heure (configurable via `BEDS24_SYNC_INTERVAL_HOURS`)
- Activer/Désactiver: `BEDS24_SYNC_ENABLED=true/false`
- Endpoints:
  - `GET /api/sync/status` - Statut de la synchronisation
  - `POST /api/sync/trigger` - Déclencher une sync manuelle

## Notes techniques importantes
- Le calendrier Beds24 retourne des données vides pour les dates sans réservations configurées
- Le système fait un fallback automatique au prix de base si l'API Beds24 ne retourne pas de prix
- Les propriétés non connectées à Beds24 affichent un avertissement "Prix indicatifs"
- Les nouvelles propriétés synchronisées depuis Beds24 sont **masquées par défaut** (is_active: false)

## Test Coverage
- **47 tests pytest** dans /app/backend/tests/
- **Tests automatisés Playwright** pour le frontend
- Dernier rapport: /app/test_reports/iteration_5.json
