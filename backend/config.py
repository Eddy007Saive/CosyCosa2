import os
from pathlib import Path
import cloudinary
import cloudinary.uploader

ROOT_DIR = Path(__file__).parent

# Create uploads directory (for backward compatibility)
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

# Beds24 Configuration
BEDS24_API_URL = "https://api.beds24.com/v2"
BEDS24_TOKEN = os.environ.get('BEDS24_TOKEN', '')
BEDS24_REFRESH_TOKEN = os.environ.get('BEDS24_REFRESH_TOKEN', '')

# Sync Configuration
BEDS24_SYNC_ENABLED = os.environ.get('BEDS24_SYNC_ENABLED', 'true').lower() == 'true'
BEDS24_SYNC_INTERVAL_HOURS = int(os.environ.get('BEDS24_SYNC_INTERVAL_HOURS', '1'))

# Admin Configuration
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'orso2024')

# Brevo Configuration
BREVO_API_KEY = os.environ.get('BREVO_API_KEY', '')
BREVO_SENDER_EMAIL = os.environ.get('BREVO_SENDER_EMAIL', 'contact@gt-bnb.com')
BREVO_SENDER_NAME = os.environ.get('BREVO_SENDER_NAME', 'Cosy Casa')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'contact@cosycasa.fr')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')

# Default site images - organized by page
DEFAULT_SITE_IMAGES = {
    # Page d'accueil
    "home_hero": "https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1920&q=80",
    "home_category_vue_mer": "https://images.unsplash.com/photo-1744271688484-f0fa9dabf4b4?w=800",
    "home_category_plage_a_pieds": "https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=800",
    "home_category_pieds_dans_eau": "https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=800",
    "home_concept": "https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=800&q=80",
    "home_cta": "https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=1920&q=80",
    # Page Services
    "services_hero": "https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=1920&q=80",
    "services_lifestyle": "https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=800&q=80",
    "services_intendance": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "services_experiences": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    # Page Contact
    "contact_hero": "https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=1920&q=80",
    "contact_page": "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    # Page Propriétés
    "properties_hero": "https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1920&q=80",
}

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

FEATURE_LABELS = {
    'WIFI': 'WiFi', 'AIR_CONDITIONING': 'Climatisation', 'HEATING': 'Chauffage',
    'KITCHEN': 'Cuisine équipée', 'DISHWASHER': 'Lave-vaisselle', 'WASHER': 'Lave-linge',
    'DRYER': 'Sèche-linge', 'REFRIGERATOR': 'Réfrigérateur', 'FREEZER': 'Congélateur',
    'MICROWAVE': 'Micro-ondes', 'OVEN': 'Four', 'COFFEE_MAKER': 'Machine à café',
    'KETTLE': 'Bouilloire', 'TOASTER': 'Grille-pain', 'TV': 'Télévision',
    'POOL': 'Piscine', 'POOL_HEATED': 'Piscine chauffée', 'GARDEN': 'Jardin',
    'PARKING': 'Parking', 'PARKING_INCLUDED': 'Parking inclus', 'PARKING_POSSIBLE': 'Parking possible',
    'BALCONY': 'Balcon', 'DECK_PATIO_UNCOVERED': 'Terrasse', 'OUTDOOR_FURNITURE': 'Mobilier extérieur',
    'BEACH_FRONT': 'Front de mer', 'LINENS': 'Linge de maison', 'TOWELS': 'Serviettes',
    'HAIR_DRYER': 'Sèche-cheveux', 'IRON_BOARD': 'Fer à repasser', 'HANGERS': 'Cintres',
    'CLOSET': 'Penderie', 'SMOKE_DETECTOR': 'Détecteur de fumée', 'GAMES': 'Jeux',
    'HIGHCHAIR': 'Chaise haute', 'BED_CRIB': 'Lit bébé', 'PACK_N_PLAY_TRAVEL_CRIB': 'Lit parapluie',
    'PRIVATE_ENTRANCE': 'Entrée privée', 'FAN_PORTABLE': 'Ventilateur', 'WATER_HOT': 'Eau chaude',
    'PETS_NOT_ALLOWED': 'Animaux non admis', 'SMOKING_NOT_ALLOWED': 'Non-fumeur',
    'CLEANING_BEFORE_CHECKOUT': 'Ménage inclus', 'LONG_TERM_RENTERS': 'Location longue durée',
    'BATHROOM_FULL': 'Salle de bain complète', 'GLASSES_WINE': 'Verres à vin',
    'DISHES_UTENSILS': 'Vaisselle et ustensiles', 'BAKING_SHEET': 'Plaque de cuisson',
    'EXTRA_PILLOWS_BLANKETS': 'Oreillers et couvertures supplémentaires',
    'LUGGAGE_DROPOFF': 'Dépôt de bagages', 'CLOTHES_DRYINGRACK': 'Étendoir à linge',
    'VIEW_SEA': 'Vue mer', 'BEACH_ACCESS': 'Accès plage'
}
