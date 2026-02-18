# ORSO RS - Product Requirements Document

## Original Problem Statement
Site internet pour une conciergerie locative en Corse appelée ORSO RS. Minimaliste, élégant. Couleurs: #2e2e2e (gris foncé presque noir) & blanc. Moteur de réservation connecté à Beds24 API (pas d'iframe). Trois catégories de logements: VUE MER / PLAGE A PIEDS / PIEDS DANS L'EAU. Site multilingue FR/EN/ES/IT.

## User Personas
1. **Voyageurs haut de gamme** - Recherchent des locations de vacances premium en Corse du Sud
2. **Propriétaires** - Souhaitent confier leur bien à une conciergerie de luxe
3. **Administrateur** - Gère les propriétés et le contenu du site

## What's Been Implemented (Feb 18, 2026)

### ✅ INTÉGRATION BEDS24 COMPLÈTE
- **Synchronisation automatique** toutes les heures (APScheduler)
- **Toutes les données récupérées de Beds24 :**
  - Descriptions (via templates)
  - Équipements/Amenities (via featureCodes)
  - Min/Max stay
  - Caution (security deposit)
  - Frais de ménage (cleaning fee)
  - Horaires check-in/check-out
  - Prix dynamiques en temps réel
  - Disponibilités via calendrier
- **Flux de réservation avec paiement Stripe via Beds24 :**
  - Sélection des dates
  - Calcul du prix en temps réel
  - Modal de réservation
  - Redirection vers Beds24 pour paiement Stripe

### ✅ Frontend (React)
- Homepage avec recherche de dates
- Page Propriétés avec filtres par catégorie
- **Page Détail Propriété COMPLÈTE :**
  - Galerie d'images
  - Description
  - **Équipements/Amenities** (traduits depuis featureCodes Beds24)
  - **Informations pratiques** :
    - Horaires arrivée/départ
    - Séjour minimum
    - Caution
    - Frais de ménage
  - Calendrier avec disponibilités temps réel
  - Calcul de prix dynamique
  - **Bouton "Paiement sécurisé par Stripe"**
  - **Modal de réservation avec redirection vers Beds24**
- Page Services (ORSO Essentiel / Premium)
- Page Contact avec formulaire + téléphone + Google Maps
- **Pages Légales complètes** (AT OME - toutes infos SIRET, RCS, TVA)
- Footer avec téléphone, email, GMB
- Multilingue FR/EN/ES/IT

### ✅ Backend (FastAPI)
- **21 propriétés** en base de données
- **16 propriétés connectées Beds24**
- **Sync complète avec toutes les données Beds24**
- API REST complète
- Endpoint `/properties/{id}/booking-url` pour génération URL Beds24
- Endpoint `/properties/{id}/beds24-details` pour détails complets

### ✅ Admin Panel (`/admin`)
- Authentification sécurisée (ADMIN_PASSWORD en env var)
- Gestion propriétés (activer/masquer)
- Upload photos
- Sync manuelle Beds24
- Gestion images du site par page
- Statut de sync automatique

### ✅ SEO/GEO
- robots.txt + sitemap.xml
- Schema.org (Organization, LocalBusiness, FAQ...)
- Open Graph / Twitter Cards
- Geo tags Corse du Sud

## Informations Légales (AT OME)
- **SIRET :** 538 392 135 00033
- **SIREN :** 538 392 135
- **RCS :** Ajaccio 538 392 135
- **TVA Intracommunautaire :** FR26538392135
- **Capital :** 7 000,00 €
- **Gérant :** Marc VOUILLARMET
- **Adresse :** Pont de l'Oso, Lotissement Puretta, 20170 San-Gavino-di-Carbini

## Informations de Contact
- **Téléphone :** +33 6 15 87 54 70
- **Email :** hello@conciergerie-cosycasa.fr
- **Google My Business :** https://share.google/AJqwlTVKrw5cqQIyD

## Technical Stack
- **Backend:** FastAPI, MongoDB, Motor, APScheduler
- **Frontend:** React, TailwindCSS, Shadcn/UI
- **Integrations:** Beds24 API V2 (complet), Stripe (via Beds24)
- **i18n:** react-i18next

## Admin Credentials
- URL: /admin
- Mot de passe: Variable d'environnement ADMIN_PASSWORD

## Data Flow - Réservation
1. User sélectionne dates sur le calendrier
2. API appelle Beds24 pour prix + disponibilité
3. User clique "BOOK NOW"
4. Modal s'ouvre avec récapitulatif
5. User remplit formulaire (nom, email, téléphone)
6. Clic "RÉSERVER MAINTENANT - PAIEMENT SÉCURISÉ"
7. API génère URL Beds24 avec paramètres pré-remplis
8. Redirection vers page Beds24/Stripe pour paiement

## Remaining Tasks (Backlog)
- [ ] Ajouter vraies photos des propriétés (actuellement images placeholder)
- [ ] Configurer Resend pour emails réels
- [ ] Témoignages clients / avis
- [ ] Blog / Actualités

## Notes Importantes
- Les nouvelles propriétés Beds24 sont **masquées par défaut** - l'admin doit les activer
- Le paiement Stripe est géré par Beds24 (pas d'intégration directe Stripe nécessaire)
- Le token Beds24 a une durée de vie de 24h, le backend le rafraîchit automatiquement
