import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, ClipboardCheck, Users, Network, Award, Clock, Settings, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OFFER_ICONS = [ClipboardCheck, Users, Network, Award];
const ADVANTAGE_ICONS = [Clock, Settings, Heart];

const getLangField = (obj, field, lang) => {
  const map = { fr: '_fr', en: '_en', es: '_es', it: '_it' };
  const suffix = map[lang] || '_fr';
  return obj[`${field}${suffix}`] || obj[`${field}_fr`] || '';
};

const SectorPage = () => {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const [sector, setSector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSector = async () => {
      try {
        const res = await fetch(`${API_URL}/api/sectors/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setSector(data);
        }
      } catch (err) {
        console.error('Error fetching sector:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSector();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <p className="text-gray-400 font-light">{t('common.loading')}</p>
      </div>
    );
  }

  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Page non trouvée</p>
          <Link to="/">
            <Button className="orso-btn-secondary">{t('common.back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cityName = getLangField(sector, 'city', lang);
  const offers = sector.offers || [];
  const advantages = sector.advantages || [];

  return (
    <div data-testid={`sector-page-${slug}`}>
      {/* Hero */}
      <section
        className="relative min-h-[50vh] flex items-end bg-cover bg-center pt-20"
        style={{ backgroundImage: sector.hero_image ? `url(${sector.hero_image})` : undefined, backgroundColor: '#2e2e2e' }}
      >
        {sector.hero_image && <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />}
        <div className="relative z-10 orso-container pb-12">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
            <span>{cityName}, Corse du Sud</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white" data-testid="sector-title">
            Conciergerie à {cityName}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="orso-section bg-white">
        <div className="orso-container max-w-3xl mx-auto text-center">
          <p className="text-lg font-light leading-relaxed text-gray-700 mb-6">
            {getLangField(sector, 'intro', lang)}
          </p>
          {getLangField(sector, 'intro2', lang) && (
            <p className="text-lg font-light leading-relaxed text-gray-600">
              {getLangField(sector, 'intro2', lang)}
            </p>
          )}
        </div>
      </section>

      {/* Offers */}
      {offers.length > 0 && (
        <section className="orso-section bg-[#f5f5f3]" data-testid="sector-offers">
          <div className="orso-container">
            <h2 className="orso-h2 text-center mb-16">
              {lang === 'fr' ? `Nos offres Cosy Casa conciergerie à ${cityName}` :
               lang === 'en' ? `Our Cosy Casa concierge offers in ${cityName}` :
               lang === 'es' ? `Nuestras ofertas en ${cityName}` :
               `Le nostre offerte a ${cityName}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {offers.map((offer, index) => {
                const Icon = OFFER_ICONS[index % OFFER_ICONS.length];
                return (
                  <div
                    key={index}
                    className="bg-white p-8 md:p-10 border border-gray-100 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-[#2e2e2e] text-white flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-[#2e2e2e] mb-4">
                      {getLangField(offer, 'title', lang)}
                    </h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      {getLangField(offer, 'desc', lang)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Advantages */}
      {advantages.length > 0 && (
        <section className="orso-section bg-white" data-testid="sector-advantages">
          <div className="orso-container">
            <h2 className="orso-h2 text-center mb-16">
              {lang === 'fr' ? `Vos avantages avec la conciergerie Cosy Casa ${cityName}` :
               lang === 'en' ? `Your advantages with Cosy Casa ${cityName}` :
               lang === 'es' ? `Sus ventajas con Cosy Casa ${cityName}` :
               `I vostri vantaggi con Cosy Casa ${cityName}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {advantages.map((adv, index) => {
                const Icon = ADVANTAGE_ICONS[index % ADVANTAGE_ICONS.length];
                return (
                  <div
                    key={index}
                    className="text-center opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-16 h-16 border border-[#2e2e2e] flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-7 h-7 text-[#2e2e2e]" strokeWidth={1.2} />
                    </div>
                    <h3 className="font-serif text-xl text-[#2e2e2e] mb-4">
                      {getLangField(adv, 'title', lang)}
                    </h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      {getLangField(adv, 'desc', lang)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#2e2e2e] py-20 md:py-28">
        <div className="orso-container text-center">
          <div className="w-12 h-px bg-white/40 mx-auto mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
            {t('conciergerie.cta')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact-conciergerie-cosy-casa">
              <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-5 rounded-full uppercase tracking-widest text-xs font-medium" data-testid="sector-cta-contact">
                {t('nav.contact')}
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectorPage;
