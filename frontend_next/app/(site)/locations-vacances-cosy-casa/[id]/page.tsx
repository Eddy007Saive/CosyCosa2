'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  MapPin, Users, Bed, Bath,
  ChevronLeft, ChevronRight,
  Wifi, Car, Waves, Wind, Utensils, Tv, Check, X,
  ArrowLeft, Loader2, AlertCircle, Clock, Shield,
  Calendar as CalendarIcon, Phone, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format, addMonths, differenceInDays, parseISO, eachDayOfInterval } from 'date-fns';
import { fr, enUS, es, it } from 'date-fns/locale';
import { getProperty, getPriceQuote, submitContact, getPropertyAvailability } from '@/lib/api';

const locales: Record<string, any> = { fr, en: enUS, es, it };

const amenityIcons: Record<string, any> = {
  Piscine: Waves, WiFi: Wifi, Parking: Car,
  Climatisation: Wind, Cuisine: Utensils, TV: Tv, default: Check,
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const locale = locales[i18n.language] || fr;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [numAdult, setNumAdult] = useState(2);
  const [numChild, setNumChild] = useState(0);
  const [priceQuote, setPriceQuote] = useState<any>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submittingContact, setSubmittingContact] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProperty(id)
      .then((data: any) => setProperty(data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!property || property.is_showcase) return;
    setLoadingAvailability(true);
    const today = new Date();
    const fromDate = format(today, 'yyyy-MM-dd');
    const toDate = format(addMonths(today, 6), 'yyyy-MM-dd');
    getPropertyAvailability(property.id, fromDate, toDate)
      .then((data: any) => {
        if (data?.blocked_dates?.length > 0) {
          setBlockedDates(data.blocked_dates.map((d: string) => parseISO(d)));
        } else {
          setBlockedDates([]);
        }
      })
      .catch(() => setAvailabilityError('Unable to load availability'))
      .finally(() => setLoadingAvailability(false));
  }, [property]);

  useEffect(() => {
    if (!checkIn || !checkOut || !property || property.is_showcase) return;
    const nights = differenceInDays(checkOut, checkIn);
    const minStay = property.min_stay || 1;
    if (nights < minStay) {
      setPriceQuote({ available: false, min_stay_error: true, min_stay: minStay, nights });
      return;
    }
    setLoadingPrice(true);
    getPriceQuote(property.id, {
      property_id: property.id,
      check_in: format(checkIn, 'yyyy-MM-dd'),
      check_out: format(checkOut, 'yyyy-MM-dd'),
      guests: numAdult + numChild,
    })
      .then((quote: any) => setPriceQuote(quote))
      .catch(() => setPriceQuote({
        available: true,
        total_price: (property.price_from || 200) * nights,
        nights,
        price_per_night: property.price_from || 200,
        currency: 'EUR',
      }))
      .finally(() => setLoadingPrice(false));
  }, [checkIn, checkOut, numAdult, numChild, property]);

  const handleBookOnBeds24 = () => {
    if (!property.beds24_id || !property.beds24_room_id || !checkIn || !checkOut || !priceQuote?.available) return;
    const params = new URLSearchParams({
      propid: property.beds24_id,
      roomid: property.beds24_room_id,
      page: 'book3',
      checkin: format(checkIn, 'EEE d MMMM yyyy', { locale }),
      checkin_hide: format(checkIn, 'yyyy-M-d'),
      checkout: format(checkOut, 'EEE d MMMM yyyy', { locale }),
      checkout_hide: format(checkOut, 'yyyy-M-d'),
      numnight: String(priceQuote.nights),
      numadult: String(numAdult),
      numchild: String(numChild),
      [`br1-${property.beds24_room_id}`]: 'Réserver',
      g: 'st',
      pc: '100',
    });
    window.open(`https://beds24.com/booking2.php?${params.toString()}`, '_blank');
  };

  const isDateBlocked = (date: Date) =>
    blockedDates.some((d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

  const hasBlockedDatesInRange = (start: Date, end: Date) =>
    eachDayOfInterval({ start, end }).some(isDateBlocked);


  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) { toast.error('Veuillez remplir tous les champs obligatoires'); return; }
    setSubmittingContact(true);
    try {
      await submitContact({
        name: contactForm.name, email: contactForm.email, phone: contactForm.phone,
        subject: `Demande d'information: ${property?.name}`,
        message: contactForm.message, property_id: property?.id, language: i18n.language,
      });
      toast.success('Votre demande a été envoyée. Nous vous contacterons rapidement.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setSubmittingContact(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 md:pt-44 orso-container">
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
      <div className="pt-40 md:pt-44 orso-container text-center py-20">
        <p className="orso-body">Propriété non trouvée</p>
        <Link href="/locations-vacances-cosy-casa">
          <Button className="orso-btn-secondary mt-8">{t('common.back')}</Button>
        </Link>
      </div>
    );
  }

  const getDescription = () => {
    const desc = property.description?.[i18n.language] || property.description?.fr;
    if (desc?.trim().length > 10) return desc;
    const templates = property.templates || {};
    for (const key of ['template1', 'template2', 'template4', 'template5']) {
      const tpl = templates[key];
      if (tpl?.trim().length > 20 && !tpl.startsWith('http')) return tpl;
    }
    return '';
  };

  const description = getDescription();
  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200'];

  return (
    <div className="pt-36 md:pt-40">
      {/* Back */}
      <div className="orso-container py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2e2e2e] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          {t('common.back')}
        </button>
      </div>

      {/* Gallery */}
      <section className="relative h-[50vh] md:h-[70vh] bg-gray-100">
        <img
          src={images[currentImageIndex]}
          alt={`${property.name} - Location de luxe en Corse du Sud`}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((p) => p === 0 ? images.length - 1 : p - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setCurrentImageIndex((p) => p === images.length - 1 ? 0 : p + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
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
            {/* Main */}
            <div className="lg:col-span-2">
              <h1 className="orso-h1 mb-4">{property.name}</h1>
              <div className="flex items-center gap-2 text-gray-500 mb-8">
                <MapPin className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-lg">{property.city}</span>
              </div>
              <div className="flex items-center gap-8 py-6 border-y border-gray-100 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <span>{property.max_guests} {t('properties.guests')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <span>{property.bedrooms} {t('properties.beds')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  <span>{property.bathrooms} {t('properties.baths')}</span>
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
                      ? `${property.name} vous accueille en Corse du Sud. Contactez-nous pour plus d'informations.`
                      : `${property.name} welcomes you in Southern Corsica. Contact us for more information.`}
                  </div>
                )}
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="mb-12">
                  <h2 className="orso-h3 mb-8">{t('property.amenities')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity: string) => {
                      const IconComponent = amenityIcons[amenity] || amenityIcons.default;
                      return (
                        <div key={amenity} className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm text-gray-700">
                          <IconComponent className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Practical Info */}
              {property.beds24_id && (
                <div className="mb-12 bg-gray-50 p-6">
                  <h2 className="orso-h3 mb-6">Informations pratiques</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <Clock className="w-5 h-5 text-gray-500 mt-1" strokeWidth={1.5} />
                      <div>
                        <p className="font-medium mb-1">Horaires</p>
                        <p className="text-sm text-gray-600">Arrivée : {property.check_in_start || '15:00'} - {property.check_in_end || '20:00'}</p>
                        <p className="text-sm text-gray-600">Départ : avant {property.check_out_end || '10:00'}</p>
                      </div>
                    </div>
                    {property.min_stay > 1 && (
                      <div className="flex items-start gap-4">
                        <CalendarIcon className="w-5 h-5 text-gray-500 mt-1" strokeWidth={1.5} />
                        <div>
                          <p className="font-medium mb-1">Séjour minimum</p>
                          <p className="text-sm text-gray-600">{property.min_stay} nuits</p>
                        </div>
                      </div>
                    )}
                    {property.security_deposit && (
                      <div className="flex items-start gap-4">
                        <Shield className="w-5 h-5 text-gray-500 mt-1" strokeWidth={1.5} />
                        <div>
                          <p className="font-medium mb-1">Caution</p>
                          <p className="text-sm text-gray-600">{property.security_deposit}€</p>
                        </div>
                      </div>
                    )}
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

              {/* Concierge CTA */}
              <div className="mb-12 bg-[#2e2e2e] text-white p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 flex-shrink-0">
                    <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl mb-3">
                      {i18n.language === 'fr' ? 'Séjour sur mesure' : i18n.language === 'en' ? 'Tailor-made stay' : 'Estancia a medida'}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
                      {i18n.language === 'fr'
                        ? "Vous souhaitez organiser un séjour personnalisé ? Activités, transport, chef à domicile, excursions en bateau... Notre équipe de conciergerie est à votre disposition."
                        : "Would you like to organize a personalized stay? Activities, transport, private chef, boat trips... Our concierge team is at your service."}
                    </p>
                    <a href="tel:+33615876470" className="inline-flex items-center gap-2 bg-white text-[#2e2e2e] px-5 py-2.5 font-medium text-sm hover:bg-gray-100 transition-colors">
                      <Phone className="w-4 h-4" />
                      +33 6 15 87 64 70
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[#f9f9f9] p-6 md:p-8 border border-gray-100">
                {property.is_showcase ? (
                  <div>
                    <p className="orso-caption mb-2">PROPRIÉTÉ EXCLUSIVE</p>
                    <h3 className="orso-h3 mb-4">Demande d&apos;information</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Cette propriété d&apos;exception est disponible sur demande.
                    </p>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Nom complet *</Label>
                        <Input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Votre nom" required />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Email *</Label>
                        <Input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="votre@email.com" required />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Téléphone</Label>
                        <Input type="tel" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="+33 6 00 00 00 00" />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Votre message *</Label>
                        <Textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Dates souhaitées, nombre de personnes..." rows={4} required />
                      </div>
                      <Button type="submit" className="orso-btn-primary w-full" disabled={submittingContact}>
                        {submittingContact ? 'Envoi en cours...' : 'Envoyer ma demande'}
                      </Button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4 text-center">Ou appelez-nous : +33 6 15 87 64 70</p>
                  </div>
                ) : (
                  <div>
                    {property.price_from && (
                      <div className="mb-6">
                        <span className="text-xs uppercase tracking-widest text-gray-500">{t('property.priceFrom')}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif text-3xl text-[#2e2e2e]">{property.price_from}€</span>
                          <span className="text-gray-500">{t('property.perNight')}</span>
                        </div>
                      </div>
                    )}

                    {loadingAvailability && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Chargement des disponibilités...</span>
                      </div>
                    )}

                    {availabilityError && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 mb-4 p-3 bg-amber-50">
                        <AlertCircle className="w-4 h-4" />
                        <span>{availabilityError}</span>
                      </div>
                    )}

                    <div className="mb-6">
                      <Label className="orso-caption mb-3 block">{t('property.selectDates')}</Label>
                      <Calendar
                        mode="range"
                        defaultMonth={new Date()}
                        selected={{ from: checkIn, to: checkOut }}
                        onSelect={(range: any) => {
                          if (!range) { setCheckIn(undefined); setCheckOut(undefined); return; }
                          const { from, to } = range;
                          if (from && to && hasBlockedDatesInRange(from, to)) {
                            toast.error('Certaines dates de votre sélection ne sont pas disponibles');
                            setCheckIn(undefined); setCheckOut(undefined); return;
                          }
                          setCheckIn(from || undefined);
                          setCheckOut(to || undefined);
                        }}
                        disabled={(date: Date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || isDateBlocked(date);
                        }}
                        locale={locale}
                        numberOfMonths={1}
                        className="border border-gray-200 p-3 bg-white w-full"
                      />
                    </div>

                    <div className="mb-6 space-y-4">
                      {/* Adultes */}
                      <div>
                        <Label className="orso-caption mb-2 block">Adultes</Label>
                        <div className="flex items-center gap-4">
                          <button onClick={() => setNumAdult(Math.max(1, numAdult - 1))} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">-</button>
                          <span className="font-serif text-xl w-12 text-center">{numAdult}</span>
                          <button onClick={() => setNumAdult(Math.min(property.max_guests - numChild, numAdult + 1))} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">+</button>
                        </div>
                      </div>
                      {/* Enfants */}
                      <div>
                        <Label className="orso-caption mb-2 block">Enfants <span className="normal-case font-light text-gray-400 text-xs">(- 12 ans)</span></Label>
                        <div className="flex items-center gap-4">
                          <button onClick={() => setNumChild(Math.max(0, numChild - 1))} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">-</button>
                          <span className="font-serif text-xl w-12 text-center">{numChild}</span>
                          <button onClick={() => setNumChild(Math.min(property.max_guests - numAdult, numChild + 1))} className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">+</button>
                        </div>
                      </div>
                      {/* Total */}
                      <p className="text-xs text-gray-500">
                        Total : {numAdult + numChild} / {property.max_guests} personnes max.
                      </p>
                    </div>

                    {loadingPrice && (
                      <div className="mb-6 py-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Vérification des disponibilités...</span>
                        </div>
                      </div>
                    )}

                    {priceQuote && !loadingPrice && (
                      <div className="mb-6 py-4 border-t border-gray-200">
                        {priceQuote.available ? (
                          <>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">{Math.round(priceQuote.price_per_night)}€ x {priceQuote.nights} {priceQuote.nights > 1 ? t('property.nights') : t('property.night')}</span>
                              <span>{Math.round(priceQuote.total_price)}€</span>
                            </div>
                            <div className="flex justify-between font-medium pt-4 border-t border-gray-200">
                              <span>{t('property.totalPrice')}</span>
                              <span className="font-serif text-xl">{Math.round(priceQuote.total_price)}€</span>
                            </div>
                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                              <Check className="w-3 h-3" />Dates disponibles - Prix garanti
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
                                <p className="text-sm text-gray-600">Minimum <strong>{priceQuote.min_stay} nuits</strong>. Vous avez sélectionné {priceQuote.nights} nuit{priceQuote.nights > 1 ? 's' : ''}.</p>
                              </>
                            ) : (
                              <div className="flex items-center justify-center gap-2 text-red-600">
                                <X className="w-5 h-5" />
                                <span className="font-medium">{priceQuote.message || 'Dates non disponibles'}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      className="orso-btn-primary w-full"
                      disabled={!priceQuote?.available || loadingPrice}
                      onClick={handleBookOnBeds24}
                    >
                      {loadingPrice ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {priceQuote?.min_stay_error ? `Minimum ${priceQuote.min_stay} nuits` : priceQuote?.available === false ? 'Non disponible' : t('property.bookNow')}
                    </Button>

                    {property.beds24_id && (
                      <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />Paiement sécurisé par Stripe
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
