// Shared SEO/GEO constants — production site URL + verified business info.
// Only facts already visible in the site copy (footer, legal pages, contact page)
// are used here; nothing about the company is invented.

export const SITE_URL = 'https://cosycasa.fr';

export const BUSINESS_INFO = {
  name: 'Cosy Casa Conciergerie',
  legalName: 'Cosy Casa (SARL AT OME)',
  url: SITE_URL,
  telephone: '+33615876470',
  email: 'hello@conciergerie-cosycasa.fr',
  logo: `${SITE_URL}/cosycasa-logo.png`,
  image: `${SITE_URL}/og-image.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Porto-Vecchio',
    addressRegion: 'Corse-du-Sud',
    postalCode: '20137',
    addressCountry: 'FR',
  },
  areaServed: [
    'Porto-Vecchio',
    'Lecci',
    'Pinarello',
    'Sainte-Lucie de Porto-Vecchio',
    'Zonza',
    'Bonifacio',
    'Corse-du-Sud',
  ],
  sameAs: [
    'https://www.facebook.com/profile.php?id=61556104644895',
    'https://www.instagram.com/cosycasaconciergerie/',
  ],
} as const;

/** LocalBusiness JSON-LD — a minima, no invented fields (no street address / SIRET). */
export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.telephone,
    email: BUSINESS_INFO.email,
    image: BUSINESS_INFO.image,
    logo: BUSINESS_INFO.logo,
    address: BUSINESS_INFO.address,
    areaServed: BUSINESS_INFO.areaServed,
    sameAs: BUSINESS_INFO.sameAs,
  };
}
