import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Save, X, Loader2, Upload, ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'list', 'link',
];

const EMPTY_POST = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  hero_image: '',
  author: 'Cosycasa',
  meta_title: '',
  meta_description: '',
  is_published: true,
};

const BlogTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState(EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/blog?include_drafts=true`);
      if (res.ok) setPosts(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setForm({
        slug: post.slug || '',
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        hero_image: post.hero_image || '',
        author: post.author || 'Cosycasa',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        is_published: post.is_published !== false,
      });
    } else {
      setEditingPost(null);
      setForm(EMPTY_POST);
    }
    setShowModal(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (val) => {
    setForm(prev => ({
      ...prev,
      title: val,
      slug: !editingPost ? generateSlug(val) : prev.slug,
      meta_title: !prev.meta_title ? val : prev.meta_title,
    }));
  };

  const savePost = async () => {
    if (!form.title || !form.slug) {
      toast.error('Titre et slug requis');
      return;
    }
    setSaving(true);
    try {
      const url = editingPost
        ? `${API_URL}/blog/${editingPost.id}`
        : `${API_URL}/blog`;
      const method = editingPost ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingPost ? 'Article mis à jour' : 'Article créé');
        setShowModal(false);
        fetchPosts();
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Erreur');
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      const res = await fetch(`${API_URL}/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Article supprimé');
        fetchPosts();
      }
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const togglePublished = async (post) => {
    try {
      await fetch(`${API_URL}/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, is_published: !post.is_published }),
      });
      fetchPosts();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const quillModules = useMemo(() => QUILL_MODULES, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload/image`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm(prev => ({ ...prev, hero_image: data.url }));
        toast.success('Image uploadée');
      } else {
        toast.error("Erreur lors de l'upload");
      }
    } catch (err) {
      toast.error('Erreur réseau');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="blog-tab">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-[#2e2e2e]">Articles de blog</h2>
          <p className="text-gray-600 mt-1">Gérez vos articles SEO avec éditeur enrichi</p>
        </div>
        <Button onClick={() => openModal()} className="bg-[#2e2e2e] text-white hover:bg-black rounded-full px-6 py-2 uppercase tracking-widest text-xs" data-testid="add-blog-btn">
          <Plus className="w-4 h-4 mr-2" /> Nouvel article
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : (
        <div className="bg-white border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Slug (URL)</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">{post.title}</TableCell>
                  <TableCell className="text-sm text-gray-500 font-mono max-w-[200px] truncate">/{post.slug}</TableCell>
                  <TableCell className="text-sm">{post.author}</TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? "default" : "secondary"} className={post.is_published ? "bg-green-100 text-green-800" : ""}>
                      {post.is_published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => togglePublished(post)} data-testid={`toggle-blog-${post.slug}`}>
                        {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openModal(post)} data-testid={`edit-blog-${post.slug}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-700" data-testid={`delete-blog-${post.slug}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    Aucun article. Cliquez sur "Nouvel article" pour en créer un.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Blog Post Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingPost ? 'Modifier l\'article' : 'Nouvel article'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Title */}
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500">Titre</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-1"
                placeholder="Conciergerie CosyCasa à..."
                data-testid="blog-form-title"
              />
            </div>

            {/* Slug */}
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500">Slug (URL)</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 text-sm">/</span>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="conciergerie-cosycasa-a-porto-vecchio"
                  data-testid="blog-form-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500">Extrait (affiché sur la page listing)</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                className="mt-1"
                rows={3}
                placeholder="Courte description de l'article..."
                data-testid="blog-form-excerpt"
              />
            </div>

            {/* Hero Image */}
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500">Image Hero</Label>
              {form.hero_image ? (
                <div className="mt-2 relative group">
                  <div className="h-40 bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={form.hero_image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer bg-white text-[#2e2e2e] px-4 py-2 text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                      <Upload className="w-3.5 h-3.5 inline mr-2" />
                      Remplacer
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, hero_image: '' }))}
                      className="bg-red-500 text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 inline mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <label className="mt-2 flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100" data-testid="blog-form-hero-image">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" strokeWidth={1.5} />
                      <span className="text-sm text-gray-500">Cliquez pour uploader une image</span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
            </div>

            {/* Content - Rich Editor */}
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Contenu (éditeur enrichi)</Label>
              <div className="border border-gray-200 rounded" data-testid="blog-form-content">
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(val) => setForm(prev => ({ ...prev, content: val }))}
                  modules={quillModules}
                  formats={QUILL_FORMATS}
                  placeholder="Rédigez votre article ici..."
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-serif text-lg mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-gray-500">Meta Title</Label>
                  <Input
                    value={form.meta_title}
                    onChange={(e) => setForm(prev => ({ ...prev, meta_title: e.target.value }))}
                    className="mt-1"
                    placeholder="Titre pour les moteurs de recherche"
                    data-testid="blog-form-meta-title"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.meta_title.length}/60 caractères</p>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-gray-500">Meta Description</Label>
                  <Textarea
                    value={form.meta_description}
                    onChange={(e) => setForm(prev => ({ ...prev, meta_description: e.target.value }))}
                    className="mt-1"
                    rows={2}
                    placeholder="Description pour les moteurs de recherche"
                    data-testid="blog-form-meta-desc"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.meta_description.length}/160 caractères</p>
                </div>
              </div>
            </div>

            {/* Author + Published */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase tracking-widest text-gray-500">Auteur</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                  className="mt-1"
                  data-testid="blog-form-author"
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_published}
                    onCheckedChange={(v) => setForm(prev => ({ ...prev, is_published: v }))}
                    data-testid="blog-form-published"
                  />
                  <Label>{form.is_published ? 'Publié' : 'Brouillon'}</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              <X className="w-4 h-4 mr-2" /> Annuler
            </Button>
            <Button onClick={savePost} disabled={saving} className="bg-[#2e2e2e] text-white hover:bg-black">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {editingPost ? 'Mettre à jour' : 'Créer l\'article'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogTab;
