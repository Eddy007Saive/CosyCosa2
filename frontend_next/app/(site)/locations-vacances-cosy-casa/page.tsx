import type { Metadata } from 'next';
import PropertiesClient from './PropertiesClient';

export const metadata: Metadata = {
  title: 'Locations de vacances à Porto-Vecchio et en Corse du Sud',
  description:
    'Découvrez notre sélection de logements de charme à Porto-Vecchio, Lecci, Pinarello et en Corse du Sud, hors plateformes, pour un séjour sur mesure.',
};

export default function Page() {
  return <PropertiesClient />;
}
