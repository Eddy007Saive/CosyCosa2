import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [sectors, setSectors] = useState([]);
  const dropdownRef = useRef(null);
  const dropdownTimeout = useRef(null);

  const languages = ['FR', 'EN', 'ES', 'IT'];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sectors`);
        if (res.ok) {
          const data = await res.json();
          setSectors(data);
        }
      } catch (err) {
        console.error('Error fetching sectors:', err);
      }
    };
    fetchSectors();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const lang = i18n.language;
  const getLangField = (obj, field) => {
    const map = { fr: '_fr', en: '_en', es: '_es', it: '_it' };
    const suffix = map[lang] || '_fr';
    return obj[`${field}${suffix}`] || obj[`${field}_fr`] || '';
  };

  const sectorItems = sectors.map(s => ({
    href: `/${s.slug}`,
    label: getLangField(s, 'city')
  }));

  const navItems = [
    { type: 'link', href: '/', label: t('nav.home') },
    {
      type: 'dropdown',
      label: t('nav.services'),
      key: 'services',
      items: [
        { href: '/conciergerie-pour-proprietaires-corse', label: t('nav.servicesOwner') },
        { href: '/locations-vacances-cosy-casa', label: t('nav.servicesTraveler') },
      ]
    },
    ...(sectorItems.length > 0 ? [{
      type: 'dropdown',
      label: t('nav.sectors'),
      key: 'sectors',
      items: sectorItems
    }] : []),
    { type: 'link', href: '/a-propos-conciergerie-cosy-casa-en-corse', label: t('nav.about') },
    { type: 'link', href: '/partenaires-conciergerie-corse', label: t('nav.partners') },
    { type: 'link', href: '/blog-conciergerie-corse', label: t('nav.blog') },
    { type: 'link', href: '/contact-conciergerie-cosy-casa', label: t('nav.contact') },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isDropdownActive = (items) => {
    return items.some(item => location.pathname === item.href);
  };

  const handleDropdownEnter = (key) => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" data-testid="navbar">
      {/* Top Bar - Contact Info + Logo + Social */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-28 opacity-100'
        }`}
      >
        <div className="bg-[#3a3a3a]/80 backdrop-blur-md border-b border-white/10">
          <div className="orso-container">
            <div className="flex items-center justify-between h-20 md:h-24">
              {/* Left: Contact Info */}
              <div className="hidden md:flex flex-col gap-1.5">
                <a
                  href="tel:+33615876470"
                  className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="topbar-phone"
                >
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="tracking-wide">+33 6 15 87 64 70</span>
                </a>
                <a
                  href="mailto:hello@conciergerie-cosycasa.fr"
                  className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="topbar-email"
                >
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="tracking-wide">hello@conciergerie-cosycasa.fr</span>
                </a>
              </div>

              {/* Center: Logo */}
              <Link
                to="/"
                className="absolute left-1/2 -translate-x-1/2"
                data-testid="navbar-logo"
              >
                <img
                  src="/cosycasa-logo.png"
                  alt="Cosy Casa Conciergerie"
                  className="h-14 md:h-16 w-auto brightness-0 invert"
                />
              </Link>

              {/* Right: Language Switcher */}
              <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-white">
                {languages.map((lng, index) => (
                  <span key={lng} className="flex items-center">
                    <button
                      onClick={() => i18n.changeLanguage(lng.toLowerCase())}
                      className={`transition-opacity ${
                        i18n.language.toUpperCase() === lng
                          ? 'opacity-100 font-medium'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                      data-testid={`lang-switch-${lng.toLowerCase()}`}
                    >
                      {lng}
                    </button>
                    {index < languages.length - 1 && (
                      <span className="mx-2 opacity-30">/</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Mobile: Hamburger */}
              <div className="md:hidden ml-auto">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      data-testid="mobile-menu-trigger"
                      aria-label="Open menu"
                    >
                      <Menu className="h-6 w-6" strokeWidth={1.5} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:w-[400px] bg-[#2e2e2e] border-l border-white/10"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between py-4 border-b border-white/10">
                        <img src="/cosycasa-logo.png" alt="Cosy Casa" className="h-10 w-auto brightness-0 invert" />
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" aria-label="Close menu">
                            <X className="h-5 w-5" strokeWidth={1.5} />
                          </Button>
                        </SheetClose>
                      </div>

                      {/* Mobile Contact Info */}
                      <div className="py-4 border-b border-white/10 flex flex-col gap-2">
                        <a href="tel:+33615876470" className="flex items-center gap-2 text-white/70 text-sm">
                          <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                          +33 6 15 87 64 70
                        </a>
                        <a href="mailto:hello@conciergerie-cosycasa.fr" className="flex items-center gap-2 text-white/70 text-sm">
                          <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                          hello@conciergerie-cosycasa.fr
                        </a>
                      </div>

                      <nav className="flex-1 py-8 overflow-y-auto">
                        <ul className="space-y-4">
                          {navItems.map((item) => {
                            if (item.type === 'link') {
                              return (
                                <li key={item.href}>
                                  <SheetClose asChild>
                                    <Link
                                      to={item.href}
                                      className={`block font-serif text-2xl text-white transition-opacity ${
                                        isActive(item.href) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                                      }`}
                                    >
                                      {item.label}
                                    </Link>
                                  </SheetClose>
                                </li>
                              );
                            }
                            const isMobileOpen = mobileDropdown === item.key;
                            return (
                              <li key={item.key}>
                                <button
                                  onClick={() => setMobileDropdown(isMobileOpen ? null : item.key)}
                                  className="flex items-center gap-2 font-serif text-2xl text-white opacity-70 hover:opacity-100 w-full text-left"
                                >
                                  {item.label}
                                  <ChevronDown className={`w-5 h-5 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                                </button>
                                {isMobileOpen && (
                                  <ul className="ml-4 mt-3 space-y-3 border-l border-white/20 pl-4">
                                    {item.items.map((subItem) => (
                                      <li key={subItem.href}>
                                        <SheetClose asChild>
                                          <Link
                                            to={subItem.href}
                                            className={`block text-lg font-light text-white transition-opacity ${
                                              isActive(subItem.href) ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                                            }`}
                                          >
                                            {subItem.label}
                                          </Link>
                                        </SheetClose>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </nav>

                      {/* Mobile Language Switcher */}
                      <div className="py-4 border-t border-white/10 flex items-center gap-4">
                        {languages.map((lng) => (
                          <button
                            key={lng}
                            onClick={() => i18n.changeLanguage(lng.toLowerCase())}
                            className={`text-sm uppercase tracking-widest text-white transition-opacity ${
                              i18n.language.toUpperCase() === lng ? 'opacity-100 font-medium' : 'opacity-40 hover:opacity-80'
                            }`}
                            data-testid={`mobile-lang-${lng.toLowerCase()}`}
                          >
                            {lng}
                          </button>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#2e2e2e]/95 backdrop-blur-md shadow-lg'
            : 'bg-[#3a3a3a]/60 backdrop-blur-sm border-b border-white/5'
        }`}
        ref={dropdownRef}
        data-testid="nav-bar"
      >
        <div className="orso-container">
          <div className="hidden md:flex items-center justify-center h-12">
            {/* Scrolled: show compact logo */}
            {isScrolled && (
              <Link to="/" className="absolute left-6 lg:left-12" data-testid="navbar-logo-compact">
                <img
                  src="/cosycasa-logo.png"
                  alt="Cosy Casa"
                  className="h-8 w-auto brightness-0 invert"
                />
              </Link>
            )}

            {navItems.map((item, index) => {
              const showSeparator = index > 0;

              if (item.type === 'link') {
                const active = isActive(item.href);
                return (
                  <div key={item.href} className="flex items-center">
                    {showSeparator && (
                      <span className="mx-4 text-white/20 text-sm select-none">|</span>
                    )}
                    <Link
                      to={item.href}
                      className={`relative text-sm uppercase tracking-[0.15em] transition-all py-1 ${
                        active
                          ? 'text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                      data-testid={`nav-link-${item.href.slice(1) || 'home'}`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#8fa87a] rounded-full" />
                      )}
                    </Link>
                  </div>
                );
              }

              // Dropdown
              const active = isDropdownActive(item.items);
              const isOpenDrop = openDropdown === item.key;

              return (
                <div
                  key={item.key}
                  className="flex items-center"
                  onMouseEnter={() => handleDropdownEnter(item.key)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {showSeparator && (
                    <span className="mx-4 text-white/20 text-sm select-none">|</span>
                  )}
                  <div className="relative">
                    <button
                      className={`flex items-center gap-1.5 text-sm uppercase tracking-[0.15em] transition-all py-1 ${
                        active
                          ? 'text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                      data-testid={`nav-dropdown-${item.key}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${isOpenDrop ? 'rotate-180' : ''}`}
                        strokeWidth={1.5}
                      />
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#8fa87a] rounded-full" />
                      )}
                    </button>

                    {isOpenDrop && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-[220px] bg-[#2e2e2e]/95 backdrop-blur-md border border-white/10 shadow-xl py-2 animate-fade-in z-50">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={`block px-5 py-3 text-sm tracking-wide transition-colors ${
                              isActive(subItem.href)
                                ? 'text-white bg-white/10'
                                : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                            data-testid={`nav-sub-${subItem.href.slice(1)}`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile nav bar - only logo + hamburger when scrolled */}
          <div className={`md:hidden flex items-center justify-between h-12 ${isScrolled ? '' : 'hidden'}`}>
            <Link to="/" data-testid="navbar-logo-mobile-compact">
              <img src="/cosycasa-logo.png" alt="Cosy Casa" className="h-7 w-auto brightness-0 invert" />
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-8 w-8"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
