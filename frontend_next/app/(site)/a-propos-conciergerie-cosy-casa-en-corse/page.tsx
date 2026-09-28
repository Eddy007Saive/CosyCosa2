import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Qui sommes-nous ? L’équipe Cosy Casa',
  description:
    "Julie, fondatrice de Cosy Casa, et son équipe 100% locale vous accompagnent à Porto-Vecchio. Rigueur, réactivité, disponibilité, anticipation et éco-responsabilité.",
};

export default function Page() {
  return <AboutClient />;
}
