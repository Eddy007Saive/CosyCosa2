import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://orso-rs.com';

// Default SEO values
const defaults = {
  title: 'ORSO RS | Conciergerie de Luxe & Locations d\'Exception en Corse du Sud',
  description: 'Découvrez ORSO RENTAL SELECTION, une sélection de villas de luxe en Corse du Sud. Locations d\'exception avec vue mer, accès plage et pieds dans l\'eau à Porto-Vecchio, Bonifacio et Calvi.',
  image: 'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200',
};

// Main SEO component for homepage
const SEO = ({ lang }) => {
  const currentLang = lang || 'fr';
  
  const titles = {
    fr: 'ORSO RS | Conciergerie de Luxe & Locations d\'Exception en Corse du Sud',
    en: 'ORSO RS | Luxury Concierge & Exceptional Rentals in Southern Corsica',
    es: 'ORSO RS | Conserjería de Lujo y Alquileres Excepcionales en Córcega del Sur',
    it: 'ORSO RS | Concierge di Lusso e Affitti Eccezionali in Corsica del Sud',
  };

  const descriptions = {
    fr: 'Découvrez ORSO RENTAL SELECTION, une sélection de villas de luxe en Corse du Sud. Locations d\'exception avec vue mer à Porto-Vecchio, Bonifacio et Calvi.',
    en: 'Discover ORSO RENTAL SELECTION, a selection of luxury villas in Southern Corsica. Exceptional rentals with sea views in Porto-Vecchio, Bonifacio and Calvi.',
    es: 'Descubra ORSO RENTAL SELECTION, una selección de villas de lujo en Córcega del Sur. Alquileres excepcionales con vistas al mar en Porto-Vecchio, Bonifacio y Calvi.',
    it: 'Scopri ORSO RENTAL SELECTION, una selezione di ville di lusso in Corsica del Sud. Affitti eccezionali con vista mare a Porto-Vecchio, Bonifacio e Calvi.',
  };

  const title = titles[currentLang] || titles.fr;
  const description = descriptions[currentLang] || descriptions.fr;

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE_URL}/`} />
    </Helmet>
  );
};

// Properties listing page SEO
export const PropertiesSEO = ({ lang = 'fr', category = null }) => {
  const baseTitles = {
    fr: 'Nos Propriétés | Villas de Luxe en Corse du Sud | ORSO RS',
    en: 'Our Properties | Luxury Villas in Southern Corsica | ORSO RS',
    es: 'Nuestras Propiedades | Villas de Lujo en Córcega del Sur | ORSO RS',
    it: 'Le Nostre Proprietà | Ville di Lusso in Corsica del Sud | ORSO RS',
  };

  const categoryTitles = {
    vue_mer: {
      fr: 'Villas Vue Mer | Locations Luxe Corse du Sud | ORSO RS',
      en: 'Sea View Villas | Luxury Rentals Southern Corsica | ORSO RS',
      es: 'Villas con Vista al Mar | Alquileres de Lujo Córcega | ORSO RS',
      it: 'Ville Vista Mare | Affitti di Lusso Corsica del Sud | ORSO RS',
    },
    plage_a_pieds: {
      fr: 'Villas Plage à Pieds | Accès Direct Plage Corse | ORSO RS',
      en: 'Beachfront Villas | Direct Beach Access Corsica | ORSO RS',
      es: 'Villas Frente a la Playa | Acceso Directo Playa Córcega | ORSO RS',
      it: 'Ville Fronte Mare | Accesso Diretto Spiaggia Corsica | ORSO RS',
    },
    pieds_dans_eau: {
      fr: 'Villas Pieds dans l\'Eau | Locations Bord de Mer Corse | ORSO RS',
      en: 'Waterfront Villas | Seaside Rentals Corsica | ORSO RS',
      es: 'Villas a Pie de Agua | Alquileres Frente al Mar Córcega | ORSO RS',
      it: 'Ville sul Mare | Affitti Fronte Mare Corsica | ORSO RS',
    },
  };

  const descriptions = {
    fr: 'Parcourez notre sélection de villas de luxe en Corse du Sud. Vue mer panoramique, accès plage privé, pieds dans l\'eau. Porto-Vecchio, Bonifacio, Palombaggia.',
    en: 'Browse our selection of luxury villas in Southern Corsica. Panoramic sea views, private beach access, waterfront properties. Porto-Vecchio, Bonifacio, Palombaggia.',
    es: 'Explore nuestra selección de villas de lujo en Córcega del Sur. Vistas panorámicas al mar, acceso privado a la playa. Porto-Vecchio, Bonifacio, Palombaggia.',
    it: 'Sfoglia la nostra selezione di ville di lusso in Corsica del Sud. Vista mare panoramica, accesso privato alla spiaggia. Porto-Vecchio, Bonifacio, Palombaggia.',
  };

  const title = category && categoryTitles[category] 
    ? (categoryTitles[category][lang] || categoryTitles[category].fr)
    : (baseTitles[lang] || baseTitles.fr);
  const description = descriptions[lang] || descriptions.fr;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE_URL}/properties${category ? `?category=${category}` : ''}`} />
    </Helmet>
  );
};

// Single property detail page SEO
export const PropertySEO = ({ property, lang = 'fr' }) => {
  if (!property) return null;

  const title = `${property.name || 'Propriété'} | Location Luxe ${property.location || 'Corse'} | ORSO RS`;
  const description = property.description 
    ? property.description.substring(0, 155) + '...'
    : `Découvrez ${property.name || 'cette propriété d\'exception'} en ${property.location || 'Corse du Sud'}. Location de luxe avec conciergerie premium.`;
  const image = property.images?.[0] || defaults.image;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="product" />
      <link rel="canonical" href={`${BASE_URL}/properties/${property._id || property.id}`} />
    </Helmet>
  );
};

// Services page SEO
export const ServicesSEO = ({ lang = 'fr' }) => {
  const titles = {
    fr: 'Nos Services | Conciergerie de Luxe Corse du Sud | ORSO RS',
    en: 'Our Services | Luxury Concierge Southern Corsica | ORSO RS',
    es: 'Nuestros Servicios | Conserjería de Lujo Córcega del Sur | ORSO RS',
    it: 'I Nostri Servizi | Concierge di Lusso Corsica del Sud | ORSO RS',
  };

  const descriptions = {
    fr: 'Découvrez nos services de conciergerie de luxe en Corse : ORSO Essentiel et ORSO Premium. Accueil personnalisé, chef privé, excursions en bateau, spa.',
    en: 'Discover our luxury concierge services in Corsica: ORSO Essential and ORSO Premium. Personalized welcome, private chef, boat excursions, spa.',
    es: 'Descubra nuestros servicios de conserjería de lujo en Córcega: ORSO Esencial y ORSO Premium. Bienvenida personalizada, chef privado, excursiones en barco.',
    it: 'Scopri i nostri servizi di concierge di lusso in Corsica: ORSO Essential e ORSO Premium. Accoglienza personalizzata, chef privato, escursioni in barca.',
  };

  const title = titles[lang] || titles.fr;
  const description = descriptions[lang] || descriptions.fr;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE_URL}/services`} />
    </Helmet>
  );
};

// Contact page SEO
export const ContactSEO = ({ lang = 'fr' }) => {
  const titles = {
    fr: 'Contact | ORSO RS Conciergerie Corse du Sud',
    en: 'Contact | ORSO RS Concierge Southern Corsica',
    es: 'Contacto | ORSO RS Conserjería Córcega del Sur',
    it: 'Contatto | ORSO RS Concierge Corsica del Sud',
  };

  const descriptions = {
    fr: 'Contactez ORSO RS pour votre projet de location de villa de luxe en Corse du Sud. Notre équipe est à votre disposition pour créer votre séjour sur-mesure.',
    en: 'Contact ORSO RS for your luxury villa rental project in Southern Corsica. Our team is at your disposal to create your tailor-made stay.',
    es: 'Contacte con ORSO RS para su proyecto de alquiler de villa de lujo en Córcega del Sur. Nuestro equipo está a su disposición.',
    it: 'Contatta ORSO RS per il tuo progetto di affitto di villa di lusso in Corsica del Sud. Il nostro team è a tua disposizione.',
  };

  const title = titles[lang] || titles.fr;
  const description = descriptions[lang] || descriptions.fr;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${BASE_URL}/contact`} />
    </Helmet>
  );
};

// Legal pages SEO
export const LegalSEO = ({ page = 'legal', lang = 'fr' }) => {
  const titles = {
    legal: {
      fr: 'Mentions Légales | ORSO RS',
      en: 'Legal Notice | ORSO RS',
      es: 'Aviso Legal | ORSO RS',
      it: 'Note Legali | ORSO RS',
    },
    privacy: {
      fr: 'Politique de Confidentialité | ORSO RS',
      en: 'Privacy Policy | ORSO RS',
      es: 'Política de Privacidad | ORSO RS',
      it: 'Informativa sulla Privacy | ORSO RS',
    },
  };

  const title = titles[page]?.[lang] || titles[page]?.fr || 'ORSO RS';

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
};

export default SEO;
