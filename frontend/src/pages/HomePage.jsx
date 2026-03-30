import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, Home, CalendarCheck, Users, Wrench, Shield, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteImages } from '@/lib/api';
import useSEO from '@/hooks/useSEO';

const DEFAULT_IMAGES = {
  home_hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  home_traveler: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
};

const OWNER_SERVICES = [
  { icon: Search, key: 's1' },
  { icon: CalendarCheck, key: 's2' },
  { icon: Users, key: 's3' },
  { icon: Wrench, key: 's4' },
  { icon: Shield, key: 's5' },
];

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [siteImages, setSiteImages] = useState(DEFAULT_IMAGES);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useSEO({
    title: 'Cosy Casa | Conciergerie en Corse du Sud - Gestion Locative Porto-Vecchio, Lecci, Pinarello',
    description: 'Cosy Casa, votre conciergerie en Corse du Sud. Expert en location courte durée : gestion locative, accueil voyageurs, entretien. Porto-Vecchio, Lecci, Pinarello.',
    path: '/'
  });

  useEffect(() => {
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
    loadSiteImages();
  }, []);

  const testimonials = t('testimonials.items', { returnObjects: true }) || [];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center pt-36"
        style={{ backgroundImage: `url(${siteImages.home_hero})` }}
        data-testid="hero-section"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-6">
            {t('hero.tagline')}
          </p>
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            data-testid="hero-title"
          >
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl font-light text-white/90 mb-10 tracking-wide">
            {t('hero.subtitle')}
          </p>
          <Link to="/contact-conciergerie-cosy-casa">
            <Button
              className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-5 rounded-full uppercase tracking-widest text-xs font-medium"
              data-testid="hero-cta"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="orso-section bg-white" data-testid="welcome-section">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="orso-caption mb-4">{t('welcome.tagline')}</p>
            <h2 className="orso-h2 mb-8">{t('welcome.title')}</h2>
            <p className="text-lg font-light leading-relaxed text-gray-700 mb-6">
              {t('welcome.p1')}
            </p>
            <p className="text-lg font-light leading-relaxed text-gray-600">
              {t('welcome.p2')}
            </p>
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="orso-section bg-[#f5f5f3]" data-testid="owner-section">
        <div className="orso-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="orso-caption mb-4">{t('owner.tagline')}</p>
              <h2 className="orso-h2 mb-6">{t('owner.title')}</h2>
              <p className="text-lg font-light text-gray-700 mb-4 max-w-2xl mx-auto">
                {t('owner.desc')}
              </p>
              <p className="text-lg font-light text-gray-700 mb-4 max-w-2xl mx-auto">
                {t('owner.desc2')}
              </p>
              <p className="font-serif text-xl text-[#2e2e2e] italic mt-6">
                {t('owner.motto')}
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {OWNER_SERVICES.map(({ icon: Icon, key }, index) => (
                <div
                  key={key}
                  className="flex flex-col items-center text-center opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-20 h-20 bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-[#2e2e2e]" strokeWidth={1.2} />
                  </div>
                  <p className="text-sm font-light text-gray-700 leading-snug">
                    {t(`owner.services.${key}`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/conciergerie">
                <Button className="orso-btn-primary" data-testid="owner-cta">
                  {t('owner.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Traveler Section */}
      <section className="orso-section bg-white" data-testid="traveler-section">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            <div className="relative min-h-[300px] lg:min-h-[400px] overflow-hidden">
              <img
                src={siteImages.home_traveler}
                alt="Voyageur"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16">
              <p className="orso-caption mb-4">{t('traveler.tagline')}</p>
              <h2 className="orso-h2 mb-8">{t('traveler.title')}</h2>
              <p className="text-lg font-light text-gray-700 mb-4">
                <strong>{t('traveler.desc').split(' ')[0]}</strong> {t('traveler.desc').split(' ').slice(1).join(' ')}
              </p>
              <p className="text-lg font-light text-gray-700 mb-4">
                {t('traveler.desc2')}
              </p>
              <p className="text-lg font-light text-gray-700 mb-8">
                {t('traveler.desc3')}
              </p>
              <Link to="/locations-vacances-cosy-casa">
                <Button className="orso-btn-primary" data-testid="traveler-cta">
                  {t('traveler.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="orso-section bg-[#2e2e2e] text-white" data-testid="testimonials-section">
          <div className="orso-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl mb-12 text-white">{t('testimonials.title')}</h2>
              
              <div className="relative min-h-[200px] flex items-center justify-center">
                <button
                  onClick={prevTestimonial}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  data-testid="testimonial-prev"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="px-12">
                  <Quote className="w-8 h-8 text-white/30 mx-auto mb-6" />
                  <p className="font-serif text-lg md:text-xl font-light leading-relaxed text-white/90 mb-6 italic">
                    "{testimonials[activeTestimonial]?.text}"
                  </p>
                  <p className="text-sm uppercase tracking-widest text-white/60">
                    <strong className="text-white/80">{testimonials[activeTestimonial]?.author}</strong>
                  </p>
                </div>

                <button
                  onClick={nextTestimonial}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  data-testid="testimonial-next"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeTestimonial ? 'bg-white w-6' : 'bg-white/30'
                    }`}
                    aria-label={`Testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog / Tendances Section */}
      <section className="orso-section bg-white" data-testid="blog-section">
        <div className="orso-container">
          <h2 className="orso-h2 text-center mb-12">{t('blog.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['lecci', 'pinarello', 'corse'].map((slug, index) => (
              <Link
                key={slug}
                to={`/conciergerie-cosy-casa-a-${slug}`}
                className="group orso-card opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
                data-testid={`blog-card-${slug}`}
              >
                <div className="aspect-[3/2] bg-[#f5f5f3] overflow-hidden">
                  <img
                    src={siteImages[`blog_${slug}`] || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=60&${slug}`}
                    alt={t(`blog.${slug}.title`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Cosy Casa</p>
                  <h3 className="font-serif text-xl text-[#2e2e2e] mb-3 group-hover:underline underline-offset-4">
                    {t(`blog.${slug}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {t(`blog.${slug}.excerpt`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f5f5f3] py-20 md:py-28" data-testid="cta-section">
        <div className="orso-container text-center">
          <div className="w-12 h-px bg-[#2e2e2e] mx-auto mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl text-[#2e2e2e] mb-6">
            {t('hero.cta')}
          </h2>
          <Link to="/contact-conciergerie-cosy-casa">
            <Button className="orso-btn-primary" data-testid="final-cta">
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
