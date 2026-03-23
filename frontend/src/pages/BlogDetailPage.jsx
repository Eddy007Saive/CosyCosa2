import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Send, MessageSquare, User, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import useSEO from '@/hooks/useSEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BlogDetailPage = () => {
  const params = useParams();
  const location = useLocation();
  const slug = params.slug || location.pathname.replace(/^\//, '');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    author_website: '',
    content: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('blog_commenter');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCommentForm(prev => ({ ...prev, ...parsed }));
      setSaveInfo(true);
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}`);
        if (res.ok) {
          setPost(await res.json());
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blog/${slug}/comments`);
        if (res.ok) {
          setComments(await res.json());
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchPost();
    fetchComments();
  }, [slug]);

  useSEO({
    title: post?.meta_title || post?.title || 'Blog – Cosy Casa',
    description: post?.meta_description || post?.excerpt || '',
    path: `/${slug}`,
    image: post?.hero_image || undefined,
  });

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentForm.author_name || !commentForm.author_email || !commentForm.content) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...commentForm, post_slug: slug }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [newComment, ...prev]);
        if (saveInfo) {
          localStorage.setItem('blog_commenter', JSON.stringify({
            author_name: commentForm.author_name,
            author_email: commentForm.author_email,
            author_website: commentForm.author_website,
          }));
        }
        setCommentForm(prev => ({ ...prev, content: '' }));
        toast.success('Commentaire publié');
      } else {
        toast.error('Erreur lors de la publication');
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-40">
        <p className="text-gray-400 font-light">Chargement...</p>
      </div>
    );
  }

  if (!post) return null;

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

      {/* Comments Section */}
      <section className="orso-section bg-[#f5f5f3]" data-testid="blog-comments-section">
        <div className="orso-container max-w-3xl mx-auto">
          {/* Existing Comments */}
          {comments.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-5 h-5 text-[#2e2e2e]" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl">
                  {comments.length} commentaire{comments.length > 1 ? 's' : ''}
                </h3>
              </div>
              <div className="space-y-8">
                {comments.map((c) => (
                  <div key={c.id} className="bg-white p-6 border border-gray-100" data-testid={`comment-${c.id}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#2e2e2e] text-white flex items-center justify-center text-sm font-medium">
                        {c.author_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {c.author_website ? (
                            <a href={c.author_website} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.author_name}</a>
                          ) : c.author_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(c.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment Form */}
          <div>
            <h3 className="font-serif text-2xl mb-8" data-testid="comment-form-title">Laisser un commentaire</h3>
            <p className="text-sm text-gray-500 mb-6">
              Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont indiqués avec <span className="text-red-500">*</span>
            </p>
            <form onSubmit={submitComment} className="space-y-5" data-testid="comment-form">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                  Commentaire <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={commentForm.content}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  required
                  className="bg-white"
                  data-testid="comment-content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    <Input
                      value={commentForm.author_name}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, author_name: e.target.value }))}
                      required
                      className="pl-10 bg-white"
                      data-testid="comment-name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    <Input
                      type="email"
                      value={commentForm.author_email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, author_email: e.target.value }))}
                      required
                      className="pl-10 bg-white"
                      data-testid="comment-email"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                    Site web
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    <Input
                      value={commentForm.author_website}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, author_website: e.target.value }))}
                      className="pl-10 bg-white"
                      placeholder="https://"
                      data-testid="comment-website"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="save-info"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="save-info" className="text-sm text-gray-600">
                  Enregistrer mon nom, mon e-mail et mon site dans le navigateur pour mon prochain commentaire.
                </label>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="orso-btn-primary"
                data-testid="comment-submit"
              >
                <Send className="w-4 h-4 mr-2" strokeWidth={1.5} />
                {submitting ? 'Envoi...' : 'Laisser un commentaire'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
