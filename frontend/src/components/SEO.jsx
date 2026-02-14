import { Helmet } from 'react-helmet-async';

const SEO_CONFIG = {
  siteName: 'ORSO RS',
  siteUrl: 'https://orso-rs.com',
  defaultImage: 'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200',
  defaultDescription: 'Découvrez ORSO RENTAL SELECTION, une sélection de villas de luxe en Corse du Sud. Locations d\'exception avec vue mer, accès plage et pieds dans l\'eau à Porto-Vecchio, Bonifacio et Calvi.',
  geoRegion: 'FR-2A',
  geoPosition: '41.5917;9.2794',
};

const SEO = ({
  title = '',
  description = '',
  image = '',
  url = '',
  type = 'website',
  keywords = null,
  noIndex = false,
  structuredData = null,
  lang = 'fr',
}) => {
  const fullTitle = title && title.length > 0
    ? `${title} | ${SEO_CONFIG.siteName}` 
    : `${SEO_CONFIG.siteName} | Conciergerie de Luxe & Locations d'Exception en Corse du Sud`;
  
  const metaDescription = description || SEO_CONFIG.defaultDescription;
  const metaImage = image || SEO_CONFIG.defaultImage;
  const metaUrl = url || SEO_CONFIG.siteUrl;
  
  const defaultKeywords = [
    'location villa luxe corse',
    'conciergerie corse du sud',
    'villa porto-vecchio',
    'location vacances bonifacio',
    'villa vue mer corse',
    'pieds dans l\'eau corse',
    'location prestige corse',
    'villa palombaggia',
    'santa giulia location',
    'calvi villa luxe',
    'location saisonnière corse',
    'villa piscine corse',
  ];
  
  const metaKeywords = keywords && keywords.length > 0
    ? [...keywords, ...defaultKeywords].join(', ')
    : defaultKeywords.join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Geo Tags */}
      <meta name="geo.region" content={SEO_CONFIG.geoRegion} />
      <meta name="geo.position" content={SEO_CONFIG.geoPosition} />
      
      {/* Canonical */}
      <link rel="canonical" href={metaUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Pre-configured SEO for property pages
export const PropertySEO = ({ property, lang = 'fr' }) => {
  if (!property) return null;
  
  const categoryNames = {
    vue_mer: 'Vue Mer',
    plage_a_pieds: 'Plage à Pieds',
    pieds_dans_eau: 'Pieds dans l\'Eau',
  };
  
  const categoryName = categoryNames[property.category] || property.category;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "name": property.name,
    "description": property.description?.[lang] || property.description?.fr || '',
    "url": `${SEO_CONFIG.siteUrl}/properties/${property.id}`,
    "image": property.images?.[0] || SEO_CONFIG.defaultImage,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city || 'Porto-Vecchio',
      "addressRegion": "Corse du Sud",
      "addressCountry": "France"
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": property.max_guests
    },
    "amenityFeature": property.amenities?.map(a => ({
      "@type": "LocationFeatureSpecification",
      "name": a
    })) || [],
    "priceRange": property.price_from ? `À partir de ${property.price_from}€/nuit` : "Sur demande",
  };
  
  if (property.coordinates?.lat && property.coordinates?.lng) {
    structuredData.geo = {
      "@type": "GeoCoordinates",
      "latitude": property.coordinates.lat,
      "longitude": property.coordinates.lng
    };
  }
  
  return (
    <SEO
      title={`${property.name} - ${categoryName} à ${property.city || 'Corse du Sud'}`}
      description={`Location de luxe ${property.name} en Corse du Sud. ${property.bedrooms} chambres, ${property.max_guests} personnes. ${categoryName}. ${property.city ? `À ${property.city}.` : ''} Réservez votre séjour d'exception.`}
      image={property.images?.[0]}
      url={`${SEO_CONFIG.siteUrl}/properties/${property.id}`}
      type="product"
      keywords={[
        `location ${property.name}`,
        `villa ${property.city || 'corse'}`,
        `location ${categoryName.toLowerCase()} corse`,
        `vacances ${property.city || 'corse du sud'}`,
      ]}
      structuredData={structuredData}
      lang={lang}
    />
  );
};

// Pre-configured SEO for services page
export const ServicesSEO = ({ lang = 'fr' }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Conciergerie de luxe",
    "provider": {
      "@type": "LocalBusiness",
      "name": "ORSO RENTAL SELECTION",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Porto-Vecchio",
        "addressRegion": "Corse du Sud",
        "addressCountry": "France"
      }
    },
    "areaServed": {
      "@type": "State",
      "name": "Corse du Sud"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services de Conciergerie",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ORSO Essentiel",
            "description": "Services essentiels de conciergerie incluant gestion des clés, ménage et assistance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ORSO Premium",
            "description": "Services premium avec chef privé, excursions en bateau, spa et expériences sur-mesure"
          }
        }
      ]
    }
  };
  
  return (
    <SEO
      title="Services de Conciergerie de Luxe en Corse"
      description="Découvrez nos services de conciergerie premium en Corse du Sud. ORSO Essentiel et ORSO Premium : chef privé, excursions en bateau, spa, transferts VIP et expériences sur-mesure pour un séjour inoubliable."
      url={`${SEO_CONFIG.siteUrl}/services`}
      keywords={[
        'conciergerie luxe corse',
        'chef privé porto-vecchio',
        'excursion bateau corse',
        'service premium vacances',
        'conciergerie bonifacio',
        'location avec services corse',
      ]}
      structuredData={structuredData}
      lang={lang}
    />
  );
};

// Pre-configured SEO for contact page
export const ContactSEO = ({ lang = 'fr' }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact ORSO RS",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "ORSO RENTAL SELECTION",
      "email": "hello@conciergerie-cosycasa.fr",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Porto-Vecchio",
        "addressRegion": "Corse du Sud",
        "addressCountry": "France"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    }
  };
  
  return (
    <SEO
      title="Contact - Réservation Villa de Luxe Corse"
      description="Contactez ORSO RS pour réserver votre villa de luxe en Corse du Sud. Notre équipe est à votre disposition pour organiser votre séjour d'exception à Porto-Vecchio, Bonifacio ou Calvi."
      url={`${SEO_CONFIG.siteUrl}/contact`}
      keywords={[
        'contact location corse',
        'réservation villa porto-vecchio',
        'demande devis location corse',
        'conciergerie corse contact',
      ]}
      structuredData={structuredData}
      lang={lang}
    />
  );
};

// Pre-configured SEO for properties listing page
export const PropertiesSEO = ({ category, city, lang = 'fr' }) => {
  const categoryNames = {
    vue_mer: 'Vue Mer',
    plage_a_pieds: 'Plage à Pieds',
    pieds_dans_eau: 'Pieds dans l\'Eau',
  };
  
  let title = 'Villas de Luxe en Corse du Sud';
  let description = 'Découvrez notre sélection de villas de luxe en Corse du Sud. Locations d\'exception avec vue mer, accès plage et pieds dans l\'eau.';
  
  if (category) {
    const catName = categoryNames[category] || category;
    title = `Villas ${catName} - Locations de Luxe en Corse`;
    description = `Sélection de villas ${catName.toLowerCase()} en Corse du Sud. Locations de prestige pour des vacances d'exception.`;
  }
  
  if (city) {
    title = `Villas de Luxe à ${city} - Locations Corse`;
    description = `Découvrez nos villas de luxe à ${city}, Corse du Sud. Locations d'exception avec services de conciergerie premium.`;
  }
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "description": description,
    "itemListElement": []
  };
  
  return (
    <SEO
      title={title}
      description={description}
      url={`${SEO_CONFIG.siteUrl}/properties${category ? `?category=${category}` : ''}${city ? `?city=${city}` : ''}`}
      keywords={[
        'villas luxe corse',
        'location vacances porto-vecchio',
        'villa vue mer bonifacio',
        'location prestige calvi',
        category && `villa ${categoryNames[category]?.toLowerCase() || category} corse`,
        city && `location ${city} corse`,
      ].filter(Boolean)}
      structuredData={structuredData}
      lang={lang}
    />
  );
};

export default SEO;
