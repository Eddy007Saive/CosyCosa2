'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1733067760534-956cbad26218?w=1920&q=80';

const VALUES = [
  {
    key: 'rigueur',
    title: 'Rigueur',
    desc: "Nous veillons à chaque détail, de l'état des lieux au suivi des prestations. La qualité est notre priorité pour garantir à nos clients une tranquillité d'esprit totale.",
  },
  {
    key: 'reactivite',
    title: 'Réactivité',
    desc: "Nous veillons à chaque détail, de l'état des lieux au suivi des prestations. La qualité est notre priorité pour garantir à nos clients une tranquillité d'esprit totale.",
  },
  {
    key: 'disponibilite',
    title: 'Disponibilité',
    desc: "Disponible 7j/7, notre équipe vous accompagne avant, pendant et après chaque location. Vous avez toujours un interlocuteur à votre écoute.",
  },
  {
    key: 'anticipation',
    title: 'Anticipation',
    desc: "Nous anticipons les besoins de vos voyageurs et optimisons la gestion de votre bien pour éviter les mauvaises surprises et maximiser votre rentabilité.",
  },
];

const ECO_ENGAGEMENTS = [
  "Limitation des déplacements pour moins d'émission CO2",
  "Utilisation de produits d'entretien, et de consommables respectueux de l'environnement",
  "Diminution des impressions papier, utilisation de documents numériques",
  "Gestion des déchets : tri sélectif, recyclages",
  "Sensibilisation des clients (Informations sur les pratiques eco responsables)",
  "Favorisation des fournisseurs et producteurs locaux",
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center bg-cover bg-center pt-36"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
            Qui sommes-nous ?
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>&gt;</span>
            <span className="text-white/90">à propos</span>
          </div>
        </div>
      </section>

      {/* Julie - Fondatrice */}
      <section className="orso-section">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative">
              <div className="aspect-[3/4] bg-[#f5f5f3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Julie - Fondatrice de Cosy Casa"
                  className="w-full h-full object-cover grayscale-[30%]"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#8fa87a]/30 hidden lg:block" />
            </div>

            <div>
              <p className="orso-caption mb-4">Fondatrice de Cosy Casa</p>
              <h2 className="orso-h2 mb-8">Julie</h2>
              <div className="space-y-5 orso-body">
                <p>
                  Issue de l&apos;univers du journalisme, puis de la décoration et de l&apos;architecture d&apos;intérieur,
                  je mets à votre service, plus de 10 ans d&apos;expérience d&apos;entreprenariat pour{' '}
                  <strong>vous offrir le meilleur de mes compétences et de ma polyvalence.</strong>
                </p>
                <p>
                  Après un virage à 180° qui me fait quitter la région parisienne pour réaliser un rêve
                  en famille, celui d&apos;habiter à Porto Vecchio, je prolonge{' '}
                  <strong>ma passion pour l&apos;immobilier</strong> en ajoutant à l&apos;équation, la{' '}
                  <strong>Conciergerie</strong>, autour d&apos;un concept moderne &amp; efficace.
                </p>
                <p>
                  Notre équipe 100% locale, vous propose un{' '}
                  <strong>service d&apos;accompagnement de A à Z pour la location courte durée</strong>,
                  la sous location de votre logement ou l&apos;intendance de votre résidence secondaire.
                </p>
                <p className="font-serif text-xl text-[#2e2e2e] italic mt-6">
                  Détendez vous, nous prenons la main !
                </p>
                <p>
                  Nous vous garantissons des <strong>prestations personnalisées</strong>, une organisation
                  transparente et une qualité de services impeccable.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <a
                  href="https://www.facebook.com/profile.php?id=61556104644895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-[#2e2e2e]/20 hover:border-[#2e2e2e]/60 hover:bg-[#2e2e2e]/5 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-[#2e2e2e]" strokeWidth={1.5} />
                </a>
                <a
                  href="https://www.instagram.com/cosycasaconciergerie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-[#2e2e2e]/20 hover:border-[#2e2e2e]/60 hover:bg-[#2e2e2e]/5 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-[#2e2e2e]" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="orso-section bg-[#f5f5f3]">
        <div className="orso-container">
          <div className="text-center mb-16">
            <p className="orso-caption mb-4">Ce qui nous guide</p>
            <h2 className="orso-h2">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {VALUES.map((v) => (
              <div key={v.key} className="bg-white p-8 lg:p-10 border border-gray-100 hover:border-gray-300 transition-colors">
                <h3 className="font-serif text-xl md:text-2xl mb-4 uppercase tracking-wide">{v.title}</h3>
                <p className="orso-body text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/contact-conciergerie-cosy-casa">
              <Button className="orso-btn-primary">
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Engagements éco-responsables */}
      <section className="orso-section">
        <div className="orso-container max-w-4xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Leaf className="w-5 h-5 text-[#8fa87a]" strokeWidth={1.5} />
              <p className="orso-caption">Responsabilité environnementale</p>
            </div>
            <h2 className="orso-h2">Nos engagements éco responsables</h2>
          </div>
          <ul className="space-y-5">
            {ECO_ENGAGEMENTS.map((e, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <span className="mt-1 w-2 h-2 rounded-full bg-[#8fa87a] shrink-0 group-hover:scale-125 transition-transform" />
                <span className="orso-body">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
