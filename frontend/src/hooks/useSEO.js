import { useEffect } from 'react';

const BASE_URL = 'https://cosycasa.fr';
const DEFAULT_IMAGE = `${BASE_URL}/cosycasa-logo.png`;

/**
 * Dynamic SEO hook - updates document title, meta description, 
 * and OG tags without react-helmet-async (which caused white page bug)
 */
const useSEO = ({ title, description, path, image, type = 'website' }) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG tags
    const updateMeta = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag && content) {
        tag.setAttribute('content', content);
      }
    };

    if (title) updateMeta('og:title', title);
    if (description) updateMeta('og:description', description);
    if (path) updateMeta('og:url', `${BASE_URL}${path}`);
    if (image) updateMeta('og:image', image);
    if (type) updateMeta('og:type', type);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && path) {
      canonical.setAttribute('href', `${BASE_URL}${path}`);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && title) twitterTitle.setAttribute('content', title);
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc && description) twitterDesc.setAttribute('content', description);

  }, [title, description, path, image, type]);
};

export default useSEO;
