import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Users,
  Bed,
  Bath,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Waves,
  Wind,
  Utensils,
  Tv,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, addDays, differenceInDays } from 'date-fns';
import { fr, enUS, es, it } from 'date-fns/locale';
import { getProperty, getPriceQuote, createBooking } from '@/lib/api';

const locales = { fr, en: enUS, es, it };

const amenityIcons = {
  Piscine: Waves,
  WiFi: Wifi,
  Parking: Car,
  Climatisation: Wind,
  Cuisine: Utensils,
  TV: Tv,
  default: Check,
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = locales[i18n.language] || fr;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(2);
  const [priceQuote, setPriceQuote] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      try {
        const data = await getProperty(id);
        setProperty(data);
      } catch (error) {
        console.error('Failed to load property:', error);
        // Set mock property for demo
        setProperty(getMockProperty(id));
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!checkIn || !checkOut || !property || property.is_showcase) return;

      setLoadingPrice(true);
      try {
        const quote = await getPriceQuote(
          property.id,
          format(checkIn, 'yyyy-MM-dd'),
          format(checkOut, 'yyyy-MM-dd'),
          guests
        );
        setPriceQuote(quote);
      } catch (error) {
        console.error('Failed to get price quote:', error);
        // Calculate mock price
        const nights = differenceInDays(checkOut, checkIn);
        setPriceQuote({
          available: true,
          total_price: (property.price_from || 200) * nights,
          nights,
          price_per_night: property.price_from || 200,
          currency: 'EUR',
        });
      } finally {
        setLoadingPrice(false);
      }
    };
    fetchPrice();
  }, [checkIn, checkOut, guests, property]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property?.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (property?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!priceQuote || !priceQuote.available) return;

    setSubmitting(true);
    try {
      const bookingData = {
        property_id: property.id,
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
        guests,
        guest_name: `${bookingForm.firstName} ${bookingForm.lastName}`,
        guest_email: bookingForm.email,
        guest_phone: bookingForm.phone,
        special_requests: bookingForm.specialRequests,
        total_price: priceQuote.total_price,
        currency: priceQuote.currency,
      };

      const result = await createBooking(bookingData);

      if (result.success) {
        toast.success(t('booking.success'));
        setShowBookingModal(false);
        // Reset form
        setBookingForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          specialRequests: '',
        });
        setCheckIn(null);
        setCheckOut(null);
        setPriceQuote(null);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 md:pt-32 orso-container">
        <Skeleton className="h-[60vh] w-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-24 md:pt-32 orso-container text-center py-20">
        <p className="orso-body">Propriété non trouvée</p>
        <Link to="/properties">
          <Button className="orso-btn-secondary mt-8">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const description =
    property.description?.[i18n.language] || property.description?.fr || '';
  const images = property.images?.length
    ? property.images
    : ['https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200'];

  return (
    <div className="pt-20 md:pt-24" data-testid="property-detail-page">
      {/* Back Button */}
      <div className="orso-container py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2e2e2e] transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          {t('common.back')}
        </button>
      </div>

      {/* Image Gallery */}
      <section className="relative h-[50vh] md:h-[70vh] bg-gray-100">
        <img
          src={images[currentImageIndex]}
          alt={property.name}
          className="w-full h-full object-cover"
          data-testid="property-main-image"
        />

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`gallery-dot ${i === currentImageIndex ? 'active' : ''}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 bg-white text-xs uppercase tracking-widest">
            {t(`categories.${property.category}`)}
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="orso-section">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1
                className="orso-h1 mb-4"
                data-testid="property-title"
              >
                {property.name}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 mb-8">
                <MapPin className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-lg">{property.city}</span>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-8 py-6 border-y border-gray-100 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <span>
                    {property.max_guests} {t('properties.guests')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <span>
                    {property.bedrooms} {t('properties.beds')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <span>
                    {property.bathrooms} {t('properties.baths')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="orso-h3 mb-6">{t('property.description')}</h2>
                <div className="orso-body whitespace-pre-line">{description}</div>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="mb-12">
                  <h2 className="orso-h3 mb-6">{t('property.amenities')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => {
                      const IconComponent =
                        amenityIcons[amenity] || amenityIcons.default;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-3 py-3"
                        >
                          <IconComponent
                            className="w-5 h-5 text-gray-500"
                            strokeWidth={1.5}
                          />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-orso-surface p-6 md:p-8 border border-gray-100">
                {property.is_showcase ? (
                  // Showcase Property - Contact Only
                  <div data-testid="showcase-contact">
                    <p className="orso-caption mb-4">{t('properties.showcase')}</p>
                    <h3 className="orso-h3 mb-6">{property.name}</h3>
                    <p className="orso-body mb-8">
                      Cette propriété est disponible sur demande uniquement.
                      Contactez-nous pour plus d'informations.
                    </p>
                    <Link to="/contact">
                      <Button
                        className="orso-btn-primary w-full"
                        data-testid="contact-btn"
                      >
                        {t('property.contactForInfo')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  // Bookable Property
                  <div data-testid="booking-widget">
                    {/* Price Display */}
                    {property.price_from && (
                      <div className="mb-6">
                        <span className="text-xs uppercase tracking-widest text-gray-500">
                          {t('property.priceFrom')}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="price-tag">
                            {property.price_from}€
                          </span>
                          <span className="text-gray-500">
                            {t('property.perNight')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Date Selection */}
                    <div className="mb-6">
                      <Label className="orso-caption mb-3 block">
                        {t('property.selectDates')}
                      </Label>
                      <Calendar
                        mode="range"
                        selected={{ from: checkIn, to: checkOut }}
                        onSelect={(range) => {
                          setCheckIn(range?.from || null);
                          setCheckOut(range?.to || null);
                        }}
                        disabled={(date) => date < new Date()}
                        locale={locale}
                        numberOfMonths={1}
                        className="border border-gray-200 p-4"
                        data-testid="booking-calendar"
                      />
                    </div>

                    {/* Guests */}
                    <div className="mb-6">
                      <Label className="orso-caption mb-3 block">
                        {t('property.guests')}
                      </Label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                          data-testid="guests-decrease"
                        >
                          -
                        </button>
                        <span className="font-serif text-xl w-12 text-center">
                          {guests}
                        </span>
                        <button
                          onClick={() =>
                            setGuests(Math.min(property.max_guests, guests + 1))
                          }
                          className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                          data-testid="guests-increase"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price Quote */}
                    {loadingPrice && (
                      <div className="mb-6 py-4 border-t border-gray-200">
                        <Skeleton className="h-6 w-full" />
                      </div>
                    )}

                    {priceQuote && !loadingPrice && (
                      <div
                        className="mb-6 py-4 border-t border-gray-200"
                        data-testid="price-quote"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            {priceQuote.price_per_night}€ x {priceQuote.nights}{' '}
                            {priceQuote.nights > 1
                              ? t('property.nights')
                              : t('property.night')}
                          </span>
                          <span>{priceQuote.total_price}€</span>
                        </div>
                        <div className="flex justify-between font-medium pt-4 border-t border-gray-200">
                          <span>{t('property.totalPrice')}</span>
                          <span className="font-serif text-xl">
                            {priceQuote.total_price}€
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Book Button */}
                    <Button
                      className="orso-btn-primary w-full"
                      disabled={!priceQuote || !priceQuote.available}
                      onClick={() => setShowBookingModal(true)}
                      data-testid="book-now-btn"
                    >
                      {t('property.bookNow')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {t('booking.title')}
            </DialogTitle>
          </DialogHeader>

          {/* Summary */}
          <div className="py-4 border-b border-gray-100">
            <h4 className="orso-caption mb-2">{t('booking.summary')}</h4>
            <p className="font-serif text-lg">{property.name}</p>
            {checkIn && checkOut && (
              <p className="text-gray-600">
                {format(checkIn, 'd MMM yyyy', { locale })} -{' '}
                {format(checkOut, 'd MMM yyyy', { locale })}
              </p>
            )}
            {priceQuote && (
              <p className="font-medium mt-2">
                {t('property.totalPrice')}: {priceQuote.total_price}€
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <h4 className="orso-caption">{t('booking.yourInfo')}</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t('booking.firstName')}</Label>
                <Input
                  id="firstName"
                  value={bookingForm.firstName}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, firstName: e.target.value })
                  }
                  required
                  className="orso-input border rounded px-3"
                  data-testid="booking-firstname"
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t('booking.lastName')}</Label>
                <Input
                  id="lastName"
                  value={bookingForm.lastName}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, lastName: e.target.value })
                  }
                  required
                  className="orso-input border rounded px-3"
                  data-testid="booking-lastname"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{t('booking.email')}</Label>
              <Input
                id="email"
                type="email"
                value={bookingForm.email}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, email: e.target.value })
                }
                required
                className="orso-input border rounded px-3"
                data-testid="booking-email"
              />
            </div>

            <div>
              <Label htmlFor="phone">{t('booking.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={bookingForm.phone}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, phone: e.target.value })
                }
                required
                className="orso-input border rounded px-3"
                data-testid="booking-phone"
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">
                {t('booking.specialRequests')}
              </Label>
              <Textarea
                id="specialRequests"
                value={bookingForm.specialRequests}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    specialRequests: e.target.value,
                  })
                }
                className="orso-input border rounded px-3 min-h-[100px]"
                data-testid="booking-requests"
              />
            </div>

            <Button
              type="submit"
              className="orso-btn-primary w-full"
              disabled={submitting}
              data-testid="booking-confirm-btn"
            >
              {submitting ? t('common.loading') : t('booking.confirm')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Mock property for demo
const getMockProperty = (id) => ({
  id: id,
  name: 'Villa Mare Vista',
  slug: 'villa-mare-vista',
  description: {
    fr: `Une villa d'exception perchée sur les hauteurs de Porto-Vecchio, offrant une vue panoramique à 180° sur la mer Méditerranée et les îles de Sardaigne.

Cette propriété de prestige allie le charme authentique de l'architecture corse à un confort moderne de haut standing. Les espaces de vie généreux s'ouvrent sur de vastes terrasses, créant une harmonie parfaite entre intérieur et extérieur.

La piscine à débordement, orientée vers le large, vous invite à la contemplation et à la détente. Chaque chambre dispose de sa propre salle de bain et offre des vues imprenables sur le paysage environnant.

À seulement 10 minutes des plus belles plages de Corse du Sud (Palombaggia, Santa Giulia) et à proximité du centre-ville de Porto-Vecchio, cette villa vous offre le meilleur de la Corse.`,
    en: `An exceptional villa perched on the heights of Porto-Vecchio, offering a 180° panoramic view of the Mediterranean Sea and the Sardinian islands.

This prestigious property combines the authentic charm of Corsican architecture with modern high-end comfort. The generous living spaces open onto vast terraces, creating a perfect harmony between interior and exterior.

The infinity pool, facing the open sea, invites you to contemplation and relaxation. Each bedroom has its own bathroom and offers breathtaking views of the surrounding landscape.

Just 10 minutes from the most beautiful beaches of Southern Corsica (Palombaggia, Santa Giulia) and close to the town center of Porto-Vecchio, this villa offers you the best of Corsica.`,
  },
  short_description: {
    fr: "Villa d'exception avec vue mer panoramique",
    en: 'Exceptional villa with panoramic sea view',
  },
  location: 'Porto-Vecchio',
  city: 'Porto-Vecchio',
  category: 'vue_mer',
  images: [
    'https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200',
    'https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=1200',
    'https://images.unsplash.com/photo-1766603636578-1da99a6dd236?w=1200',
    'https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=1200',
  ],
  max_guests: 8,
  bedrooms: 4,
  bathrooms: 3,
  amenities: [
    'Piscine',
    'Vue mer',
    'Climatisation',
    'WiFi',
    'Parking',
    'Cuisine équipée',
    'TV',
    'Terrasse',
  ],
  price_from: 450,
  currency: 'EUR',
  is_showcase: false,
});

export default PropertyDetailPage;
