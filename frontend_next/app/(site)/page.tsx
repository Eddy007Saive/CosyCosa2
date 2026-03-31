'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, CalendarCheck, Users, Wrench, Shield, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteImages } from '@/lib/api';

const DEFAULT_IMAGES = {
  home_hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
  home_traveler: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
};

const OWNER_SERVICES = [
  { icon: Search, key: 's1' },
  { icon: CalendarCheck, key: 's2' },
  { icon: Users, key: 's3' },
  { icon: Wrench, key: 's4' },
  { icon: Shield, key: 's5' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [siteImages, setSiteImages] = useState<Record<string, string>>(DEFAULT_IMAGES);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    getSiteImages()
      .then((data: any) => {
        if (data?.images) setSiteImages({ ...DEFAULT_IMAGES, ...data.images });
      })
      .catch(() => {});
  }, []);

  const testimonials: Array<{ text: string; author: string }> =
    (t('testimonials.items', { returnObjects: true }) as any) || [];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-36">
        <img
          src="/hero.gif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-6">{t('hero.tagline')}</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">{t('hero.title')}</h1>
          <p className="text-lg md:text-xl font-light text-white/90 mb-10 tracking-wide">{t('hero.subtitle')}</p>
          <Link href="/contact-conciergerie-cosy-casa">
            <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-5 rounded-full uppercase tracking-widest text-xs font-medium">
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Welcome */}
      <section className="orso-section bg-white">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="orso-caption mb-4">{t('welcome.tagline')}</p>
            <h2 className="orso-h2 mb-8">{t('welcome.title')}</h2>
            <p className="text-lg font-light leading-relaxed text-gray-700 mb-6">{t('welcome.p1')}</p>
            <p className="text-lg font-light leading-relaxed text-gray-600">{t('welcome.p2')}</p>
          </div>
        </div>
      </section>

      {/* Owner */}
      <section className="orso-section bg-[#f5f5f3]">
        <div className="orso-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="orso-caption mb-4">{t('owner.tagline')}</p>
              <h2 className="orso-h2 mb-6">{t('owner.title')}</h2>
              <p className="text-lg font-light text-gray-700 mb-4 max-w-2xl mx-auto">{t('owner.desc')}</p>
              <p className="text-lg font-light text-gray-700 mb-4 max-w-2xl mx-auto">{t('owner.desc2')}</p>
              <p className="font-serif text-xl text-[#2e2e2e] italic mt-6">{t('owner.motto')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
              {OWNER_SERVICES.map(({ icon: Icon, key }, index) => (
                <div key={key} className="flex flex-col items-center text-center opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-20 h-20 bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-[#2e2e2e]" strokeWidth={1.2} />
                  </div>
                  <p className="text-sm font-light text-gray-700 leading-snug">{t(`owner.services.${key}`)}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/conciergerie">
                <Button className="orso-btn-primary">
                  {t('owner.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Traveler */}
      <section className="orso-section bg-white">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            <div className="relative min-h-[300px] lg:min-h-[400px] overflow-hidden">
              <img src={siteImages.home_traveler} alt="Voyageur" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16">
              <p className="orso-caption mb-4">{t('traveler.tagline')}</p>
              <h2 className="orso-h2 mb-8">{t('traveler.title')}</h2>
              <p className="text-lg font-light text-gray-700 mb-4">{t('traveler.desc')}</p>
              <p className="text-lg font-light text-gray-700 mb-4">{t('traveler.desc2')}</p>
              <p className="text-lg font-light text-gray-700 mb-8">{t('traveler.desc3')}</p>
              <Link href="/locations-vacances-cosy-casa">
                <Button className="orso-btn-primary">
                  {t('traveler.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="orso-section bg-[#2e2e2e] text-white">
          <div className="orso-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl mb-12 text-white">{t('testimonials.title')}</h2>
              <div className="relative min-h-[200px] flex items-center justify-center">
                <button
                  onClick={() => setActiveTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="px-12">
                  <Quote className="w-8 h-8 text-white/30 mx-auto mb-6" />
                  <p className="font-serif text-lg md:text-xl font-light leading-relaxed text-white/90 mb-6 italic">
                    &ldquo;{testimonials[activeTestimonial]?.text}&rdquo;
                  </p>
                  <p className="text-sm uppercase tracking-widest text-white/60">
                    <strong className="text-white/80">{testimonials[activeTestimonial]?.author}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setActiveTestimonial((p) => (p + 1) % testimonials.length)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${index === activeTestimonial ? 'bg-white w-6' : 'bg-white/30 w-2'}`}
                    aria-label={`Testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      <section className="orso-section bg-white">
        <div className="orso-container">
          <h2 className="orso-h2 text-center mb-12">{t('blog.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['lecci', 'pinarello', 'corse'].map((slug, index) => (
              <Link
                key={slug}
                href={`/conciergerie-cosy-casa-a-${slug}`}
                className="group orso-card opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-[3/2] bg-[#f5f5f3] overflow-hidden">
                  <img
                    src={(siteImages as any)[`blog_${slug}`] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=60'}
                    alt={t(`blog.${slug}.title`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Cosy Casa</p>
                  <h3 className="font-serif text-xl text-[#2e2e2e] mb-3 group-hover:underline underline-offset-4">
                    {t(`blog.${slug}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{t(`blog.${slug}.excerpt`)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#f5f5f3] py-20 md:py-28">
        <div className="orso-container text-center">
          <div className="w-12 h-px bg-[#2e2e2e] mx-auto mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl text-[#2e2e2e] mb-6">{t('hero.cta')}</h2>
          <Link href="/contact-conciergerie-cosy-casa">
            <Button className="orso-btn-primary">
              {t('nav.contact')}
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
