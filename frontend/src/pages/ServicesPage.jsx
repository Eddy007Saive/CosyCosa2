import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteImages } from '@/lib/api';
import { ServicesSEO } from '@/components/SEO';

const DEFAULT_IMAGES = {
  services_intendance: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  services_experiences: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
};

const ServicesPage = () => {
  const { i18n } = useTranslation();
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
  ];

  const experienceServices = [
    'Excursions en bateau',
    'Location de yacht',
    'Randonnées guidées',
    'Cours de cuisine corse',
  ];

  return (
    <div className="pt-20" data-testid="services-page">
      {/* SEO */}
      <ServicesSEO lang={i18n.language} />
      
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-px bg-[#2e2e2e] mx-auto mb-8" />
            <h1 
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2e2e2e] mb-6"
              data-testid="services-title"
            >
              Le Prestige Sur-Mesure
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
              Parce que chaque voyage est unique, ORSO vous propose des offres sur mesure, adaptées à vos envies.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Intendance - Image Left, Text Right */}
      <section className="bg-[#f5f5f3]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="h-[50vh] lg:h-auto lg:min-h-[70vh]">
            <img
              src={siteImages.services_intendance}
              alt="Intendance & Services"
              className="w-full h-full object-cover"
              data-testid="services-intendance-image"
            />
          </div>
          
          {/* Text */}
          <div className="flex items-center p-8 md:p-12 lg:p-16 xl:p-20">
            <div className="max-w-lg">
              <div className="w-10 h-px bg-[#2e2e2e] mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] mb-4">
                Intendance & Services à domicile
              </h2>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                Des prestations haut de gamme pour un quotidien sans contraintes.
              </p>
              <ul className="space-y-3">
                {intendanceServices.map((service, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-[#2e2e2e] rounded-full" />
                    <span className="font-light">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Experiences - Text Left, Image Right */}
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Text */}
          <div className="flex items-center p-8 md:p-12 lg:p-16 xl:p-20 order-2 lg:order-1">
            <div className="max-w-lg ml-auto">
              <div className="w-10 h-px bg-[#2e2e2e] mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] mb-4">
                Expériences & Loisirs
              </h2>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                Des activités exclusives et immersives pour sublimer chaque instant de votre séjour.
              </p>
              <ul className="space-y-3">
                {experienceServices.map((service, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-[#2e2e2e] rounded-full" />
                    <span className="font-light">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Image */}
          <div className="h-[50vh] lg:h-auto lg:min-h-[70vh] order-1 lg:order-2">
            <img
              src={siteImages.services_experiences}
              alt="Expériences & Loisirs"
              className="w-full h-full object-cover"
              data-testid="services-experiences-image"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Demandes sur mesure */}
      <section className="bg-[#2e2e2e] py-20 md:py-28">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-px bg-white/40 mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
              Demandes sur mesure
            </h2>
            <p className="text-white/80 text-lg font-light leading-relaxed mb-10">
              Un accompagnement personnalisé pour concrétiser chacune de vos envies, même les plus spécifiques. Notre équipe est à votre disposition pour réaliser tous vos souhaits.
            </p>
            <Link to="/contact">
              <Button 
                className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-4 rounded-full uppercase tracking-widest text-xs font-medium transition-all"
                data-testid="services-contact-btn"
              >
                Nous contacter
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
