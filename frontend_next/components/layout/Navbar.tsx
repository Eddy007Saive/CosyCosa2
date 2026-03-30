'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const LANGUAGES = ['FR', 'EN', 'ES', 'IT'];

interface SectorItem { href: string; label: string; }
interface NavItem {
  type: 'link' | 'dropdown';
  href?: string;
  label: string;
  key?: string;
  items?: SectorItem[];
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [sectors, setSectors] = useState<Array<Record<string, string>>>([]);
  const dropdownRef = useRef<HTMLElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/sectors`)
      .then((r) => r.ok ? r.json() : [])
      .then(setSectors)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const lang = i18n.language;
  const getLangField = (obj: Record<string, string>, field: string) => {
    const map: Record<string, string> = { fr: '_fr', en: '_en', es: '_es', it: '_it' };
    const suffix = map[lang] || '_fr';
    return obj[`${field}${suffix}`] || obj[`${field}_fr`] || '';
  };

  const sectorItems: SectorItem[] = sectors.map((s) => ({
    href: `/${s.slug}`,
    label: getLangField(s, 'city'),
  }));

  const navItems: NavItem[] = [
    { type: 'link', href: '/', label: t('nav.home') },
    {
      type: 'dropdown', label: t('nav.services'), key: 'services',
      items: [
        { href: '/conciergerie-pour-proprietaires-corse', label: t('nav.servicesOwner') },
        { href: '/locations-vacances-cosy-casa', label: t('nav.servicesTraveler') },
      ],
    },
    ...(sectorItems.length > 0
      ? [{ type: 'dropdown' as const, label: t('nav.sectors'), key: 'sectors', items: sectorItems }]
      : []),
    { type: 'link', href: '/a-propos-conciergerie-cosy-casa-en-corse', label: t('nav.about') },
    { type: 'link', href: '/partenaires-conciergerie-corse', label: t('nav.partners') },
    { type: 'link', href: '/blog-conciergerie-corse', label: t('nav.blog') },
    { type: 'link', href: '/contact-conciergerie-cosy-casa', label: t('nav.contact') },
  ];

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const isDropdownActive = (items: SectorItem[]) =>
    items.some((item) => pathname === item.href);

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className={`transition-all duration-500 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-28 opacity-100'}`}>
        <div className="bg-[#3a3a3a]/80 backdrop-blur-md border-b border-white/10">
          <div className="orso-container">
            <div className="flex items-center justify-between h-20 md:h-24">
              <div className="hidden md:flex flex-col gap-1.5">
                <a href="tel:+33615876470" className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors text-sm">
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="tracking-wide">+33 6 15 87 64 70</span>
                </a>
                <a href="mailto:hello@conciergerie-cosycasa.fr" className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors text-sm">
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="tracking-wide">hello@conciergerie-cosycasa.fr</span>
                </a>
              </div>

              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <img src="/cosycasa-logo.png" alt="Cosy Casa Conciergerie" className="h-14 md:h-16 w-auto brightness-0 invert" />
              </Link>

              <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-white">
                {LANGUAGES.map((lng, index) => (
                  <span key={lng} className="flex items-center">
                    <button
                      onClick={() => i18n.changeLanguage(lng.toLowerCase())}
                      className={`transition-opacity ${i18n.language.toUpperCase() === lng ? 'opacity-100 font-medium' : 'opacity-50 hover:opacity-80'}`}
                    >
                      {lng}
                    </button>
                    {index < LANGUAGES.length - 1 && <span className="mx-2 opacity-30">/</span>}
                  </span>
                ))}
              </div>

              <div className="md:hidden ml-auto">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Menu className="h-6 w-6" strokeWidth={1.5} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[400px] bg-[#2e2e2e] border-l border-white/10">
                    <MobileMenu
                      navItems={navItems}
                      mobileDropdown={mobileDropdown}
                      setMobileDropdown={setMobileDropdown}
                      isActive={isActive}
                      i18n={i18n}
                      languages={LANGUAGES}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Bar */}
      <nav
        ref={dropdownRef}
        className={`transition-all duration-300 ${isScrolled ? 'bg-[#2e2e2e]/95 backdrop-blur-md shadow-lg' : 'bg-[#3a3a3a]/60 backdrop-blur-sm border-b border-white/5'}`}
      >
        <div className="orso-container">
          <div className="hidden md:flex items-center justify-center h-12">
            {isScrolled && (
              <Link href="/" className="absolute left-6 lg:left-12">
                <img src="/cosycasa-logo.png" alt="Cosy Casa" className="h-8 w-auto brightness-0 invert" />
              </Link>
            )}
            {navItems.map((item, index) => {
              const showSep = index > 0;
              if (item.type === 'link') {
                const active = isActive(item.href!);
                return (
                  <div key={item.href} className="flex items-center">
                    {showSep && <span className="mx-4 text-white/20 text-sm select-none">|</span>}
                    <Link
                      href={item.href!}
                      className={`relative text-sm uppercase tracking-[0.15em] transition-all py-1 ${active ? 'text-white' : 'text-white/70 hover:text-white'}`}
                    >
                      {item.label}
                      {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#8fa87a] rounded-full" />}
                    </Link>
                  </div>
                );
              }
              const active = isDropdownActive(item.items!);
              const isOpenDrop = openDropdown === item.key;
              return (
                <div key={item.key} className="flex items-center" onMouseEnter={() => handleDropdownEnter(item.key!)} onMouseLeave={handleDropdownLeave}>
                  {showSep && <span className="mx-4 text-white/20 text-sm select-none">|</span>}
                  <div className="relative">
                    <button className={`flex items-center gap-1.5 text-sm uppercase tracking-[0.15em] transition-all py-1 ${active ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                      {item.label}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpenDrop ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                      {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#8fa87a] rounded-full" />}
                    </button>
                    {isOpenDrop && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-[220px] bg-[#2e2e2e]/95 backdrop-blur-md border border-white/10 shadow-xl py-2 animate-fade-in z-50">
                        {item.items!.map((sub) => (
                          <Link key={sub.href} href={sub.href} className={`block px-5 py-3 text-sm tracking-wide transition-colors ${isActive(sub.href) ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`md:hidden flex items-center justify-between h-12 ${isScrolled ? '' : 'hidden'}`}>
            <Link href="/"><img src="/cosycasa-logo.png" alt="Cosy Casa" className="h-7 w-auto brightness-0 invert" /></Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8">
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

function MobileMenu({ navItems, mobileDropdown, setMobileDropdown, isActive, i18n, languages }: {
  navItems: NavItem[];
  mobileDropdown: string | null;
  setMobileDropdown: (v: string | null) => void;
  isActive: (p: string) => boolean;
  i18n: ReturnType<typeof useTranslation>['i18n'];
  languages: string[];
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4 border-b border-white/10">
        <img src="/cosycasa-logo.png" alt="Cosy Casa" className="h-10 w-auto brightness-0 invert" />
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </SheetClose>
      </div>
      <div className="py-4 border-b border-white/10 flex flex-col gap-2">
        <a href="tel:+33615876470" className="flex items-center gap-2 text-white/70 text-sm">
          <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />+33 6 15 87 64 70
        </a>
        <a href="mailto:hello@conciergerie-cosycasa.fr" className="flex items-center gap-2 text-white/70 text-sm">
          <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />hello@conciergerie-cosycasa.fr
        </a>
      </div>
      <nav className="flex-1 py-8 overflow-y-auto">
        <ul className="space-y-4">
          {navItems.map((item) => {
            if (item.type === 'link') {
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link href={item.href!} className={`block font-serif text-2xl text-white transition-opacity ${isActive(item.href!) ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              );
            }
            const open = mobileDropdown === item.key;
            return (
              <li key={item.key}>
                <button onClick={() => setMobileDropdown(open ? null : item.key!)} className="flex items-center gap-2 font-serif text-2xl text-white opacity-70 hover:opacity-100 w-full text-left">
                  {item.label}
                  <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                </button>
                {open && (
                  <ul className="ml-4 mt-3 space-y-3 border-l border-white/20 pl-4">
                    {item.items!.map((sub) => (
                      <li key={sub.href}>
                        <SheetClose asChild>
                          <Link href={sub.href} className={`block text-lg font-light text-white transition-opacity ${isActive(sub.href) ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                            {sub.label}
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
      <div className="py-4 border-t border-white/10 flex items-center gap-4">
        {languages.map((lng) => (
          <button key={lng} onClick={() => i18n.changeLanguage(lng.toLowerCase())} className={`text-sm uppercase tracking-widest text-white transition-opacity ${i18n.language.toUpperCase() === lng ? 'opacity-100 font-medium' : 'opacity-40 hover:opacity-80'}`}>
            {lng}
          </button>
        ))}
      </div>
    </div>
  );
}
