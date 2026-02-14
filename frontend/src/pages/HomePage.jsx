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

const locales = { fr, en: enUS, es, it };

// Default images as fallback
const DEFAULT_IMAGES = {
  hero_home: "https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1920&q=80",
  category_vue_mer: "https://images.unsplash.com/photo-1744271688484-f0fa9dabf4b4?w=800",
  category_plage_a_pieds: "https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=800",
  category_pieds_dans_eau: "https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=800",
  concept_interior: "https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=800&q=80",
  cta_background: "https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=1920&q=80",
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
        // Use default categories
        setCategories([
          { id: 'vue_mer', name: 'Vue Mer', image: DEFAULT_IMAGES.category_vue_mer },
          { id: 'plage_a_pieds', name: 'Plage à Pieds', image: DEFAULT_IMAGES.category_plage_a_pieds },
          { id: 'pieds_dans_eau', name: "Pieds dans l'Eau", image: DEFAULT_IMAGES.category_pieds_dans_eau },
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
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        data-testid="hero-section"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1920&q=80"
            alt="Villa de luxe en Corse"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 orso-container text-center text-white py-32">
          <p
            className="orso-caption text-white/80 mb-6 opacity-0 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            {t('hero.tagline')}
          </p>
          <h1
            className="orso-h1 text-white mb-6 max-w-4xl mx-auto opacity-0 animate-fade-in"
            style={{ animationDelay: '400ms' }}
            data-testid="hero-title"
          >
            {t('hero.title')}
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: '600ms' }}
          >
            {t('hero.subtitle')}
          </p>
          <div
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: '800ms' }}
          >
            <Link to="/properties">
              <Button
                className="orso-btn-primary bg-white text-[#2e2e2e] hover:bg-white/90"
                data-testid="hero-cta"
              >
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 opacity-0 animate-fade-in"
          style={{ animationDelay: '1000ms' }}
        >
          <div className="orso-container pb-8 md:pb-16">
            <div
              className="bg-white p-4 md:p-6 border border-gray-100 shadow-lg max-w-4xl mx-auto"
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
                  src={category.image}
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

      {/* Concept Section */}
      <section className="orso-section bg-orso-surface" data-testid="concept-section">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=800&q=80"
                alt="Intérieur luxueux"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <p className="orso-caption mb-4">{t('concept.tagline')}</p>
              <h2 className="orso-h2 mb-8">{t('concept.title')}</h2>
              <div className="space-y-6 orso-body mb-10">
                <p>{t('concept.p1')}</p>
                <p>{t('concept.p2')}</p>
                <p>{t('concept.p3')}</p>
              </div>

              {/* Values */}
              <div className="space-y-6">
                {['quality', 'discretion', 'authenticity'].map((value) => (
                  <div key={value} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center border border-[#2e2e2e] flex-shrink-0">
                      <Check className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#2e2e2e] mb-1">
                        {t(`concept.${value}`)}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {t(`concept.${value}_desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="orso-section bg-white" data-testid="services-section">
        <div className="orso-container">
          <div className="text-center mb-16">
            <p className="orso-caption mb-4">{t('services.tagline')}</p>
            <h2 className="orso-h2 mb-4">{t('services.title')}</h2>
            <p className="orso-body max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ORSO Essentiel */}
            <div
              className="service-card p-8 md:p-12 bg-orso-surface border border-transparent"
              data-testid="service-essentiel"
            >
              <p className="orso-caption mb-4">{t('services.essentiel.title')}</p>
              <h3 className="orso-h3 mb-4">{t('services.essentiel.subtitle')}</h3>
              <p className="orso-body mb-8">{t('services.essentiel.desc')}</p>
              <ul className="space-y-3 mb-8">
                {t('services.essentiel.features', { returnObjects: true }).map(
                  (feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <span className="text-[#2e2e2e]">—</span>
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <Link to="/services">
                <Button className="orso-btn-secondary">
                  {t('services.learnMore')}
                </Button>
              </Link>
            </div>

            {/* ORSO Premium */}
            <div
              className="service-card p-8 md:p-12 bg-[#2e2e2e] text-white"
              data-testid="service-premium"
            >
              <p className="orso-caption text-white/60 mb-4">
                {t('services.premium.title')}
              </p>
              <h3 className="orso-h3 text-white mb-4">
                {t('services.premium.subtitle')}
              </h3>
              <p className="text-white/80 mb-8">{t('services.premium.desc')}</p>
              <ul className="space-y-3 mb-8">
                {t('services.premium.features', { returnObjects: true }).map(
                  (feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <span className="text-white">—</span>
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <Link to="/services">
                <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-8 py-4 uppercase tracking-widest text-xs">
                  {t('services.learnMore')}
                </Button>
              </Link>
            </div>
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
            src="https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=1920&q=80"
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
