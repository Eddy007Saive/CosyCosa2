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
- ✅ Gestion propriétés (CRUD)
- ✅ Système de réservation avec price quotes
- ✅ Formulaire de contact (envoi email via Resend)
- ✅ Upload d'images (/api/upload/image)
- ✅ API de gestion des images du site

### Frontend (React)
- ✅ Design minimaliste avec fonts Cormorant Garamond + Manrope
- ✅ Homepage avec hero, search bar, catégories (images dynamiques)
- ✅ Page Propriétés avec filtres par catégorie
- ✅ **Page Détail Propriété améliorée:**
  - Calendrier avec dates bloquées de Beds24
  - Prix calculés en temps réel
  - Indicateur de chargement des disponibilités
  - Message pour propriétés non connectées
  - Indicateur "Dates disponibles - Prix garanti"
- ✅ Formulaire de contact intégré pour propriétés vitrine
- ✅ Lien admin discret dans le footer
- ✅ Page Services (ORSO Essentiel / Premium)
- ✅ Page Contact avec formulaire
- ✅ Internationalisation i18n (FR/EN/ES/IT)

### Admin Panel (/admin - mot de passe: orso2024)
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des propriétés (ajouter, modifier, supprimer)
- ✅ Synchronisation Beds24
- ✅ Gestion des images des propriétés
- ✅ Gestion de la visibilité et catégories
- ✅ Gestion des images du site (6 images configurables)
- ✅ Upload d'images par drag-and-drop

### Integrations
- ✅ **Beds24 API V2** - Synchronisation complète:
  - Propriétés avec rooms
  - Disponibilités en temps réel
  - Prix dynamiques
  - Token auto-refresh
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

### P1 (Important) - COMPLÉTÉ ✅
- [x] Propriétés vitrine - Formulaire de contact intégré
- [x] Lien admin dans le footer
- [ ] Configuration Resend pour emails réels
- [ ] Sécuriser mot de passe admin (variable d'environnement)

### P2 (Nice to have)
- [ ] Synchronisation automatique Beds24 (tâche de fond)
- [ ] Optimisation SEO/GEO pour la Corse
- [ ] Carte interactive Google Maps
- [ ] Avis clients / témoignages
- [ ] Blog / Actualités

## Technical Stack
- **Backend**: FastAPI, MongoDB, Motor
- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Integrations**: Beds24 API V2, Resend (email), Stripe (via Beds24)
- **i18n**: react-i18next
- **File Upload**: Images stockées dans /app/backend/uploads/

## Admin Credentials
- URL: /admin (ou cliquer sur "Admin" dans le footer)
- Mot de passe: orso2024

## Notes techniques importantes
- Le calendrier Beds24 retourne des données vides pour les dates sans réservations configurées
- Le système fait un fallback automatique au prix de base si l'API Beds24 ne retourne pas de prix
- Les propriétés non connectées à Beds24 affichent un avertissement "Prix indicatifs"
