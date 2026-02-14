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
import { getProperties, getSiteImages, updateSiteImages, uploadImage, getAdminProperties, getSyncStatus, triggerSync } from '@/lib/api';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Simple password protection - change this password!
const ADMIN_PASSWORD = 'orso2024';

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
    },
  },
  contact: {
    label: 'Contact',
    images: {
      contact_hero: {
        label: 'Image Hero Contact',
        description: 'Grande image de fond page Contact',
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
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('orso_admin_auth', 'true');
      toast.success('Connexion réussie');
    } else {
      toast.error('Mot de passe incorrect');
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
            <h1 className="font-serif text-3xl mb-2">ORSO RS</h1>
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Entrez le mot de passe"
                  data-testid="admin-password"
                />
              </div>
            </div>
            
            <Button type="submit" className="orso-btn-primary w-full" data-testid="admin-login-btn">
              Connexion
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
            <h1 className="font-serif text-2xl">ORSO RS</h1>
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
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <>
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
                            <span className="text-sm">Téléchargement...</span>
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
                      <div className="flex gap-2">
                        <Input
                          value={siteImages[key] || ''}
                          onChange={(e) => handleSiteImageChange(key, e.target.value)}
                          placeholder="https://example.com/image.jpg ou glissez une image"
                          className="text-sm flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gray-50 border border-gray-100 p-6">
              <h3 className="font-medium mb-3">Conseils pour les images</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Glissez-déposez</strong> vos images directement sur les zones ou cliquez pour parcourir</li>
                <li>• Formats acceptés : JPG, PNG, WebP, GIF (max 10MB)</li>
                <li>• Utilisez des images de haute qualité (min. 1920px de large pour les images héro)</li>
                <li>• Vous pouvez aussi coller une URL d'image externe (Unsplash, Cloudinary, etc.)</li>
                <li>• Les modifications seront visibles sur le site après avoir cliqué sur "Enregistrer"</li>
              </ul>
            </div>
          </div>
        )}
      </main>

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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Images: {selectedPropertyForImages?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
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

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowImagesModal(false)}>
                Annuler
              </Button>
              <Button onClick={saveImages} className="bg-[#2e2e2e] text-white hover:bg-black">
                <Check className="w-4 h-4 mr-2" />
                Enregistrer les images
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
