import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import useSEO from '@/hooks/useSEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BlogDetailPage = () => {
  const params = useParams();
  const location = useLocation();
  // Get slug from params or from the URL path
  const slug = params.slug || location.pathname.replace(/^\//, '');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useSEO({
    title: post?.meta_title || post?.title || 'Blog – Cosy Casa',
    description: post?.meta_description || post?.excerpt || '',
    path: `/${slug}`,
    image: post?.hero_image || undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-40">
        <p className="text-gray-400 font-light">Chargement...</p>
      </div>
    );
  }

  if (!post) return null; // Will fall through to SectorPage via router

  return (
    <div data-testid={`blog-detail-${slug}`}>
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center bg-cover bg-center pt-36"
        style={{ backgroundImage: post.hero_image ? `url(${post.hero_image})` : undefined, backgroundColor: '#2e2e2e' }}
      >
        {post.hero_image && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-6" data-testid="blog-detail-title">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>&gt;</span>
            <Link to="/blog-conciergerie-corse" className="hover:text-white transition-colors">Blog</Link>
            <span>&gt;</span>
            <span className="text-white/90">{post.title}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="orso-section">
        <div className="orso-container max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="orso-caption">{post.author || 'Cosycasa'}</span>
            {post.created_at && (
              <>
                <span className="text-gray-300">|</span>
                <span className="orso-caption">
                  {new Date(post.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </>
            )}
          </div>
          <div
            className="blog-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            data-testid="blog-detail-content"
          />
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
