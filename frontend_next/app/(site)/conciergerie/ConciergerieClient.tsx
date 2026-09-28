'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ClipboardCheck, Users, Network, Award, Clock, Settings, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteImages } from '@/lib/api';

const OFFERS = [
  { key: 'evaluation', icon: ClipboardCheck },
  { key: 'team', icon: Users },
  { key: 'network', icon: Network },
  { key: 'quality', icon: Award },
];

const ADVANTAGES = [
  { key: 'time', icon: Clock },
  { key: 'simple', icon: Settings },
  { key: 'engagement', icon: Heart },
];

export default function ConciergeriePage() {
  const { t } = useTranslation();
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    getSiteImages()
      .then((data: any) => { if (data?.images?.conciergerie_hero) setHeroImage(data.images.conciergerie_hero); })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center bg-[#2e2e2e] pt-36"
        style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {heroImage && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            {t('conciergerie.hero.title')}
          </h1>
          <p className="text-lg font-light text-white/80 leading-relaxed">
            {t('conciergerie.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="orso-section bg-white">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg font-light leading-relaxed text-gray-700 mb-6">{t('conciergerie.intro')}</p>
            <p className="text-lg font-light leading-relaxed text-gray-600">{t('conciergerie.intro2')}</p>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="orso-section bg-[#f5f5f3]">
        <div className="orso-container">
          <h2 className="orso-h2 text-center mb-16">{t('conciergerie.offers.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {OFFERS.map(({ key, icon: Icon }, index) => (
              <div
                key={key}
                className="bg-white p-8 md:p-10 border border-gray-100 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-[#2e2e2e] text-white flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-[#2e2e2e] mb-4">
                  {t(`conciergerie.offers.${key}.title`)}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {t(`conciergerie.offers.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="orso-section bg-white">
        <div className="orso-container">
          <h2 className="orso-h2 text-center mb-16">{t('conciergerie.advantages.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {ADVANTAGES.map(({ key, icon: Icon }, index) => (
              <div
                key={key}
                className="text-center opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 border border-[#2e2e2e] flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-7 h-7 text-[#2e2e2e]" strokeWidth={1.2} />
                </div>
                <h3 className="font-serif text-xl text-[#2e2e2e] mb-4">
                  {t(`conciergerie.advantages.${key}.title`)}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {t(`conciergerie.advantages.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2e2e2e] py-20 md:py-28">
        <div className="orso-container text-center">
          <div className="w-12 h-px bg-white/40 mx-auto mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">{t('conciergerie.cta')}</h2>
          <Link href="/contact-conciergerie-cosy-casa">
            <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-5 rounded-full uppercase tracking-widest text-xs font-medium">
              {t('nav.contact')}
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
