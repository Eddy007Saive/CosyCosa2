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
  - Équipements/Amenities (via featureCodes) - 8 équipements affichés par propriété
  - Min/Max stay
  - Caution (security deposit)
  - Frais de ménage (cleaning fee)
  - Horaires check-in/check-out
  - Prix dynamiques en temps réel
  - Disponibilités via calendrier
- **Flux de réservation avec paiement Stripe direct (P0 RÉSOLU):**
  - Backend crée réservation dans Beds24 via API
  - Génère URL de paiement Stripe direct (`bookpay.php`)
  - L'utilisateur est redirigé directement vers la page de paiement Stripe
  - **Contourne le formulaire de réservation Beds24** (demande utilisateur critique)

### ✅ Frontend (React)
- **Homepage avec badge de confiance** (ajouté Feb 18):
  - "Paiement 100% sécurisé" avec icône ✓
  - "Service premium depuis 2011" avec étoile ★
  - Multilingue FR/EN/ES/IT
- Page Propriétés avec filtres par catégorie
- **Page Détail Propriété COMPLÈTE :**
  - Galerie d'images
  - **Description avec texte de secours** si Beds24 vide (Feb 18)
  - **Équipements/Amenities** (8 items par propriété)
  - **Informations pratiques** :
    - Horaires arrivée/départ
    - Séjour minimum
    - Caution
    - Frais de ménage
  - **Calendrier de disponibilité FONCTIONNEL** (testé et validé)
  - Calcul de prix dynamique (ex: 900€ x 4 nuits = 3600€)
  - **Bouton "Paiement sécurisé par Stripe"**
  - **Modal de réservation avec redirection vers Stripe**
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
- **Endpoint `/api/bookings` - Crée réservation dans Beds24 + retourne payment_url Stripe**
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
- Schema.org (Organization, LocalBusiness, FAQ...) dans index.html
- Open Graph / Twitter Cards
- Geo tags Corse du Sud
- **Note:** SEO dynamique via react-helmet-async désactivé (provoque page blanche)
- Le SEO statique dans index.html est très complet et suffisant

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
- **Integrations:** Beds24 API V2 (complet), Stripe (via Beds24 bookpay.php)
- **i18n:** react-i18next

## Admin Credentials
- URL: /admin
- Mot de passe: Variable d'environnement ADMIN_PASSWORD

## Data Flow - Réservation (MIS À JOUR)
1. User sélectionne dates sur le calendrier
2. API appelle Beds24 pour prix + disponibilité
3. User clique "BOOK NOW"
4. Modal s'ouvre avec récapitulatif
5. User remplit formulaire (nom, email, téléphone)
6. Clic "RÉSERVER MAINTENANT - PAIEMENT SÉCURISÉ"
7. **Backend crée réservation dans Beds24 API**
8. **Backend retourne URL de paiement Stripe direct**
9. **Redirection vers page Stripe pour paiement** (contourne formulaire Beds24)

## Issues Résolues (Session Feb 18, 2026)
- ✅ **Bug calendrier désactivé (P0)** - Confirmé comme fonctionnel après tests
- ⚠️ **SEO dynamique (P1)** - Maintenu désactivé car provoque bug page blanche. SEO statique suffisant.

## Remaining Tasks (Backlog)
### P1 - Prochain
- [ ] **Upsells/Extras Beds24** - L'utilisateur veut afficher les extras. Les propriétés actuelles n'ont pas d'upsellItems configurés dans Beds24.

### P2 - Future
- [ ] Ajouter section "Témoignages clients"
- [ ] Intégrer liens réseaux sociaux (Instagram/Facebook)
- [ ] Configurer Resend pour emails réels du formulaire de contact

### P3 - Backlog
- [ ] Carte SVG pour localiser les propriétés
- [ ] Blog / Actualités

## Notes Importantes
- Les nouvelles propriétés Beds24 sont **masquées par défaut** - l'admin doit les activer
- Le paiement Stripe est géré via URL directe Beds24 `bookpay.php` avec paramètres g=st (Stripe only) et pc=100 (100% paiement)
- Le token Beds24 a une durée de vie de 24h, le backend le rafraîchit automatiquement
- **L'API Beds24 `/properties` retourne parfois erreur 500** - monitoring recommandé
