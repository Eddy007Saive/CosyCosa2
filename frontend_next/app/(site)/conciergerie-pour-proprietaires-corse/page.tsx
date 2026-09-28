import type { Metadata } from 'next';
import ProprietairesClient from './ProprietairesClient';

export const metadata: Metadata = {
  title: 'Services de conciergerie pour propriétaires',
  description:
    'Recherche de locataires, planning des réservations, accueil voyageurs, entretien du logement : découvrez tous les services Cosy Casa pour propriétaires en Corse du Sud.',
};

export default function Page() {
  return <ProprietairesClient />;
}
