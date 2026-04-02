'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Bed, Bath, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getProperties, getSiteImages } from '@/lib/api';

const BEDROOM_FILTERS = [
  { id: 'bedrooms_1_2', label: '1 – 2 chambres', min: 1, max: 2 },
  { id: 'bedrooms_3_4', label: '3 – 4 chambres', min: 3, max: 4 },
  { id: 'bedrooms_5plus', label: '5+ chambres',   min: 5, max: undefined },
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=600',
  'https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=600',
  'https://images.unsplash.com/photo-1766603636578-1da99a6dd236?w=600',
  'https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=600',
  'https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=600',
  'https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=600',
];

interface Property {
  id: string;
  name: string;
  city: string;
  category: string;
  images: string[];
  short_description: Record<string, string>;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  price_from: number | null;
  is_showcase: boolean;
}

function PropertiesContent() {
  const { t, i18n } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    setLoading(true);
    getProperties()
      .then((data: any) => setAllProperties(data?.properties || []))
      .catch(() => setAllProperties([]))
      .finally(() => setLoading(false));
    getSiteImages()
      .then((data: any) => { if (data?.images?.locations_hero) setHeroImage(data.images.locations_hero); })
      .catch(() => {});
  }, []);

  const properties = (() => {
    const f = BEDROOM_FILTERS.find((f) => f.id === activeFilter);
    if (!f) return allProperties;
    return allProperties.filter((p) =>
      p.bedrooms >= f.min && (f.max === undefined || p.bedrooms <= f.max)
    );
  })();

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    const params = new URLSearchParams(searchParams.toString());
    if (filterId === 'all') params.delete('filter');
    else params.set('filter', filterId);
    router.replace(`/locations-vacances-cosy-casa?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      {heroImage && (
        <section className="relative min-h-[50vh] flex items-center justify-center bg-[#2e2e2e] pt-36"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">{t('properties.title')}</h1>
            <p className="text-lg font-light text-white/80">{t('properties.subtitle')}</p>
          </div>
        </section>
      )}

      <div className={heroImage ? '' : 'pt-40 md:pt-44'}>
      {!heroImage && (
        <section className="orso-container py-12 md:py-20">
          <div className="max-w-3xl">
            <p className="orso-caption mb-4">{t('properties.title')}</p>
            <h1 className="orso-h1 mb-6">{t('properties.title')}</h1>
            <p className="orso-body">{t('properties.subtitle')}</p>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="border-y border-gray-100 sticky top-20 md:top-24 bg-white z-30">
        <div className="orso-container">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            <span className="text-xs uppercase tracking-widest text-gray-500 mr-4 flex-shrink-0">
              Chambres :
            </span>
            {[{ id: 'all', label: 'Toutes' }, ...BEDROOM_FILTERS].map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilterChange(f.id)}
                className={`px-5 py-2 text-xs uppercase tracking-widest transition-colors flex-shrink-0 ${
                  activeFilter === f.id
                    ? 'bg-[#2e2e2e] text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="orso-section">
        <div className="orso-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} language={i18n.language} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="orso-body">Aucune propriété trouvée pour cette catégorie.</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}

function PropertyCard({ property, index, language }: { property: Property; index: number; language: string }) {
  const { t } = useTranslation();
  const mainImage = property.images?.length > 0
    ? property.images[0]
    : DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  const description = property.short_description?.[language] || property.short_description?.fr || '';

  return (
    <Link
      href={`/locations-vacances-cosy-casa/${property.id}`}
      className="group orso-card opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="property-image relative aspect-[4/3]">
        <img src={mainImage} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 text-xs uppercase tracking-widest">
            {t(`categories.${property.category}`)}
          </span>
        </div>
        {property.is_showcase && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-[#2e2e2e] text-white text-xs uppercase tracking-widest">
              {t('properties.showcase')}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl md:text-2xl mb-2 group-hover:opacity-70 transition-opacity">
          {property.name}
        </h3>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4" strokeWidth={1.5} />
          <span>{property.city}</span>
        </div>
        {description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>}
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" strokeWidth={1.5} />
            <span>{property.max_guests}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" strokeWidth={1.5} />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" strokeWidth={1.5} />
            <span>{property.bathrooms}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {property.is_showcase ? (
            <span className="text-sm text-gray-500">{t('properties.contactUs')}</span>
          ) : (
            <div>
              {property.price_from && (
                <>
                  <span className="text-xs uppercase tracking-widest text-gray-500">{t('properties.from')}</span>
                  <span className="font-serif text-xl ml-2">{property.price_from}€</span>
                  <span className="text-gray-500 text-sm">{t('properties.perNight')}</span>
                </>
              )}
            </div>
          )}
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
        </div>
      </div>
    </Link>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-gray-400">Chargement...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
