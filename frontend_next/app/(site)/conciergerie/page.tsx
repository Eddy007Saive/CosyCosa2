import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getLocalBusinessJsonLd } from '@/lib/seo';
import ConciergerieClient from './ConciergerieClient';

export const metadata: Metadata = {
  title: 'Conciergerie pour propriétaires en Corse du Sud',
  description:
    'Confiez la gestion locative de votre bien à Porto-Vecchio et en Corse du Sud à une équipe locale, réactive et rigoureuse. Découvrez nos offres et avantages.',
};

export default function Page() {
  return (
    <>
      <JsonLd data={getLocalBusinessJsonLd()} />
      <ConciergerieClient />
    </>
  );
}
