import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getLocalBusinessJsonLd } from '@/lib/seo';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Conciergerie de charme à Porto-Vecchio, Corse du Sud',
  description:
    "Cosy Casa, conciergerie haut de gamme et 100% locale à Porto-Vecchio, Lecci, Pinarello : gestion sur mesure pour propriétaires, séjours d'exception pour voyageurs.",
};

export default function Page() {
  return (
    <>
      <JsonLd data={getLocalBusinessJsonLd()} />
      <HomeClient />
    </>
  );
}
