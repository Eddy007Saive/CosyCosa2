import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EspritPage = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="esprit-page" className="bg-white overflow-x-hidden">
      {/* Spacer for navbar */}
      <div className="h-24" />

      {/* Main Content Section - Excellence & Savoir Faire */}
      <section className="py-12 md:py-20" data-testid="excellence-section">
        <div className="orso-container">
          <div className="relative">
            {/* Background beige panel */}
            <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full bg-[#f5f5f0]" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[700px] lg:min-h-[800px]">
              
              {/* Left Column - Photos with overlay */}
              <div className="lg:col-span-5 relative z-10">
                {/* Julie's Photo - Large */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80"
                    alt="Julie - ORSO Rental Selection"
                    className="w-full max-w-lg grayscale object-cover"
                    style={{ aspectRatio: '4/5' }}
                  />
                  
                  {/* Bastien's Photo - Small, overlapping bottom right of Julie's photo */}
                  <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 lg:bottom-0 lg:-right-16 z-20">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80"
                      alt="Bastien - CASA TERRA Real Estate"
                      className="w-32 h-40 md:w-36 md:h-48 lg:w-40 lg:h-52 object-cover grayscale shadow-lg"
                      style={{ background: '#000' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 lg:pl-24 relative z-0">
                {/* 01 Number - positioned top right */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12">
                  <span className="text-7xl md:text-8xl lg:text-[10rem] font-serif text-gray-200/60 leading-none select-none">01</span>
                </div>

                {/* Title */}
                <div className="mb-10 mt-8 md:mt-12 lg:mt-20">
                  <h2 className="font-serif text-xl md:text-2xl text-[#2e2e2e] tracking-[0.15em] uppercase">
                    Excellence & Savoir Faire:
                  </h2>
                </div>

                {/* Julie's Description */}
                <div className="space-y-6 text-gray-700 leading-relaxed text-base md:text-lg max-w-xl ml-auto">
                  <p className="text-right">
                    Julie, <strong className="font-semibold">votre interlocutrice</strong> ORSO Rental Selection, met son <strong className="font-semibold">expertise</strong> au service de votre bien, assurant un <strong className="font-semibold">pilotage sur mesure</strong> et une <strong className="font-semibold">valorisation optimale</strong>. Alliant discrétion, professionnalisme et sens du détail, elle veille à une <strong className="font-semibold">expérience fluide et sereine</strong> tant pour les propriétaires que pour leurs hôtes.
                  </p>
                  <p className="text-right">
                    Avec confiance, disponibilité et rigueur, Julie a à cœur de sublimer chaque propriété en offrant un service d'exception.
                  </p>
                </div>

                {/* Vision Quote */}
                <div className="my-10 md:my-12">
                  <p className="text-center font-serif text-lg md:text-xl text-[#2e2e2e] italic">
                    Une vision commune, une sélection d'excellence.
                  </p>
                </div>

                {/* Bastien Section - Text only */}
                <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg max-w-xl ml-auto">
                  <p className="text-right">
                    Fondateur de CASA TERRA Real Estate, Bastien s'entoure de Julie pour offrir un service haut de gamme alliant <strong className="font-semibold">authenticité & art de vivre en Corse</strong>.
                  </p>
                  <p className="text-right">
                    Leur complémentarité garantit un accompagnement humain et une sélection de biens d'exception pour une expérience exclusive
                  </p>
                </div>

                {/* Final Quote */}
                <div className="mt-10 md:mt-12 pt-8 border-t border-gray-300">
                  <p className="text-center font-serif text-lg md:text-xl text-[#2e2e2e] italic font-medium">
                    « Des lieux uniques pour des moments hors du temps »
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#2e2e2e]" data-testid="esprit-cta">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-12 h-px bg-white/40 mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              {t('esprit.cta.title', 'Rencontrons-nous')}
            </h2>
            <p className="text-lg text-white/80 font-light leading-relaxed mb-10">
              {t('esprit.cta.subtitle', 'Nous serions ravis d\'échanger avec vous sur votre projet et vos attentes.')}
            </p>
            <Link to="/contact">
              <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-6 rounded-full uppercase tracking-widest text-sm font-medium">
                {t('esprit.cta.button', 'Nous contacter')}
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EspritPage;
