// SEO is handled in index.html with comprehensive static meta tags and structured data
// Dynamic SEO via react-helmet-async causes React rendering issues in this codebase
// The index.html contains full SEO including:
// - Primary meta tags (title, description, keywords)
// - Open Graph / Facebook meta tags
// - Twitter Card meta tags  
// - Geo tags for local Corsica SEO
// - Structured data (Organization, LocalBusiness)
// - Canonical URLs and hreflang alternates for i18n

// These empty components maintain compatibility with existing imports
// For property-specific SEO, consider server-side rendering in future

const SEO = () => null;

export const PropertySEO = () => null;
export const ServicesSEO = () => null;
export const ContactSEO = () => null;
export const PropertiesSEO = () => null;
export const LegalSEO = () => null;

export default SEO;
