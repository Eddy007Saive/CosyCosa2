import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import useSEO from '@/hooks/useSEO';

const HERO_IMAGE = 'https://images.pexels.com/photos/11875385/pexels-photo-11875385.jpeg?auto=compress&cs=tinysrgb&w=1920';

const PARTNERS = [
  {
    title: 'Balade en bateau avec Skipper',
    description: "Partez à bord du Piena Luna avec Olivier et découvrez les criques secrètes du sud-est de la Corse. Entre baignade, snorkeling et instants de détente, savourez un déjeuner maison aux saveurs locales dans une atmosphère chaleureuse.",
    image: 'https://images.pexels.com/photos/11875385/pexels-photo-11875385.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: 'https://www.levasionturquoise.com/',
  },
  {
    title: 'Baignade à cheval / randonnées',
    description: "Découvrez la magie d'une baignade à cheval dans les eaux cristallines de Saint-Cyprien ou laissez-vous guider à travers les sentiers sauvages de Pinarello lors d'une randonnée équestre inoubliable.",
    image: 'https://images.unsplash.com/photo-1629605923453-7cd4f2680c44?w=800&q=80',
    link: 'https://www.country-horse.com/',
  },
  {
    title: 'Massages / Soins Esthétiques',
    description: "Plongez dans l'univers envoûtant d'Angélique, masseuse professionnelle passionnée depuis plus de 10 ans. Ses mains expertes et son savoir-faire vous transportent dans une parenthèse de bien-être absolu.",
    image: 'https://images.pexels.com/photos/9335987/pexels-photo-9335987.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: 'https://outoftimemassages.wixsite.com/massages-angelique',
  },
  {
    title: 'Visite, dégustation au Domaine de Torraccia',
    description: "Venez découvrir le Domaine de Torraccia, un vignoble familial niché entre mer et maquis, où traditions corses et vins bios se rencontrent le temps d'une visite ou d'une dégustation.",
    image: 'https://images.pexels.com/photos/5697222/pexels-photo-5697222.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: 'https://www.domaine-de-torraccia.com/',
  },
  {
    title: 'Simples et Divines Huiles Essentielles',
    description: "Venez découvrir Simples et Divines, producteurs d'huiles essentielles et de cosmétiques naturels au cœur du maquis corse, où chaque plante est cultivée, récoltée et transformée avec passion et savoir-faire artisanal.",
    image: 'https://images.unsplash.com/photo-1669281393403-e1f3248dce2b?w=800&q=80',
    link: 'https://www.lessimples.com/fr/',
  },
  {
    title: 'Rando Palmée à Bonifacio',
    description: "Partez à la découverte des fonds marins de Bonifacio lors d'une randonnée palmée exceptionnelle. Entre falaises calcaires et eaux cristallines, vivez une expérience unique au cœur de la réserve naturelle.",
    image: 'https://images.unsplash.com/photo-1758626221307-8b02e7540ad7?w=800&q=80',
    link: 'tel:+33670897062',
  },
];

const PartnersPage = () => {
  useSEO({
    title: 'Partenaires conciergerie Corse – Cosy Casa',
    description: "Partenaires conciergerie Corse – CosyCasa s'entoure de partenaires locaux fiables pour offrir des services haut de gamme en Corse-du-Sud.",
    path: '/partenaires-conciergerie-corse',
  });

  return (
    <div data-testid="partners-page">
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center bg-cover bg-center pt-36"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        data-testid="partners-hero"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4" data-testid="partners-hero-title">
            Partenaires
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>&gt;</span>
            <span className="text-white/90">partenaires</span>
          </div>
        </div>
      </section>

      {/* Partners List */}
      <section className="orso-section" data-testid="partners-list">
        <div className="orso-container">
          <div className="space-y-24 lg:space-y-32">
            {PARTNERS.map((partner, index) => {
              const isReversed = index % 2 !== 0;
              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
                  data-testid={`partner-card-${index}`}
                >
                  {/* Image */}
                  <div className={`overflow-hidden ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={partner.image}
                        alt={partner.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={isReversed ? 'lg:order-1' : ''}>
                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-6 tracking-tight" data-testid={`partner-title-${index}`}>
                      {partner.title}
                    </h2>
                    <p className="orso-body mb-8">
                      {partner.description}
                    </p>
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[#2e2e2e] border-b border-[#2e2e2e]/30 pb-1 hover:border-[#2e2e2e] transition-colors"
                      data-testid={`partner-link-${index}`}
                    >
                      En savoir plus
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
