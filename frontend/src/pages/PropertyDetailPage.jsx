import { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  AlertCircle,
  ExternalLink,
  Clock,
  Shield,
  Calendar as CalendarIcon,
  Phone,
  Sparkles,
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
import { format, addDays, differenceInDays, addMonths, parseISO, isWithinInterval, eachDayOfInterval } from 'date-fns';
import { fr, enUS, es, it } from 'date-fns/locale';
import { getProperty, getPriceQuote, createBooking, submitContact, getPropertyAvailability, getBookingUrl } from '@/lib/api';
import { PropertySEO } from '@/components/SEO';

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
  
  // Availability states
  const [blockedDates, setBlockedDates] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Contact form for showcase properties
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  // Load property
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
  
  // Load availability when property is loaded (for next 6 months)
  useEffect(() => {
    const loadAvailability = async () => {
      if (!property || property.is_showcase) return;
      
      setLoadingAvailability(true);
      setAvailabilityError(null);
      
      try {
        const today = new Date();
        const fromDate = format(today, 'yyyy-MM-dd');
        const toDate = format(addMonths(today, 6), 'yyyy-MM-dd');
        
        const data = await getPropertyAvailability(property.id, fromDate, toDate);
        
        if (data.blocked_dates && data.blocked_dates.length > 0) {
          // Parse blocked dates
          const blocked = data.blocked_dates.map(dateStr => parseISO(dateStr));
          setBlockedDates(blocked);
        } else {
          setBlockedDates([]);
        }
        
        if (data.note) {
          console.log('Availability note:', data.note);
        }
      } catch (error) {
        console.error('Failed to load availability:', error);
        setAvailabilityError('Unable to load availability');
      } finally {
        setLoadingAvailability(false);
      }
    };
    
    loadAvailability();
  }, [property]);
  
  // Function to check if a date is blocked
  const isDateBlocked = (date) => {
    return blockedDates.some(blockedDate => 
      format(blockedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };
  
  // Check if date range has blocked dates
  const hasBlockedDatesInRange = (start, end) => {
    if (!start || !end) return false;
    const daysInRange = eachDayOfInterval({ start, end });
    return daysInRange.some(day => isDateBlocked(day));
  };

  useEffect(() => {
    const fetchPrice = async () => {
      if (!checkIn || !checkOut || !property || property.is_showcase) return;

      const nights = differenceInDays(checkOut, checkIn);
      const minStay = property.min_stay || 1;
      
      // Check minimum stay requirement
      if (nights < minStay) {
        setPriceQuote({
          available: false,
          min_stay_error: true,
          min_stay: minStay,
          nights,
          message: `Séjour minimum de ${minStay} nuits requis`
        });
        setLoadingPrice(false);
        return;
      }

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

  // Create booking via API and redirect to Stripe payment page
  const handleBookOnBeds24 = async () => {
    if (!property.beds24_id) {
      toast.error('Cette propriété n\'est pas disponible à la réservation en ligne');
      return;
    }
    
    // Validate form
    if (!bookingForm.firstName || !bookingForm.lastName || !bookingForm.email) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create booking via API - this will create the reservation in Beds24
      // and return the direct Stripe payment URL
      const bookingData = {
        property_id: property.id,
        room_id: property.beds24_room_id,
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
        guests: guests,
        guest_name: `${bookingForm.firstName} ${bookingForm.lastName}`,
        guest_email: bookingForm.email,
        guest_phone: bookingForm.phone || '',
        special_requests: bookingForm.specialRequests || '',
        total_price: priceQuote?.total_price || 0,
        currency: priceQuote?.currency || 'EUR',
      };
      
      const result = await createBooking(bookingData);
      
      if (result.success && result.payment_url) {
        // Redirect to Stripe payment page
        toast.success('Redirection vers le paiement sécurisé...');
        // Use window.location to redirect (same tab) for better UX
        window.location.href = result.payment_url;
      } else if (result.success && !result.payment_url) {
        // Booking created but no payment URL (fallback case)
        toast.success('Réservation créée ! Vous recevrez un email avec les instructions de paiement.');
        setShowBookingModal(false);
      } else {
        toast.error('Erreur lors de la création de la réservation');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!priceQuote || !priceQuote.available) return;

    // Use Beds24 booking page instead of internal booking
    if (property.beds24_id) {
      await handleBookOnBeds24();
      return;
    }

    // Fallback for non-Beds24 properties (shouldn't happen normally)
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

  // Handle contact form submission for showcase properties
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmittingContact(true);
    try {
      await submitContact({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        subject: `Demande d'information: ${property?.name}`,
        message: contactForm.message,
        property_id: property?.id,
        language: i18n.language,
      });
      
      toast.success('Votre demande a été envoyée. Nous vous contacterons rapidement.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact submission failed:', error);
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSubmittingContact(false);
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
        <Link to="/locations-vacances-cosy-casa">
          <Button className="orso-btn-secondary mt-8">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  // Get description - try multiple sources
  const getDescription = () => {
    // First try the description field
    const desc = property.description?.[i18n.language] || property.description?.fr;
    if (desc && desc.trim().length > 10) return desc;
    
    // Then try templates (Beds24 stores descriptions there)
    const templates = property.templates || {};
    for (const key of ['template1', 'template2', 'template4', 'template5']) {
      const tpl = templates[key];
      if (tpl && tpl.trim().length > 20 && !tpl.startsWith('http')) {
        return tpl;
      }
    }
    
    // Return empty string - will show placeholder
    return '';
  };
  
  const description = getDescription();
  const images = property.images?.length
    ? property.images
    : ['https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200'];

  return (
    <div className="pt-20 md:pt-24" data-testid="property-detail-page">
      {/* SEO */}
      <PropertySEO property={property} lang={i18n.language} />
      
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
          alt={`${property.name} - Location de luxe en Corse du Sud`}
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
                {description ? (
                  <div className="orso-description whitespace-pre-line">{description}</div>
                ) : (
                  <div className="orso-description text-gray-500 italic">
                    {i18n.language === 'fr' 
                      ? `${property.name} vous accueille en Corse du Sud. Contactez-nous pour plus d'informations sur cette propriété.`
                      : i18n.language === 'en'
                      ? `${property.name} welcomes you in Southern Corsica. Contact us for more information about this property.`
                      : i18n.language === 'es'
                      ? `${property.name} le da la bienvenida en el sur de Córcega. Contáctenos para más información.`
                      : `${property.name} vi accoglie nella Corsica del Sud. Contattateci per maggiori informazioni.`
                    }
                  </div>
                )}
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="mb-12">
                  <h2 className="orso-h3 mb-8">{t('property.amenities')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity) => {
                      const IconComponent =
                        amenityIcons[amenity] || amenityIcons.default;
                      return (
                        <div
                          key={amenity}
                          className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <IconComponent
                            className="w-4 h-4 text-gray-500"
                            strokeWidth={1.5}
                          />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Practical Info - Only for Beds24 connected properties */}
              {property.beds24_id && (
                <div className="mb-12 bg-gray-50 p-6 rounded-lg">
                  <h2 className="orso-h3 mb-6">Informations pratiques</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Check-in / Check-out */}
                    <div className="flex items-start gap-4">
                      <Clock className="w-5 h-5 text-gray-500 mt-1" strokeWidth={1.5} />
                      <div>
                        <p className="font-medium mb-1">Horaires</p>
                        <p className="text-sm text-gray-600">
                          Arrivée : {property.check_in_start || '15:00'} - {property.check_in_end || '20:00'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Départ : avant {property.check_out_end || '10:00'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Min Stay */}
                    {property.min_stay && property.min_stay > 1 && (
                      <div className="flex items-start gap-4">
                        <CalendarIcon className="w-5 h-5 text-gray-500 mt-1" strokeWidth={1.5} />
                        <div>
                          <p className="font-medium mb-1">Séjour minimum</p>
                          <p className="text-sm text-gray-600">{property.min_stay} nuits</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Security Deposit */}
                    {property.security_deposit && (
                      <div className="flex items-start gap-4">
                        <Shield className="w-5 h-5 text-gray-500 mt-1" strokeWidth={1.5} />
                        <div>
                          <p className="font-medium mb-1">Caution</p>
                          <p className="text-sm text-gray-600">{property.security_deposit}€</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Cleaning Fee */}
                    {property.cleaning_fee && (
                      <div className="flex items-start gap-4">
                        <Check className="w-5 h-5 text-gray-500 mt-1" strokeWidth={1.5} />
                        <div>
                          <p className="font-medium mb-1">Frais de ménage</p>
                          <p className="text-sm text-gray-600">{property.cleaning_fee}€ (inclus)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Concierge Services CTA */}
              <div className="mb-12 bg-[#2e2e2e] text-white p-6 md:p-8 rounded-lg" data-testid="concierge-cta">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
                    <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl mb-3">
                      {i18n.language === 'fr' ? 'Séjour sur mesure' 
                        : i18n.language === 'en' ? 'Tailor-made stay'
                        : i18n.language === 'es' ? 'Estancia a medida'
                        : 'Soggiorno su misura'}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
                      {i18n.language === 'fr' 
                        ? 'Vous souhaitez organiser un séjour personnalisé ? Activités, transport, chef à domicile, excursions en bateau... Notre équipe de conciergerie est à votre disposition pour créer une expérience unique.'
                        : i18n.language === 'en'
                        ? 'Would you like to organize a personalized stay? Activities, transport, private chef, boat trips... Our concierge team is at your service to create a unique experience.'
                        : i18n.language === 'es'
                        ? '¿Le gustaría organizar una estancia personalizada? Actividades, transporte, chef privado, excursiones en barco... Nuestro equipo de conserjería está a su disposición.'
                        : 'Desiderate organizzare un soggiorno personalizzato? Attività, trasporto, chef privato, escursioni in barca... Il nostro team di concierge è a vostra disposizione.'}
                    </p>
                    <a 
                      href="tel:+33615875470" 
                      className="inline-flex items-center gap-2 bg-white text-[#2e2e2e] px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      +33 6 15 87 54 70
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-orso-surface p-6 md:p-8 border border-gray-100">
                {property.is_showcase ? (
                  // Showcase Property - Contact Form
                  <div data-testid="showcase-contact">
                    <p className="orso-caption mb-2">PROPRIÉTÉ EXCLUSIVE</p>
                    <h3 className="orso-h3 mb-4">Demande d'information</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Cette propriété d'exception est disponible sur demande. 
                      Remplissez le formulaire ci-dessous et nous vous contacterons dans les plus brefs délais.
                    </p>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                          Nom complet *
                        </Label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Votre nom"
                          required
                          data-testid="contact-name"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                          Email *
                        </Label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="votre@email.com"
                          required
                          data-testid="contact-email"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                          Téléphone
                        </Label>
                        <Input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+33 6 00 00 00 00"
                          data-testid="contact-phone"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                          Votre message *
                        </Label>
                        <Textarea
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Dates souhaitées, nombre de personnes, questions..."
                          rows={4}
                          required
                          data-testid="contact-message"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="orso-btn-primary w-full"
                        disabled={submittingContact}
                        data-testid="contact-submit-btn"
                      >
                        {submittingContact ? 'Envoi en cours...' : 'Envoyer ma demande'}
                      </Button>
                    </form>
                    
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      Ou appelez-nous directement au +33 6 00 00 00 00
                    </p>
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
                    
                    {/* Availability Loading/Error State */}
                    {loadingAvailability && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Chargement des disponibilités...</span>
                      </div>
                    )}
                    
                    {availabilityError && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 mb-4 p-3 bg-amber-50 rounded">
                        <AlertCircle className="w-4 h-4" />
                        <span>{availabilityError}</span>
                      </div>
                    )}
                    
                    {blockedDates.length > 0 && !loadingAvailability && (
                      <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                        <span>Dates non disponibles</span>
                      </div>
                    )}

                    {/* Date Selection */}
                    <div className="mb-6">
                      <Label className="orso-caption mb-3 block">
                        {t('property.selectDates')}
                      </Label>
                      <Calendar
                        mode="range"
                        defaultMonth={new Date()}
                        selected={{ from: checkIn, to: checkOut }}
                        onSelect={(range) => {
                          if (!range) {
                            setCheckIn(null);
                            setCheckOut(null);
                            return;
                          }
                          
                          const { from, to } = range;
                          
                          // If both dates selected, check for blocked dates
                          if (from && to) {
                            if (hasBlockedDatesInRange(from, to)) {
                              toast.error('Certaines dates de votre sélection ne sont pas disponibles');
                              setCheckIn(null);
                              setCheckOut(null);
                              return;
                            }
                          }
                          
                          setCheckIn(from || null);
                          setCheckOut(to || null);
                        }}
                        disabled={(date) => {
                          // Disable past dates
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          if (date < today) return true;
                          // Disable blocked dates from Beds24
                          return isDateBlocked(date);
                        }}
                        locale={locale}
                        numberOfMonths={2}
                        className="border-2 border-gray-200 rounded-xl shadow-xl p-6 bg-white"
                        data-testid="booking-calendar"
                        modifiers={{
                          blocked: blockedDates
                        }}
                        modifiersStyles={{
                          blocked: { 
                            backgroundColor: '#f3f4f6',
                            color: '#9ca3af',
                            textDecoration: 'line-through'
                          }
                        }}
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
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Vérification des disponibilités...</span>
                        </div>
                      </div>
                    )}

                    {priceQuote && !loadingPrice && (
                      <div
                        className="mb-6 py-4 border-t border-gray-200"
                        data-testid="price-quote"
                      >
                        {priceQuote.available ? (
                          <>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">
                                {Math.round(priceQuote.price_per_night)}€ x {priceQuote.nights}{' '}
                                {priceQuote.nights > 1
                                  ? t('property.nights')
                                  : t('property.night')}
                              </span>
                              <span>{Math.round(priceQuote.total_price)}€</span>
                            </div>
                            <div className="flex justify-between font-medium pt-4 border-t border-gray-200">
                              <span>{t('property.totalPrice')}</span>
                              <span className="font-serif text-xl">
                                {Math.round(priceQuote.total_price)}€
                              </span>
                            </div>
                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Dates disponibles - Prix garanti
                            </p>
                          </>
                        ) : (
                          <div className="text-center py-4">
                            {priceQuote.min_stay_error ? (
                              <>
                                <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
                                  <AlertCircle className="w-5 h-5" />
                                  <span className="font-medium">Séjour minimum requis</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Cette propriété nécessite un séjour d'au moins <strong>{priceQuote.min_stay} nuits</strong>.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Vous avez sélectionné {priceQuote.nights} {priceQuote.nights > 1 ? 'nuits' : 'nuit'}.
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                                  <X className="w-5 h-5" />
                                  <span className="font-medium">Dates non disponibles</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {priceQuote.message || 'Veuillez sélectionner d\'autres dates'}
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Book Button */}
                    <Button
                      className="orso-btn-primary w-full"
                      disabled={!priceQuote || !priceQuote.available || loadingPrice}
                      onClick={() => setShowBookingModal(true)}
                      data-testid="book-now-btn"
                    >
                      {loadingPrice ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {priceQuote?.min_stay_error
                        ? `Minimum ${priceQuote.min_stay} nuits`
                        : priceQuote?.available === false 
                        ? 'Non disponible' 
                        : t('property.bookNow')}
                    </Button>
                    
                    {property.beds24_id && (
                      <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        Paiement sécurisé par Stripe
                      </p>
                    )}
                    
                    {!property.beds24_id && (
                      <p className="text-xs text-amber-600 mt-3 text-center">
                        ⚠️ Propriété non connectée à Beds24 - Prix indicatifs
                      </p>
                    )}
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

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Vous allez être redirigé vers notre page de réservation sécurisée pour finaliser votre paiement.
              </p>
            </div>

            <Button
              type="submit"
              className="orso-btn-primary w-full flex items-center justify-center gap-2"
              disabled={submitting}
              data-testid="booking-confirm-btn"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirection...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Réserver maintenant - Paiement Sécurisé
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-3">
              Paiement sécurisé par Stripe. Vous ne serez débité qu'après confirmation.
            </p>
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
