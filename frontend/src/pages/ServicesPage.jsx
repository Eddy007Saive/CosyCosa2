import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check, Download, Phone, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteImages } from '@/lib/api';

const DEFAULT_IMAGES = {
  services_hero: "https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=1920&q=80",
  services_lifestyle: "https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=800&q=80",
};

const ServicesPage = () => {
  const { t } = useTranslation();
  const [siteImages, setSiteImages] = useState(DEFAULT_IMAGES);

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

  const intendanceServices = [
    'Accueil personnalisé',
    'Préparation du logement',
    'Ménage quotidien ou intermédiaire',
    'Changement de linge',
    'Service de blanchisserie',
    'Courses à domicile',
    'Chef à domicile',
    'Soins bien-être / massages',
    'Baby-sitting / Garde d\'enfants',
  ];

  const experienceServices = [
    'Excursions en bateau',
    'Location de yacht',
    'Randonnées guidées',
    'Plongée sous-marine',
    'Cours de cuisine corse',
    'Dégustation de vins',
    'Réservation de restaurants',
    'Événements privés',
  ];

  return (
    <div className="pt-24 md:pt-32" data-testid="services-page">
      {/* Hero Section */}
      <section className="orso-container py-12 md:py-20">
        <div className="max-w-3xl">
          <p className="orso-caption mb-4">{t('services.tagline')}</p>
          <h1 className="orso-h1 mb-6" data-testid="services-title">
            {t('services.title')}
          </h1>
          <p className="orso-body">{t('services.subtitle')}</p>
        </div>
      </section>

      {/* Main Content - Split Layout */}
      <section className="border-t border-gray-100">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
            {/* Left - Text Content */}
            <div className="py-16 md:py-24 lg:pr-16 lg:border-r border-gray-100">
              {/* Intendance Services */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orso-surface flex items-center justify-center">
                    <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h2 className="orso-h3">Intendance & Services à domicile</h2>
                </div>
                <p className="orso-body mb-8">
                  Des prestations haut de gamme pour un quotidien sans contraintes.
                </p>
                <ul className="space-y-3">
                  {intendanceServices.map((service, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#2e2e2e]">—</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Experiences */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orso-surface flex items-center justify-center">
                    <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h2 className="orso-h3">Expériences & Loisirs</h2>
                </div>
                <p className="orso-body mb-8">
                  Des activités exclusives et immersives pour sublimer chaque instant
                  de votre séjour.
                </p>
                <ul className="space-y-3">
                  {experienceServices.map((service, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#2e2e2e]">—</span>
                      <span className="text-gray-600">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Custom Requests */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orso-surface flex items-center justify-center">
                    <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h2 className="orso-h3">Demandes sur mesure</h2>
                </div>
                <p className="orso-body">
                  Un accompagnement personnalisé pour concrétiser chacune de vos
                  envies, même les plus spécifiques. Notre équipe est à votre
                  disposition pour réaliser tous vos souhaits.
                </p>
              </div>
            </div>

            {/* Right - Image (Sticky) */}
            <div className="hidden lg:block relative">
              <div className="sticky top-32 h-[calc(100vh-8rem)]">
                <img
                  src="https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=800&q=80"
                  alt="Service de luxe"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="orso-section bg-orso-surface" data-testid="offers-section">
        <div className="orso-container">
          <div className="text-center mb-16">
            <p className="orso-caption mb-4">NOS FORMULES</p>
            <h2 className="orso-h2">Choisissez votre niveau de service</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* ORSO Essentiel */}
            <div
              className="bg-white p-8 md:p-12 border border-gray-100"
              data-testid="offer-essentiel"
            >
              <p className="orso-caption text-gray-500 mb-2">
                {t('services.essentiel.title')}
              </p>
              <h3 className="orso-h3 mb-4">{t('services.essentiel.subtitle')}</h3>
              <p className="orso-body mb-8">{t('services.essentiel.desc')}</p>

              <ul className="space-y-4 mb-8">
                {t('services.essentiel.features', { returnObjects: true }).map(
                  (feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className="w-5 h-5 text-[#2e2e2e] flex-shrink-0 mt-0.5"
                        strokeWidth={1.5}
                      />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  )
                )}
              </ul>

              <Link to="/contact">
                <Button className="orso-btn-secondary w-full">
                  {t('services.learnMore')}
                </Button>
              </Link>
            </div>

            {/* ORSO Premium */}
            <div
              className="bg-[#2e2e2e] text-white p-8 md:p-12"
              data-testid="offer-premium"
            >
              <p className="orso-caption text-white/60 mb-2">
                {t('services.premium.title')}
              </p>
              <h3 className="orso-h3 text-white mb-4">
                {t('services.premium.subtitle')}
              </h3>
              <p className="text-white/80 mb-8">{t('services.premium.desc')}</p>

              <ul className="space-y-4 mb-8">
                {t('services.premium.features', { returnObjects: true }).map(
                  (feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className="w-5 h-5 text-white flex-shrink-0 mt-0.5"
                        strokeWidth={1.5}
                      />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  )
                )}
              </ul>

              <div className="flex items-center gap-4 mb-8 py-4 border-t border-white/10">
                <Clock className="w-5 h-5 text-white/60" strokeWidth={1.5} />
                <span className="text-white/80">
                  Disponible 24h/24, 7j/7
                </span>
              </div>

              <Link to="/contact">
                <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 w-full px-8 py-4 uppercase tracking-widest text-xs">
                  {t('services.learnMore')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Download Brochure */}
          <div className="text-center mt-16">
            <a
              href="https://orso-rs.com/wp-content/uploads/2025/03/Collection-de-Services-4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 orso-btn-ghost"
              data-testid="download-brochure"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Télécharger notre brochure PDF
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="orso-section bg-white">
        <div className="orso-container text-center">
          <h2 className="orso-h2 mb-6">Une demande particulière ?</h2>
          <p className="orso-body max-w-2xl mx-auto mb-10">
            Notre équipe est à votre disposition pour répondre à toutes vos
            questions et organiser votre séjour sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button className="orso-btn-primary">
                Nous contacter
              </Button>
            </Link>
            <a href="tel:+33600000000">
              <Button className="orso-btn-secondary">
                <Phone className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Appeler
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
