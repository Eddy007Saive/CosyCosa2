import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Home, Key, Shield, Calendar, Wrench, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProprietairePage = () => {
  const { t } = useTranslation();

  return (
    <div data-testid="proprietaire-page">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80")'
        }}
        data-testid="proprietaire-hero"
      >
        <div className="text-center text-white px-4 pt-20">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
            {t('proprietaire.hero.title', 'Êtes-vous propriétaire ?')}
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8 text-white/90">
            {t('proprietaire.hero.subtitle', 'Louez votre propriété et augmentez vos revenus !')}
          </p>
          <Link to="/contact">
            <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-8 py-6 rounded-full uppercase tracking-widest text-sm font-medium">
              {t('proprietaire.hero.cta', 'Contactez-nous !')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="orso-section bg-white">
        <div className="orso-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-px bg-[#2e2e2e] mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl text-[#2e2e2e] mb-6">
              {t('proprietaire.intro.title', 'Un accompagnement sur mesure pour votre villa')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-4">
              {t('proprietaire.intro.subtitle', 'Intendance locative et suivi de propriété pour vous offrir tranquillité et valorisation de votre bien.')}
            </p>
            <p className="text-gray-600 font-light leading-relaxed">
              {t('proprietaire.intro.desc', "Nous veillons sur votre villa tout au long de l'année, qu'elle accueille des voyageurs ou qu'elle reste votre lieu de séjour.")}
            </p>
          </div>
        </div>
      </section>

      {/* Intendance Locative Section */}
      <section className="orso-section bg-orso-surface" data-testid="intendance-locative">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="w-10 h-px bg-[#2e2e2e] mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] mb-4">
                {t('proprietaire.locative.title', 'Intendance locative de votre villa')}
              </h2>
              <p className="text-gray-600 font-light mb-6 leading-relaxed">
                {t('proprietaire.locative.subtitle', "Confiez-nous votre bien et bénéficiez d'un service d'intendance locative sur mesure.")}
              </p>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                {t('proprietaire.locative.desc', "Nous prenons en charge l'ensemble des aspects liés aux locations afin d'offrir une expérience fluide aux propriétaires comme aux voyageurs.")}
              </p>
              
              <p className="text-[#2e2e2e] font-medium mb-4">
                {t('proprietaire.locative.services_title', 'Nous nous occupons notamment de :')}
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  t('proprietaire.locative.service1', "création, diffusion et optimisation de l'annonce"),
                  t('proprietaire.locative.service2', 'organisation des plannings, contrats et cautions'),
                  t('proprietaire.locative.service3', 'sélection et suivi des locataires'),
                  t('proprietaire.locative.service4', 'accueil des voyageurs et assistance pendant le séjour'),
                  t('proprietaire.locative.service5', "coordination du ménage, de la blanchisserie et de l'entretien"),
                  t('proprietaire.locative.service6', 'suivi de la villa entre les locations')
                ].map((service, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-[#2e2e2e] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-light">{service}</span>
                  </li>
                ))}
              </ul>

              {/* Mission */}
              <div className="bg-white p-6 border-l-4 border-[#2e2e2e]">
                <p className="text-sm uppercase tracking-widest text-[#2e2e2e]/60 mb-2">
                  {t('proprietaire.mission', 'Notre mission')}
                </p>
                <p className="text-[#2e2e2e] font-light italic">
                  {t('proprietaire.locative.mission', 'Valoriser votre propriété tout en vous offrant sérénité et tranquillité.')}
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/5] lg:aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Villa intendance"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intendance Propriété Section */}
      <section className="orso-section bg-white" data-testid="intendance-propriete">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image - Order reversed on desktop */}
            <div className="relative aspect-[4/5] lg:aspect-square overflow-hidden lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"
                alt="Villa propriété"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="lg:order-2">
              <div className="w-10 h-px bg-[#2e2e2e] mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] mb-4">
                {t('proprietaire.propriete.title', 'Intendance de votre propriété')}
              </h2>
              <p className="text-gray-600 font-light mb-6 leading-relaxed">
                {t('proprietaire.propriete.subtitle', "Un accompagnement discret et fiable pour veiller sur votre villa tout au long de l'année.")}
              </p>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                {t('proprietaire.propriete.desc', 'Lorsque vous êtes absent, nous assurons le suivi de votre propriété et coordonnons les différentes interventions nécessaires à son bon fonctionnement et à sa valorisation.')}
              </p>
              
              <p className="text-[#2e2e2e] font-medium mb-4">
                {t('proprietaire.propriete.services_title', 'Services à la carte :')}
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  t('proprietaire.propriete.service1', 'passages de contrôle réguliers de la propriété'),
                  t('proprietaire.propriete.service2', 'aération et vérifications générales'),
                  t('proprietaire.propriete.service3', 'coordination des prestataires (piscine, jardin, maintenance...)'),
                  t('proprietaire.propriete.service4', 'réception de livraisons ou d\'interventions techniques'),
                  t('proprietaire.propriete.service5', 'préparation de la villa avant votre arrivée'),
                  t('proprietaire.propriete.service6', "organisation et suivi de travaux, rénovations ou projets d'aménagement (maître d'œuvre à disposition)"),
                  t('proprietaire.propriete.service7', 'accompagnement personnalisé selon vos besoins')
                ].map((service, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-[#2e2e2e] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-light">{service}</span>
                  </li>
                ))}
              </ul>

              {/* Mission */}
              <div className="bg-orso-surface p-6 border-l-4 border-[#2e2e2e]">
                <p className="text-sm uppercase tracking-widest text-[#2e2e2e]/60 mb-2">
                  {t('proprietaire.mission', 'Notre mission')}
                </p>
                <p className="text-[#2e2e2e] font-light italic">
                  {t('proprietaire.propriete.mission', "Préserver la qualité de votre propriété et vous offrir une totale tranquillité d'esprit.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="orso-section bg-[#2e2e2e]" data-testid="proprietaire-cta">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="w-12 h-px bg-white/40 mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              {t('proprietaire.cta.title', 'Parlons de votre villa')}
            </h2>
            <p className="text-lg text-white/80 font-light leading-relaxed mb-10">
              {t('proprietaire.cta.subtitle', 'Chaque propriété étant unique, nous privilégions toujours un premier échange afin de comprendre vos attentes.')}
            </p>
            <Link to="/contact">
              <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-6 rounded-full uppercase tracking-widest text-sm font-medium">
                {t('proprietaire.cta.button', 'Nous contacter')}
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProprietairePage;
