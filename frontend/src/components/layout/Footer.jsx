import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, ExternalLink, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#2e2e2e] text-white relative overflow-hidden"
      data-testid="footer"
    >
      {/* Watermark */}
      <div className="footer-watermark font-serif select-none text-white">
        ORSO
      </div>

      <div className="orso-container py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
                ORSO
              </h2>
              <span className="text-xs uppercase tracking-[0.3em] text-white/60 mt-2 block">
                Rental Selection
              </span>
            </Link>
            <p className="text-white/70 text-base leading-relaxed max-w-md mb-6">
              {t('footer.tagline')}
            </p>
            
            {/* Social Links + GMB */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/orso.rental.selection/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 transition-all"
                data-testid="footer-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/people/ORSO-Rental-Selection/61578475163360/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 transition-all"
                data-testid="footer-facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://share.google/AJqwlTVKrw5cqQIyD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm border border-white/20 px-4 py-2 hover:border-white/40"
                data-testid="footer-gmb-link"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                {t('footer.googleMyBusiness', 'Voir sur Google')}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/properties"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-link-properties"
                >
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-link-services"
                >
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-link-contact"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/60 mt-1 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-white/80 text-sm">
                  {t('contact.info.address')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                <a
                  href="tel:+33615875470"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-phone"
                >
                  +33 6 15 87 54 70
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                <a
                  href="mailto:contact@orso-rs.com"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-email"
                >
                  contact@orso-rs.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-xs uppercase tracking-widest">
              {currentYear} ORSO RS. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/legal"
                className="text-white/50 hover:text-white/80 text-xs uppercase tracking-widest transition-colors"
              >
                {t('footer.legal')}
              </Link>
              <Link
                to="/privacy"
                className="text-white/50 hover:text-white/80 text-xs uppercase tracking-widest transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to="/admin"
                className="text-white/30 hover:text-white/50 text-xs uppercase tracking-widest transition-colors"
                data-testid="footer-admin-link"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
