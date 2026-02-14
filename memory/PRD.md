# ORSO RS - Product Requirements Document

## Original Problem Statement
Site internet pour une conciergerie locative en Corse appelée ORSO RS. Minimaliste, élégant. Couleurs: #2e2e2e (gris foncé presque noir) & blanc. Moteur de réservation connecté à Beds24 API (pas d'iframe). Trois catégories de logements: VUE MER / PLAGE A PIEDS / PIEDS DANS L'EAU. Site multilingue FR/EN/ES/IT.

## User Personas
1. **Voyageurs haut de gamme** - Recherchent des locations de vacances premium en Corse du Sud
2. **Propriétaires** - Souhaitent confier leur bien à une conciergerie de luxe

## Core Requirements
- Design minimaliste et élégant (#2e2e2e + blanc)
- Moteur de réservation connecté à Beds24 API V2
- Trois catégories: Vue Mer, Plage à Pieds, Pieds dans l'Eau
- Logements "vitrine" (sans réservation en ligne)
- Site multilingue (FR/EN/ES/IT)
- Page services (ORSO Essentiel, ORSO Premium)
- Formulaire de contact

## What's Been Implemented (Feb 14, 2026)

### Backend (FastAPI)
- ✅ API REST complète avec endpoints /api/
- ✅ Intégration Beds24 API V2 (authentification token)
- ✅ Gestion propriétés (CRUD)
- ✅ Système de réservation avec price quotes
- ✅ Formulaire de contact (envoi email via Resend)
- ✅ Synchronisation Beds24
- ✅ Données demo initialisées (5 propriétés)

### Frontend (React)
- ✅ Design minimaliste avec fonts Cormorant Garamond + Manrope
- ✅ Homepage avec hero, search bar, catégories
- ✅ Page Propriétés avec filtres par catégorie
- ✅ Page Détail Propriété avec galerie, calendrier, booking widget
- ✅ Page Services (ORSO Essentiel / Premium)
- ✅ Page Contact avec formulaire
- ✅ Internationalisation i18n (FR/EN/ES/IT)
- ✅ Smooth scroll avec Lenis
- ✅ Design responsive mobile
- ✅ SEO optimisé (meta tags, structured data)

### Integrations
- ✅ Beds24 API V2 (token fourni par utilisateur)
- ⏳ Resend emails (clé API non fournie - logs only)
- ✅ Stripe (via Beds24 - configuré côté Beds24)

## Prioritized Backlog

### P0 (Critical)
- [x] Moteur de réservation fonctionnel
- [x] Affichage propriétés avec filtres
- [x] Design conforme (#2e2e2e + blanc)

### P1 (Important)
- [ ] Connexion réelle Beds24 avec vraies propriétés
- [ ] Configuration Resend pour emails réels
- [ ] Calendly embed pour page contact

### P2 (Nice to have)
- [ ] Carte interactive Google Maps
- [ ] Avis clients / témoignages
- [ ] Blog / Actualités
- [ ] Espace propriétaire

## Next Tasks
1. Tester la connexion Beds24 avec de vraies propriétés
2. Configurer Resend avec une clé API valide
3. Ajouter Calendly embed sur page contact
4. Optimiser les images (compression, lazy loading)
5. Ajouter analytics (Google Analytics)

## Technical Stack
- **Backend**: FastAPI, MongoDB, Motor
- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Integrations**: Beds24 API V2, Resend (email), Stripe (via Beds24)
- **i18n**: react-i18next
