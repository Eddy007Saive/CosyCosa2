import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSEO from '@/hooks/useSEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Blog – Conciergerie Corse – Cosy Casa',
    description: 'Blog conciergerie Corse – Explorez nos conseils, actus et astuces pour optimiser votre location saisonnière en Corse avec CosyCasa.',
    path: '/blog-conciergerie-corse',
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div data-testid="blog-list-page">
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center bg-cover bg-center pt-36"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80)' }}
        data-testid="blog-hero"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4" data-testid="blog-hero-title">
            Nos articles
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>&gt;</span>
            <span className="text-white/90">blog</span>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="orso-section">
        <div className="orso-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] bg-gray-200 mb-6" />
                  <div className="h-4 bg-gray-200 w-1/4 mb-3" />
                  <div className="h-6 bg-gray-200 w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10" data-testid="blog-grid">
              {posts.map((post) => (
                <Link
                  key={post.id || post.slug}
                  to={`/${post.slug}`}
                  className="group block"
                  data-testid={`blog-card-${post.slug}`}
                >
                  <div className="overflow-hidden mb-6">
                    <div className="aspect-[16/10] overflow-hidden bg-[#f5f5f3]">
                      {post.hero_image ? (
                        <img
                          src={post.hero_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e5e5e3] flex items-center justify-center text-gray-400 font-serif text-xl">
                          Cosy Casa
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="orso-caption mb-2">{post.author || 'Cosycasa'}</p>
                  <h2 className="font-serif text-xl md:text-2xl mb-3 group-hover:opacity-70 transition-opacity">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;
