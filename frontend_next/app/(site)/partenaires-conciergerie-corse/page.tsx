import type { Metadata } from 'next';
import PartnersClient from './PartnersClient';

export const metadata: Metadata = {
  title: 'Nos partenaires en Corse du Sud',
  description:
    "Découvrez le carnet d'adresses Cosy Casa : nos partenaires de confiance à Porto-Vecchio et en Corse du Sud pour un séjour réussi.",
};

export default function Page() {
  return <PartnersClient />;
}
