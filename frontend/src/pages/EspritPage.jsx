import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EspritPage = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="esprit-page">
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center justify-center bg-white pt-32 pb-16"
        data-testid="esprit-hero"
      >
        <div className="text-center px-4">
          <div className="w-12 h-px bg-[#2e2e2e] mx-auto mb-8" />
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2e2e2e] mb-6">
            {t('esprit.hero.title', 'Notre Esprit')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto">
            {t('esprit.hero.subtitle', 'Une vision commune, une sélection d\'excellence.')}
          </p>
        </div>
      </section>

      {/* Excellence & Savoir Faire Section */}
      <section className="orso-section bg-orso-surface" data-testid="excellence-section">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image Julie */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
                alt="Julie - ORSO Rental Selection"
                className="w-full max-w-md aspect-[3/4] object-cover"
              />
            </div>

            {/* Content */}
            <div className="lg:pt-8">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl md:text-6xl font-serif text-gray-300">01</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] tracking-wide uppercase">
                  {t('esprit.excellence.title', 'Excellence & Savoir Faire')}
                </h2>
              </div>

              <div className="space-y-6 text-gray-700 font-light leading-relaxed">
                <p>
                  Julie, <strong className="font-medium">votre interlocutrice</strong> ORSO Rental Selection, met son <strong className="font-medium">expertise</strong> au service de votre bien, assurant un <strong className="font-medium">pilotage sur mesure</strong> et une <strong className="font-medium">valorisation optimale</strong>. Alliant discrétion, professionnalisme et sens du détail, elle veille à une <strong className="font-medium">expérience fluide et sereine</strong> tant pour les propriétaires que pour leurs hôtes.
                </p>
                <p>
                  Avec confiance, disponibilité et rigueur, Julie a à cœur de sublimer chaque propriété en offrant un service d'exception.
                </p>
              </div>

              {/* Divider */}
              <div className="my-12">
                <p className="text-center text-[#2e2e2e] font-serif text-xl italic">
                  {t('esprit.vision', 'Une vision commune, une sélection d\'excellence.')}
                </p>
              </div>

              {/* Bastien Section */}
              <div className="flex gap-6 items-start">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
                  alt="Bastien - CASA TERRA Real Estate"
                  className="w-32 h-40 object-cover flex-shrink-0"
                />
                <div className="space-y-4 text-gray-700 font-light leading-relaxed">
                  <p>
                    Fondateur de CASA TERRA Real Estate, Bastien s'entoure de Julie pour offrir un service haut de gamme alliant <strong className="font-medium">authenticité & art de vivre en Corse</strong>.
                  </p>
                  <p>
                    Leur complémentarité garantit un accompagnement humain et une sélection de biens d'exception pour une expérience exclusive.
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-center font-serif text-xl md:text-2xl text-[#2e2e2e] italic">
                  « Des lieux uniques pour des moments hors du temps »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="orso-section bg-[#2e2e2e]" data-testid="esprit-cta">
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
