import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact - Cosy Casa Conciergerie Porto-Vecchio',
  description:
    'Contactez Cosy Casa Conciergerie à Porto-Vecchio par téléphone, email ou via notre formulaire. Nous répondons à toutes vos demandes 7j/7.',
};

export default function Page() {
  return <ContactClient />;
}
