import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { fr, enUS, es, it } from 'date-fns/locale';
import { getCategories, getSiteImages } from '@/lib/api';
import SEO from '@/components/SEO';

const locales = { fr, en: enUS, es, it };

// Default images as fallback (using new key structure)
const DEFAULT_IMAGES = {
  home_hero: "https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1920&q=80",
  home_category_vue_mer: "https://images.unsplash.com/photo-1744271688484-f0fa9dabf4b4?w=800",
  home_category_plage_a_pieds: "https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=800",
  home_category_pieds_dans_eau: "https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=800",
  home_concept: "https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=800&q=80",
  home_cta: "https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=1920&q=80",
};

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [siteImages, setSiteImages] = useState(DEFAULT_IMAGES);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(2);
  const locale = locales[i18n.language] || fr;

  useEffect(() => {
    // Load site images
    const loadSiteImages = async () => {
      try {
        const data = await getSiteImages();
        if (data?.images) {
          setSiteImages({ ...DEFAULT_IMAGES, ...data.images });
        }
      } catch (error) {
        console.error('Failed to load site images:', error);
      }
    };
    
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          throw new Error('No categories');
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Use default categories with new image keys
        setCategories([
          { id: 'vue_mer', name: 'Vue Mer', image: DEFAULT_IMAGES.home_category_vue_mer },
          { id: 'plage_a_pieds', name: 'Plage à Pieds', image: DEFAULT_IMAGES.home_category_plage_a_pieds },
          { id: 'pieds_dans_eau', name: "Pieds dans l'Eau", image: DEFAULT_IMAGES.home_category_pieds_dans_eau },
        ]);
      }
    };
    
    loadSiteImages();
    loadCategories();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    params.set('guests', guests.toString());
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div data-testid="home-page">
      {/* SEO */}
      <SEO lang={i18n.language} />
      
      {/* Hero Section - Split Design */}
      <section
        className="min-h-screen flex items-center bg-white pt-20"
        data-testid="hero-section"
      >
        <div className="orso-container w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[70vh]">
            {/* Left Side - Logo with Lines */}
            <div 
              className="flex items-center justify-center opacity-0 animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <div className="relative flex flex-col items-center">
                {/* Top vertical line */}
                <div className="w-px h-16 md:h-24 bg-[#2e2e2e] mb-8" />
                
                {/* Logo Text */}
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-[0.4em] text-[#2e2e2e] font-light">
                    O R S O
                  </h2>
                  <p className="text-sm md:text-base tracking-[0.3em] text-[#2e2e2e] mt-3 uppercase">
                    Rental Selection
                  </p>
                </div>
                
                {/* Bottom vertical line */}
                <div className="w-px h-16 md:h-24 bg-[#2e2e2e] mt-8" />
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div 
              className="flex flex-col justify-center opacity-0 animate-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              {/* Quote */}
              <h1 
                className="text-xl md:text-2xl lg:text-3xl text-[#2e2e2e] font-light tracking-wide mb-12 lg:mb-16 whitespace-nowrap"
                data-testid="hero-title"
              >
                « {t('hero.quote', 'Des Lieux uniques pour des moments hors du temps')} »
              </h1>

              {/* Two Columns: Secteurs & Critères */}
              <div className="grid grid-cols-2 gap-8 lg:gap-12">
                {/* Secteurs */}
                <div className="border-r border-[#2e2e2e]/20 pr-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#2e2e2e]/60 mb-4">
                    {t('hero.sectors', '3 secteurs')}
                  </p>
                  <ul className="space-y-2 text-[#2e2e2e]">
                    <li className="font-light">Pinarello</li>
                    <li className="font-light">Saint Cyprien</li>
                    <li className="font-light">Cala Rossa</li>
                  </ul>
                </div>

                {/* Critères */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#2e2e2e]/60 mb-4">
                    {t('hero.criteria', '3 critères')}
                  </p>
                  <ul className="space-y-2 text-[#2e2e2e]">
                    <li className="font-light">{t('categories.vue_mer')}</li>
                    <li className="font-light">{t('categories.plage_a_pieds')}</li>
                    <li className="font-light">{t('categories.pieds_dans_eau')}</li>
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-12 lg:mt-16">
                <Link to="/properties">
                  <Button
                    className="orso-btn-primary"
                    data-testid="hero-cta"
                  >
                    {t('hero.cta')}
                    <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="bg-orso-surface py-8">
        <div className="orso-container">
          <div
            className="bg-white p-4 md:p-6 border border-gray-100 shadow-sm max-w-4xl mx-auto"
            data-testid="search-bar"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Check-in */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 text-left w-full"
                      data-testid="search-checkin"
                    >
                      <Calendar className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500">
                          {t('search.checkIn')}
                        </p>
                        <p className="font-serif text-lg">
                          {checkIn
                            ? format(checkIn, 'd MMM', { locale })
                            : t('search.selectDate')}
                        </p>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        setCheckIn(date);
                        if (!checkOut || date >= checkOut) {
                          setCheckOut(addDays(date, 1));
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      locale={locale}
                    />
                  </PopoverContent>
                </Popover>

                {/* Check-out */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 text-left w-full"
                      data-testid="search-checkout"
                    >
                      <Calendar className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-500">
                          {t('search.checkOut')}
                        </p>
                        <p className="font-serif text-lg">
                          {checkOut
                            ? format(checkOut, 'd MMM', { locale })
                            : t('search.selectDate')}
                        </p>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) =>
                        date < (checkIn ? addDays(checkIn, 1) : new Date())
                      }
                      locale={locale}
                    />
                  </PopoverContent>
                </Popover>

                {/* Guests */}
                <div className="flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
                  <Users className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {t('search.guests')}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-colors"
                        data-testid="guests-minus"
                      >
                        -
                      </button>
                      <span className="font-serif text-lg w-8 text-center">
                        {guests}
                      </span>
                      <button
                        onClick={() => setGuests(Math.min(20, guests + 1))}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-colors"
                        data-testid="guests-plus"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-center">
                  <Button
                    onClick={handleSearch}
                    className="orso-btn-primary w-full h-full"
                    data-testid="search-submit"
                  >
                    {t('search.search')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Categories Section */}
      <section className="orso-section bg-white" data-testid="categories-section">
        <div className="orso-container">
          <div className="text-center mb-16">
            <p className="orso-caption mb-4">{t('categories.title')}</p>
            <h2 className="orso-h2 mb-4">{t('categories.subtitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/properties?category=${category.id}`}
                className="group relative aspect-[4/5] overflow-hidden orso-card opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
                data-testid={`category-card-${category.id}`}
              >
                <img
                  src={siteImages[`home_category_${category.id}`] || category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="category-overlay absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
                    {t(`categories.${category.id}`)}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {t(`categories.${category.id}_desc`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Concept Section - Full Width Text */}
      <section className="orso-section bg-orso-surface" data-testid="concept-section">
        <div className="orso-container">
          <div className="max-w-4xl mx-auto text-center">
            <p className="orso-caption mb-6">{t('concept.tagline')}</p>
            <h2 className="orso-h2 mb-12">{t('concept.title')}</h2>
            
            <div className="space-y-8 mb-16">
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700">
                {t('concept.p1')}
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700">
                {t('concept.p2')}
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700">
                {t('concept.p3')}
              </p>
            </div>

            {/* Values - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-200">
              {['quality', 'discretion', 'authenticity'].map((value) => (
                <div key={value} className="text-center">
                  <div className="w-12 h-12 flex items-center justify-center border border-[#2e2e2e] mx-auto mb-4">
                    <Check className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-xl text-[#2e2e2e] mb-2">
                    {t(`concept.${value}`)}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t(`concept.${value}_desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Checkerboard Layout */}
      <section className="bg-[#f5f5f3]" data-testid="services-section">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="h-[50vh] lg:h-auto lg:min-h-[60vh]">
            <img
              src={siteImages.services_intendance || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"}
              alt={t('services.intendance.title')}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Text */}
          <div className="flex items-center p-8 md:p-12 lg:p-16 xl:p-20">
            <div className="max-w-lg">
              <div className="w-10 h-px bg-[#2e2e2e] mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] mb-4">
                {t('services.intendance.title')}
              </h2>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                {t('services.intendance.subtitle')}
              </p>
              <ul className="space-y-3">
                {(t('services.intendance.services', { returnObjects: true }) || []).map((service, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-[#2e2e2e] rounded-full flex-shrink-0" />
                    <span className="font-light">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Text */}
          <div className="flex items-center p-8 md:p-12 lg:p-16 xl:p-20 order-2 lg:order-1">
            <div className="max-w-lg ml-auto">
              <div className="w-10 h-px bg-[#2e2e2e] mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] mb-4">
                {t('services.experiences.title')}
              </h2>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                {t('services.experiences.subtitle')}
              </p>
              <ul className="space-y-3">
                {(t('services.experiences.services', { returnObjects: true }) || []).map((service, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-[#2e2e2e] rounded-full flex-shrink-0" />
                    <span className="font-light">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Image */}
          <div className="h-[50vh] lg:h-auto lg:min-h-[60vh] order-1 lg:order-2">
            <img
              src={siteImages.services_experiences || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"}
              alt={t('services.experiences.title')}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Custom Requests Section */}
      <section className="bg-[#2e2e2e] py-16 md:py-20">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-px bg-white/40 mx-auto mb-8" />
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">
              {t('services.custom.title')}
            </h2>
            <p className="text-white/80 text-base font-light leading-relaxed mb-8">
              {t('services.custom.subtitle')}
            </p>
            <Link to="/contact">
              <Button 
                className="bg-white text-[#2e2e2e] hover:bg-white/90 px-8 py-3 rounded-full uppercase tracking-widest text-xs font-medium transition-all"
              >
                {t('services.custom.cta')}
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-32 md:py-48"
        data-testid="cta-section"
      >
        <div className="absolute inset-0">
          <img
            src={siteImages.home_cta}
            alt="Lifestyle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 orso-container text-center text-white">
          <h2 className="orso-h2 text-white mb-6 max-w-3xl mx-auto">
            L'art de voyager selon vous
          </h2>
          <p className="text-lg text-white/90 max-w-xl mx-auto mb-10">
            Savourez la liberté d'improviser et l'art de déléguer en toute
            sérénité.
          </p>
          <Link to="/contact">
            <Button className="orso-btn-primary bg-white text-[#2e2e2e] hover:bg-white/90">
              {t('nav.contact')}
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
