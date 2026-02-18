import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'ORSO RS - Location de Villas en Corse du Sud';
const SITE_URL = 'https://orso-rs.com';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200';

/**
 * Base SEO component for all pages
 * Accepts lang prop for compatibility but doesn't use it (static meta for SEO)
 */
const SEO = ({ 
  title, 
  description,
  image,
  url,
  type,
  noindex,
  lang // accepted but unused - for compatibility
}) => {
  // Ensure all values are valid strings with safe defaults
  const safeTitle = String(title || 'Location de Villas de Luxe en Corse');
  const safeDescription = String(description || 'Découvrez notre sélection de villas d\'exception en Corse du Sud. Vue mer, pieds dans l\'eau, plages à proximité. Réservation en ligne.');
  const safeImage = String(image || DEFAULT_IMAGE);
  const safeUrl = String(url || '');
  const safeType = String(type || 'website');
  
  const fullTitle = safeTitle.includes(SITE_NAME) ? safeTitle : `${safeTitle} | ${SITE_NAME}`;
  const fullUrl = safeUrl ? `${SITE_URL}${safeUrl}` : SITE_URL;
  
  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={safeImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={safeType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={safeImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

/**
 * SEO for property detail pages
 */
export const PropertySEO = ({ property, lang = 'fr' }) => {
  if (!property) return null;
  
  const name = property.name || 'Propriété';
  const city = property.city || 'Corse du Sud';
  const description = property.description?.[lang] || property.description?.fr || '';
  const shortDesc = description.substring(0, 155) + (description.length > 155 ? '...' : '');
  const image = property.images?.[0] || DEFAULT_IMAGE;
  const price = property.price_from;
  
  const title = `${name} - Location à ${city}`;
  const metaDesc = shortDesc || `${name} à ${city}. ${property.bedrooms || 0} chambres, ${property.max_guests || 4} personnes. Réservez votre séjour de luxe en Corse.`;
  
  return (
    <>
      <Helmet>
        <title>{`${title} | ${SITE_NAME}`}</title>
        <meta name="description" content={metaDesc} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={`${SITE_URL}/properties/${property.id}`} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={image} />
        
        {/* Canonical */}
        <link rel="canonical" href={`${SITE_URL}/properties/${property.id}`} />
      </Helmet>
      
      {/* JSON-LD Structured Data for Property */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "name": name,
            "description": metaDesc,
            "image": image,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": city,
              "addressRegion": "Corse du Sud",
              "addressCountry": "FR"
            },
            ...(price && {
              "priceRange": `${price}€ - ${price * 2}€`
            }),
            "amenityFeature": (property.amenities || []).map(a => ({
              "@type": "LocationFeatureSpecification",
              "name": a,
              "value": true
            }))
          })}
        </script>
      </Helmet>
    </>
  );
};

/**
 * SEO for services page
 */
export const ServicesSEO = () => (
  <SEO
    title="Nos Services de Conciergerie"
    description="Services de conciergerie haut de gamme en Corse du Sud : gestion locative, accueil personnalisé, ménage, maintenance, conciergerie 24/7."
    url="/services"
  />
);

/**
 * SEO for contact page
 */
export const ContactSEO = () => (
  <SEO
    title="Contactez-nous"
    description="Contactez ORSO RS pour réserver votre villa en Corse du Sud ou obtenir des informations sur nos services de conciergerie."
    url="/contact"
  />
);

/**
 * SEO for properties listing page
 */
export const PropertiesSEO = () => (
  <SEO
    title="Nos Villas en Corse du Sud"
    description="Découvrez notre collection de villas de luxe en Corse du Sud : vue mer, plage à pieds, pieds dans l'eau. Porto-Vecchio, Bonifacio, Calvi."
    url="/properties"
  />
);

/**
 * SEO for legal pages
 */
export const LegalSEO = ({ title = 'Mentions Légales', url = '/legal' }) => (
  <SEO
    title={title}
    description={`${title} d'ORSO RS - Conciergerie et location de villas en Corse du Sud.`}
    url={url}
    noindex={true}
  />
);

export default SEO;
