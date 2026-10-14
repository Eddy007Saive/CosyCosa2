import type { Metadata } from 'next';
import { preload } from 'react-dom';
import { JsonLd } from '@/components/JsonLd';
import { getLocalBusinessJsonLd } from '@/lib/seo';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Conciergerie à Porto-Vecchio, Corse du Sud',
  description:
    "Cosy Casa, votre conciergerie à Porto-Vecchio : haut de gamme et 100% locale, à Lecci et Pinarello. Gestion sur mesure pour propriétaires, séjours d'exception pour voyageurs.",
};

export default function Page() {
  // LCP : le poster du hero (/hero-poster.webp) est l'image la plus grande au-dessus
  // de la ligne de flottaison. Preload en priorite haute, emis dans le HTML initial
  // (le composant client n'est rendu qu'apres hydratation, voir I18nProvider).
  preload('/hero-poster.webp', { as: 'image', fetchPriority: 'high' });

  return (
    <>
      <JsonLd data={getLocalBusinessJsonLd()} />
      <HomeClient />
    </>
  );
}
