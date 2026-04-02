'use client';

import { useState, useEffect } from 'react';
import {
  Eye, EyeOff, Edit, Trash2, Plus, Image, RefreshCw, Save, X, Check,
  Lock, LogOut, Link as LinkIcon, LayoutDashboard, ImageIcon, FileText,
  MapPin, BookOpen, Upload, Loader2, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getSiteImages, updateSiteImages, uploadImage,
  getAdminProperties, getSyncStatus, syncBeds24,
  adminLogin, getServicesPdf, updateServicesPdf,
} from '@/lib/api';
import BlogTab from '@/components/admin/BlogTab';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const SITE_IMAGE_PAGES: Record<string, { label: string; images: Record<string, { label: string; description: string }> }> = {
  home: {
    label: 'Accueil',
    images: {
      home_hero: { label: "Image Hero", description: "Grande image de fond sur la page d'accueil (remplace le GIF animé si renseignée)" },
      home_traveler: { label: 'Photo section Voyageurs', description: 'Photo à côté de la section "Partez à la découverte de nos propriétés"' },
    },
  },
  conciergerie: {
    label: 'Conciergerie',
    images: {
      conciergerie_hero: { label: 'Image Hero Conciergerie', description: 'Grande image de fond en haut de la page Conciergerie' },
    },
  },
  proprietaires: {
    label: 'Pour les Propriétaires',
    images: {
      proprietaire_hero: { label: 'Image Hero', description: 'Grande image de fond en haut de la page Pour les Propriétaires' },
    },
  },
  locations: {
    label: 'Locations de vacances',
    images: {
      locations_hero: { label: 'Image Hero', description: 'Grande image de fond en haut de la page Locations de vacances' },
    },
  },
  contact: {
    label: 'Contact',
    images: {
      contact_page: { label: 'Photo Contact', description: 'Photo à gauche du formulaire de contact' },
    },
  },
  apropos: {
    label: 'À propos',
    images: {
      esprit_hero:  { label: 'Image Hero', description: "Grande image de fond en haut de la page À propos" },
      esprit_julie: { label: 'Photo Julie', description: 'Grande photo de Julie (format portrait, noir et blanc recommandé)' },
    },
  },
  blog: {
    label: 'Blog',
    images: {
      blog_hero: { label: 'Image Hero Blog', description: "Grande image de fond en haut de la page Blog" },
    },
  },
  partenaires: {
    label: 'Partenaires',
    images: {
      partenaires_hero: { label: 'Image Hero Partenaires', description: "Grande image de fond en haut de la page Partenaires" },
      partner_kyrnos: { label: 'Kyrnos Marine', description: 'Balade en bateau avec Skipper' },
      partner_country_horse: { label: 'Country Horse', description: 'Baignade à cheval / randonnées' },
      partner_angelique: { label: 'Massages Angélique', description: 'Massages / Soins Esthétiques' },
      partner_torraccia: { label: 'Domaine de Torraccia', description: 'Visite, dégustation au Domaine de Torraccia' },
      partner_simples: { label: 'Simples et Divines', description: 'Huiles Essentielles' },
      partner_rando: { label: 'Rando Palmée Bonifacio', description: 'Randonnée palmée à Bonifacio' },
    },
  },
};

type Property = {
  id: string;
  name: string;
  beds24_id?: string;
  city: string;
  category: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  price_from?: number;
  description?: { fr?: string };
  images?: string[];
  is_showcase: boolean;
  is_active: boolean;
};

type Sector = {
  id: string;
  slug: string;
  city_fr: string;
  city_en: string;
  city_es: string;
  city_it: string;
  meta_description_fr: string;
  meta_description_en: string;
  intro_fr: string;
  intro_en: string;
  intro_es: string;
  intro_it: string;
  intro2_fr: string;
  intro2_en: string;
  intro2_es: string;
  intro2_it: string;
  offers: Array<Record<string, string>>;
  advantages: Array<Record<string, string>>;
  hero_image: string;
  is_active: boolean;
  order: number;
};

type SyncStatus = {
  scheduler_running: boolean;
  sync_interval_hours: number;
  next_sync?: string;
  last_sync?: { status: string; last_sync: string; message?: string };
};

const EMPTY_SECTOR = {
  slug: '', city_fr: '', city_en: '', city_es: '', city_it: '',
  meta_description_fr: '', meta_description_en: '',
  intro_fr: '', intro_en: '', intro_es: '', intro_it: '',
  intro2_fr: '', intro2_en: '', intro2_es: '', intro2_it: '',
  offers: [] as Array<Record<string, string>>,
  advantages: [] as Array<Record<string, string>>,
  hero_image: '', is_active: true, order: 0,
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [activeImagePage, setActiveImagePage] = useState('home');

  const [siteImages, setSiteImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [savingImages, setSavingImages] = useState(false);

  const [servicesPdfUrl, setServicesPdfUrl] = useState('');
  const [savingPdf, setSavingPdf] = useState(false);

  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedPropertyForImages, setSelectedPropertyForImages] = useState<Property | null>(null);

  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [sectorForm, setSectorForm] = useState(EMPTY_SECTOR);

  const [propertyForm, setPropertyForm] = useState({
    name: '', beds24_id: '', city: '', category: 'vue_mer',
    max_guests: 4, bedrooms: 2, bathrooms: 1, price_from: '',
    description_fr: '', is_showcase: false, is_active: true,
  });
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  useEffect(() => {
    const auth = sessionStorage.getItem('orso_admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
      loadSiteImages();
      loadServicesPdf();
      loadSectors();
      loadSyncStatus();
      const interval = setInterval(loadSyncStatus, 60000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadSyncStatus = async () => {
    try { setSyncStatus(await getSyncStatus()); } catch { /* silent */ }
  };

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getAdminProperties() as { properties: Property[] };
      setProperties(data.properties || []);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };

  const loadSiteImages = async () => {
    setLoadingImages(true);
    try {
      const data = await getSiteImages() as { images: Record<string, string> };
      setSiteImages(data.images || {});
    } catch { toast.error('Erreur de chargement des images'); }
    finally { setLoadingImages(false); }
  };

  const loadServicesPdf = async () => {
    try {
      const data = await getServicesPdf() as { services_pdf_url: string };
      setServicesPdfUrl(data.services_pdf_url || '');
    } catch { /* silent */ }
  };

  const loadSectors = async () => {
    setLoadingSectors(true);
    try {
      const res = await fetch(`${API_URL}/sectors?include_hidden=true`);
      if (res.ok) setSectors(await res.json());
    } catch { /* silent */ }
    finally { setLoadingSectors(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      await adminLogin(password);
      setIsAuthenticated(true);
      sessionStorage.setItem('orso_admin_auth', 'true');
      toast.success('Connexion réussie');
    } catch { setLoginError('Mot de passe incorrect'); }
    finally { setLoggingIn(false); }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('orso_admin_auth');
  };

  const handleSyncBeds24 = async () => {
    setSyncing(true);
    try {
      const data = await syncBeds24() as { success: boolean; synced: number; updated: number };
      if (data.success) {
        toast.success(`${data.synced} nouvelles propriétés, ${data.updated} mises à jour`);
        loadProperties();
      }
    } catch { toast.error('Erreur de synchronisation'); }
    finally { setSyncing(false); }
  };

  const saveSiteImagesHandler = async () => {
    setSavingImages(true);
    try {
      await updateSiteImages(siteImages);
      toast.success('Images du site enregistrées');
    } catch { toast.error('Erreur lors de la sauvegarde'); }
    finally { setSavingImages(false); }
  };

  const saveServicesPdf = async () => {
    setSavingPdf(true);
    try {
      await updateServicesPdf(servicesPdfUrl);
      toast.success('Lien PDF enregistré');
    } catch { toast.error('Erreur lors de la sauvegarde du PDF'); }
    finally { setSavingPdf(false); }
  };

  const handleImageUpload = async (key: string, file: File) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) { toast.error('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Fichier trop volumineux. Maximum 10MB.'); return; }
    setUploadingKey(key);
    try {
      const result = await uploadImage(file) as { success: boolean; url: string };
      if (result.success && result.url) {
        setSiteImages(prev => ({ ...prev, [key]: result.url }));
        toast.success('Image téléchargée avec succès');
      }
    } catch { toast.error('Erreur lors du téléchargement'); }
    finally { setUploadingKey(null); }
  };

  const toggleVisibility = async (property: Property) => {
    try {
      const res = await fetch(`${API_URL}/properties/${property.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !property.is_active }),
      });
      if (res.ok) { toast.success(property.is_active ? 'Propriété masquée' : 'Propriété visible'); loadProperties(); }
    } catch { toast.error('Erreur'); }
  };

  const updateCategory = async (property: Property, category: string) => {
    try {
      const res = await fetch(`${API_URL}/properties/${property.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      if (res.ok) { toast.success('Catégorie mise à jour'); loadProperties(); }
    } catch { toast.error('Erreur'); }
  };

  const deleteProperty = async (property: Property) => {
    if (!window.confirm(`Supprimer "${property.name}" ?`)) return;
    try {
      const res = await fetch(`${API_URL}/properties/${property.id}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Propriété supprimée'); loadProperties(); }
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const saveProperty = async () => {
    try {
      const slug = propertyForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();
      const propertyData = {
        name: propertyForm.name, slug,
        beds24_id: propertyForm.beds24_id || null,
        city: propertyForm.city, category: propertyForm.category,
        max_guests: parseInt(String(propertyForm.max_guests)),
        bedrooms: parseInt(String(propertyForm.bedrooms)),
        bathrooms: parseInt(String(propertyForm.bathrooms)),
        price_from: propertyForm.price_from ? parseFloat(propertyForm.price_from) : null,
        description: { fr: propertyForm.description_fr, en: propertyForm.description_fr, es: propertyForm.description_fr, it: propertyForm.description_fr },
        short_description: { fr: propertyForm.description_fr.slice(0, 200), en: propertyForm.description_fr.slice(0, 200), es: propertyForm.description_fr.slice(0, 200), it: propertyForm.description_fr.slice(0, 200) },
        location: propertyForm.city,
        is_showcase: propertyForm.is_showcase,
        is_active: propertyForm.is_active,
        amenities: [],
        images: editingProperty?.images || [],
      };
      const url = editingProperty ? `${API_URL}/properties/${editingProperty.id}` : `${API_URL}/properties`;
      const method = editingProperty ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(propertyData) });
      if (res.ok) { toast.success(editingProperty ? 'Propriété mise à jour' : 'Propriété créée'); setShowPropertyModal(false); loadProperties(); }
      else toast.error('Erreur lors de la sauvegarde');
    } catch { toast.error('Erreur lors de la sauvegarde'); }
  };

  const handlePropertyImageUpload = async (index: number, file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) { toast.error('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Fichier trop volumineux. Maximum 10MB.'); return; }
    setUploadingImageIndex(index);
    try {
      const result = await uploadImage(file) as { success: boolean; url: string };
      if (result.success && result.url) {
        const n = [...imageUrls];
        n[index] = result.url;
        setImageUrls(n);
        toast.success('Image uploadée');
      }
    } catch { toast.error("Erreur lors de l'upload"); }
    finally { setUploadingImageIndex(null); }
  };

  const saveImages = async () => {
    if (!selectedPropertyForImages) return;
    try {
      const validUrls = imageUrls.filter(url => url.trim() !== '');
      const res = await fetch(`${API_URL}/properties/${selectedPropertyForImages.id}/images`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validUrls),
      });
      if (res.ok) { toast.success(`${validUrls.length} image(s) enregistrée(s)`); setShowImagesModal(false); loadProperties(); }
    } catch { toast.error('Erreur lors de la sauvegarde des images'); }
  };

  const saveSector = async () => {
    try {
      const url = editingSector ? `${API_URL}/sectors/${editingSector.id}` : `${API_URL}/sectors`;
      const method = editingSector ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sectorForm) });
      if (res.ok) {
        toast.success(editingSector ? 'Secteur mis à jour' : 'Secteur créé');
        setShowSectorModal(false);
        setEditingSector(null);
        loadSectors();
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Erreur');
      }
    } catch { toast.error('Erreur lors de la sauvegarde'); }
  };

  const deleteSector = async (sectorId: string) => {
    if (!window.confirm('Supprimer ce secteur ?')) return;
    try {
      const res = await fetch(`${API_URL}/sectors/${sectorId}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Secteur supprimé'); loadSectors(); }
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const toggleSectorActive = async (sector: Sector) => {
    try {
      const updated = { ...sector, is_active: !sector.is_active } as Record<string, unknown>;
      delete updated.id; delete updated.created_at; delete updated.updated_at;
      const res = await fetch(`${API_URL}/sectors/${sector.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
      if (res.ok) { toast.success(sector.is_active ? 'Secteur masqué' : 'Secteur affiché'); loadSectors(); }
    } catch { toast.error('Erreur'); }
  };

  const openSectorModal = (sector: Sector | null = null) => {
    if (sector) {
      setEditingSector(sector);
      setSectorForm({
        slug: sector.slug || '', city_fr: sector.city_fr || '', city_en: sector.city_en || '',
        city_es: sector.city_es || '', city_it: sector.city_it || '',
        meta_description_fr: sector.meta_description_fr || '', meta_description_en: sector.meta_description_en || '',
        intro_fr: sector.intro_fr || '', intro_en: sector.intro_en || '',
        intro_es: sector.intro_es || '', intro_it: sector.intro_it || '',
        intro2_fr: sector.intro2_fr || '', intro2_en: sector.intro2_en || '',
        intro2_es: sector.intro2_es || '', intro2_it: sector.intro2_it || '',
        offers: sector.offers || [], advantages: sector.advantages || [],
        hero_image: sector.hero_image || '', is_active: sector.is_active ?? true, order: sector.order || 0,
      });
    } else {
      setEditingSector(null);
      setSectorForm({ ...EMPTY_SECTOR, order: sectors.length });
    }
    setShowSectorModal(true);
  };

  // ——— Login screen ———
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl mb-2">Cosy Casa</h1>
            <p className="text-gray-500 text-sm uppercase tracking-widest">Administration</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password" type="password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  className={`pl-10 ${loginError ? 'border-red-500' : ''}`}
                  placeholder="Entrez le mot de passe" disabled={loggingIn}
                />
              </div>
              {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
            </div>
            <Button type="submit" className="w-full bg-[#2e2e2e] text-white hover:bg-black" disabled={loggingIn}>
              {loggingIn ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connexion...</> : 'Connexion'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ——— Admin dashboard ———
  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl">Cosy Casa</h1>
            <p className="text-xs uppercase tracking-widest text-gray-500">Administration</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleSyncBeds24} disabled={syncing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sync...' : 'Sync Beds24'}
            </Button>
            {syncStatus && (
              <div className="flex items-center gap-2 text-xs">
                {syncStatus.scheduler_running ? (
                  <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3 h-3" />Auto-sync actif</span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400"><Clock className="w-3 h-3" />Auto-sync inactif</span>
                )}
              </div>
            )}
            <Button size="sm" className="bg-[#2e2e2e] text-white hover:bg-black"
              onClick={() => {
                setEditingProperty(null);
                setPropertyForm({ name: '', beds24_id: '', city: '', category: 'vue_mer', max_guests: 4, bedrooms: 2, bathrooms: 1, price_from: '', description_fr: '', is_showcase: false, is_active: true });
                setShowPropertyModal(true);
              }}>
              <Plus className="w-4 h-4 mr-2" />Nouvelle propriété
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            {[
              { key: 'properties', label: 'Propriétés', icon: LayoutDashboard },
              { key: 'site-images', label: 'Images du site', icon: ImageIcon },
              { key: 'pdf-services', label: 'PDF Services', icon: FileText },
              { key: 'sectors', label: 'Secteurs', icon: MapPin },
              { key: 'blog', label: 'Blog', icon: BookOpen },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 text-sm uppercase tracking-widest border-b-2 transition-colors ${
                  activeTab === key ? 'border-[#2e2e2e] text-[#2e2e2e]' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-2" />{label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ——— Properties Tab ——— */}
        {activeTab === 'properties' && (
          <>
            {syncStatus?.last_sync && (
              <div className={`mb-6 p-4 border flex items-center justify-between ${
                syncStatus.last_sync.status === 'success' ? 'bg-green-50 border-green-200'
                  : syncStatus.last_sync.status === 'error' ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3">
                  {syncStatus.last_sync.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                    : syncStatus.last_sync.status === 'error' ? <AlertCircle className="w-5 h-5 text-red-600" />
                    : <Clock className="w-5 h-5 text-yellow-600" />}
                  <div>
                    <p className="text-sm font-medium">
                      {syncStatus.scheduler_running
                        ? <>Synchronisation automatique <span className="text-green-600">activée</span> (toutes les {syncStatus.sync_interval_hours}h)</>
                        : <>Synchronisation automatique <span className="text-gray-500">désactivée</span></>}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dernière sync : {new Date(syncStatus.last_sync.last_sync).toLocaleString('fr-FR')}
                      {syncStatus.last_sync.message && ` — ${syncStatus.last_sync.message}`}
                    </p>
                    {syncStatus.next_sync && (
                      <p className="text-xs text-gray-500">Prochaine sync : {new Date(syncStatus.next_sync).toLocaleString('fr-FR')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {[
                { value: properties.length, label: 'Total propriétés', color: '' },
                { value: properties.filter(p => p.beds24_id).length, label: 'Connectées Beds24', color: '' },
                { value: properties.filter(p => p.is_active).length, label: 'Visibles', color: 'text-green-600' },
                { value: properties.filter(p => !p.is_active).length, label: 'Masquées', color: 'text-gray-400' },
                { value: properties.filter(p => p.is_showcase).length, label: 'Vitrines', color: '' },
              ].map(({ value, label, color }) => (
                <div key={label} className="bg-white p-6 border border-gray-100">
                  <p className={`text-3xl font-serif ${color}`}>{value}</p>
                  <p className="text-xs uppercase tracking-widest text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Propriété</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix/nuit</TableHead>
                    <TableHead>Beds24</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-500">Chargement...</TableCell></TableRow>
                  ) : properties.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-500">Aucune propriété</TableCell></TableRow>
                  ) : properties.map((property) => (
                    <TableRow key={property.id} className={!property.is_active ? 'bg-gray-50' : ''}>
                      <TableCell>
                        <div className={`w-10 h-10 bg-gray-100 overflow-hidden ${!property.is_active ? 'opacity-50' : ''}`}>
                          {property.images?.[0]
                            ? <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Image className="w-4 h-4 text-gray-400" /></div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={!property.is_active ? 'opacity-60' : ''}>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{property.name}</p>
                            {!property.is_active && <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500"><EyeOff className="w-3 h-3 mr-1" />Masqué</Badge>}
                          </div>
                          <p className="text-xs text-gray-500">{property.max_guests} pers · {property.bedrooms} ch · {property.bathrooms} sdb</p>
                        </div>
                      </TableCell>
                      <TableCell className={!property.is_active ? 'opacity-60' : ''}>{property.city}</TableCell>
                      <TableCell>
                        <Select value={property.category} onValueChange={(value) => updateCategory(property, value)}>
                          <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vue_mer">Vue Mer</SelectItem>
                            <SelectItem value="plage_a_pieds">Plage à Pieds</SelectItem>
                            <SelectItem value="pieds_dans_eau">Pieds dans l&apos;Eau</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{property.price_from ? `${property.price_from}€` : '-'}</TableCell>
                      <TableCell>
                        {property.beds24_id
                          ? <Badge variant="outline" className="text-xs"><LinkIcon className="w-3 h-3 mr-1" />{property.beds24_id}</Badge>
                          : <span className="text-gray-400 text-xs">Non connecté</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={property.is_active} onCheckedChange={() => toggleVisibility(property)} />
                          {property.is_showcase && <Badge variant="secondary" className="text-xs">Vitrine</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedPropertyForImages(property); setImageUrls(property.images?.length ? property.images : ['']); setShowImagesModal(true); }} title="Gérer les images">
                            <Image className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            setEditingProperty(property);
                            setPropertyForm({ name: property.name, beds24_id: property.beds24_id || '', city: property.city, category: property.category, max_guests: property.max_guests, bedrooms: property.bedrooms, bathrooms: property.bathrooms, price_from: String(property.price_from || ''), description_fr: property.description?.fr || '', is_showcase: property.is_showcase, is_active: property.is_active });
                            setShowPropertyModal(true);
                          }} title="Modifier">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteProperty(property)} title="Supprimer" className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {/* ——— Site Images Tab ——— */}
        {activeTab === 'site-images' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl">Images du site</h2>
                <p className="text-gray-500 text-sm mt-1">Modifiez les images de chaque page de votre site</p>
              </div>
              <Button onClick={saveSiteImagesHandler} disabled={savingImages} className="bg-[#2e2e2e] text-white hover:bg-black">
                <Save className={`w-4 h-4 mr-2 ${savingImages ? 'animate-spin' : ''}`} />
                {savingImages ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
              {Object.entries(SITE_IMAGE_PAGES).map(([pageKey, pageConfig]) => (
                <Button key={pageKey} variant={activeImagePage === pageKey ? 'default' : 'outline'} size="sm"
                  onClick={() => setActiveImagePage(pageKey)}
                  className={activeImagePage === pageKey ? 'bg-[#2e2e2e] text-white' : ''}>
                  {pageConfig.label}
                </Button>
              ))}
            </div>

            {loadingImages ? (
              <div className="text-center py-12 text-gray-500">Chargement...</div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 px-4 py-3">
                  <h3 className="font-medium text-lg">Page : {SITE_IMAGE_PAGES[activeImagePage]?.label}</h3>
                  <p className="text-sm text-gray-500">{Object.keys(SITE_IMAGE_PAGES[activeImagePage]?.images || {}).length} image(s) configurables</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(SITE_IMAGE_PAGES[activeImagePage]?.images || {}).map(([key, config]) => (
                    <div key={key} className="bg-white border border-gray-100 p-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label className="font-medium">{config.label}</Label>
                        </div>
                        <p className="text-xs text-gray-500">{config.description}</p>
                      </div>
                      <div
                        className={`aspect-video bg-gray-100 overflow-hidden relative border-2 border-dashed transition-colors cursor-pointer ${dragOverKey === key ? 'border-[#2e2e2e] bg-gray-200' : 'border-transparent hover:border-gray-300'}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOverKey(key); }}
                        onDragLeave={() => setDragOverKey(null)}
                        onDrop={(e) => { e.preventDefault(); setDragOverKey(null); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(key, f); }}
                        onClick={() => document.getElementById(`file-input-${key}`)?.click()}
                      >
                        {uploadingKey === key ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-sm">Téléchargement vers Cloudinary...</span>
                          </div>
                        ) : siteImages[key] ? (
                          <>
                            <img src={siteImages[key]} alt={config.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                              <div className="text-white text-center"><Upload className="w-6 h-6 mx-auto mb-1" /><span className="text-sm">Glissez une image ou cliquez</span></div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">Glissez une image ici</span>
                            <span className="text-xs">ou cliquez pour parcourir</span>
                          </div>
                        )}
                        <input id={`file-input-${key}`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(key, f); e.target.value = ''; }} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-500">URL de l&apos;image</Label>
                        <Input value={siteImages[key] || ''} onChange={(e) => setSiteImages(prev => ({ ...prev, [key]: e.target.value }))} placeholder="URL générée automatiquement après upload" className="text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 p-6">
              <h3 className="font-medium mb-3 text-green-900">Upload Cloudinary activé !</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• <strong>Glissez-déposez</strong> vos images directement sur les zones ou cliquez pour parcourir</li>
                <li>• Les images sont automatiquement uploadées sur <strong>Cloudinary</strong> (stockage permanent)</li>
                <li>• Formats acceptés : JPG, PNG, WebP, GIF (max 10MB)</li>
                <li>• Vous pouvez aussi coller une URL externe si vous préférez</li>
                <li>• Cliquez sur <strong>&quot;Enregistrer&quot;</strong> après vos modifications</li>
              </ul>
            </div>
          </div>
        )}

        {/* ——— PDF Services Tab ——— */}
        {activeTab === 'pdf-services' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#2e2e2e]">PDF Services</h2>
                <p className="text-gray-600 mt-1">Configurez le lien du PDF qui s&apos;ouvrira quand les visiteurs cliquent sur &quot;EN SAVOIR PLUS&quot;</p>
              </div>
              <Button onClick={saveServicesPdf} disabled={savingPdf} className="bg-[#2e2e2e] text-white hover:bg-black">
                {savingPdf ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Enregistrer
              </Button>
            </div>
            <div className="bg-white border border-gray-100 p-6 space-y-6">
              <div>
                <Label htmlFor="pdf-url" className="text-sm font-medium">URL du PDF des services</Label>
                <p className="text-xs text-gray-500 mt-1 mb-3">Ce PDF s&apos;affichera quand les visiteurs cliquent sur &quot;EN SAVOIR PLUS&quot; dans les sections de services</p>
                <div className="flex gap-3">
                  <Input id="pdf-url" value={servicesPdfUrl} onChange={(e) => setServicesPdfUrl(e.target.value)} placeholder="https://example.com/services.pdf" className="flex-1" />
                  {servicesPdfUrl && (
                    <a href={servicesPdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2"><Eye className="w-4 h-4" />Voir</Button>
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {servicesPdfUrl ? (
                  <><CheckCircle2 className="w-5 h-5 text-green-600" /><span className="text-sm text-green-700">PDF configuré</span></>
                ) : (
                  <><AlertCircle className="w-5 h-5 text-yellow-600" /><span className="text-sm text-yellow-700">Aucun PDF configuré — les boutons redirigeront vers la page contact</span></>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ——— Sectors Tab ——— */}
        {activeTab === 'sectors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#2e2e2e]">Secteurs géographiques</h2>
                <p className="text-gray-600 mt-1">Gérez les pages SEO par secteur</p>
              </div>
              <Button onClick={() => openSectorModal()} className="bg-[#2e2e2e] text-white hover:bg-black">
                <Plus className="w-4 h-4 mr-2" /> Nouveau secteur
              </Button>
            </div>
            {loadingSectors ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : (
              <div className="bg-white border border-gray-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ordre</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Slug (URL)</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectors.map((sector) => (
                      <TableRow key={sector.id}>
                        <TableCell className="font-mono text-sm">{sector.order}</TableCell>
                        <TableCell className="font-medium">{sector.city_fr}</TableCell>
                        <TableCell className="text-sm text-gray-500 font-mono">/{sector.slug}</TableCell>
                        <TableCell>
                          <Badge variant={sector.is_active ? 'default' : 'secondary'} className={sector.is_active ? 'bg-green-100 text-green-800' : ''}>
                            {sector.is_active ? 'Actif' : 'Masqué'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toggleSectorActive(sector)}>
                              {sector.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openSectorModal(sector)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteSector(sector.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sectors.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-400">Aucun secteur. Cliquez sur &quot;Nouveau secteur&quot; pour en créer un.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* ——— Blog Tab ——— */}
        {activeTab === 'blog' && <BlogTab />}
      </main>

      {/* ——— Sector Modal ——— */}
      <Dialog open={showSectorModal} onOpenChange={setShowSectorModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingSector ? `Modifier : ${editingSector.city_fr}` : 'Nouveau secteur'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Slug (URL) *</Label>
                <Input value={sectorForm.slug} onChange={(e) => setSectorForm({ ...sectorForm, slug: e.target.value })} placeholder="conciergerie-porto-vecchio" disabled={!!editingSector} />
                <p className="text-xs text-gray-400 mt-1">cosycasa.fr/{sectorForm.slug || '...'}</p>
              </div>
              <div>
                <Label>Ordre d&apos;affichage</Label>
                <Input type="number" value={sectorForm.order} onChange={(e) => setSectorForm({ ...sectorForm, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Nom de la ville</Label>
              <div className="grid grid-cols-4 gap-3">
                <Input value={sectorForm.city_fr} onChange={(e) => setSectorForm({ ...sectorForm, city_fr: e.target.value })} placeholder="FR: Porto-Vecchio" />
                <Input value={sectorForm.city_en} onChange={(e) => setSectorForm({ ...sectorForm, city_en: e.target.value })} placeholder="EN" />
                <Input value={sectorForm.city_es} onChange={(e) => setSectorForm({ ...sectorForm, city_es: e.target.value })} placeholder="ES" />
                <Input value={sectorForm.city_it} onChange={(e) => setSectorForm({ ...sectorForm, city_it: e.target.value })} placeholder="IT" />
              </div>
            </div>
            <div>
              <Label>Image Hero (URL)</Label>
              <Input value={sectorForm.hero_image} onChange={(e) => setSectorForm({ ...sectorForm, hero_image: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>Meta Description (SEO)</Label>
              <Textarea value={sectorForm.meta_description_fr} onChange={(e) => setSectorForm({ ...sectorForm, meta_description_fr: e.target.value })} placeholder="Description FR pour Google..." rows={2} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Introduction (FR)</Label>
              <Textarea value={sectorForm.intro_fr} onChange={(e) => setSectorForm({ ...sectorForm, intro_fr: e.target.value })} placeholder="Paragraphe d'introduction..." rows={3} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Introduction 2 (FR)</Label>
              <Textarea value={sectorForm.intro2_fr} onChange={(e) => setSectorForm({ ...sectorForm, intro2_fr: e.target.value })} placeholder="Second paragraphe..." rows={3} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Offres ({sectorForm.offers.length})</Label>
                <Button variant="outline" size="sm" onClick={() => setSectorForm({ ...sectorForm, offers: [...sectorForm.offers, { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' }] })}>
                  <Plus className="w-3 h-3 mr-1" /> Ajouter
                </Button>
              </div>
              <div className="space-y-4">
                {sectorForm.offers.map((offer, idx) => (
                  <div key={idx} className="border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-gray-400">Offre {idx + 1}</span>
                      <Button variant="ghost" size="sm" className="text-red-400 h-6" onClick={() => setSectorForm({ ...sectorForm, offers: sectorForm.offers.filter((_, i) => i !== idx) })}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input value={offer.title_fr || ''} onChange={(e) => { const offers = [...sectorForm.offers]; offers[idx] = { ...offers[idx], title_fr: e.target.value }; setSectorForm({ ...sectorForm, offers }); }} placeholder="Titre FR" />
                    <Textarea value={offer.desc_fr || ''} onChange={(e) => { const offers = [...sectorForm.offers]; offers[idx] = { ...offers[idx], desc_fr: e.target.value }; setSectorForm({ ...sectorForm, offers }); }} placeholder="Description FR" rows={2} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Avantages ({sectorForm.advantages.length})</Label>
                <Button variant="outline" size="sm" onClick={() => setSectorForm({ ...sectorForm, advantages: [...sectorForm.advantages, { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' }] })}>
                  <Plus className="w-3 h-3 mr-1" /> Ajouter
                </Button>
              </div>
              <div className="space-y-4">
                {sectorForm.advantages.map((adv, idx) => (
                  <div key={idx} className="border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-gray-400">Avantage {idx + 1}</span>
                      <Button variant="ghost" size="sm" className="text-red-400 h-6" onClick={() => setSectorForm({ ...sectorForm, advantages: sectorForm.advantages.filter((_, i) => i !== idx) })}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input value={adv.title_fr || ''} onChange={(e) => { const advantages = [...sectorForm.advantages]; advantages[idx] = { ...advantages[idx], title_fr: e.target.value }; setSectorForm({ ...sectorForm, advantages }); }} placeholder="Titre FR" />
                    <Textarea value={adv.desc_fr || ''} onChange={(e) => { const advantages = [...sectorForm.advantages]; advantages[idx] = { ...advantages[idx], desc_fr: e.target.value }; setSectorForm({ ...sectorForm, advantages }); }} placeholder="Description FR" rows={2} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={sectorForm.is_active} onCheckedChange={(checked) => setSectorForm({ ...sectorForm, is_active: checked })} />
              <Label>Secteur visible sur le site</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSectorModal(false)}>Annuler</Button>
              <Button onClick={saveSector} className="bg-[#2e2e2e] text-white hover:bg-black">
                <Save className="w-4 h-4 mr-2" /> {editingSector ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ——— Property Modal ——— */}
      <Dialog open={showPropertyModal} onOpenChange={setShowPropertyModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingProperty ? 'Modifier la propriété' : 'Nouvelle propriété'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Nom de la propriété *</Label>
                <Input value={propertyForm.name} onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })} placeholder="Villa Mare Vista" />
              </div>
              <div>
                <Label>ID Beds24 (optionnel)</Label>
                <Input value={propertyForm.beds24_id} onChange={(e) => setPropertyForm({ ...propertyForm, beds24_id: e.target.value })} placeholder="Laisser vide si non connecté" />
              </div>
              <div>
                <Label>Ville *</Label>
                <Input value={propertyForm.city} onChange={(e) => setPropertyForm({ ...propertyForm, city: e.target.value })} placeholder="Porto-Vecchio" />
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select value={propertyForm.category} onValueChange={(value) => setPropertyForm({ ...propertyForm, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vue_mer">Vue Mer</SelectItem>
                    <SelectItem value="plage_a_pieds">Plage à Pieds</SelectItem>
                    <SelectItem value="pieds_dans_eau">Pieds dans l&apos;Eau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prix à partir de (€/nuit)</Label>
                <Input type="number" value={propertyForm.price_from} onChange={(e) => setPropertyForm({ ...propertyForm, price_from: e.target.value })} placeholder="350" />
              </div>
              <div>
                <Label>Voyageurs max</Label>
                <Input type="number" value={propertyForm.max_guests} onChange={(e) => setPropertyForm({ ...propertyForm, max_guests: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label>Chambres</Label>
                <Input type="number" value={propertyForm.bedrooms} onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label>Salles de bain</Label>
                <Input type="number" value={propertyForm.bathrooms} onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: parseInt(e.target.value) })} />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={propertyForm.description_fr} onChange={(e) => setPropertyForm({ ...propertyForm, description_fr: e.target.value })} placeholder="Description de la propriété..." rows={4} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={propertyForm.is_showcase} onCheckedChange={(checked) => setPropertyForm({ ...propertyForm, is_showcase: checked })} />
                <Label>Propriété vitrine (pas de réservation en ligne)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={propertyForm.is_active} onCheckedChange={(checked) => setPropertyForm({ ...propertyForm, is_active: checked })} />
                <Label>Visible sur le site</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPropertyModal(false)}>Annuler</Button>
              <Button onClick={saveProperty} className="bg-[#2e2e2e] text-white hover:bg-black">
                <Save className="w-4 h-4 mr-2" />{editingProperty ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ——— Images Modal ——— */}
      <Dialog open={showImagesModal} onOpenChange={setShowImagesModal}>
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-serif text-2xl">Images : {selectedPropertyForImages?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
            <p className="text-sm text-gray-500">Uploadez vos images ou collez une URL Cloudinary/Unsplash.</p>
            {imageUrls.map((url, index) => (
              <div key={index} className="space-y-2 border border-gray-100 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-5 shrink-0">{index + 1}.</span>
                  <Input
                    value={url}
                    onChange={(e) => { const n = [...imageUrls]; n[index] = e.target.value; setImageUrls(n); }}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 text-sm"
                  />
                  <label className="cursor-pointer shrink-0" title="Uploader une image">
                    <div className="h-9 w-9 flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors">
                      {uploadingImageIndex === index
                        ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        : <Upload className="w-4 h-4 text-gray-500" />}
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploadingImageIndex !== null}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePropertyImageUpload(index, f); e.target.value = ''; }}
                    />
                  </label>
                  <Button variant="ghost" size="icon" onClick={() => { const n = imageUrls.filter((_, i) => i !== index); setImageUrls(n.length ? n : ['']); }} className="text-red-500 shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {url.trim() && (
                  <div className="ml-5 h-24 bg-gray-100 overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={() => setImageUrls([...imageUrls, ''])} className="w-full">
              <Plus className="w-4 h-4 mr-2" />Ajouter une image
            </Button>
          </div>
          <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t bg-white">
            <Button variant="outline" onClick={() => setShowImagesModal(false)}>Annuler</Button>
            <Button onClick={saveImages} className="bg-[#2e2e2e] text-white hover:bg-black">
              <Check className="w-4 h-4 mr-2" />Enregistrer les images
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
