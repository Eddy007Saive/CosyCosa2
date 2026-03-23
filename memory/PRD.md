# Cosy Casa - Product Requirements Document

## Projet
Site web pour **Cosy Casa**, conciergerie locative en Corse du Sud (Porto-Vecchio, Lecci, Pinarello).

## URL du site d'origine
https://cosycasa.fr/

## Design
- **Palette** : Gris foncé `#2e2e2e` + Blanc
- **Typographie** : `Cormorant Garamond` (serif élégant)
- **Style** : Minimaliste et élégant, template hérité d'ORSO RS

## Architecture
```
/app/
├── backend/
│   ├── .env (Beds24, Cloudinary, Brevo, MongoDB)
│   └── server.py (FastAPI monolithique)
├── frontend/
│   ├── public/
│   │   ├── cosycasa-logo.png
│   │   └── index.html (SEO complet CosyCasa)
│   └── src/
│       ├── App.js (routes CosyCasa)
│       ├── index.css (styles globaux)
│       ├── components/
│       │   ├── layout/ (Navbar.jsx, Footer.jsx)
│       │   ├── ui/ (shadcn components)
│       │   └── SEO.jsx (stubs - react-helmet désactivé)
│       ├── pages/
│       │   ├── HomePage.jsx (hero, bienvenue, propriétaires, voyageurs, témoignages, tendances)
│       │   ├── ConciergeriePage.jsx (offres + avantages)
│       │   ├── PropertiesPage.jsx (listing Beds24)
│       │   ├── PropertyDetailPage.jsx (détail + calendrier réservation)
│       │   ├── ContactPage.jsx (formulaire + infos)
│       │   ├── BlogPage.jsx (3 articles SEO: Lecci, Pinarello, Corse)
│       │   ├── AdminPage.jsx (backoffice)
│       │   ├── LegalPage.jsx
│       │   └── PrivacyPage.jsx
│       ├── i18n/index.js (FR/EN/ES/IT)
│       └── lib/api.js
└── memory/
    └── PRD.md
```

## URLs (SEO préservé)
| URL | Page |
|-----|------|
| `/` | Homepage |
| `/locations-vacances-cosy-casa` | Listing propriétés |
| `/locations-vacances-cosy-casa/:id` | Détail propriété |
| `/conciergerie` | Page Conciergerie |
| `/contact` | Contact |
| `/conciergerie-cosy-casa-a-lecci` | Article SEO Lecci |
| `/conciergerie-cosy-casa-a-pinarello` | Article SEO Pinarello |
| `/conciergerie-cosy-casa-a-corse` | Article SEO Corse |
| `/legal` | Mentions légales |
| `/privacy` | Politique confidentialité |
| `/admin` | Panneau admin |

## Intégrations
- **Beds24** : Propriétés, tarification dynamique, réservations (owner ID: 123322)
- **Stripe** : Paiement (via Beds24)
- **Brevo** : Emails transactionnels
- **Cloudinary** : Hébergement d'images

## Base de données
- **MongoDB** : DB `cosycasa`
- Collections : `properties`, `site_settings`, `categories`, `bookings`

## Admin
- URL : `/admin`
- Mot de passe : `orso2024`
- Fonctionnalités : gestion propriétés (afficher/cacher, modifier), images du site, PDF services

## Contact
- Email : contact@cosycasa.fr
- Téléphone : +33 6 15 87 64 70
- Instagram : @cosycasaconciergerie
- Facebook : facebook.com/profile.php?id=61556104644895

## Ce qui est implémenté (Mars 2026)
- [x] Rebranding complet ORSO RS → Cosy Casa
- [x] Logo CosyCasa intégré (Navbar + Footer)
- [x] Homepage avec sections: Hero, Bienvenue, Propriétaires, Voyageurs, Témoignages, Tendances
- [x] Page Conciergerie (offres + avantages)
- [x] Page Propriétés (listing Beds24 + filtres catégories)
- [x] Page Détail Propriété (calendrier réservation + devis)
- [x] Page Contact (formulaire + infos CosyCasa)
- [x] 3 pages blog SEO (Lecci, Pinarello, Corse)
- [x] Multilingue FR/EN/ES/IT
- [x] SEO complet (meta tags, structured data, breadcrumbs, FAQ)
- [x] Admin backoffice (gestion propriétés + images)
- [x] Sync Beds24 automatique (17 propriétés)
- [x] Upload images Cloudinary
- [x] Pages légales (Mentions légales + Confidentialité)
- [x] Tests passés 100% (backend + frontend)

## Backlog / Prochaines tâches
- [ ] **P1** : Activer les propriétés CosyCasa dans l'admin (actuellement toutes cachées)
- [ ] **P1** : Intégrer Calendly (en attente du lien client)
- [ ] **P2** : Intégrer les "Upsells" (Extras) de Beds24
- [ ] **P2** : Section témoignages dynamique (éditable depuis l'admin)
- [ ] **P2** : Webhook Beds24 pour mise à jour statut réservations
- [ ] **P3** : Résoudre le bug SEO react-helmet-async (page blanche)
- [ ] **P3** : Refactoring server.py en modules

## Problèmes connus
- **SEO dynamique** : `react-helmet-async` provoque un bug de page blanche (contourné avec meta tags statiques dans index.html)
- **Propriétés cachées** : Toutes les 17 propriétés Beds24 sont `is_active: false` par défaut (nouveau DB). L'admin doit les activer manuellement.
