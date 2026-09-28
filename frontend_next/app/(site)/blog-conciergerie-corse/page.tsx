import type { Metadata } from 'next';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Blog conciergerie et location saisonnière en Corse',
  description:
    "Conseils, guides et actualités sur la conciergerie et la location saisonnière à Porto-Vecchio et en Corse du Sud, par l'équipe locale Cosy Casa.",
};

export default function Page() {
  return <BlogListClient />;
}
