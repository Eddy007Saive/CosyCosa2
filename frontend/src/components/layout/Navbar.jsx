import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
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

  const languages = ['FR', 'EN', 'ES', 'IT'];

  const darkHeroPages = ['/conciergerie', '/conciergerie-pour-proprietaires-corse', '/contact-conciergerie-cosy-casa'];
  const hasDarkHero = darkHeroPages.includes(location.pathname);
  const useLightText = hasDarkHero && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang.toLowerCase());
  };

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
    { type: 'link', href: '/conciergerie', label: t('nav.conciergerie') },
    { type: 'link', href: '/contact-conciergerie-cosy-casa', label: t('nav.contact') },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isDropdownActive = (items) => {
    return items.some(item => location.pathname === item.href);
  };

  const textClass = (active) =>
    `text-sm uppercase tracking-widest transition-all ${
      active
        ? useLightText ? 'text-white opacity-100' : 'text-[#2e2e2e] opacity-100'
        : useLightText ? 'text-white opacity-70 hover:opacity-100' : 'text-[#2e2e2e] opacity-60 hover:opacity-100'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-header border-b border-gray-100 bg-white/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
      data-testid="navbar"
    >
      <div className="orso-container">
        <nav className="flex items-center justify-between h-20 md:h-24" ref={dropdownRef}>
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="navbar-logo">
            <img 
              src="/cosycasa-logo.png" 
              alt="Cosy Casa Conciergerie" 
              className={`h-14 md:h-16 w-auto transition-all duration-300 ${useLightText ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`nav-link ${textClass(isActive(item.href))}`}
                    data-testid={`nav-link-${item.href.slice(1) || 'home'}`}
                  >
                    {item.label}
                  </Link>
                );
              }

              // Dropdown
              const active = isDropdownActive(item.items);
              const isOpenDrop = openDropdown === item.key;

              return (
                <div key={item.key} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpenDrop ? null : item.key)}
                    className={`nav-link flex items-center gap-1 ${textClass(active)}`}
                    data-testid={`nav-dropdown-${item.key}`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpenDrop ? 'rotate-180' : ''}`}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpenDrop && (
                    <div className="absolute top-full left-0 mt-2 min-w-[240px] bg-white border border-gray-100 shadow-lg py-2 animate-fade-in z-50">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={`block px-5 py-3 text-sm transition-colors ${
                            isActive(subItem.href)
                              ? 'text-[#2e2e2e] bg-[#f5f5f3] font-medium'
                              : 'text-gray-600 hover:text-[#2e2e2e] hover:bg-[#f5f5f3]'
                          }`}
                          data-testid={`nav-sub-${subItem.href.slice(1)}`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Language Switcher + CTA */}
          <div className="hidden lg:flex items-center gap-6">
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

            <Link to="/locations-vacances-cosy-casa">
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
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <img src="/cosycasa-logo.png" alt="Cosy Casa" className="h-10 w-auto" />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X className="h-5 w-5" strokeWidth={1.5} />
                      </Button>
                    </SheetClose>
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
                                  className={`block font-serif text-2xl transition-opacity ${
                                    isActive(item.href) ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              </SheetClose>
                            </li>
                          );
                        }

                        // Mobile dropdown
                        const isMobileOpen = mobileDropdown === item.key;
                        return (
                          <li key={item.key}>
                            <button
                              onClick={() => setMobileDropdown(isMobileOpen ? null : item.key)}
                              className="flex items-center gap-2 font-serif text-2xl opacity-70 hover:opacity-100 w-full text-left"
                            >
                              {item.label}
                              <ChevronDown className={`w-5 h-5 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                            </button>
                            {isMobileOpen && (
                              <ul className="ml-4 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                                {item.items.map((subItem) => (
                                  <li key={subItem.href}>
                                    <SheetClose asChild>
                                      <Link
                                        to={subItem.href}
                                        className={`block text-lg font-light transition-opacity ${
                                          isActive(subItem.href) ? 'opacity-100 text-[#2e2e2e]' : 'opacity-60 hover:opacity-100'
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

                  <div className="py-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => changeLanguage(lang)}
                          className={`text-sm uppercase tracking-widest transition-opacity ${
                            i18n.language.toUpperCase() === lang ? 'opacity-100 font-medium' : 'opacity-40 hover:opacity-80'
                          }`}
                          data-testid={`mobile-lang-${lang.toLowerCase()}`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-6">
                    <SheetClose asChild>
                      <Link to="/locations-vacances-cosy-casa" className="block">
                        <Button className="orso-btn-primary w-full" data-testid="mobile-book-btn">
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
