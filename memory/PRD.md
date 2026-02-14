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
- ✅ Intégration Beds24 API V2 (authentification token)
- ✅ Gestion propriétés (CRUD)
- ✅ Système de réservation avec price quotes
- ✅ Formulaire de contact (envoi email via Resend)
- ✅ Synchronisation Beds24
- ✅ Données demo initialisées (5 propriétés)
- ✅ API de gestion des images du site (/api/settings/images)
- ✅ **Nouveau**: Upload d'images (/api/upload/image)

### Frontend (React)
- ✅ Design minimaliste avec fonts Cormorant Garamond + Manrope
- ✅ Homepage avec hero, search bar, catégories (images dynamiques)
- ✅ Page Propriétés avec filtres par catégorie
- ✅ Page Détail Propriété avec galerie, calendrier, booking widget
- ✅ **Nouveau**: Formulaire de contact intégré pour propriétés vitrine
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
- ✅ Gestion des images du site (6 images configurables)
- ✅ **Nouveau**: Upload d'images par drag-and-drop

### Integrations
- ✅ Beds24 API V2 (token fourni par utilisateur)
- ⏳ Resend emails (clé API non fournie - logs only)
- ✅ Stripe (via Beds24 - configuré côté Beds24)

## Prioritized Backlog

### P0 (Critical) - COMPLÉTÉ
- [x] Moteur de réservation fonctionnel
- [x] Affichage propriétés avec filtres
- [x] Design conforme (#2e2e2e + blanc)
- [x] Espace admin complet
- [x] Gestion des images du site
- [x] Upload d'images par drag-and-drop

### P1 (Important) - COMPLÉTÉ
- [x] **Propriétés vitrine** - Formulaire de contact intégré dans la page propriété
- [ ] Configuration Resend pour emails réels
- [ ] Sécuriser mot de passe admin (variable d'environnement)

### P2 (Nice to have)
- [ ] Synchronisation automatique Beds24 (tâche de fond)
- [ ] Optimisation SEO/GEO pour la Corse
- [ ] Carte interactive Google Maps
- [ ] Avis clients / témoignages
- [ ] Blog / Actualités

## Next Tasks
1. Configurer Resend avec une clé API valide pour les emails
2. Sécuriser le mot de passe admin (variable d'environnement)
3. Optimisation SEO/GEO pour la Corse
4. Synchronisation automatique Beds24

## Technical Stack
- **Backend**: FastAPI, MongoDB, Motor
- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Integrations**: Beds24 API V2, Resend (email), Stripe (via Beds24)
- **i18n**: react-i18next
- **File Upload**: Images stockées dans /app/backend/uploads/

## Admin Credentials
- URL: /admin
- Mot de passe: orso2024
