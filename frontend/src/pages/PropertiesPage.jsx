import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Bed, Bath, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getProperties, getCategories } from '@/lib/api';
import { PropertiesSEO } from '@/components/SEO';

const PropertiesPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [propertiesData, categoriesData] = await Promise.all([
          getProperties(activeCategory !== 'all' ? { category: activeCategory } : {}),
          getCategories(),
        ]);
        // Use API data if available, otherwise use mock data
        const apiProperties = propertiesData.properties || [];
        if (apiProperties.length > 0) {
          setProperties(apiProperties);
        } else {
          // Filter mock data by category
          const mockData = getMockProperties();
          if (activeCategory !== 'all') {
            setProperties(mockData.filter(p => p.category === activeCategory));
          } else {
            setProperties(mockData);
          }
        }
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Set mock data for demo
        const mockData = getMockProperties();
        if (activeCategory !== 'all') {
          setProperties(mockData.filter(p => p.category === activeCategory));
        } else {
          setProperties(mockData);
        }
        setCategories([
          { id: 'vue_mer', name: 'Vue Mer' },
          { id: 'plage_a_pieds', name: 'Plage à Pieds' },
          { id: 'pieds_dans_eau', name: "Pieds dans l'Eau" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const getCategoryName = (categoryId) => {
    if (categoryId === 'all') return t('properties.all');
    return t(`categories.${categoryId}`) || categoryId;
  };

  return (
    <div className="pt-24 md:pt-32" data-testid="properties-page">
      {/* SEO */}
      <PropertiesSEO 
        category={activeCategory !== 'all' ? activeCategory : null} 
        lang={i18n.language} 
      />
      
      {/* Header */}
      <section className="orso-container py-12 md:py-20">
        <div className="max-w-3xl">
          <p className="orso-caption mb-4">{t('properties.title')}</p>
          <h1 className="orso-h1 mb-6" data-testid="properties-title">
            {t('properties.title')}
          </h1>
          <p className="orso-body">{t('properties.subtitle')}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-y border-gray-100 sticky top-20 md:top-24 bg-white z-30">
        <div className="orso-container">
          <div className="flex items-center gap-2 py-4 overflow-x-auto hide-scrollbar">
            <span className="text-xs uppercase tracking-widest text-gray-500 mr-4 flex-shrink-0">
              {t('properties.filter')}:
            </span>
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-5 py-2 text-xs uppercase tracking-widest transition-colors flex-shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#2e2e2e] text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
              data-testid="filter-all"
            >
              {t('properties.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2 text-xs uppercase tracking-widest transition-colors flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#2e2e2e] text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
                data-testid={`filter-${cat.id}`}
              >
                {getCategoryName(cat.id)}
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
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={index}
                  language={i18n.language}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="orso-body">
                Aucune propriété trouvée pour cette catégorie.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const PropertyCard = ({ property, index, language }) => {
  const { t } = useTranslation();
  
  // Default luxury images for properties without images
  const defaultImages = [
    'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=600',
    'https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=600',
    'https://images.unsplash.com/photo-1766603636578-1da99a6dd236?w=600',
    'https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=600',
    'https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=600',
    'https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=600',
    'https://images.unsplash.com/photo-1744271688484-f0fa9dabf4b4?w=600',
    'https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=600',
  ];
  
  // Use property image or pick from defaults based on index
  const mainImage =
    property.images?.length > 0 
      ? property.images[0]
      : defaultImages[index % defaultImages.length];
  const description =
    property.short_description?.[language] ||
    property.short_description?.fr ||
    '';

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group orso-card opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      data-testid={`property-card-${property.id}`}
    >
      {/* Image */}
      <div className="property-image relative aspect-[4/3]">
        <img
          src={mainImage}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 text-xs uppercase tracking-widest">
            {t(`categories.${property.category}`)}
          </span>
        </div>
        {/* Showcase Badge */}
        {property.is_showcase && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-[#2e2e2e] text-white text-xs uppercase tracking-widest">
              {t('properties.showcase')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-xl md:text-2xl mb-2 group-hover:opacity-70 transition-opacity">
          {property.name}
        </h3>

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4" strokeWidth={1.5} />
          <span>{property.city}</span>
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Features */}
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

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {property.is_showcase ? (
            <span className="text-sm text-gray-500">
              {t('properties.contactUs')}
            </span>
          ) : (
            <div>
              {property.price_from && (
                <>
                  <span className="text-xs uppercase tracking-widest text-gray-500">
                    {t('properties.from')}
                  </span>
                  <span className="font-serif text-xl ml-2">
                    {property.price_from}€
                  </span>
                  <span className="text-gray-500 text-sm">
                    {t('properties.perNight')}
                  </span>
                </>
              )}
            </div>
          )}
          <ArrowRight
            className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </Link>
  );
};

// Mock data for demo
const getMockProperties = () => [
  {
    id: 'villa-mare-1',
    name: 'Villa Mare Vista',
    slug: 'villa-mare-vista',
    description: {
      fr: "Une villa d'exception avec vue panoramique sur la mer Méditerranée.",
      en: 'An exceptional villa with panoramic views of the Mediterranean Sea.',
    },
    short_description: {
      fr: "Villa d'exception avec vue mer à 180°",
      en: 'Exceptional villa with 180° sea view',
    },
    location: 'Porto-Vecchio',
    city: 'Porto-Vecchio',
    category: 'vue_mer',
    images: [
      'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=600',
    ],
    max_guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Piscine', 'Vue mer', 'Climatisation', 'WiFi'],
    price_from: 450,
    currency: 'EUR',
    is_showcase: false,
  },
  {
    id: 'villa-plage-1',
    name: 'Casa Palombaggia',
    slug: 'casa-palombaggia',
    description: {
      fr: 'À quelques pas de la célèbre plage de Palombaggia.',
      en: 'Just steps from the famous Palombaggia beach.',
    },
    short_description: {
      fr: 'À 2 minutes à pied de Palombaggia',
      en: '2-minute walk to Palombaggia',
    },
    location: 'Palombaggia',
    city: 'Porto-Vecchio',
    category: 'plage_a_pieds',
    images: [
      'https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=600',
    ],
    max_guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Terrasse', 'Jardin', 'Parking', 'WiFi'],
    price_from: 350,
    currency: 'EUR',
    is_showcase: false,
  },
  {
    id: 'villa-eau-1',
    name: 'Villa Pieds dans l\'Eau',
    slug: 'villa-pieds-dans-leau',
    description: {
      fr: 'Le luxe ultime: accès direct à la mer depuis votre terrasse.',
      en: 'Ultimate luxury: direct sea access from your terrace.',
    },
    short_description: {
      fr: 'Accès privatif à la mer',
      en: 'Private sea access',
    },
    location: 'Bonifacio',
    city: 'Bonifacio',
    category: 'pieds_dans_eau',
    images: [
      'https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=600',
    ],
    max_guests: 10,
    bedrooms: 5,
    bathrooms: 4,
    amenities: ['Piscine', 'Accès mer', 'Jacuzzi', 'Climatisation'],
    price_from: 800,
    currency: 'EUR',
    is_showcase: false,
  },
  {
    id: 'villa-showcase-1',
    name: 'Domaine Exclusif',
    slug: 'domaine-exclusif',
    description: {
      fr: 'Un domaine privé exceptionnel, disponible sur demande uniquement.',
      en: 'An exceptional private estate, available on request only.',
    },
    short_description: {
      fr: 'Domaine privé de prestige',
      en: 'Prestigious private estate',
    },
    location: 'Calvi',
    city: 'Calvi',
    category: 'vue_mer',
    images: [
      'https://images.unsplash.com/photo-1766603636578-1da99a6dd236?w=600',
    ],
    max_guests: 12,
    bedrooms: 6,
    bathrooms: 5,
    amenities: ['Piscine', 'Tennis', 'Personnel de maison'],
    price_from: null,
    currency: 'EUR',
    is_showcase: true,
  },
];

export default PropertiesPage;
