import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const languages = ['FR', 'EN', 'ES', 'IT'];

  // Pages with dark hero backgrounds that need light text
  const darkHeroPages = ['/proprietaire', '/contact'];
  const hasDarkHero = darkHeroPages.includes(location.pathname);
  
  // Use light text when on dark hero pages AND not scrolled
  const useLightText = hasDarkHero && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang.toLowerCase());
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/properties', label: t('nav.properties') },
    { href: '/esprit', label: t('nav.esprit') },
    { href: '/proprietaire', label: t('nav.proprietaire') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-header border-b border-gray-100'
          : 'bg-transparent'
      }`}
      data-testid="navbar"
    >
      <div className="orso-container">
        <nav className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
            data-testid="navbar-logo"
          >
            <div className={`flex flex-col items-center ${useLightText ? 'text-white' : 'text-[#2e2e2e]'}`}>
              {/* Top vertical line */}
              <div className={`w-px h-4 ${useLightText ? 'bg-white/40' : 'bg-[#2e2e2e]/30'}`} />
              
              {/* Logo Text */}
              <div className="text-center my-1">
                <h1 className="text-lg md:text-xl tracking-[0.3em] font-light">
                  O R S O
                </h1>
                <p className={`text-[8px] tracking-[0.2em] ${useLightText ? 'text-white/60' : 'text-[#2e2e2e]/60'} uppercase`}>
                  Rental Selection
                </p>
              </div>
              
              {/* Bottom vertical line */}
              <div className={`w-px h-4 ${useLightText ? 'bg-white/40' : 'bg-[#2e2e2e]/30'}`} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link text-sm uppercase tracking-widest transition-all ${
                  isActive(link.href)
                    ? useLightText ? 'text-white opacity-100' : 'text-[#2e2e2e] opacity-100'
                    : useLightText ? 'text-white opacity-70 hover:opacity-100' : 'text-[#2e2e2e] opacity-60 hover:opacity-100'
                }`}
                data-testid={`nav-link-${link.href.slice(1) || 'home'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher + CTA */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language Switcher */}
            <div className={`lang-switch flex items-center gap-2 text-xs uppercase tracking-widest ${useLightText ? 'text-white' : 'text-[#2e2e2e]'}`}>
              {languages.map((lang, index) => (
                <span key={lang} className="flex items-center">
                  <button
                    onClick={() => changeLanguage(lang)}
                    className={`transition-opacity ${
                      i18n.language.toUpperCase() === lang
                        ? 'opacity-100 font-medium'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                    data-testid={`lang-switch-${lang.toLowerCase()}`}
                  >
                    {lang}
                  </button>
                  {index < languages.length - 1 && (
                    <span className="mx-2 opacity-30">/</span>
                  )}
                </span>
              ))}
            </div>

            {/* Book CTA */}
            <Link to="/properties">
              <Button
                className={useLightText ? "bg-white text-[#2e2e2e] hover:bg-white/90 px-6 py-2 rounded-full uppercase tracking-widest text-xs font-medium" : "orso-btn-primary"}
                data-testid="nav-book-btn"
              >
                {t('nav.book')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={useLightText ? "text-white" : "text-[#2e2e2e]"}
                  data-testid="mobile-menu-trigger"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" strokeWidth={1.5} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] bg-white border-l border-gray-100"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <img 
                      src="/orso-logo.png" 
                      alt="ORSO Rental Selection" 
                      className="h-8 w-auto"
                    />
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5" strokeWidth={1.5} />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 py-8">
                    <ul className="space-y-6">
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <SheetClose asChild>
                            <Link
                              to={link.href}
                              className={`block font-serif text-3xl transition-opacity ${
                                isActive(link.href)
                                  ? 'opacity-100'
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                              data-testid={`mobile-nav-${link.href.slice(1) || 'home'}`}
                            >
                              {link.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Language Switcher */}
                  <div className="py-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => changeLanguage(lang)}
                          className={`text-sm uppercase tracking-widest transition-opacity ${
                            i18n.language.toUpperCase() === lang
                              ? 'opacity-100 font-medium'
                              : 'opacity-40 hover:opacity-80'
                          }`}
                          data-testid={`mobile-lang-${lang.toLowerCase()}`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="py-6">
                    <SheetClose asChild>
                      <Link to="/properties" className="block">
                        <Button
                          className="orso-btn-primary w-full"
                          data-testid="mobile-book-btn"
                        >
                          {t('nav.book')}
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
