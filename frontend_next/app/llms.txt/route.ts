import { getBlogPosts } from '@/lib/api';
import { SITE_URL } from '@/lib/seo';

// llms.txt (https://llmstxt.org) : fichier Markdown destiné aux agents IA.
// Un H1 obligatoire, un résumé en blockquote, puis des sections de liens.
// Sans cette route, le catch-all (site)/[slug] renvoyait la page 404 en HTML.

export const revalidate = 3600;

const STATIC_PAGES: Array<{ path: string; label: string; note: string }> = [
  { path: '/', label: 'Accueil', note: 'présentation de Cosy Casa, conciergerie 100 % locale en Corse du Sud.' },
  { path: '/conciergerie', label: 'Nos services de conciergerie', note: 'accueil des voyageurs, ménage, linge, intendance, disponibilité 7j/7.' },
  { path: '/conciergerie-pour-proprietaires-corse', label: 'Propriétaires', note: 'gestion complète de votre location saisonnière, tarification dynamique.' },
  { path: '/locations-vacances-cosy-casa', label: 'Locations de vacances', note: 'villas, maisons et appartements gérés par Cosy Casa, réservables en direct.' },
  { path: '/blog-conciergerie-corse', label: 'Blog', note: 'guides pratiques sur Porto-Vecchio, la Corse du Sud et la location saisonnière.' },
  { path: '/partenaires-conciergerie-corse', label: 'Partenaires', note: 'prestataires locaux avec lesquels Cosy Casa travaille.' },
  { path: '/a-propos-conciergerie-cosy-casa-en-corse', label: 'À propos', note: 'l’histoire de Cosy Casa et de sa fondatrice.' },
  { path: '/contact-conciergerie-cosy-casa', label: 'Contact', note: 'nous écrire ou nous appeler.' },
];

const OPTIONAL_PAGES: Array<{ path: string; label: string }> = [
  { path: '/cgv', label: 'Conditions générales de vente' },
  { path: '/legal', label: 'Mentions légales' },
  { path: '/privacy', label: 'Politique de confidentialité' },
];

function mdLink(label: string, path: string, note?: string) {
  return `- [${label}](${SITE_URL}${path})${note ? `: ${note}` : ''}`;
}

export async function GET() {
  let blogLines: string[] = [];
  try {
    const posts = await getBlogPosts();
    if (Array.isArray(posts)) {
      blogLines = posts
        .filter((post: any) => post?.slug && post?.title && post.is_published !== false)
        .map((post: any) => mdLink(String(post.title).trim(), `/${post.slug}`));
    }
  } catch {
    // Backend injoignable : on sert quand même les pages statiques,
    // le fichier ne doit jamais échouer à cause de l'API distante.
  }

  const lines = [
    '# Cosy Casa Conciergerie',
    '',
    '> Conciergerie de luxe et gestion de locations saisonnières en Corse du Sud : Porto-Vecchio, Lecci, Pinarello, Sainte-Lucie de Porto-Vecchio, Zonza, Bonifacio. Deux audiences : les propriétaires qui confient la gestion complète de leur bien, et les voyageurs qui réservent en direct des biens sélectionnés avec accueil personnalisé.',
    '',
    'Cosy Casa est une conciergerie 100 % locale fondée à Porto-Vecchio. Valeurs affichées : rigueur, réactivité, disponibilité 7j/7, anticipation. Engagement éco-responsable (produits d’entretien écologiques, tri, fournisseurs locaux).',
    '',
    '## Pages principales',
    '',
    ...STATIC_PAGES.map((p) => mdLink(p.label, p.path, p.note)),
    '',
    '## Articles du blog',
    '',
    ...(blogLines.length > 0
      ? blogLines
      : [mdLink('Blog Cosy Casa', '/blog-conciergerie-corse', 'liste complète des articles.')]),
    '',
    '## Optional',
    '',
    ...OPTIONAL_PAGES.map((p) => mdLink(p.label, p.path)),
    '',
  ];

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
