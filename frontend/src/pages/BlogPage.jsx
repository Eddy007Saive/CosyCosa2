import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BLOG_DATA = {
  lecci: {
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    sections: [
      {
        key: "intro",
        contentFr: "Cosy Casa Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée. Située au cœur de la Corse du Sud, notre équipe locale connaît parfaitement le marché de Lecci et ses environs, de la plage de Pinarello aux montagnes de l'Alta Rocca.",
        contentEn: "Cosy Casa Concierge Lecci offers tailored support for the short-term rental management of your properties. Located in the heart of Southern Corsica, our local team perfectly knows the Lecci market.",
        contentEs: "Cosy Casa Conserjería Lecci le ofrece un acompañamiento a medida para la gestión locativa de sus propiedades.",
        contentIt: "Cosy Casa Concierge Lecci offre un accompagnamento su misura per la gestione locativa delle vostre proprietà."
      },
      {
        key: "services",
        titleFr: "Nos services à Lecci",
        titleEn: "Our services in Lecci",
        titleEs: "Nuestros servicios en Lecci",
        titleIt: "I nostri servizi a Lecci",
        contentFr: "Nous prenons en charge la création et l'optimisation de vos annonces, la gestion du calendrier des réservations, l'accueil des voyageurs, le ménage, la blanchisserie et la maintenance. Grâce à notre réseau de prestataires locaux à Lecci, chaque aspect de votre location est géré avec professionnalisme et réactivité.",
        contentEn: "We handle the creation and optimization of your listings, reservation calendar management, guest welcome, cleaning, laundry and maintenance.",
        contentEs: "Nos encargamos de la creación y optimización de sus anuncios, gestión de reservas y acogida de viajeros.",
        contentIt: "Ci occupiamo della creazione e ottimizzazione dei vostri annunci, gestione prenotazioni e accoglienza viaggiatori."
      },
      {
        key: "why",
        titleFr: "Pourquoi choisir Cosy Casa à Lecci ?",
        titleEn: "Why choose Cosy Casa in Lecci?",
        titleEs: "¿Por qué elegir Cosy Casa en Lecci?",
        titleIt: "Perché scegliere Cosy Casa a Lecci?",
        contentFr: "Lecci bénéficie d'une situation géographique exceptionnelle entre mer et montagne. Notre connaissance approfondie du secteur nous permet d'optimiser votre rentabilité locative tout en offrant à vos voyageurs une expérience authentique de la Corse du Sud. Avec Cosy Casa, profitez d'un revenu passif sans souci.",
        contentEn: "Lecci benefits from an exceptional geographical location between sea and mountains. Our in-depth knowledge of the area allows us to optimize your rental profitability.",
        contentEs: "Lecci se beneficia de una situación geográfica excepcional. Nuestro conocimiento del sector optimiza su rentabilidad.",
        contentIt: "Lecci gode di una posizione geografica eccezionale. La nostra conoscenza del settore ottimizza la vostra redditività."
      }
    ]
  },
  pinarello: {
    heroImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
    sections: [
      {
        key: "intro",
        contentFr: "Cosy Casa Conciergerie Pinarello vous propose un accompagnement personnalisé pour simplifier la gestion locative de vos biens en courte durée. Pinarello, avec sa plage emblématique et sa tour génoise, est l'un des joyaux de la Corse du Sud, attirant chaque année des voyageurs du monde entier.",
        contentEn: "Cosy Casa Concierge Pinarello offers personalized support to simplify the rental management of your properties. Pinarello, with its iconic beach, is a jewel of Southern Corsica.",
        contentEs: "Cosy Casa Conserjería Pinarello le ofrece un acompañamiento personalizado para la gestión de sus propiedades.",
        contentIt: "Cosy Casa Concierge Pinarello offre supporto personalizzato per la gestione delle vostre proprietà."
      },
      {
        key: "services",
        titleFr: "La gestion locative à Pinarello",
        titleEn: "Rental management in Pinarello",
        titleEs: "Gestión locativa en Pinarello",
        titleIt: "Gestione locativa a Pinarello",
        contentFr: "De la mise en ligne de vos annonces à l'accueil des voyageurs, en passant par le ménage et la maintenance, nous gérons l'intégralité de votre location saisonnière à Pinarello. Notre tarification dynamique s'adapte au marché pour maximiser vos revenus pendant la haute saison estivale.",
        contentEn: "From listing your property to welcoming guests, including cleaning and maintenance, we manage your entire seasonal rental in Pinarello.",
        contentEs: "Desde la publicación de anuncios hasta la acogida de viajeros, gestionamos su alquiler en Pinarello.",
        contentIt: "Dalla pubblicazione degli annunci all'accoglienza, gestiamo il vostro affitto stagionale a Pinarello."
      },
      {
        key: "why",
        titleFr: "Pinarello : un marché locatif d'exception",
        titleEn: "Pinarello: an exceptional rental market",
        titleEs: "Pinarello: un mercado de alquiler excepcional",
        titleIt: "Pinarello: un mercato locativo d'eccezione",
        contentFr: "Pinarello offre un cadre idyllique recherché par une clientèle exigeante. La demande locative y est forte, notamment en période estivale. Cosy Casa met à profit cette dynamique pour garantir un taux d'occupation optimal et des revenus maximisés pour votre propriété.",
        contentEn: "Pinarello offers an idyllic setting sought by discerning clientele. Rental demand is strong, especially in summer.",
        contentEs: "Pinarello ofrece un entorno idílico. La demanda de alquiler es fuerte, especialmente en verano.",
        contentIt: "Pinarello offre un contesto idilliaco. La domanda locativa è forte, soprattutto in estate."
      }
    ]
  },
  corse: {
    heroImage: "https://images.unsplash.com/photo-1548264237-07fa534029a2?w=1200&q=80",
    sections: [
      {
        key: "intro",
        contentFr: "Cosy Casa Conciergerie vous propose un accompagnement sur mesure pour la gestion locative de vos biens partout en Corse du Sud. Du golfe de Porto-Vecchio aux plages de Bonifacio, en passant par les villages authentiques de l'arrière-pays, notre expertise couvre l'ensemble du territoire.",
        contentEn: "Cosy Casa Concierge offers tailored support for the rental management of your properties throughout Southern Corsica.",
        contentEs: "Cosy Casa Conserjería le ofrece acompañamiento por toda Córcega del Sur.",
        contentIt: "Cosy Casa Concierge offre supporto su misura in tutta la Corsica del Sud."
      },
      {
        key: "services",
        titleFr: "Une conciergerie qui couvre toute la Corse du Sud",
        titleEn: "A concierge covering all of Southern Corsica",
        titleEs: "Una conserjería que cubre toda Córcega del Sur",
        titleIt: "Un concierge che copre tutta la Corsica del Sud",
        contentFr: "Que votre bien se situe à Porto-Vecchio, Lecci, Pinarello, Sainte-Lucie de Porto-Vecchio ou encore Zonza, notre équipe mobile et réactive intervient rapidement. Nous adaptons nos services aux spécificités de chaque zone géographique pour optimiser votre rentabilité.",
        contentEn: "Whether your property is in Porto-Vecchio, Lecci, Pinarello or Zonza, our mobile team responds quickly.",
        contentEs: "Ya sea en Porto-Vecchio, Lecci, Pinarello o Zonza, nuestro equipo actúa rápidamente.",
        contentIt: "Che la vostra proprietà sia a Porto-Vecchio, Lecci, Pinarello o Zonza, il nostro team interviene rapidamente."
      },
      {
        key: "why",
        titleFr: "La Corse, destination touristique d'excellence",
        titleEn: "Corsica, a tourism destination of excellence",
        titleEs: "Córcega, destino turístico de excelencia",
        titleIt: "La Corsica, destinazione turistica d'eccellenza",
        contentFr: "La Corse du Sud attire chaque année des millions de visiteurs venus profiter de ses plages paradisiaques, de ses montagnes majestueuses et de sa gastronomie unique. Ce flux touristique constant représente une opportunité exceptionnelle pour les propriétaires de biens locatifs. Cosy Casa vous aide à en tirer le meilleur parti.",
        contentEn: "Southern Corsica attracts millions of visitors each year. This constant tourist flow represents an exceptional opportunity for property owners.",
        contentEs: "Córcega del Sur atrae millones de visitantes cada año. Este flujo representa una oportunidad excepcional.",
        contentIt: "La Corsica del Sud attrae milioni di visitatori ogni anno. Questo flusso rappresenta un'opportunità eccezionale."
      }
    ]
  }
};

const BlogPage = ({ slug }) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const data = BLOG_DATA[slug];

  if (!data) return <div className="pt-40 text-center">Page not found</div>;

  const getLangContent = (section, field) => {
    const langMap = { fr: 'Fr', en: 'En', es: 'Es', it: 'It' };
    const suffix = langMap[lang] || 'Fr';
    return section[`${field}${suffix}`] || section[`${field}Fr`];
  };

  const locationLabel = {
    lecci: 'Lecci, Corse du Sud',
    pinarello: 'Pinarello, Corse du Sud',
    corse: 'Corse du Sud'
  };

  return (
    <div data-testid={`blog-page-${slug}`}>
      {/* Hero */}
      <section
        className="relative min-h-[50vh] flex items-end bg-cover bg-center pt-36"
        style={{ backgroundImage: `url(${data.heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative z-10 orso-container pb-12">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <MapPin className="w-4 h-4" strokeWidth={1.5} />
            <span>{locationLabel[slug]}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white" data-testid="blog-title">
            {t(`blog.${slug}.title`)}
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="orso-section bg-white">
        <div className="orso-container max-w-3xl mx-auto">
          {data.sections.map((section, index) => (
            <div key={section.key} className={index > 0 ? 'mt-12' : ''}>
              {section[`title${lang === 'fr' ? 'Fr' : lang === 'en' ? 'En' : lang === 'es' ? 'Es' : 'It'}`] && (
                <h2 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] mb-6">
                  {getLangContent(section, 'title')}
                </h2>
              )}
              <p className="text-lg font-light leading-relaxed text-gray-700">
                {getLangContent(section, 'content')}
              </p>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-gray-200 text-center">
            <h3 className="font-serif text-2xl text-[#2e2e2e] mb-6">
              {t('conciergerie.cta')}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact-conciergerie-cosy-casa">
                <Button className="orso-btn-primary" data-testid="blog-contact-cta">
                  {t('nav.contact')}
                  <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
              <Link to="/conciergerie">
                <Button className="orso-btn-secondary" data-testid="blog-conciergerie-cta">
                  {t('nav.conciergerie')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPage;
