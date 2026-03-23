import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Image,
  RefreshCw,
  Save,
  X,
  Check,
  Lock,
  LogOut,
  Link as LinkIcon,
  LayoutDashboard,
  ImageIcon,
  Home,
  Upload,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getProperties, getSiteImages, updateSiteImages, uploadImage, getAdminProperties, getSyncStatus, triggerSync, adminLogin, getServicesPdf, updateServicesPdf } from '@/lib/api';
import BlogTab from '@/components/admin/BlogTab';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Site image configuration - organized by page
const SITE_IMAGE_PAGES = {
  home: {
    label: 'Accueil',
    images: {
      home_hero: {
        label: "Image d'accueil (Hero)",
        description: 'Grande image de fond sur la page d\'accueil',
      },
      home_category_vue_mer: {
        label: 'Catégorie Vue Mer',
        description: 'Image de la catégorie Vue Mer',
      },
      home_category_plage_a_pieds: {
        label: 'Catégorie Plage à Pieds',
        description: 'Image de la catégorie Plage à Pieds',
      },
      home_category_pieds_dans_eau: {
        label: 'Catégorie Pieds dans l\'Eau',
        description: 'Image de la catégorie Pieds dans l\'Eau',
      },
      home_concept: {
        label: 'Image Notre Concept',
        description: 'Photo d\'intérieur pour la section concept',
      },
      home_cta: {
        label: 'Fond section CTA',
        description: 'Image de fond pour l\'appel à l\'action',
      },
    },
  },
  services: {
    label: 'Services',
    images: {
      services_hero: {
        label: 'Image Hero Services',
        description: 'Grande image en haut de la page Services',
      },
      services_lifestyle: {
        label: 'Image Lifestyle',
        description: 'Photo lifestyle sur le côté droit',
      },
      services_intendance: {
        label: 'Image Intendance',
        description: 'Photo pour la section Intendance & Services',
      },
      services_experiences: {
        label: 'Image Expériences',
        description: 'Photo pour la section Expériences & Loisirs',
      },
    },
  },
  contact: {
    label: 'Contact',
    images: {
      contact_hero: {
        label: 'Image Hero Contact',
        description: 'Grande image de fond page Contact',
      },
      contact_page: {
        label: 'Image principale Contact',
        description: 'Photo à gauche du formulaire de contact',
      },
    },
  },
  esprit: {
    label: 'Esprit',
    images: {
      esprit_julie: {
        label: 'Photo Julie',
        description: 'Grande photo de Julie (format portrait, noir et blanc recommandé)',
      },
      esprit_bastien: {
        label: 'Photo Bastien',
        description: 'Petite photo de Bastien (format portrait, noir et blanc recommandé)',
      },
    },
  },
  proprietaire: {
    label: 'Propriétaires',
    images: {
      proprietaire_hero: {
        label: 'Image Hero',
        description: 'Grande image de fond en haut de la page (villa de luxe recommandée)',
      },
      proprietaire_locative: {
        label: 'Image Intendance Locative',
        description: 'Photo pour la section intendance locative (format carré)',
      },
      proprietaire_propriete: {
        label: 'Image Intendance Propriété',
        description: 'Photo pour la section intendance propriété (format carré)',
      },
    },
  },
  properties: {
    label: 'Propriétés',
    images: {
      properties_hero: {
        label: 'Image Hero Propriétés',
        description: 'Grande image en haut de la page Propriétés',
      },
    },
  },
};

const AdminPage = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('properties');
  const [activeImagePage, setActiveImagePage] = useState('home');
  
  // Site images state
  const [siteImages, setSiteImages] = useState({});
  const [loadingImages, setLoadingImages] = useState(false);
  const [savingImages, setSavingImages] = useState(false);
  
  // Services PDF state
  const [servicesPdfUrl, setServicesPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);
  
  // Sync status
  const [syncStatus, setSyncStatus] = useState(null);
  
  // Modal states
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [selectedPropertyForImages, setSelectedPropertyForImages] = useState(null);
  
  // Upload states
  const [uploadingKey, setUploadingKey] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);
  
  // Sectors state
  const [sectors, setSectors] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [sectorForm, setSectorForm] = useState({
    slug: '', city_fr: '', city_en: '', city_es: '', city_it: '',
    meta_description_fr: '', meta_description_en: '',
    intro_fr: '', intro_en: '', intro_es: '', intro_it: '',
    intro2_fr: '', intro2_en: '', intro2_es: '', intro2_it: '',
    offers: [], advantages: [], hero_image: '', is_active: true, order: 0
  });
  
  // Form state
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    beds24_id: '',
    city: '',
    category: 'vue_mer',
    max_guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    price_from: '',
    description_fr: '',
    is_showcase: false,
    is_active: true,
  });
  
  const [imageUrls, setImageUrls] = useState(['']);

  // Load sync status
  const loadSyncStatus = async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  // Check session storage for auth
  useEffect(() => {
    const auth = sessionStorage.getItem('orso_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load properties
  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
      loadSiteImages();
      loadServicesPdf();
      loadSectors();
    }
  }, [isAuthenticated]);

  const loadSectors = async () => {
    setLoadingSectors(true);
    try {
      const res = await fetch(`${API_URL}/sectors?include_hidden=true`);
      if (res.ok) {
        const data = await res.json();
        setSectors(data);
      }
    } catch (error) {
      console.error('Failed to load sectors:', error);
    } finally {
      setLoadingSectors(false);
    }
  };

  const saveSector = async () => {
    try {
      const url = editingSector ? `${API_URL}/sectors/${editingSector.id}` : `${API_URL}/sectors`;
      const method = editingSector ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectorForm)
      });
      if (res.ok) {
        toast.success(editingSector ? 'Secteur mis à jour' : 'Secteur créé');
        setShowSectorModal(false);
        setEditingSector(null);
        loadSectors();
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const deleteSector = async (sectorId) => {
    if (!window.confirm('Supprimer ce secteur ?')) return;
    try {
      const res = await fetch(`${API_URL}/sectors/${sectorId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Secteur supprimé');
        loadSectors();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleSectorActive = async (sector) => {
    try {
      const updated = { ...sector, is_active: !sector.is_active };
      delete updated.id;
      delete updated.created_at;
      delete updated.updated_at;
      const res = await fetch(`${API_URL}/sectors/${sector.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        toast.success(sector.is_active ? 'Secteur masqué' : 'Secteur affiché');
        loadSectors();
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const openSectorModal = (sector = null) => {
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
        hero_image: sector.hero_image || '', is_active: sector.is_active ?? true, order: sector.order || 0
      });
    } else {
      setEditingSector(null);
      setSectorForm({
        slug: '', city_fr: '', city_en: '', city_es: '', city_it: '',
        meta_description_fr: '', meta_description_en: '',
        intro_fr: '', intro_en: '', intro_es: '', intro_it: '',
        intro2_fr: '', intro2_en: '', intro2_es: '', intro2_it: '',
        offers: [
          { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' },
          { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' },
          { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' },
          { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' }
        ],
        advantages: [
          { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' },
          { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' },
          { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' }
        ],
        hero_image: '', is_active: true, order: sectors.length
      });
    }
    setShowSectorModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    
    try {
      await adminLogin(password);
      setIsAuthenticated(true);
      sessionStorage.setItem('orso_admin_auth', 'true');
      toast.success('Connexion réussie');
    } catch (error) {
      setLoginError('Mot de passe incorrect');
      toast.error('Mot de passe incorrect');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('orso_admin_auth');
  };

  const loadProperties = async () => {
    setLoading(true);
    try {
      // Use admin endpoint to get all properties including hidden ones
      const data = await getAdminProperties();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadSiteImages = async () => {
    setLoadingImages(true);
    try {
      const data = await getSiteImages();
      setSiteImages(data.images || {});
    } catch (error) {
      console.error('Failed to load site images:', error);
      toast.error('Erreur de chargement des images');
    } finally {
      setLoadingImages(false);
    }
  };

  const loadServicesPdf = async () => {
    setLoadingPdf(true);
    try {
      const data = await getServicesPdf();
      setServicesPdfUrl(data.services_pdf_url || '');
    } catch (error) {
      console.error('Failed to load services PDF:', error);
    } finally {
      setLoadingPdf(false);
    }
  };

  const saveServicesPdf = async () => {
    setSavingPdf(true);
    try {
      await updateServicesPdf(servicesPdfUrl);
      toast.success('Lien PDF enregistré');
    } catch (error) {
      console.error('Failed to save services PDF:', error);
      toast.error('Erreur lors de la sauvegarde du PDF');
    } finally {
      setSavingPdf(false);
    }
  };

  // Load sync status on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadSyncStatus();
      // Refresh sync status every minute
      const interval = setInterval(loadSyncStatus, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleSiteImageChange = (key, value) => {
    setSiteImages(prev => ({ ...prev, [key]: value }));
  };

  const saveSiteImages = async () => {
    setSavingImages(true);
    try {
      await updateSiteImages(siteImages);
      toast.success('Images du site enregistrées');
    } catch (error) {
      console.error('Failed to save site images:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSavingImages(false);
    }
  };

  // Image upload handlers
  const handleImageUpload = async (key, file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.');
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Fichier trop volumineux. Maximum 10MB.');
      return;
    }
    
    setUploadingKey(key);
    try {
      const result = await uploadImage(file);
      if (result.success && result.url) {
        handleSiteImageChange(key, result.url);
        toast.success('Image téléchargée avec succès');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleDragOver = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverKey(key);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverKey(null);
  };

  const handleDrop = async (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverKey(null);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleImageUpload(key, files[0]);
    }
  };

  const handleFileInputChange = async (e, key) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(key, file);
    }
    // Reset input
    e.target.value = '';
  };

  const syncBeds24 = async () => {
    setSyncing(true);
    try {
      const response = await fetch(`${API_URL}/sync/beds24`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`${data.synced} nouvelles propriétés, ${data.updated} mises à jour`);
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur de synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const openNewProperty = () => {
    setEditingProperty(null);
    setPropertyForm({
      name: '',
      beds24_id: '',
      city: '',
      category: 'vue_mer',
      max_guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      price_from: '',
      description_fr: '',
      is_showcase: false,
      is_active: true,
    });
    setShowPropertyModal(true);
  };

  const openEditProperty = (property) => {
    setEditingProperty(property);
    setPropertyForm({
      name: property.name,
      beds24_id: property.beds24_id || '',
      city: property.city,
      category: property.category,
      max_guests: property.max_guests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      price_from: property.price_from || '',
      description_fr: property.description?.fr || '',
      is_showcase: property.is_showcase,
      is_active: property.is_active,
    });
    setShowPropertyModal(true);
  };

  const saveProperty = async () => {
    try {
      const slug = propertyForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();
      
      const propertyData = {
        name: propertyForm.name,
        slug: slug,
        beds24_id: propertyForm.beds24_id || null,
        city: propertyForm.city,
        category: propertyForm.category,
        max_guests: parseInt(propertyForm.max_guests),
        bedrooms: parseInt(propertyForm.bedrooms),
        bathrooms: parseInt(propertyForm.bathrooms),
        price_from: propertyForm.price_from ? parseFloat(propertyForm.price_from) : null,
        description: {
          fr: propertyForm.description_fr,
          en: propertyForm.description_fr,
          es: propertyForm.description_fr,
          it: propertyForm.description_fr,
        },
        short_description: {
          fr: propertyForm.description_fr.slice(0, 200),
          en: propertyForm.description_fr.slice(0, 200),
          es: propertyForm.description_fr.slice(0, 200),
          it: propertyForm.description_fr.slice(0, 200),
        },
        location: propertyForm.city,
        is_showcase: propertyForm.is_showcase,
        is_active: propertyForm.is_active,
        amenities: [],
        images: editingProperty?.images || [],
      };

      let response;
      if (editingProperty) {
        // Update existing
        response = await fetch(`${API_URL}/properties/${editingProperty.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData),
        });
      } else {
        // Create new
        response = await fetch(`${API_URL}/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData),
        });
      }

      if (response.ok) {
        toast.success(editingProperty ? 'Propriété mise à jour' : 'Propriété créée');
        setShowPropertyModal(false);
        loadProperties();
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const toggleVisibility = async (property) => {
    try {
      const response = await fetch(`${API_URL}/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !property.is_active }),
      });

      if (response.ok) {
        toast.success(property.is_active ? 'Propriété masquée' : 'Propriété visible');
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const updateCategory = async (property, category) => {
    try {
      const response = await fetch(`${API_URL}/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });

      if (response.ok) {
        toast.success('Catégorie mise à jour');
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const openImagesModal = (property) => {
    setSelectedPropertyForImages(property);
    setImageUrls(property.images?.length > 0 ? property.images : ['']);
    setShowImagesModal(true);
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls.length > 0 ? newUrls : ['']);
  };

  const saveImages = async () => {
    try {
      const validUrls = imageUrls.filter(url => url.trim() !== '');
      
      const response = await fetch(`${API_URL}/properties/${selectedPropertyForImages.id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validUrls),
      });

      if (response.ok) {
        toast.success(`${validUrls.length} image(s) enregistrée(s)`);
        setShowImagesModal(false);
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des images');
    }
  };

  const deleteProperty = async (property) => {
    if (!window.confirm(`Supprimer "${property.name}" ?`)) return;
    
    try {
      const response = await fetch(`${API_URL}/properties/${property.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Propriété supprimée');
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      vue_mer: 'Vue Mer',
      plage_a_pieds: 'Plage à Pieds',
      pieds_dans_eau: "Pieds dans l'Eau",
    };
    return labels[cat] || cat;
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-orso-surface flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl mb-2">Cosy Casa</h1>
            <p className="text-gray-500 text-sm uppercase tracking-widest">Administration</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="password" className="orso-caption mb-2 block">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  className={`pl-10 ${loginError ? 'border-red-500' : ''}`}
                  placeholder="Entrez le mot de passe"
                  data-testid="admin-password"
                  disabled={loggingIn}
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-sm mt-2">{loginError}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="orso-btn-primary w-full" 
              data-testid="admin-login-btn"
              disabled={loggingIn}
            >
              {loggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Connexion'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-orso-surface" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl">Cosy Casa</h1>
            <p className="text-xs uppercase tracking-widest text-gray-500">Administration</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={syncBeds24}
              disabled={syncing}
              data-testid="sync-beds24-btn"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sync...' : 'Sync Beds24'}
            </Button>
            
            {/* Auto-sync status indicator */}
            {syncStatus && (
              <div className="flex items-center gap-2 text-xs">
                {syncStatus.scheduler_running ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Auto-sync actif
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    Auto-sync inactif
                  </span>
                )}
              </div>
            )}
            
            <Button
              onClick={openNewProperty}
              size="sm"
              className="bg-[#2e2e2e] text-white hover:bg-black"
              data-testid="add-property-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle propriété
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('properties')}
              className={`py-4 text-sm uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'properties'
                  ? 'border-[#2e2e2e] text-[#2e2e2e]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              data-testid="tab-properties"
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Propriétés
            </button>
            <button
              onClick={() => setActiveTab('site-images')}
              className={`py-4 text-sm uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'site-images'
                  ? 'border-[#2e2e2e] text-[#2e2e2e]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              data-testid="tab-site-images"
            >
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Images du site
            </button>
            <button
              onClick={() => setActiveTab('pdf-services')}
              className={`py-4 text-sm uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'pdf-services'
                  ? 'border-[#2e2e2e] text-[#2e2e2e]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              data-testid="tab-pdf-services"
            >
              <FileText className="w-4 h-4 inline mr-2" />
              PDF Services
            </button>
            <button
              onClick={() => setActiveTab('sectors')}
              className={`py-4 text-sm uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'sectors'
                  ? 'border-[#2e2e2e] text-[#2e2e2e]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              data-testid="tab-sectors"
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Secteurs
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`py-4 text-sm uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'blog'
                  ? 'border-[#2e2e2e] text-[#2e2e2e]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
              data-testid="tab-blog"
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Blog
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <>
            {/* Sync Status Banner */}
            {syncStatus?.last_sync && (
              <div className={`mb-6 p-4 border rounded-lg flex items-center justify-between ${
                syncStatus.last_sync.status === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : syncStatus.last_sync.status === 'error'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`} data-testid="sync-status-banner">
                <div className="flex items-center gap-3">
                  {syncStatus.last_sync.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : syncStatus.last_sync.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {syncStatus.scheduler_running ? (
                        <>Synchronisation automatique <span className="text-green-600">activée</span> (toutes les {syncStatus.sync_interval_hours}h)</>
                      ) : (
                        <>Synchronisation automatique <span className="text-gray-500">désactivée</span></>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Dernière sync: {new Date(syncStatus.last_sync.last_sync).toLocaleString('fr-FR')}
                      {syncStatus.last_sync.message && ` — ${syncStatus.last_sync.message}`}
                    </p>
                    {syncStatus.next_sync && (
                      <p className="text-xs text-gray-500">
                        Prochaine sync: {new Date(syncStatus.next_sync).toLocaleString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-6 border border-gray-100">
                <p className="text-3xl font-serif">{properties.length}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">Total propriétés</p>
              </div>
              <div className="bg-white p-6 border border-gray-100">
                <p className="text-3xl font-serif">{properties.filter(p => p.beds24_id).length}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">Connectées Beds24</p>
              </div>
              <div className="bg-white p-6 border border-gray-100">
                <p className="text-3xl font-serif text-green-600">{properties.filter(p => p.is_active).length}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">Visibles</p>
              </div>
              <div className="bg-white p-6 border border-gray-100">
                <p className="text-3xl font-serif text-gray-400">{properties.filter(p => !p.is_active).length}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">Masquées</p>
              </div>
              <div className="bg-white p-6 border border-gray-100">
                <p className="text-3xl font-serif">{properties.filter(p => p.is_showcase).length}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500">Vitrines</p>
              </div>
            </div>

            {/* Properties Table */}
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
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    Aucune propriété
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow 
                    key={property.id} 
                    className={!property.is_active ? 'bg-gray-50' : ''}
                    data-testid={`property-row-${property.id}`}
                  >
                    <TableCell>
                      <div className={`w-10 h-10 bg-gray-100 overflow-hidden ${!property.is_active ? 'opacity-50' : ''}`}>
                        {property.images?.[0] ? (
                          <img
                            src={property.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={!property.is_active ? 'opacity-60' : ''}>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{property.name}</p>
                          {!property.is_active && (
                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Masqué
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {property.max_guests} pers · {property.bedrooms} ch · {property.bathrooms} sdb
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className={!property.is_active ? 'opacity-60' : ''}>{property.city}</TableCell>
                    <TableCell>
                      <Select
                        value={property.category}
                        onValueChange={(value) => updateCategory(property, value)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vue_mer">Vue Mer</SelectItem>
                          <SelectItem value="plage_a_pieds">Plage à Pieds</SelectItem>
                          <SelectItem value="pieds_dans_eau">Pieds dans l'Eau</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {property.price_from ? `${property.price_from}€` : '-'}
                    </TableCell>
                    <TableCell>
                      {property.beds24_id ? (
                        <Badge variant="outline" className="text-xs">
                          <LinkIcon className="w-3 h-3 mr-1" />
                          {property.beds24_id}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">Non connecté</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={property.is_active}
                          onCheckedChange={() => toggleVisibility(property)}
                        />
                        {property.is_showcase && (
                          <Badge variant="secondary" className="text-xs">Vitrine</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openImagesModal(property)}
                          title="Gérer les images"
                        >
                          <Image className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditProperty(property)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProperty(property)}
                          title="Supprimer"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
          </>
        )}

        {/* Site Images Tab */}
        {activeTab === 'site-images' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl">Images du site</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Modifiez les images de chaque page de votre site
                </p>
              </div>
              <Button
                onClick={saveSiteImages}
                disabled={savingImages}
                className="bg-[#2e2e2e] text-white hover:bg-black"
                data-testid="save-site-images-btn"
              >
                <Save className={`w-4 h-4 mr-2 ${savingImages ? 'animate-spin' : ''}`} />
                {savingImages ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>

            {/* Page Navigation */}
            <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4">
              {Object.entries(SITE_IMAGE_PAGES).map(([pageKey, pageConfig]) => (
                <Button
                  key={pageKey}
                  variant={activeImagePage === pageKey ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveImagePage(pageKey)}
                  className={activeImagePage === pageKey ? 'bg-[#2e2e2e] text-white' : ''}
                  data-testid={`image-page-tab-${pageKey}`}
                >
                  {pageConfig.label}
                </Button>
              ))}
            </div>

            {loadingImages ? (
              <div className="text-center py-12 text-gray-500">Chargement...</div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <h3 className="font-medium text-lg">
                    Page: {SITE_IMAGE_PAGES[activeImagePage]?.label}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {Object.keys(SITE_IMAGE_PAGES[activeImagePage]?.images || {}).length} image(s) configurables
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(SITE_IMAGE_PAGES[activeImagePage]?.images || {}).map(([key, config]) => (
                    <div
                      key={key}
                      className="bg-white border border-gray-100 p-6 space-y-4"
                      data-testid={`site-image-${key}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label className="font-medium">{config.label}</Label>
                        </div>
                        <p className="text-xs text-gray-500">{config.description}</p>
                      </div>
                      
                      {/* Drag & Drop Zone + Image Preview */}
                      <div
                        className={`aspect-video bg-gray-100 overflow-hidden relative border-2 border-dashed transition-colors cursor-pointer ${
                          dragOverKey === key
                            ? 'border-[#2e2e2e] bg-gray-200'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onDragOver={(e) => handleDragOver(e, key)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, key)}
                        onClick={() => document.getElementById(`file-input-${key}`)?.click()}
                      >
                        {uploadingKey === key ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-sm">Téléchargement vers Cloudinary...</span>
                          </div>
                        ) : siteImages[key] ? (
                          <>
                            <img
                              src={siteImages[key]}
                              alt={config.label}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                                e.target.className = 'hidden';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                              <div className="text-white text-center">
                                <Upload className="w-6 h-6 mx-auto mb-1" />
                                <span className="text-sm">Glissez une image ou cliquez</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">Glissez une image ici</span>
                            <span className="text-xs">ou cliquez pour parcourir</span>
                          </div>
                        )}
                        <input
                          id={`file-input-${key}`}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => handleFileInputChange(e, key)}
                        />
                      </div>
                      
                      {/* URL Input */}
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-500">URL de l'image</Label>
                        <Input
                          value={siteImages[key] || ''}
                          onChange={(e) => handleSiteImageChange(key, e.target.value)}
                          placeholder="URL générée automatiquement après upload"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="font-medium mb-3 text-green-900">Upload Cloudinary activé !</h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• <strong>Glissez-déposez</strong> vos images directement sur les zones ou cliquez pour parcourir</li>
                <li>• Les images sont automatiquement uploadées sur <strong>Cloudinary</strong> (stockage permanent)</li>
                <li>• Formats acceptés : JPG, PNG, WebP, GIF (max 10MB)</li>
                <li>• Vous pouvez aussi coller une URL externe si vous préférez</li>
                <li>• Cliquez sur <strong>"Enregistrer"</strong> après vos modifications</li>
              </ul>
            </div>
          </div>
        )}

        {/* PDF Services Tab */}
        {activeTab === 'pdf-services' && (
          <div className="space-y-8" data-testid="pdf-services-tab">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#2e2e2e]">PDF Services</h2>
                <p className="text-gray-600 mt-1">
                  Configurez le lien du PDF qui s'ouvrira quand les visiteurs cliquent sur "EN SAVOIR PLUS" dans la section services
                </p>
              </div>
              <Button
                onClick={saveServicesPdf}
                disabled={savingPdf}
                className="orso-btn-primary"
                data-testid="save-pdf-btn"
              >
                {savingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </div>

            <div className="bg-white border border-gray-100 p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pdf-url" className="text-sm font-medium">
                    URL du PDF des services
                  </Label>
                  <p className="text-xs text-gray-500 mt-1 mb-3">
                    Ce PDF s'affichera quand les visiteurs cliquent sur "EN SAVOIR PLUS" pour les deux sections de services (Intendance et Expériences)
                  </p>
                  <div className="flex gap-3">
                    <Input
                      id="pdf-url"
                      value={servicesPdfUrl}
                      onChange={(e) => setServicesPdfUrl(e.target.value)}
                      placeholder="https://example.com/services.pdf"
                      className="flex-1"
                      data-testid="pdf-url-input"
                    />
                    {servicesPdfUrl && (
                      <a href={servicesPdfUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Voir
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Comment ça marche ?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Collez l'URL d'un fichier PDF hébergé en ligne (Google Drive, Dropbox, votre serveur, etc.)</li>
                  <li>• Si aucun PDF n'est configuré, le bouton "EN SAVOIR PLUS" redirigera vers la page de contact</li>
                  <li>• Le PDF s'ouvrira dans un nouvel onglet du navigateur</li>
                </ul>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {servicesPdfUrl ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700">PDF configuré</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-700">Aucun PDF configuré - les boutons redirigeront vers la page contact</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sectors Tab */}
        {activeTab === 'sectors' && (
          <div className="space-y-6" data-testid="sectors-tab">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#2e2e2e]">Secteurs géographiques</h2>
                <p className="text-gray-600 mt-1">Gérez les pages SEO par secteur (apparaissent dans le menu "Secteurs")</p>
              </div>
              <Button onClick={() => openSectorModal()} className="orso-btn-primary" data-testid="add-sector-btn">
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
                          <Badge variant={sector.is_active ? "default" : "secondary"} className={sector.is_active ? "bg-green-100 text-green-800" : ""}>
                            {sector.is_active ? 'Actif' : 'Masqué'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost" size="sm"
                              onClick={() => toggleSectorActive(sector)}
                              data-testid={`toggle-sector-${sector.slug}`}
                            >
                              {sector.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              onClick={() => openSectorModal(sector)}
                              data-testid={`edit-sector-${sector.slug}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              onClick={() => deleteSector(sector.id)}
                              className="text-red-500 hover:text-red-700"
                              data-testid={`delete-sector-${sector.slug}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sectors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          Aucun secteur. Cliquez sur "Nouveau secteur" pour en créer un.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <BlogTab />
        )}
      </main>

      {/* Sector Modal */}
      <Dialog open={showSectorModal} onOpenChange={setShowSectorModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingSector ? `Modifier : ${editingSector.city_fr}` : 'Nouveau secteur'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Slug (URL) *</Label>
                <Input
                  value={sectorForm.slug}
                  onChange={(e) => setSectorForm({ ...sectorForm, slug: e.target.value })}
                  placeholder="conciergerie-porto-vecchio"
                  disabled={!!editingSector}
                  data-testid="sector-slug-input"
                />
                <p className="text-xs text-gray-400 mt-1">cosycasa.fr/{sectorForm.slug || '...'}</p>
              </div>
              <div>
                <Label>Ordre d'affichage</Label>
                <Input
                  type="number"
                  value={sectorForm.order}
                  onChange={(e) => setSectorForm({ ...sectorForm, order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* City Names */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Nom de la ville</Label>
              <div className="grid grid-cols-4 gap-3">
                <Input value={sectorForm.city_fr} onChange={(e) => setSectorForm({ ...sectorForm, city_fr: e.target.value })} placeholder="FR: Porto-Vecchio" data-testid="sector-city-fr" />
                <Input value={sectorForm.city_en} onChange={(e) => setSectorForm({ ...sectorForm, city_en: e.target.value })} placeholder="EN" />
                <Input value={sectorForm.city_es} onChange={(e) => setSectorForm({ ...sectorForm, city_es: e.target.value })} placeholder="ES" />
                <Input value={sectorForm.city_it} onChange={(e) => setSectorForm({ ...sectorForm, city_it: e.target.value })} placeholder="IT" />
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <Label>Image Hero (URL)</Label>
              <Input value={sectorForm.hero_image} onChange={(e) => setSectorForm({ ...sectorForm, hero_image: e.target.value })} placeholder="https://..." />
            </div>

            {/* Meta Description */}
            <div>
              <Label>Meta Description (SEO)</Label>
              <Textarea value={sectorForm.meta_description_fr} onChange={(e) => setSectorForm({ ...sectorForm, meta_description_fr: e.target.value })} placeholder="Description FR pour Google..." rows={2} />
            </div>

            {/* Intros */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Introduction (FR)</Label>
              <Textarea value={sectorForm.intro_fr} onChange={(e) => setSectorForm({ ...sectorForm, intro_fr: e.target.value })} placeholder="Paragraphe d'introduction..." rows={3} data-testid="sector-intro-fr" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Introduction 2 (FR)</Label>
              <Textarea value={sectorForm.intro2_fr} onChange={(e) => setSectorForm({ ...sectorForm, intro2_fr: e.target.value })} placeholder="Second paragraphe..." rows={3} />
            </div>

            {/* Offers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Offres ({sectorForm.offers.length})</Label>
                <Button variant="outline" size="sm" onClick={() => setSectorForm({ ...sectorForm, offers: [...sectorForm.offers, { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' }] })}>
                  <Plus className="w-3 h-3 mr-1" /> Ajouter
                </Button>
              </div>
              <div className="space-y-4">
                {sectorForm.offers.map((offer, idx) => (
                  <div key={idx} className="border border-gray-200 p-4 rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-gray-400">Offre {idx + 1}</span>
                      <Button variant="ghost" size="sm" className="text-red-400 h-6" onClick={() => setSectorForm({ ...sectorForm, offers: sectorForm.offers.filter((_, i) => i !== idx) })}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input value={offer.title_fr} onChange={(e) => { const offers = [...sectorForm.offers]; offers[idx] = { ...offers[idx], title_fr: e.target.value }; setSectorForm({ ...sectorForm, offers }); }} placeholder="Titre FR" />
                    <Textarea value={offer.desc_fr} onChange={(e) => { const offers = [...sectorForm.offers]; offers[idx] = { ...offers[idx], desc_fr: e.target.value }; setSectorForm({ ...sectorForm, offers }); }} placeholder="Description FR" rows={2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Advantages */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Avantages ({sectorForm.advantages.length})</Label>
                <Button variant="outline" size="sm" onClick={() => setSectorForm({ ...sectorForm, advantages: [...sectorForm.advantages, { title_fr: '', title_en: '', title_es: '', title_it: '', desc_fr: '', desc_en: '', desc_es: '', desc_it: '' }] })}>
                  <Plus className="w-3 h-3 mr-1" /> Ajouter
                </Button>
              </div>
              <div className="space-y-4">
                {sectorForm.advantages.map((adv, idx) => (
                  <div key={idx} className="border border-gray-200 p-4 rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-gray-400">Avantage {idx + 1}</span>
                      <Button variant="ghost" size="sm" className="text-red-400 h-6" onClick={() => setSectorForm({ ...sectorForm, advantages: sectorForm.advantages.filter((_, i) => i !== idx) })}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input value={adv.title_fr} onChange={(e) => { const advantages = [...sectorForm.advantages]; advantages[idx] = { ...advantages[idx], title_fr: e.target.value }; setSectorForm({ ...sectorForm, advantages }); }} placeholder="Titre FR" />
                    <Textarea value={adv.desc_fr} onChange={(e) => { const advantages = [...sectorForm.advantages]; advantages[idx] = { ...advantages[idx], desc_fr: e.target.value }; setSectorForm({ ...sectorForm, advantages }); }} placeholder="Description FR" rows={2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <Switch checked={sectorForm.is_active} onCheckedChange={(checked) => setSectorForm({ ...sectorForm, is_active: checked })} />
              <Label>Secteur visible sur le site</Label>
            </div>

            {/* Save */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSectorModal(false)}>Annuler</Button>
              <Button onClick={saveSector} className="orso-btn-primary" data-testid="save-sector-btn">
                <Save className="w-4 h-4 mr-2" /> {editingSector ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Property Modal */}
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
                <Input
                  value={propertyForm.name}
                  onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                  placeholder="Villa Mare Vista"
                  data-testid="property-name-input"
                />
              </div>
              
              <div>
                <Label>ID Beds24 (optionnel)</Label>
                <Input
                  value={propertyForm.beds24_id}
                  onChange={(e) => setPropertyForm({ ...propertyForm, beds24_id: e.target.value })}
                  placeholder="Laisser vide si non connecté"
                />
              </div>
              
              <div>
                <Label>Ville *</Label>
                <Input
                  value={propertyForm.city}
                  onChange={(e) => setPropertyForm({ ...propertyForm, city: e.target.value })}
                  placeholder="Porto-Vecchio"
                />
              </div>
              
              <div>
                <Label>Catégorie</Label>
                <Select
                  value={propertyForm.category}
                  onValueChange={(value) => setPropertyForm({ ...propertyForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vue_mer">Vue Mer</SelectItem>
                    <SelectItem value="plage_a_pieds">Plage à Pieds</SelectItem>
                    <SelectItem value="pieds_dans_eau">Pieds dans l'Eau</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Prix à partir de (€/nuit)</Label>
                <Input
                  type="number"
                  value={propertyForm.price_from}
                  onChange={(e) => setPropertyForm({ ...propertyForm, price_from: e.target.value })}
                  placeholder="350"
                />
              </div>
              
              <div>
                <Label>Voyageurs max</Label>
                <Input
                  type="number"
                  value={propertyForm.max_guests}
                  onChange={(e) => setPropertyForm({ ...propertyForm, max_guests: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Chambres</Label>
                <Input
                  type="number"
                  value={propertyForm.bedrooms}
                  onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Salles de bain</Label>
                <Input
                  type="number"
                  value={propertyForm.bathrooms}
                  onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                />
              </div>
              
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={propertyForm.description_fr}
                  onChange={(e) => setPropertyForm({ ...propertyForm, description_fr: e.target.value })}
                  placeholder="Description de la propriété..."
                  rows={4}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={propertyForm.is_showcase}
                    onCheckedChange={(checked) => setPropertyForm({ ...propertyForm, is_showcase: checked })}
                  />
                  <Label>Propriété vitrine (pas de réservation en ligne)</Label>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={propertyForm.is_active}
                    onCheckedChange={(checked) => setPropertyForm({ ...propertyForm, is_active: checked })}
                  />
                  <Label>Visible sur le site</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPropertyModal(false)}>
                Annuler
              </Button>
              <Button onClick={saveProperty} className="bg-[#2e2e2e] text-white hover:bg-black">
                <Save className="w-4 h-4 mr-2" />
                {editingProperty ? 'Enregistrer' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Images Modal */}
      <Dialog open={showImagesModal} onOpenChange={setShowImagesModal}>
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-serif text-2xl">
              Images: {selectedPropertyForImages?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
            <p className="text-sm text-gray-500">
              Ajoutez les URLs des images (hébergées sur Unsplash, votre serveur, etc.)
            </p>
            
            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-6">{index + 1}.</span>
                <Input
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImageUrl(index)}
                  className="text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" onClick={addImageUrl} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une image
            </Button>

            {/* Preview */}
            {imageUrls.some(url => url.trim()) && (
              <div className="grid grid-cols-4 gap-2 pt-4 border-t">
                {imageUrls.filter(url => url.trim()).map((url, i) => (
                  <div key={i} className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer fixe en bas */}
          <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t bg-white">
            <Button variant="outline" onClick={() => setShowImagesModal(false)}>
              Annuler
            </Button>
            <Button onClick={saveImages} className="bg-[#2e2e2e] text-white hover:bg-black">
              <Check className="w-4 h-4 mr-2" />
              Enregistrer les images
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
