'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, CalendarCheck, Users, Wrench, Shield, Paintbrush, CheckCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SERVICES = [
  {
    key: 'locataires',
    icon: Search,
    items: [
      "Rédaction percutante et diffusion d'annonces multiplateformes",
      "Photos professionnelles",
      "Tarification dynamique",
      "Booster d'algorithmes",
    ],
  },
  {
    key: 'planning',
    icon: CalendarCheck,
    items: [
      "Optimiser le taux d'occupation",
      "Calendriers connectés",
      "Signature des contrats",
      "Prise de cautions",
    ],
  },
  {
    key: 'accueil',
    icon: Users,
    items: [
      "Check in & Check out",
      "Livret d'accueil",
      "Gestion des imprévus (retard, oublis, dommages…)",
      "Demandes particulières",
      "Partenariats avec activités touristiques",
      "Assistance",
    ],
  },
  {
    key: 'entretien',
    icon: Wrench,
    items: ["Ménage", "Blanchisserie", "Lits faits à l'arrivée"],
  },
  {
    key: 'imprevus',
    icon: Shield,
    items: ["Carnet d'adresse : maintenances/réparations", "Retard", "Oublis voyageurs", "Dommages"],
  },
  {
    key: 'deco',
    icon: Paintbrush,
    items: ["Home Staging", "Projet déco", "Optimisation de l'agencement"],
  },
];

const SERVICE_TITLES: Record<string, Record<string, string>> = {
  fr: {
    locataires: "Trouver des locataires",
    planning: "Organiser le planning des réservations",
    accueil: "Accueil & service aux voyageurs",
    entretien: "Entretenir votre logement",
    imprevus: "Palier aux imprévus",
    deco: "En Option : Préconisations Déco (sur devis)",
  },
  en: {
    locataires: "Find tenants",
    planning: "Organize booking schedule",
    accueil: "Guest welcome & service",
    entretien: "Maintain your property",
    imprevus: "Handle unexpected events",
    deco: "Optional: Decor recommendations (on quote)",
  },
  es: {
    locataires: "Encontrar inquilinos",
    planning: "Organizar el planning",
    accueil: "Acogida y servicio viajeros",
    entretien: "Mantener su alojamiento",
    imprevus: "Gestionar los imprevistos",
    deco: "Opción: Decoración (presupuesto)",
  },
  it: {
    locataires: "Trovare inquilini",
    planning: "Organizzare il planning",
    accueil: "Accoglienza e servizio viaggiatori",
    entretien: "Manutenzione alloggio",
    imprevus: "Gestire gli imprevisti",
    deco: "Opzione: Raccomandazioni Arredo (su preventivo)",
  },
};

export default function ProprietairesPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const titles = SERVICE_TITLES[lang] || SERVICE_TITLES.fr;

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-[#2e2e2e] pt-36">
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6">{t('proprietaires.hero.tagline')}</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">{t('proprietaires.hero.title')}</h1>
          <p className="text-lg font-light text-white/80 leading-relaxed">{t('proprietaires.hero.subtitle')}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-20 bg-white">
        <div className="orso-container">
          <div className="text-center mb-4">
            <p className="orso-caption mb-4">{t('proprietaires.servicesTagline')}</p>
            <h2 className="orso-h2">{t('proprietaires.servicesTitle')}</h2>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20 bg-white">
        <div className="orso-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map(({ key, icon: Icon, items }, index) => (
              <div
                key={key}
                className="bg-[#f5f5f3] p-8 border border-gray-100 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#2e2e2e] text-white flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-[#2e2e2e] mb-5">{titles[key]}</h3>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-light">
                      <CheckCircle className="w-4 h-4 text-[#2e2e2e] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarif */}
      <section className="orso-section bg-[#2e2e2e] text-white">
        <div className="orso-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-8">{t('proprietaires.tarif.title')}</h2>
            <div className="text-7xl md:text-8xl font-serif mb-4">22%</div>
            <p className="text-white/70 text-sm mb-8">{t('proprietaires.tarif.desc')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {['noHidden', 'noCommitment', 'monthlyPayment'].map((key) => (
                <div key={key} className="border border-white/20 p-6">
                  <p className="text-sm uppercase tracking-widest text-white/80">
                    {t(`proprietaires.tarif.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Espace Propriétaire */}
      <section className="orso-section bg-white">
        <div className="orso-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#2e2e2e] text-white flex items-center justify-center mx-auto mb-8">
              <Smartphone className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h2 className="orso-h2 mb-10">{t('proprietaires.espace.title')}</h2>

            {/* Fluxia */}
            <div className="bg-[#f5f5f3] border border-gray-100 p-8 text-left mb-10">
              <h3 className="font-serif text-xl text-[#2e2e2e] mb-4">{t('proprietaires.espace.fluxiaTitle')}</h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed">{t('proprietaires.espace.fluxiaDesc')}</p>
            </div>

            <p className="text-lg font-light text-gray-700 mb-8">{t('proprietaires.espace.desc')}</p>
            <ul className="space-y-4 text-left max-w-lg mx-auto mb-10">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((key) => (
                <li key={key} className="flex items-start gap-3 text-gray-700 font-light">
                  <CheckCircle className="w-5 h-5 text-[#2e2e2e] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>{t(`proprietaires.espace.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f5f3] py-20">
        <div className="orso-container text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-[#2e2e2e] mb-6">{t('proprietaires.cta')}</h2>
          <Link href="/contact-conciergerie-cosy-casa">
            <Button className="orso-btn-primary">
              {t('nav.contact')}
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
