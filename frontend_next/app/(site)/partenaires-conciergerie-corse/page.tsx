'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getSiteImages, getPartners } from '@/lib/api';

const DEFAULT_HERO = 'https://images.pexels.com/photos/11875385/pexels-photo-11875385.jpeg?auto=compress&cs=tinysrgb&w=1920';

export default function PartnersPage() {
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteImages()
      .then((data: any) => { if (data?.images?.partenaires_hero) setHeroImage(data.images.partenaires_hero); })
      .catch(() => {});
    getPartners()
      .then((data: any) => setPartners(Array.isArray(data) ? data : []))
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center bg-cover bg-center pt-36"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
            Carnet
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>&gt;</span>
            <span className="text-white/90">Carnet</span>
          </div>
        </div>
      </section>

      {/* Partners List */}
      <section className="orso-section">
        <div className="orso-container">
          {loading ? (
            <div className="space-y-24 lg:space-y-32">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 w-3/4" />
                    <div className="h-4 bg-gray-200 w-full" />
                    <div className="h-4 bg-gray-200 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Aucun partenaire pour le moment.</div>
          ) : (
            <div className="space-y-24 lg:space-y-32">
              {partners.map((partner, index) => {
                const isReversed = index % 2 !== 0;
                return (
                  <div
                    key={partner.id}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
                  >
                    {/* Image */}
                    <div className={`overflow-hidden ${isReversed ? 'lg:order-2' : ''}`}>
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={partner.image || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'}
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
                      {partner.link && (
                        <a
                          href={partner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[#2e2e2e] border-b border-[#2e2e2e]/30 pb-1 hover:border-[#2e2e2e] transition-colors"
                        >
                          En savoir plus
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
