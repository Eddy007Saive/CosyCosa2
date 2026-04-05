'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2e2e2e] text-white relative overflow-hidden">
      <div className="orso-container py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <img
                src="/cosycasa-logo.png"
                alt="Cosy Casa"
                className="h-32 md:h-36 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-base leading-relaxed max-w-md mb-3">
              Cosy Casa vous propose ses services pour déléguer en toute sérénité et maximiser vos performances !
            </p>
            <p className="text-white/90 text-sm italic tracking-wide mb-6">
              Valoriser. Accueillir. Enchanter.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/cosycasaconciergerie/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61556104644895"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/60 hover:bg-white/10 transition-all"
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
              {[
                { href: '/', label: 'Accueil' },
                { href: '/locations-vacances-cosy-casa', label: 'Nos secteurs' },
                { href: '/a-propos-conciergerie-cosy-casa-en-corse', label: 'A propos' },
                { href: '/partenaires-conciergerie-corse', label: 'Carnet' },
                { href: '/blog-conciergerie-corse', label: 'Blog' },
                { href: '/contact-conciergerie-cosy-casa', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
              Infos
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/legal" className="text-white/80 hover:text-white transition-colors text-sm">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-white transition-colors text-sm">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/conditions-generales-dutilisation" className="text-white/80 hover:text-white transition-colors text-sm">
                  Conditions générales d&apos;utilisations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/60 mb-6">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/60 mt-1 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-white/80 text-sm">Porto-Vecchio, Corse du Sud</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                <a href="tel:+33615876470" className="text-white/80 hover:text-white transition-colors text-sm">
                  +33 6 15 87 64 70
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/60 flex-shrink-0" strokeWidth={1.5} />
                <a href="mailto:hello@conciergerie-cosycasa.fr" className="text-white/80 hover:text-white transition-colors text-sm">
                  hello@conciergerie-cosycasa.fr
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
            <Link href="/admin" className="text-white/30 hover:text-white/50 text-xs uppercase tracking-widest transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
