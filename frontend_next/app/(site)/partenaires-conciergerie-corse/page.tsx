'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const HERO_IMAGE = 'https://images.pexels.com/photos/11875385/pexels-photo-11875385.jpeg?auto=compress&cs=tinysrgb&w=1920';

const PARTNERS = [
  {
    title: 'Balade en bateau avec Skipper',
    description: "Embarquez à bord de l'Axopar 37 Sun Top \"Titidoudou\" et découvrez les plus beaux rivages du sud-est de la Corse dans un cadre privilégié. Entre escales dans des criques confidentielles, baignades dans des eaux cristallines et instants de détente à bord, chaque moment se vit avec douceur et élégance. Une expérience en mer raffinée, pensée pour savourer pleinement la beauté des lieux, en toute intimité.",
    image: '/partenaires/kyrnos-marine.png',
    link: 'https://www.kyrnos-marine.com/',
  },
  {
    title: 'Baignade à cheval / randonnées',
    description: "Découvrez la magie d'une baignade à cheval dans les eaux cristallines de Saint-Cyprien ou laissez-vous guider à travers les sentiers sauvages de Pinarello lors d'une randonnée équestre inoubliable.",
    image: '/partenaires/country-horse.png',
    link: 'https://www.country-horse.com/',
  },
  {
    title: 'Massages / Soins Esthétiques',
    description: "Plongez dans l'univers envoûtant d'Angélique, masseuse professionnelle passionnée depuis plus de 10 ans. Ses mains expertes et son savoir-faire vous transportent dans une parenthèse de bien-être absolu.",
    image: '/partenaires/massages-angelique.png',
    link: 'https://outoftimemassages.wixsite.com/massages-angelique',
  },
  {
    title: 'Visite, dégustation au Domaine de Torraccia',
    description: "Venez découvrir le Domaine de Torraccia, un vignoble familial niché entre mer et maquis, où traditions corses et vins bios se rencontrent le temps d'une visite ou d'une dégustation.",
    image: '/partenaires/torraccia.jpeg',
    link: 'https://www.domaine-de-torraccia.com/',
  },
  {
    title: 'Simples et Divines Huiles Essentielles',
    description: "Venez découvrir Simples et Divines, producteurs d'huiles essentielles et de cosmétiques naturels au cœur du maquis corse, où chaque plante est cultivée, récoltée et transformée avec passion et savoir-faire artisanal.",
    image: '/partenaires/simples-divines.png',
    link: 'https://www.lessimples.com/fr/',
  },
  {
    title: 'Rando Palmée à Bonifacio',
    description: "Partez à la découverte des fonds marins de Bonifacio lors d'une randonnée palmée exceptionnelle. Entre falaises calcaires et eaux cristallines, vivez une expérience unique au cœur de la réserve naturelle.",
    image: 'https://images.unsplash.com/photo-1758626221307-8b02e7540ad7?w=800&q=80',
    link: 'tel:+33670897062',
  },
];

export default function PartnersPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center bg-cover bg-center pt-36"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
            Partenaires
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>&gt;</span>
            <span className="text-white/90">partenaires</span>
          </div>
        </div>
      </section>

      {/* Partners List */}
      <section className="orso-section">
        <div className="orso-container">
          <div className="space-y-24 lg:space-y-32">
            {PARTNERS.map((partner, index) => {
              const isReversed = index % 2 !== 0;
              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
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
                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-6 tracking-tight">
                      {partner.title}
                    </h2>
                    <p className="orso-body mb-8">{partner.description}</p>
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[#2e2e2e] border-b border-[#2e2e2e]/30 pb-1 hover:border-[#2e2e2e] transition-colors"
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
}
