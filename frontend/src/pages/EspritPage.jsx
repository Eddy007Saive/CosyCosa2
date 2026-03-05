import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EspritPage = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="esprit-page" className="bg-white">
      {/* Spacer for navbar */}
      <div className="h-24" />

      {/* Main Content Section - Excellence & Savoir Faire */}
      <section className="py-12 md:py-20" data-testid="excellence-section">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column - Julie's Photo */}
            <div className="lg:col-span-5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
                  alt="Julie - ORSO Rental Selection"
                  className="w-full max-w-md grayscale object-cover"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-7 bg-[#f5f5f0] p-8 md:p-12 lg:p-16 relative">
              {/* Title with 01 */}
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-6xl md:text-7xl lg:text-8xl font-serif text-gray-200 leading-none">01</span>
                <h2 className="font-serif text-xl md:text-2xl text-[#2e2e2e] tracking-[0.15em] uppercase">
                  Excellence & Savoir Faire:
                </h2>
              </div>

              {/* Julie's Description */}
              <div className="space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">
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

              {/* Bastien Section */}
              <div className="flex gap-6 items-start">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                  alt="Bastien - CASA TERRA Real Estate"
                  className="w-28 md:w-32 h-36 md:h-40 object-cover grayscale flex-shrink-0"
                />
                <div className="space-y-4 text-gray-700 leading-relaxed text-base md:text-lg">
                  <p>
                    Fondateur de CASA TERRA Real Estate, Bastien s'entoure de Julie pour offrir un service haut de gamme alliant <strong className="font-semibold">authenticité & art de vivre en Corse</strong>.
                  </p>
                  <p>
                    Leur complémentarité garantit un accompagnement humain et une sélection de biens d'exception pour une expérience exclusive
                  </p>
                </div>
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
