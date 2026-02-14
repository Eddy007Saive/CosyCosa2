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

## What's Been Implemented

### Backend (FastAPI)
- ✅ API REST complète avec endpoints /api/
- ✅ Intégration Beds24 API V2 (authentification token)
- ✅ Gestion propriétés (CRUD)
- ✅ Système de réservation avec price quotes
- ✅ Formulaire de contact (envoi email via Resend)
- ✅ Synchronisation Beds24
- ✅ Données demo initialisées (5 propriétés)
- ✅ API de gestion des images du site (/api/settings/images)

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

### Admin Panel (/admin - mot de passe: orso2024)
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des propriétés (ajouter, modifier, supprimer)
- ✅ Synchronisation Beds24
- ✅ Gestion des images des propriétés
- ✅ Gestion de la visibilité et catégories
- ✅ **Nouveau**: Gestion des images du site (6 images configurables)

### Integrations
- ✅ Beds24 API V2 (token fourni par utilisateur)
- ⏳ Resend emails (clé API non fournie - logs only)
- ✅ Stripe (via Beds24 - configuré côté Beds24)

## Prioritized Backlog

### P0 (Critical)
- [x] Moteur de réservation fonctionnel
- [x] Affichage propriétés avec filtres
- [x] Design conforme (#2e2e2e + blanc)
- [x] Espace admin complet
- [x] Gestion des images du site

### P1 (Important)
- [ ] **Flux de réservation complet** - Intégrer disponibilité/prix temps réel Beds24 + création réservation
- [ ] **Propriétés vitrine** - Remplacer bouton réservation par formulaire contact
- [ ] Configuration Resend pour emails réels
- [ ] Sécuriser mot de passe admin (variable d'environnement)

### P2 (Nice to have)
- [ ] Synchronisation automatique Beds24 (tâche de fond)
- [ ] Optimisation SEO/GEO pour la Corse
- [ ] Carte interactive Google Maps
- [ ] Avis clients / témoignages
- [ ] Blog / Actualités

## Next Tasks
1. Implémenter le flux de réservation bout en bout avec Beds24
2. Gérer les propriétés "vitrine" côté frontend
3. Configurer Resend avec une clé API valide
4. Sécuriser le mot de passe admin

## Technical Stack
- **Backend**: FastAPI, MongoDB, Motor
- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Integrations**: Beds24 API V2, Resend (email), Stripe (via Beds24)
- **i18n**: react-i18next

## Admin Credentials
- URL: /admin
- Mot de passe: orso2024
