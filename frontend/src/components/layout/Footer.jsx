import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#2e2e2e] text-white relative overflow-hidden"
      data-testid="footer"
    >
      <div className="orso-container py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/cosycasa-logo.png" 
                alt="Cosy Casa" 
                className="h-24 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-base leading-relaxed max-w-md mb-6">
              {t('footer.tagline')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/cosycasaconciergerie/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 transition-all"
                data-testid="footer-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61556104644895"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 transition-all"
                data-testid="footer-facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Plan du site */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
              Plan du site
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/locations-vacances-cosy-casa" className="text-white/80 hover:text-white transition-colors text-sm">
                  Nos secteurs
                </Link>
              </li>
              <li>
                <Link to="/a-propos-conciergerie-cosy-casa-en-corse" className="text-white/80 hover:text-white transition-colors text-sm">
                  A propos
                </Link>
              </li>
              <li>
                <Link to="/partenaires-conciergerie-corse" className="text-white/80 hover:text-white transition-colors text-sm">
                  Partenaires
                </Link>
              </li>
              <li>
                <Link to="/temoignages" className="text-white/80 hover:text-white transition-colors text-sm">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact-conciergerie-cosy-casa" className="text-white/80 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
              Infos
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/legal"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-link-legal"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-link-privacy"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  to="/conditions-generales-dutilisation"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-link-cgu"
                >
                  Conditions générales d'utilisations
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
                  Porto-Vecchio, Corse du Sud
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                <a
                  href="tel:+33615876470"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-phone"
                >
                  +33 6 15 87 64 70
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                <a
                  href="mailto:contact@cosycasa.fr"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-email"
                >
                  contact@cosycasa.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-xs uppercase tracking-widest">
              {currentYear} Cosy Casa. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-6">
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
