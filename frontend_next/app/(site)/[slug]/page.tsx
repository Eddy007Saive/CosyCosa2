'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ClipboardCheck, Users, Network, Award, Clock, Settings, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSector, getBlogPost } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const OFFER_ICONS = [ClipboardCheck, Users, Network, Award];
const ADVANTAGE_ICONS = [Clock, Settings, Heart];

// Blog data for static blog pages (conciergerie-cosy-casa-a-*)
const BLOG_DATA: Record<string, {
  heroImage: string;
  locationLabel: string;
  sections: Array<{ key: string; titleFr?: string; titleEn?: string; titleEs?: string; titleIt?: string; contentFr: string; contentEn: string; contentEs: string; contentIt: string }>;
}> = {
  lecci: {
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    locationLabel: 'Lecci, Corse du Sud',
    sections: [
      {
        key: 'intro',
        contentFr: "Cosy Casa Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée. Située au cœur de la Corse du Sud, notre équipe locale connaît parfaitement le marché de Lecci et ses environs, de la plage de Pinarello aux montagnes de l'Alta Rocca.",
        contentEn: "Cosy Casa Concierge Lecci offers tailored support for the short-term rental management of your properties. Located in the heart of Southern Corsica, our local team perfectly knows the Lecci market.",
        contentEs: "Cosy Casa Conserjería Lecci le ofrece un acompañamiento a medida para la gestión locativa de sus propiedades.",
        contentIt: "Cosy Casa Concierge Lecci offre un accompagnamento su misura per la gestione locativa delle vostre proprietà.",
      },
      {
        key: 'services',
        titleFr: 'Nos services à Lecci', titleEn: 'Our services in Lecci', titleEs: 'Nuestros servicios en Lecci', titleIt: 'I nostri servizi a Lecci',
        contentFr: "Nous prenons en charge la création et l'optimisation de vos annonces, la gestion du calendrier des réservations, l'accueil des voyageurs, le ménage, la blanchisserie et la maintenance.",
        contentEn: "We handle the creation and optimization of your listings, reservation calendar management, guest welcome, cleaning, laundry and maintenance.",
        contentEs: "Nos encargamos de la creación y optimización de sus anuncios, gestión de reservas y acogida de viajeros.",
        contentIt: "Ci occupiamo della creazione e ottimizzazione dei vostri annunci, gestione prenotazioni e accoglienza viaggiatori.",
      },
      {
        key: 'why',
        titleFr: 'Pourquoi choisir Cosy Casa à Lecci ?', titleEn: 'Why choose Cosy Casa in Lecci?', titleEs: '¿Por qué elegir Cosy Casa en Lecci?', titleIt: 'Perché scegliere Cosy Casa a Lecci?',
        contentFr: "Lecci bénéficie d'une situation géographique exceptionnelle entre mer et montagne. Notre connaissance approfondie du secteur nous permet d'optimiser votre rentabilité locative tout en offrant à vos voyageurs une expérience authentique de la Corse du Sud.",
        contentEn: "Lecci benefits from an exceptional geographical location between sea and mountains. Our in-depth knowledge of the area allows us to optimize your rental profitability.",
        contentEs: "Lecci se beneficia de una situación geográfica excepcional. Nuestro conocimiento del sector optimiza su rentabilidad.",
        contentIt: "Lecci gode di una posizione geografica eccezionale. La nostra conoscenza del settore ottimizza la vostra redditività.",
      },
    ],
  },
  pinarello: {
    heroImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80',
    locationLabel: 'Pinarello, Corse du Sud',
    sections: [
      {
        key: 'intro',
        contentFr: "Cosy Casa Conciergerie Pinarello vous propose un accompagnement personnalisé pour simplifier la gestion locative de vos biens en courte durée. Pinarello, avec sa plage emblématique et sa tour génoise, est l'un des joyaux de la Corse du Sud.",
        contentEn: "Cosy Casa Concierge Pinarello offers personalized support to simplify the rental management of your properties. Pinarello, with its iconic beach, is a jewel of Southern Corsica.",
        contentEs: "Cosy Casa Conserjería Pinarello le ofrece un acompañamiento personalizado para la gestión de sus propiedades.",
        contentIt: "Cosy Casa Concierge Pinarello offre supporto personalizzato per la gestione delle vostre proprietà.",
      },
      {
        key: 'services',
        titleFr: 'La gestion locative à Pinarello', titleEn: 'Rental management in Pinarello', titleEs: 'Gestión locativa en Pinarello', titleIt: 'Gestione locativa a Pinarello',
        contentFr: "De la mise en ligne de vos annonces à l'accueil des voyageurs, en passant par le ménage et la maintenance, nous gérons l'intégralité de votre location saisonnière à Pinarello.",
        contentEn: "From listing your property to welcoming guests, including cleaning and maintenance, we manage your entire seasonal rental in Pinarello.",
        contentEs: "Desde la publicación de anuncios hasta la acogida de viajeros, gestionamos su alquiler en Pinarello.",
        contentIt: "Dalla pubblicazione degli annunci all'accoglienza, gestiamo il vostro affitto stagionale a Pinarello.",
      },
      {
        key: 'why',
        titleFr: 'Pinarello : un marché locatif d\'exception', titleEn: 'Pinarello: an exceptional rental market', titleEs: 'Pinarello: un mercado de alquiler excepcional', titleIt: 'Pinarello: un mercato locativo d\'eccezione',
        contentFr: "Pinarello offre un cadre idyllique recherché par une clientèle exigeante. La demande locative y est forte, notamment en période estivale. Cosy Casa met à profit cette dynamique pour garantir un taux d'occupation optimal.",
        contentEn: "Pinarello offers an idyllic setting sought by discerning clientele. Rental demand is strong, especially in summer.",
        contentEs: "Pinarello ofrece un entorno idílico. La demanda de alquiler es fuerte, especialmente en verano.",
        contentIt: "Pinarello offre un contesto idilliaco. La domanda locativa è forte, soprattutto in estate.",
      },
    ],
  },
  corse: {
    heroImage: 'https://images.unsplash.com/photo-1548264237-07fa534029a2?w=1200&q=80',
    locationLabel: 'Corse du Sud',
    sections: [
      {
        key: 'intro',
        contentFr: "Cosy Casa Conciergerie vous propose un accompagnement sur mesure pour la gestion locative de vos biens partout en Corse du Sud. Du golfe de Porto-Vecchio aux plages de Bonifacio, notre expertise couvre l'ensemble du territoire.",
        contentEn: "Cosy Casa Concierge offers tailored support for the rental management of your properties throughout Southern Corsica.",
        contentEs: "Cosy Casa Conserjería le ofrece acompañamiento por toda Córcega del Sur.",
        contentIt: "Cosy Casa Concierge offre supporto su misura in tutta la Corsica del Sud.",
      },
      {
        key: 'services',
        titleFr: 'Une conciergerie qui couvre toute la Corse du Sud', titleEn: 'A concierge covering all of Southern Corsica', titleEs: 'Una conserjería que cubre toda Córcega del Sur', titleIt: 'Un concierge che copre tutta la Corsica del Sud',
        contentFr: "Que votre bien se situe à Porto-Vecchio, Lecci, Pinarello, Sainte-Lucie de Porto-Vecchio ou encore Zonza, notre équipe mobile et réactive intervient rapidement.",
        contentEn: "Whether your property is in Porto-Vecchio, Lecci, Pinarello or Zonza, our mobile team responds quickly.",
        contentEs: "Ya sea en Porto-Vecchio, Lecci, Pinarello o Zonza, nuestro equipo actúa rápidamente.",
        contentIt: "Che la vostra proprietà sia a Porto-Vecchio, Lecci, Pinarello o Zonza, il nostro team interviene rapidamente.",
      },
      {
        key: 'why',
        titleFr: 'La Corse, destination touristique d\'excellence', titleEn: 'Corsica, a tourism destination of excellence', titleEs: 'Córcega, destino turístico de excelencia', titleIt: 'La Corsica, destinazione turistica d\'eccellenza',
        contentFr: "La Corse du Sud attire chaque année des millions de visiteurs. Ce flux touristique constant représente une opportunité exceptionnelle pour les propriétaires de biens locatifs.",
        contentEn: "Southern Corsica attracts millions of visitors each year. This constant tourist flow represents an exceptional opportunity for property owners.",
        contentEs: "Córcega del Sur atrae millones de visitantes cada año. Este flujo representa una oportunidad excepcional.",
        contentIt: "La Corsica del Sud attrae milioni di visitatori ogni anno. Questo flusso rappresenta un'opportunità eccezionale.",
      },
    ],
  },
};

function getLangField(obj: Record<string, string>, field: string, lang: string) {
  const map: Record<string, string> = { fr: '_fr', en: '_en', es: '_es', it: '_it' };
  const suffix = map[lang] || '_fr';
  return obj[`${field}${suffix}`] || obj[`${field}_fr`] || '';
}

function getLangContent(section: Record<string, string>, field: string, lang: string) {
  const map: Record<string, string> = { fr: 'Fr', en: 'En', es: 'Es', it: 'It' };
  const suffix = map[lang] || 'Fr';
  return section[`${field}${suffix}`] || section[`${field}Fr`] || '';
}

export default function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const [sector, setSector] = useState<any>(null);
  const [blogPost, setBlogPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try blog post first, then sector
    getBlogPost(slug)
      .then((data: any) => {
        if (data && data.slug) { setBlogPost(data); setLoading(false); }
        else throw new Error('not a blog');
      })
      .catch(() => {
        getSector(slug)
          .then((data: any) => setSector(data))
          .catch(() => setSector(null))
          .finally(() => setLoading(false));
      });
  }, [slug]);

  // Render blog post from API
  if (blogPost) {
    return (
      <div>
        {blogPost.hero_image && (
          <section
            className="relative min-h-[50vh] flex items-end bg-cover bg-center pt-36"
            style={{ backgroundImage: `url(${blogPost.hero_image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            <div className="relative z-10 orso-container pb-12">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-3">{blogPost.author}</p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white">{blogPost.title}</h1>
            </div>
          </section>
        )}
        {!blogPost.hero_image && (
          <section className="pt-40 pb-12 bg-[#2e2e2e]">
            <div className="orso-container">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-3">{blogPost.author}</p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white">{blogPost.title}</h1>
            </div>
          </section>
        )}

        <article className="orso-section bg-white">
          <div className="orso-container max-w-3xl mx-auto">
            {blogPost.excerpt && (
              <p className="text-xl font-light text-gray-600 mb-10 pb-10 border-b border-gray-100 leading-relaxed">
                {blogPost.excerpt}
              </p>
            )}
            <div
              className="prose prose-lg max-w-none font-light text-gray-700 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-[#2e2e2e] [&_h2]:mt-10 [&_h2]:mb-5 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-[#2e2e2e] [&_h3]:mt-8 [&_h3]:mb-4 [&_p]:mb-5 [&_ul]:space-y-2 [&_li]:ml-4"
              dangerouslySetInnerHTML={{ __html: blogPost.content || '' }}
            />
            <div className="mt-16 pt-12 border-t border-gray-200 text-center">
              <h3 className="font-serif text-2xl text-[#2e2e2e] mb-6">{t('conciergerie.cta')}</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact-conciergerie-cosy-casa">
                  <Button className="orso-btn-primary">
                    {t('nav.contact')}
                    <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </Link>
                <Link href="/conciergerie">
                  <Button className="orso-btn-secondary">{t('nav.conciergerie')}</Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-40">
        <p className="text-gray-400 font-light">{t('common.loading')}</p>
      </div>
    );
  }

  // Not found
  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-40">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Page non trouvée</p>
          <Link href="/">
            <Button className="orso-btn-secondary">{t('common.back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Sector page
  const cityName = getLangField(sector, 'city', lang) || slug;
  const offers = sector.offers || [];
  const advantages = sector.advantages || [];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[65vh] flex items-center justify-center bg-cover bg-center pt-36"
        style={{
          backgroundImage: sector.hero_image ? `url(${sector.hero_image})` : undefined,
          backgroundColor: '#2e2e2e',
        }}
      >
        {sector.hero_image && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative z-10 orso-container text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl mb-8">
            Conciergerie à {cityName}
          </h1>
          {getLangField(sector, 'intro', lang) && (
            <p className="text-base md:text-lg font-light leading-relaxed text-white/85 mb-4">
              {getLangField(sector, 'intro', lang)}
            </p>
          )}
          {getLangField(sector, 'intro2', lang) && (
            <p className="text-base md:text-lg font-light leading-relaxed text-white/75">
              {getLangField(sector, 'intro2', lang)}
            </p>
          )}
        </div>
      </section>

      {/* Offers */}
      {offers.length > 0 && (
        <section className="orso-section bg-[#f5f5f3]">
          <div className="orso-container">
            <h2 className="orso-h2 text-center mb-16">
              {lang === 'fr' ? `Nos offres Cosy Casa conciergerie à ${cityName}` :
               lang === 'en' ? `Our Cosy Casa concierge offers in ${cityName}` :
               lang === 'es' ? `Nuestras ofertas en ${cityName}` :
               `Le nostre offerte a ${cityName}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {offers.map((offer: any, index: number) => {
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
        <section className="orso-section bg-white">
          <div className="orso-container">
            <h2 className="orso-h2 text-center mb-16">
              {lang === 'fr' ? `Vos avantages avec la conciergerie Cosy Casa ${cityName}` :
               lang === 'en' ? `Your advantages with Cosy Casa ${cityName}` :
               lang === 'es' ? `Sus ventajas con Cosy Casa ${cityName}` :
               `I vostri vantaggi con Cosy Casa ${cityName}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {advantages.map((adv: any, index: number) => {
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
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">{t('conciergerie.cta')}</h2>
          <Link href="/contact-conciergerie-cosy-casa">
            <Button className="bg-white text-[#2e2e2e] hover:bg-white/90 px-10 py-5 rounded-full uppercase tracking-widest text-xs font-medium">
              {t('nav.contact')}
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
