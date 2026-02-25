from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import shutil
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
BREVO_SENDER_NAME = os.environ.get('BREVO_SENDER_NAME', 'ORSO Rental Selection')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'hello@conciergerie-cosycasa.fr')

# Create the main app
app = FastAPI(title="ORSO RS API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize scheduler
scheduler = AsyncIOScheduler()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== SITE SETTINGS ==============

class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site_settings"
    images: Dict[str, str] = {}
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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

@api_router.get("/settings/images")
async def get_site_images():
    """Get all site images"""
    settings = await db.site_settings.find_one({"id": "site_settings"}, {"_id": 0})
    if settings and settings.get("images"):
        # Merge with defaults (in case new image keys are added)
        images = {**DEFAULT_SITE_IMAGES, **settings["images"]}
        return {"images": images}
    return {"images": DEFAULT_SITE_IMAGES}

@api_router.put("/settings/images")
async def update_site_images(images: Dict[str, str]):
    """Update site images"""
    await db.site_settings.update_one(
        {"id": "site_settings"},
        {
            "$set": {
                "images": images,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    return {"success": True, "message": "Images updated"}

@api_router.put("/settings/images/{image_key}")
async def update_single_image(image_key: str, url: str = None):
    """Update a single site image"""
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    await db.site_settings.update_one(
        {"id": "site_settings"},
        {
            "$set": {
                f"images.{image_key}": url,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )
    return {"success": True, "message": f"Image {image_key} updated"}

# ============== FILE UPLOAD ==============

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@api_router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and return its URL"""
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB")
    
    # Generate unique filename
    unique_id = str(uuid.uuid4())[:8]
    safe_filename = f"{unique_id}{file_ext}"
    file_path = UPLOADS_DIR / safe_filename
    
    # Save file
    with open(file_path, 'wb') as f:
        f.write(content)
    
    # Return relative URL (frontend will prepend the base URL)
    image_url = f"/api/uploads/{safe_filename}"
    
    logger.info(f"Image uploaded: {safe_filename}")
    return {
        "success": True,
        "url": image_url,
        "filename": safe_filename
    }

@api_router.get("/uploads/{filename}")
async def get_uploaded_image(filename: str):
    """Serve uploaded images"""
    from fastapi.responses import FileResponse
    
    file_path = UPLOADS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Determine content type
    ext = Path(filename).suffix.lower()
    content_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
    }
    content_type = content_types.get(ext, 'application/octet-stream')
    
    return FileResponse(file_path, media_type=content_type)

# ============== MODELS ==============

class PropertyCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_en: str
    name_es: str
    name_it: str
    slug: str
    image: str
    description: Optional[str] = None

class PropertyAmenity(BaseModel):
    name: str
    icon: Optional[str] = None

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    beds24_id: Optional[str] = None
    beds24_room_id: Optional[str] = None  # Room type ID for booking
    name: str
    slug: str
    description: Dict[str, str]  # {fr, en, es, it}
    short_description: Dict[str, str]
    location: str
    city: str
    category: str  # vue_mer, plage_a_pieds, pieds_dans_eau
    images: List[str]
    max_guests: int
    bedrooms: int
    bathrooms: int
    amenities: List[str]
    feature_codes: Optional[List[str]] = []  # Beds24 feature codes
    price_from: Optional[float] = None
    currency: str = "EUR"
    is_showcase: bool = False  # True = vitrine only, no booking
    is_active: bool = True
    coordinates: Optional[Dict[str, float]] = None
    # Beds24 specific fields
    min_stay: Optional[int] = None
    max_stay: Optional[int] = None
    security_deposit: Optional[float] = None
    cleaning_fee: Optional[float] = None
    check_in_start: Optional[str] = None
    check_in_end: Optional[str] = None
    check_out_end: Optional[str] = None
    booking_url: Optional[str] = None  # Beds24 booking page URL
    payment_settings: Optional[Dict] = None  # Stripe/payment gateway settings
    templates: Optional[Dict[str, str]] = None  # Beds24 templates (descriptions, etc)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertyCreate(BaseModel):
    beds24_id: Optional[str] = None
    name: str
    slug: str
    description: Dict[str, str]
    short_description: Dict[str, str]
    location: str
    city: str
    category: str
    images: List[str]
    max_guests: int
    bedrooms: int
    bathrooms: int
    amenities: List[str]
    price_from: Optional[float] = None
    is_showcase: bool = False
    coordinates: Optional[Dict[str, float]] = None

class BookingRequest(BaseModel):
    property_id: str
    room_id: Optional[str] = None
    check_in: str
    check_out: str
    guests: int
    guest_name: str
    guest_email: EmailStr
    guest_phone: str
    special_requests: Optional[str] = None
    total_price: float
    currency: str = "EUR"

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    property_id: str
    beds24_booking_id: Optional[str] = None
    check_in: str
    check_out: str
    guests: int
    guest_name: str
    guest_email: str
    guest_phone: str
    special_requests: Optional[str] = None
    total_price: float
    currency: str = "EUR"
    status: str = "pending"  # pending, confirmed, cancelled
    payment_status: str = "pending"  # pending, paid, refunded
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    property_id: Optional[str] = None
    language: str = "fr"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactRequestCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    property_id: Optional[str] = None
    language: str = "fr"

class AvailabilityCheck(BaseModel):
    property_id: str
    check_in: str
    check_out: str
    guests: int

class PriceQuote(BaseModel):
    available: bool
    total_price: Optional[float] = None
    currency: str = "EUR"
    nights: int
    price_per_night: Optional[float] = None
    cleaning_fee: Optional[float] = None
    service_fee: Optional[float] = None
    taxes: Optional[float] = None
    breakdown: Optional[List[Dict]] = None

# ============== BEDS24 SERVICE ==============

class Beds24Service:
    def __init__(self):
        self.base_url = BEDS24_API_URL
        self.token = BEDS24_TOKEN
        self.refresh_token = BEDS24_REFRESH_TOKEN
        self._token_loaded = False
        
    async def _load_token_from_db(self):
        """Load token from database if available (persisted after refresh)"""
        if self._token_loaded:
            return
        try:
            settings = await db.site_settings.find_one({"id": "beds24_tokens"})
            if settings:
                if settings.get("token"):
                    self.token = settings["token"]
                if settings.get("refresh_token"):
                    self.refresh_token = settings["refresh_token"]
                logger.info("Loaded Beds24 tokens from database")
            self._token_loaded = True
        except Exception as e:
            logger.error(f"Error loading tokens from DB: {e}")
            self._token_loaded = True
    
    async def _save_token_to_db(self):
        """Save refreshed token to database for persistence"""
        try:
            await db.site_settings.update_one(
                {"id": "beds24_tokens"},
                {
                    "$set": {
                        "token": self.token,
                        "refresh_token": self.refresh_token,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                },
                upsert=True
            )
            logger.info("Saved Beds24 tokens to database")
        except Exception as e:
            logger.error(f"Error saving tokens to DB: {e}")
        
    async def _get_headers(self):
        await self._load_token_from_db()
        return {
            "accept": "application/json",
            "token": self.token
        }
    
    async def refresh_access_token(self):
        """Refresh the access token using refresh token"""
        await self._load_token_from_db()
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/authentication/token",
                    headers={
                        "accept": "application/json",
                        "refreshToken": self.refresh_token
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    new_token = data.get("token")
                    if new_token:
                        self.token = new_token
                        # Also update refresh token if provided
                        if data.get("refreshToken"):
                            self.refresh_token = data["refreshToken"]
                        # Persist to database
                        await self._save_token_to_db()
                        logger.info("Successfully refreshed and saved Beds24 token")
                        return True
                else:
                    logger.error(f"Token refresh failed with status {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.error(f"Failed to refresh token: {e}")
        return False
    
    async def get_properties(self, retry: bool = True) -> List[Dict]:
        """Get all properties from Beds24"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/properties",
                    headers=await self._get_headers(),
                    params={"includeAllRooms": "true"}
                )
                if response.status_code == 200:
                    return response.json().get("data", [])
                elif response.status_code == 401 and retry:
                    logger.warning("Token expired, refreshing...")
                    if await self.refresh_access_token():
                        return await self.get_properties(retry=False)
                else:
                    logger.error(f"get_properties failed: {response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Beds24 properties: {e}")
        return []
    
    async def get_property(self, property_id: str, retry: bool = True) -> Optional[Dict]:
        """Get single property details from Beds24"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/properties/{property_id}",
                    headers=await self._get_headers(),
                    params={
                        "includeAllRooms": "true",
                        "includePriceRules": "true"
                    }
                )
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 401 and retry:
                    logger.warning("Token expired, refreshing...")
                    if await self.refresh_access_token():
                        return await self.get_property(property_id, retry=False)
        except Exception as e:
            logger.error(f"Error fetching Beds24 property {property_id}: {e}")
        return None
    
    async def get_rooms_for_property(self, property_id: str) -> List[str]:
        """Get room IDs for a property from Beds24"""
        try:
            prop_data = await self.get_property(property_id)
            if prop_data and "data" in prop_data:
                rooms = prop_data["data"].get("rooms", [])
                return [str(room.get("id")) for room in rooms if room.get("id")]
            elif prop_data:
                rooms = prop_data.get("rooms", [])
                return [str(room.get("id")) for room in rooms if room.get("id")]
        except Exception as e:
            logger.error(f"Error getting rooms for property {property_id}: {e}")
        return []
    
    async def get_property_images(self, property_id: str, retry: bool = True) -> List[str]:
        """Get images for a property from Beds24"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/properties/{property_id}/images",
                    headers=await self._get_headers()
                )
                if response.status_code == 200:
                    data = response.json()
                    images = []
                    if isinstance(data, list):
                        for img in data:
                            if img.get("url"):
                                images.append(img["url"])
                    return images
                elif response.status_code == 401 and retry:
                    logger.warning("Token expired in get_property_images, refreshing...")
                    if await self.refresh_access_token():
                        return await self.get_property_images(property_id, retry=False)
        except Exception as e:
            logger.error(f"Error fetching images for property {property_id}: {e}")
        return []
    
    async def get_calendar(self, room_id: str, from_date: str, to_date: str, retry: bool = True) -> Dict:
        """Get calendar availability and pricing from Beds24"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/inventory/rooms/calendar",
                    headers=await self._get_headers(),
                    params={
                        "roomId": room_id,
                        "startDate": from_date,
                        "endDate": to_date,
                        "includeNumAvail": "true"  # Include availability data
                    }
                )
                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"Calendar response for room {room_id}: {str(result)[:500]}")
                    return result
                elif response.status_code == 401 and retry:
                    # Token expired, refresh and retry
                    await self.refresh_access_token()
                    return await self.get_calendar(room_id, from_date, to_date, retry=False)
                else:
                    logger.warning(f"Calendar API returned {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.error(f"Error fetching calendar for room {room_id}: {e}")
        return {"data": []}
    
    async def get_offers(self, room_id: str, from_date: str, to_date: str, occupancy: int, retry: bool = True) -> Dict:
        """Get price offers for specific dates"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/inventory/rooms/offers",
                    headers=await self._get_headers(),
                    params={
                        "roomId": room_id,
                        "from": from_date,
                        "to": to_date,
                        "occupancy": str(occupancy)
                    }
                )
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 401 and retry:
                    # Token expired, refresh and retry
                    await self.refresh_access_token()
                    return await self.get_offers(room_id, from_date, to_date, occupancy, retry=False)
        except Exception as e:
            logger.error(f"Error fetching offers for room {room_id}: {e}")
        return {}
    
    async def create_booking(self, booking_data: Dict, retry: bool = True) -> Dict:
        """Create a booking in Beds24"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                payload = [{
                    "roomId": int(booking_data.get("room_id")) if booking_data.get("room_id") else None,
                    "arrival": booking_data.get("check_in"),
                    "departure": booking_data.get("check_out"),
                    "numAdult": booking_data.get("guests", 1),
                    "guestFirstName": booking_data.get("guest_name", "").split()[0] if booking_data.get("guest_name") else "",
                    "guestName": booking_data.get("guest_name", ""),
                    "guestEmail": booking_data.get("guest_email"),
                    "guestPhone": booking_data.get("guest_phone"),
                    "price": booking_data.get("total_price"),
                    "currency": booking_data.get("currency", "EUR"),
                    "notes": booking_data.get("special_requests", ""),
                    "source": "website"
                }]
                
                logger.info(f"Beds24 booking payload: {payload}")
                
                response = await client.post(
                    f"{self.base_url}/bookings",
                    headers=await self._get_headers(),
                    json=payload
                )
                
                logger.info(f"Beds24 booking response status: {response.status_code}")
                
                if response.status_code in [200, 201]:
                    result = response.json()
                    logger.info(f"Beds24 booking response: {result}")
                    if result and isinstance(result, list) and len(result) > 0:
                        # Extract booking ID from the response
                        booking_response = result[0]
                        if booking_response.get("success") and "new" in booking_response:
                            # Return with the booking ID
                            return {
                                "success": True,
                                "bookId": booking_response["new"].get("id"),
                                "id": booking_response["new"].get("id"),
                                "price": booking_response["new"].get("price")
                            }
                        return booking_response
                    return result if result else {"success": False, "error": "Empty response"}
                elif response.status_code == 401 and retry:
                    # Token expired, refresh and retry
                    await self.refresh_access_token()
                    return await self.create_booking(booking_data, retry=False)
                else:
                    logger.error(f"Beds24 booking error: {response.status_code} - {response.text}")
                    return {"success": False, "error": f"API error: {response.status_code}"}
        except Exception as e:
            logger.error(f"Error creating Beds24 booking: {e}")
        return {"success": False, "error": "Failed to create booking"}

beds24_service = Beds24Service()

# ============== API ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "ORSO RS API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# --- Categories ---
@api_router.get("/categories", response_model=List[PropertyCategory])
async def get_categories():
    """Get all property categories"""
    categories = [
        PropertyCategory(
            id="vue_mer",
            name="Vue Mer",
            name_en="Sea View",
            name_es="Vista al Mar",
            name_it="Vista Mare",
            slug="vue-mer",
            image="https://images.unsplash.com/photo-1744271688484-f0fa9dabf4b4?w=800",
            description="Des propriétés avec une vue imprenable sur la mer"
        ),
        PropertyCategory(
            id="plage_a_pieds",
            name="Plage à Pieds",
            name_en="Beach Walking Distance",
            name_es="Playa a Pie",
            name_it="Spiaggia a Piedi",
            slug="plage-a-pieds",
            image="https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=800",
            description="Accédez à la plage en quelques minutes à pied"
        ),
        PropertyCategory(
            id="pieds_dans_eau",
            name="Pieds dans l'Eau",
            name_en="Waterfront",
            name_es="Frente al Mar",
            name_it="Direttamente sul Mare",
            slug="pieds-dans-leau",
            image="https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=800",
            description="Le luxe ultime: la plage à vos pieds"
        )
    ]
    return categories

# --- Admin Auth ---
class AdminLoginRequest(BaseModel):
    password: str

@api_router.post("/admin/login")
async def admin_login(request: AdminLoginRequest):
    """Validate admin password"""
    if request.password == ADMIN_PASSWORD:
        return {"success": True, "message": "Authentication successful"}
    raise HTTPException(status_code=401, detail="Invalid password")

# --- Properties ---
@api_router.get("/properties")
async def get_properties(
    category: Optional[str] = None,
    city: Optional[str] = None,
    guests: Optional[int] = None,
    is_showcase: Optional[bool] = None,
    include_hidden: Optional[bool] = False
):
    """Get all properties with optional filters"""
    query = {}
    
    # By default, only return active properties (for public site)
    # Admin can request all properties with include_hidden=true
    if not include_hidden:
        query["is_active"] = True
    
    if category:
        query["category"] = category
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if guests:
        query["max_guests"] = {"$gte": guests}
    if is_showcase is not None:
        query["is_showcase"] = is_showcase
    
    properties = await db.properties.find(query, {"_id": 0}).to_list(100)
    return {"properties": properties, "total": len(properties)}

@api_router.get("/properties/{property_id}")
async def get_property(property_id: str):
    """Get single property by ID"""
    property_data = await db.properties.find_one(
        {"id": property_id, "is_active": True},
        {"_id": 0}
    )
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_data

@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate):
    """Create a new property"""
    property_obj = Property(**property_data.model_dump())
    doc = property_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.properties.insert_one(doc)
    return property_obj

@api_router.put("/properties/{property_id}")
async def update_property(property_id: str, updates: Dict[str, Any]):
    """Update a property"""
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.properties.update_one(
        {"id": property_id},
        {"$set": updates}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {"success": True, "message": "Property updated"}

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    """Soft delete a property"""
    result = await db.properties.update_one(
        {"id": property_id},
        {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {"success": True, "message": "Property deleted"}

# --- Availability & Pricing ---
@api_router.get("/properties/{property_id}/availability")
async def get_property_availability(
    property_id: str,
    from_date: str,
    to_date: str
):
    """Get availability calendar for a property with blocked dates from Beds24"""
    property_data = await db.properties.find_one(
        {"id": property_id, "is_active": True},
        {"_id": 0}
    )
    
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_data.get("is_showcase"):
        return {
            "property_id": property_id,
            "is_showcase": True,
            "message": "This property requires direct contact for availability",
            "blocked_dates": [],
            "available": False
        }
    
    beds24_id = property_data.get("beds24_id")
    beds24_room_id = property_data.get("beds24_room_id")
    blocked_dates = []
    
    if beds24_id and beds24_room_id:
        # Use the stored room_id directly for calendar lookup
        logger.info(f"Fetching calendar for room {beds24_room_id} (property {beds24_id})")
        
        calendar_response = await beds24_service.get_calendar(str(beds24_room_id), from_date, to_date)
        calendar_data = calendar_response.get("data", [])
        
        # Parse calendar data - Beds24 returns date ranges, not individual dates
        for room_data in calendar_data:
            calendar_entries = room_data.get("calendar", [])
            
            for entry in calendar_entries:
                # Each entry has from/to date range and numAvail
                entry_from = entry.get("from")
                entry_to = entry.get("to")
                num_avail = entry.get("numAvail", 1)
                
                # If numAvail is 0, all dates in this range are blocked
                if num_avail == 0 and entry_from:
                    # Generate all dates in the range
                    from datetime import datetime, timedelta
                    start = datetime.strptime(entry_from, "%Y-%m-%d")
                    end = datetime.strptime(entry_to or entry_from, "%Y-%m-%d")
                    
                    current = start
                    while current <= end:
                        date_str = current.strftime("%Y-%m-%d")
                        if date_str not in blocked_dates:
                            blocked_dates.append(date_str)
                        current += timedelta(days=1)
        
        return {
            "property_id": property_id,
            "beds24_id": beds24_id,
            "beds24_room_id": beds24_room_id,
            "from_date": from_date,
            "to_date": to_date,
            "blocked_dates": sorted(blocked_dates),
            "calendar_raw": calendar_data[:5],  # Sample for debugging
            "available": True
        }
    
    # Property not connected to Beds24 - all dates available
    return {
        "property_id": property_id,
        "from_date": from_date,
        "to_date": to_date,
        "blocked_dates": [],
        "available": True,
        "note": "Property not connected to Beds24 - availability not synced"
    }

@api_router.post("/properties/{property_id}/price-quote")
async def get_price_quote(property_id: str, check: AvailabilityCheck):
    """Get price quote for specific dates - checks availability first"""
    property_data = await db.properties.find_one(
        {"id": property_id, "is_active": True},
        {"_id": 0}
    )
    
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_data.get("is_showcase"):
        return PriceQuote(
            available=False,
            nights=0,
            message="This property requires direct contact for pricing"
        )
    
    # Calculate nights
    from_dt = datetime.strptime(check.check_in, "%Y-%m-%d")
    to_dt = datetime.strptime(check.check_out, "%Y-%m-%d")
    nights = (to_dt - from_dt).days
    
    if nights <= 0:
        return PriceQuote(
            available=False,
            nights=0,
            message="Invalid date range"
        )
    
    beds24_id = property_data.get("beds24_id")
    if beds24_id:
        # Get room IDs for this property
        room_ids = await beds24_service.get_rooms_for_property(beds24_id)
        if not room_ids:
            room_ids = [beds24_id]
        
        # Use first room for availability and pricing
        room_id = room_ids[0]
        
        # First check availability via calendar
        calendar = await beds24_service.get_calendar(room_id, check.check_in, check.check_out)
        calendar_data = calendar.get("data", [])
        
        # Check if any date in range is blocked
        is_available = True
        for day_data in calendar_data:
            if day_data.get("numAvail", 1) == 0 or day_data.get("closed", False):
                is_available = False
                break
        
        if not is_available:
            return PriceQuote(
                available=False,
                nights=nights,
                currency=property_data.get("currency", "EUR"),
                message="Dates not available"
            )
        
        # Get price offers
        offers = await beds24_service.get_offers(
            room_id,
            check.check_in,
            check.check_out,
            check.guests
        )
        
        if offers.get("data"):
            offer_data = offers.get("data", [])
            if isinstance(offer_data, list) and len(offer_data) > 0:
                offer = offer_data[0]
            else:
                offer = offer_data
            
            total_price = offer.get("price", 0) if isinstance(offer, dict) else 0
            
            if total_price > 0:
                return PriceQuote(
                    available=True,
                    total_price=total_price,
                    currency=property_data.get("currency", "EUR"),
                    nights=nights,
                    price_per_night=total_price / nights if nights > 0 else 0,
                    breakdown=offer.get("breakdown", []) if isinstance(offer, dict) else []
                )
    
    # Fallback to base price (for properties not connected to Beds24 or if API fails)
    base_price = property_data.get("price_from") or 150  # Use 150 if price_from is None or 0
    total = base_price * nights
    
    return PriceQuote(
        available=True,
        total_price=total,
        currency=property_data.get("currency", "EUR"),
        nights=nights,
        price_per_night=base_price
    )

# --- Bookings ---
@api_router.post("/bookings")
async def create_booking(booking: BookingRequest, background_tasks: BackgroundTasks):
    """
    Generate a payment URL for Beds24.
    The booking and date blocking only happens AFTER successful payment on Beds24/Stripe.
    This ensures no dates are blocked without payment.
    """
    property_data = await db.properties.find_one(
        {"id": booking.property_id, "is_active": True},
        {"_id": 0}
    )
    
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_data.get("is_showcase"):
        raise HTTPException(
            status_code=400,
            detail="This property cannot be booked online. Please contact us."
        )
    
    beds24_id = property_data.get("beds24_id")
    beds24_room_id = property_data.get("beds24_room_id")
    
    if not beds24_id or not beds24_room_id:
        raise HTTPException(
            status_code=400,
            detail="This property is not configured for online booking"
        )
    
    # Save booking intent locally with "pending" status
    # This is just for tracking - NO reservation is created in Beds24 yet
    booking_obj = Booking(
        property_id=booking.property_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guests=booking.guests,
        guest_name=booking.guest_name,
        guest_email=booking.guest_email,
        guest_phone=booking.guest_phone,
        special_requests=booking.special_requests,
        total_price=booking.total_price,
        currency=booking.currency,
        status="pending"  # Will be updated by Beds24 webhook after payment
    )
    
    # Save to MongoDB as pending intent
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    
    logger.info(f"Booking intent saved: {booking_obj.id} - redirecting to Beds24 payment")
    
    # Build Beds24 booking page URL with pre-filled guest info
    # The booking is ONLY created in Beds24 after successful payment
    # Parameters:
    # - propid: Property ID in Beds24
    # - roomid: Room type ID
    # - checkin/checkout: Dates in YYYY-MM-DD format
    # - numadult: Number of guests
    # - firstname, lastname, email, phone: Guest info (pre-filled)
    # - g=st: Stripe payment only
    # - pc=100: Require 100% payment upfront
    
    from urllib.parse import urlencode, quote
    
    # Split guest name into first/last
    name_parts = booking.guest_name.strip().split(' ', 1)
    first_name = name_parts[0] if name_parts else ''
    last_name = name_parts[1] if len(name_parts) > 1 else ''
    
    # Build the Beds24 booking URL
    # This URL opens Beds24's booking page with payment - reservation only created after payment
    booking_params = {
        'propid': beds24_id,
        'roomid': beds24_room_id,
        'checkin': booking.check_in,
        'checkout': booking.check_out,
        'numadult': booking.guests,
        'firstname': first_name,
        'lastname': last_name,
        'email': booking.guest_email,
        'phone': booking.guest_phone or '',
        'notes': booking.special_requests or '',
        'g': 'st',  # Stripe gateway only
        'pc': '100'  # 100% payment required
    }
    
    payment_url = f"https://beds24.com/booking2.php?{urlencode(booking_params)}"
    
    return {
        "success": True,
        "booking_id": booking_obj.id,
        "beds24_booking_id": None,  # Will be set after payment via webhook
        "status": "pending",
        "payment_url": payment_url,
        "message": "Redirecting to secure payment. Reservation will be confirmed after payment."
    }


@api_router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    """Get booking details"""
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@api_router.post("/properties/{property_id}/booking-url")
async def generate_booking_url(property_id: str, request: dict):
    """
    Generate Beds24 booking page URL with pre-filled data.
    This redirects to Beds24's hosted booking page which handles Stripe payment.
    """
    property_data = await db.properties.find_one(
        {"id": property_id},
        {"_id": 0}
    )
    
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    beds24_id = property_data.get("beds24_id")
    if not beds24_id:
        raise HTTPException(
            status_code=400,
            detail="This property is not connected to Beds24. Please contact us to book."
        )
    
    # Get parameters
    check_in = request.get("check_in", "")
    check_out = request.get("check_out", "")
    guests = request.get("guests", 2)
    first_name = request.get("first_name", "")
    last_name = request.get("last_name", "")
    email = request.get("email", "")
    phone = request.get("phone", "")
    
    # Build Beds24 booking URL with parameters
    # https://beds24.com/booking2.php?propid=XXX&checkin=YYYY-MM-DD&checkout=YYYY-MM-DD
    base_url = f"https://beds24.com/booking2.php"
    
    params = {
        "propid": beds24_id,
    }
    
    # Add optional parameters
    if check_in:
        params["checkin"] = check_in
    if check_out:
        params["checkout"] = check_out
    if guests:
        params["numadult"] = guests
    if first_name:
        params["firstname"] = first_name
    if last_name:
        params["lastname"] = last_name
    if email:
        params["email"] = email
    if phone:
        params["phone"] = phone
    
    # Build query string
    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    booking_url = f"{base_url}?{query_string}"
    
    return {
        "success": True,
        "booking_url": booking_url,
        "property_name": property_data.get("name"),
        "beds24_id": beds24_id,
        "payment_enabled": property_data.get("payment_settings", {}).get("gateways", {}).get("stripe", {}).get("type") == "enable"
    }

@api_router.get("/properties/{property_id}/beds24-details")
async def get_beds24_property_details(property_id: str):
    """
    Get full Beds24 details for a property including amenities, payment settings, etc.
    """
    property_data = await db.properties.find_one(
        {"id": property_id},
        {"_id": 0}
    )
    
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    
    beds24_id = property_data.get("beds24_id")
    
    return {
        "success": True,
        "property_id": property_id,
        "beds24_id": beds24_id,
        "beds24_room_id": property_data.get("beds24_room_id"),
        "name": property_data.get("name"),
        "amenities": property_data.get("amenities", []),
        "feature_codes": property_data.get("feature_codes", []),
        "min_stay": property_data.get("min_stay"),
        "max_stay": property_data.get("max_stay"),
        "security_deposit": property_data.get("security_deposit"),
        "cleaning_fee": property_data.get("cleaning_fee"),
        "check_in_start": property_data.get("check_in_start"),
        "check_in_end": property_data.get("check_in_end"),
        "check_out_end": property_data.get("check_out_end"),
        "booking_url": property_data.get("booking_url"),
        "payment_settings": property_data.get("payment_settings"),
        "templates": property_data.get("templates"),
        "is_beds24_connected": beds24_id is not None,
        "has_stripe_enabled": property_data.get("payment_settings", {}).get("gateways", {}).get("stripe", {}).get("type") == "enable"
    }

# --- Contact ---
@api_router.post("/contact")
async def submit_contact(contact: ContactRequestCreate, background_tasks: BackgroundTasks):
    """Submit a contact request"""
    contact_obj = ContactRequest(**contact.model_dump())
    
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_requests.insert_one(doc)
    
    # Send email notification in background
    background_tasks.add_task(
        send_contact_notification,
        contact.name,
        contact.email,
        contact.subject,
        contact.message,
        contact.phone
    )
    
    return {
        "success": True,
        "message": "Your message has been sent. We will contact you shortly."
    }

# --- Beds24 Sync ---
@api_router.post("/sync/beds24/images")
async def sync_beds24_images():
    """Sync images from Beds24 for all properties"""
    # Get all properties with beds24_id
    properties = await db.properties.find(
        {"beds24_id": {"$ne": None}},
        {"_id": 0, "id": 1, "beds24_id": 1, "name": 1}
    ).to_list(100)
    
    updated = 0
    for prop in properties:
        beds24_id = prop.get("beds24_id")
        if beds24_id:
            images = await beds24_service.get_property_images(beds24_id)
            if images:
                await db.properties.update_one(
                    {"beds24_id": beds24_id},
                    {"$set": {"images": images, "updated_at": datetime.now(timezone.utc).isoformat()}}
                )
                updated += 1
                logger.info(f"Updated images for {prop.get('name')}: {len(images)} images")
    
    return {"success": True, "updated": updated, "total": len(properties)}

@api_router.put("/properties/{property_id}/images")
async def update_property_images(property_id: str, images: List[str]):
    """Update property images"""
    result = await db.properties.update_one(
        {"$or": [{"id": property_id}, {"beds24_id": property_id}]},
        {"$set": {"images": images, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {"success": True, "message": "Images updated", "count": len(images)}

@api_router.put("/properties/{property_id}/category")
async def update_property_category(property_id: str, category: str):
    """Update property category"""
    valid_categories = ["vue_mer", "plage_a_pieds", "pieds_dans_eau"]
    if category not in valid_categories:
        raise HTTPException(status_code=400, detail=f"Invalid category. Must be one of: {valid_categories}")
    
    result = await db.properties.update_one(
        {"$or": [{"id": property_id}, {"beds24_id": property_id}]},
        {"$set": {"category": category, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return {"success": True, "message": f"Category updated to {category}"}

@api_router.get("/sync/beds24/properties")
async def get_beds24_properties_raw():
    """Get raw properties from Beds24 API for debugging"""
    properties = await beds24_service.get_properties()
    return {"properties": properties, "count": len(properties)}

@api_router.post("/init-demo-data")
async def init_demo_data():
    """Initialize demo properties for display"""
    demo_properties = [
        {
            "id": "villa-mare-1",
            "beds24_id": None,
            "name": "Villa Mare Vista",
            "slug": "villa-mare-vista",
            "description": {
                "fr": "Une villa d'exception perchée sur les hauteurs de Porto-Vecchio, offrant une vue panoramique à 180° sur la mer Méditerranée et les îles de Sardaigne.\n\nCette propriété de prestige allie le charme authentique de l'architecture corse à un confort moderne de haut standing.",
                "en": "An exceptional villa perched on the heights of Porto-Vecchio, offering a 180° panoramic view of the Mediterranean Sea and the Sardinian islands.",
                "es": "Una villa excepcional encaramada en las alturas de Porto-Vecchio, que ofrece una vista panorámica de 180° del mar Mediterráneo.",
                "it": "Una villa eccezionale arroccata sulle alture di Porto-Vecchio, che offre una vista panoramica a 180° sul Mar Mediterraneo."
            },
            "short_description": {
                "fr": "Villa d'exception avec vue mer panoramique à 180°",
                "en": "Exceptional villa with 180° panoramic sea view",
                "es": "Villa excepcional con vista panorámica al mar de 180°",
                "it": "Villa eccezionale con vista panoramica sul mare a 180°"
            },
            "location": "Porto-Vecchio",
            "city": "Porto-Vecchio",
            "category": "vue_mer",
            "images": [
                "https://images.unsplash.com/photo-1747512281554-1e259aab3cd2?w=1200",
                "https://images.unsplash.com/photo-1758548157747-285c7012db5b?w=1200",
                "https://images.unsplash.com/photo-1766603636578-1da99a6dd236?w=1200"
            ],
            "max_guests": 8,
            "bedrooms": 4,
            "bathrooms": 3,
            "amenities": ["Piscine", "Vue mer", "Climatisation", "WiFi", "Parking", "Cuisine équipée"],
            "price_from": 450,
            "currency": "EUR",
            "is_showcase": False,
            "is_active": True,
            "coordinates": {"lat": 41.5917, "lng": 9.2794}
        },
        {
            "id": "casa-palombaggia-1",
            "beds24_id": None,
            "name": "Casa Palombaggia",
            "slug": "casa-palombaggia",
            "description": {
                "fr": "À quelques pas de la célèbre plage de Palombaggia, cette villa contemporaine vous offre le meilleur de la Corse du Sud. Les eaux turquoise de l'une des plus belles plages de Méditerranée sont à portée de main.",
                "en": "Just steps from the famous Palombaggia beach, this contemporary villa offers you the best of Southern Corsica.",
                "es": "A pocos pasos de la famosa playa de Palombaggia, esta villa contemporánea le ofrece lo mejor del sur de Córcega.",
                "it": "A pochi passi dalla famosa spiaggia di Palombaggia, questa villa contemporanea vi offre il meglio della Corsica del Sud."
            },
            "short_description": {
                "fr": "À 2 minutes à pied de la plage de Palombaggia",
                "en": "2-minute walk to Palombaggia beach",
                "es": "A 2 minutos a pie de la playa de Palombaggia",
                "it": "A 2 minuti a piedi dalla spiaggia di Palombaggia"
            },
            "location": "Palombaggia",
            "city": "Porto-Vecchio",
            "category": "plage_a_pieds",
            "images": [
                "https://images.unsplash.com/photo-1567525078525-cdae8c7f25c5?w=1200",
                "https://images.unsplash.com/photo-1766928102073-789c1ec6c2da?w=1200"
            ],
            "max_guests": 6,
            "bedrooms": 3,
            "bathrooms": 2,
            "amenities": ["Terrasse", "Jardin", "Parking", "WiFi", "Barbecue"],
            "price_from": 350,
            "currency": "EUR",
            "is_showcase": False,
            "is_active": True,
            "coordinates": {"lat": 41.5125, "lng": 9.3167}
        },
        {
            "id": "villa-pieds-eau-1",
            "beds24_id": None,
            "name": "Villa Pieds dans l'Eau",
            "slug": "villa-pieds-dans-leau",
            "description": {
                "fr": "Le luxe ultime: accès direct à la mer depuis votre terrasse. Cette villa exceptionnelle vous offre une expérience unique avec un accès privatif à une crique de sable fin. Le rêve méditerranéen incarné.",
                "en": "Ultimate luxury: direct sea access from your terrace. This exceptional villa offers you a unique experience with private access to a fine sand cove.",
                "es": "El lujo supremo: acceso directo al mar desde su terraza. Esta villa excepcional le ofrece una experiencia única.",
                "it": "Il lusso supremo: accesso diretto al mare dalla vostra terrazza. Questa villa eccezionale vi offre un'esperienza unica."
            },
            "short_description": {
                "fr": "Accès privatif à la mer et ponton privé",
                "en": "Private sea access and private jetty",
                "es": "Acceso privado al mar y muelle privado",
                "it": "Accesso privato al mare e pontile privato"
            },
            "location": "Bonifacio",
            "city": "Bonifacio",
            "category": "pieds_dans_eau",
            "images": [
                "https://images.unsplash.com/photo-1662320281809-f03a655bc42f?w=1200",
                "https://images.unsplash.com/photo-1768424694845-edc1bab43419?w=1200"
            ],
            "max_guests": 10,
            "bedrooms": 5,
            "bathrooms": 4,
            "amenities": ["Piscine", "Accès mer", "Jacuzzi", "Climatisation", "Bateau", "Personnel"],
            "price_from": 800,
            "currency": "EUR",
            "is_showcase": False,
            "is_active": True,
            "coordinates": {"lat": 41.3875, "lng": 9.1583}
        },
        {
            "id": "domaine-exclusif-1",
            "beds24_id": None,
            "name": "Domaine Exclusif",
            "slug": "domaine-exclusif",
            "description": {
                "fr": "Un domaine privé exceptionnel niché sur les hauteurs de Calvi. Cette propriété unique offre une intimité absolue et des prestations dignes des plus grands palaces. Disponible sur demande uniquement.",
                "en": "An exceptional private estate nestled on the heights of Calvi. This unique property offers absolute privacy and services worthy of the finest palaces.",
                "es": "Una finca privada excepcional enclavada en las alturas de Calvi. Esta propiedad única ofrece privacidad absoluta.",
                "it": "Una tenuta privata eccezionale incastonata sulle alture di Calvi. Questa proprietà unica offre privacy assoluta."
            },
            "short_description": {
                "fr": "Domaine privé de prestige - Sur demande",
                "en": "Prestigious private estate - On request",
                "es": "Finca privada de prestigio - Bajo petición",
                "it": "Tenuta privata di prestigio - Su richiesta"
            },
            "location": "Calvi",
            "city": "Calvi",
            "category": "vue_mer",
            "images": [
                "https://images.unsplash.com/photo-1766603636578-1da99a6dd236?w=1200"
            ],
            "max_guests": 12,
            "bedrooms": 6,
            "bathrooms": 5,
            "amenities": ["Piscine", "Tennis", "Personnel de maison", "Héliport", "Spa"],
            "price_from": None,
            "currency": "EUR",
            "is_showcase": True,
            "is_active": True,
            "coordinates": {"lat": 42.5667, "lng": 8.7583}
        },
        {
            "id": "villa-santa-giulia-1",
            "beds24_id": None,
            "name": "Villa Santa Giulia",
            "slug": "villa-santa-giulia",
            "description": {
                "fr": "Face au lagon turquoise de Santa Giulia, cette villa moderne offre un cadre idyllique pour des vacances en famille ou entre amis. La plage de sable blanc n'est qu'à quelques minutes à pied.",
                "en": "Facing the turquoise lagoon of Santa Giulia, this modern villa offers an idyllic setting for family or friends vacations.",
                "es": "Frente a la laguna turquesa de Santa Giulia, esta villa moderna ofrece un entorno idílico.",
                "it": "Di fronte alla laguna turchese di Santa Giulia, questa villa moderna offre un ambiente idilliaco."
            },
            "short_description": {
                "fr": "Vue sur le lagon de Santa Giulia, plage à 3 min",
                "en": "View of Santa Giulia lagoon, beach 3 min away",
                "es": "Vista de la laguna de Santa Giulia, playa a 3 min",
                "it": "Vista sulla laguna di Santa Giulia, spiaggia a 3 min"
            },
            "location": "Santa Giulia",
            "city": "Porto-Vecchio",
            "category": "plage_a_pieds",
            "images": [
                "https://images.unsplash.com/photo-1744271688484-f0fa9dabf4b4?w=1200"
            ],
            "max_guests": 8,
            "bedrooms": 4,
            "bathrooms": 3,
            "amenities": ["Piscine", "Vue mer", "Terrasse", "WiFi", "Climatisation"],
            "price_from": 400,
            "currency": "EUR",
            "is_showcase": False,
            "is_active": True,
            "coordinates": {"lat": 41.5083, "lng": 9.2750}
        }
    ]
    
    inserted = 0
    for prop in demo_properties:
        existing = await db.properties.find_one({"id": prop["id"]})
        if not existing:
            prop["created_at"] = datetime.now(timezone.utc).isoformat()
            prop["updated_at"] = datetime.now(timezone.utc).isoformat()
            await db.properties.insert_one(prop)
            inserted += 1
    
    return {"success": True, "inserted": inserted, "total": len(demo_properties)}

@api_router.post("/sync/beds24")
async def sync_beds24_properties():
    """Sync properties from Beds24 with full data"""
    beds24_properties = await beds24_service.get_properties()
    
    logger.info(f"Got {len(beds24_properties)} properties from Beds24 API")
    
    synced = 0
    updated = 0
    properties_list = []
    
    # Feature code to human readable mapping
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
        'LUGGAGE_DROPOFF': 'Dépôt de bagages', 'CLOTHES_DRYINGRACK': 'Étendoir à linge'
    }
    
    for b24_prop in beds24_properties:
        beds24_id = str(b24_prop.get("id"))
        existing = await db.properties.find_one(
            {"beds24_id": beds24_id},
            {"_id": 0}
        )
        
        # Extract room info if available
        rooms = b24_prop.get("roomTypes", [])
        max_guests = 4
        bedrooms = 1
        min_stay = None
        max_stay = None
        security_deposit = None
        cleaning_fee = None
        price_from = None
        room_id = None
        feature_codes_raw = []
        room_templates = {}
        
        # Get data from first room type (main listing)
        if rooms:
            room = rooms[0]
            room_id = str(room.get("id"))
            max_guests = room.get("maxPeople", 4) or 4
            min_stay = room.get("minStay")
            max_stay = room.get("maxStay")
            security_deposit = room.get("securityDeposit")
            cleaning_fee = room.get("cleaningFee")
            price_from = room.get("minPrice") or room.get("rackRate")
            
            logger.info(f"Property {beds24_id}: room_id={room_id}, min_stay={min_stay}, security={security_deposit}")
            
            # Get feature codes (amenities)
            raw_features = room.get("featureCodes", [])
            logger.info(f"Property {beds24_id}: featureCodes count={len(raw_features)}")
            for feat in raw_features:
                if isinstance(feat, list):
                    feature_codes_raw.extend(feat)
                else:
                    feature_codes_raw.append(feat)
            
            # Get room templates (can contain descriptions)
            room_templates = room.get("templates", {})
            
            # Count bedrooms from feature codes
            bedroom_count = sum(1 for f in raw_features if isinstance(f, list) and 'BEDROOM' in f)
            if bedroom_count > 0:
                bedrooms = bedroom_count
        
        # Convert feature codes to readable amenities
        amenities = []
        for code in feature_codes_raw:
            if code in FEATURE_LABELS:
                amenities.append(FEATURE_LABELS[code])
        amenities = list(set(amenities))  # Remove duplicates
        
        # Build property name
        prop_name = b24_prop.get("name", "Propriété Sans Nom")
        
        # Create slug
        import re
        slug = re.sub(r'[^a-z0-9]+', '-', prop_name.lower()).strip('-')
        
        # Get description from templates (usually template1 or template2)
        prop_templates = b24_prop.get("templates", {})
        all_templates = {**prop_templates, **room_templates}
        
        # Try to find description in templates
        desc = ""
        for tpl_key in ["template1", "template2", "template4", "template5"]:
            tpl_val = all_templates.get(tpl_key, "")
            if tpl_val and len(tpl_val) > len(desc) and not tpl_val.startswith("http"):
                desc = tpl_val
        
        # Get check-in/out times
        check_in_start = b24_prop.get("checkInStart", "15:00")
        check_in_end = b24_prop.get("checkInEnd", "20:00")
        check_out_end = b24_prop.get("checkOutEnd", "10:00")
        
        # Payment settings
        payment_gateways = b24_prop.get("paymentGateways", {})
        payment_collection = b24_prop.get("paymentCollection", {})
        booking_rules = b24_prop.get("bookingRules", {})
        
        # Generate Beds24 booking URL
        booking_url = f"https://beds24.com/booking2.php?propid={beds24_id}"
        
        property_data = {
            "beds24_id": beds24_id,
            "beds24_room_id": room_id,
            "name": prop_name,
            "slug": slug,
            "description": {
                "fr": desc,
                "en": desc,
                "es": desc,
                "it": desc
            },
            "short_description": {
                "fr": desc[:200] if desc else "",
                "en": desc[:200] if desc else "",
                "es": desc[:200] if desc else "",
                "it": desc[:200] if desc else ""
            },
            "location": f"{b24_prop.get('address', '')}".strip(),
            "city": b24_prop.get("city", "") or "Corse du Sud",
            "category": "vue_mer",  # Default - can be changed manually
            "images": [],  # Beds24 images need separate handling
            "max_guests": max_guests,
            "bedrooms": bedrooms,
            "bathrooms": 1,
            "amenities": amenities,
            "feature_codes": feature_codes_raw,
            "price_from": price_from,
            "currency": b24_prop.get("currency", "EUR"),
            "is_showcase": False,
            "min_stay": min_stay,
            "max_stay": max_stay,
            "security_deposit": security_deposit,
            "cleaning_fee": cleaning_fee,
            "check_in_start": check_in_start,
            "check_in_end": check_in_end,
            "check_out_end": check_out_end,
            "booking_url": booking_url,
            "payment_settings": {
                "gateways": payment_gateways,
                "collection": payment_collection,
                "rules": booking_rules
            },
            "templates": all_templates,
            "coordinates": {
                "lat": float(b24_prop.get("latitude")) if b24_prop.get("latitude") else None,
                "lng": float(b24_prop.get("longitude")) if b24_prop.get("longitude") else None
            },
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if not existing:
            # Create new property - HIDDEN by default (is_active: False)
            property_data["id"] = f"beds24-{beds24_id}"
            property_data["created_at"] = datetime.now(timezone.utc).isoformat()
            property_data["is_active"] = False  # Hidden by default - admin must activate
            await db.properties.insert_one(property_data)
            synced += 1
        else:
            # Update existing property - preserve certain fields
            preserved_fields = ["id", "category", "is_active", "is_showcase", "created_at", "images"]
            for field in preserved_fields:
                if field in existing:
                    property_data[field] = existing[field]
            
            await db.properties.update_one(
                {"beds24_id": beds24_id},
                {"$set": property_data}
            )
            updated += 1
        
        properties_list.append({
            "beds24_id": beds24_id,
            "name": prop_name,
            "city": property_data["city"],
            "amenities_count": len(amenities),
            "room_id": room_id
        })
    
    return {
        "success": True, 
        "synced": synced, 
        "updated": updated,
        "total_beds24": len(beds24_properties),
        "properties": properties_list
    }

@api_router.post("/sync/beds24/activate-all")
async def activate_all_beds24_properties():
    """Activate all Beds24 synchronized properties"""
    result = await db.properties.update_many(
        {"beds24_id": {"$exists": True}},
        {"$set": {"is_active": True}}
    )
    return {
        "success": True,
        "activated": result.modified_count,
        "message": f"{result.modified_count} propriétés activées"
    }

# ============== EMAIL FUNCTIONS ==============

async def send_booking_confirmation(email: str, name: str, property_name: str, check_in: str, check_out: str):
    """Send booking confirmation email"""
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email")
        return
    
    try:
        resend.Emails.send({
            "from": "ORSO RS <noreply@orso-rs.com>",
            "to": [email],
            "subject": f"Confirmation de réservation - {property_name}",
            "html": f"""
            <div style="font-family: 'Manrope', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2e2e2e;">Merci pour votre réservation</h1>
                <p>Bonjour {name},</p>
                <p>Votre réservation pour <strong>{property_name}</strong> a été confirmée.</p>
                <p><strong>Dates:</strong> {check_in} au {check_out}</p>
                <p>Notre équipe vous contactera prochainement avec plus de détails.</p>
                <p>À bientôt en Corse!</p>
                <p>L'équipe ORSO RS</p>
            </div>
            """
        })
        logger.info(f"Booking confirmation sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send booking confirmation: {e}")

async def send_contact_notification(name: str, email: str, subject: str, message: str, phone: str = None):
    """Send contact notification to admin via Brevo"""
    if not BREVO_API_KEY:
        logger.warning("Brevo API key not configured, skipping email")
        return
    
    try:
        # Configure Brevo API
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = BREVO_API_KEY
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
        
        # Build the email
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": CONTACT_EMAIL, "name": "ORSO RS"}],
            sender={"email": BREVO_SENDER_EMAIL, "name": BREVO_SENDER_NAME},
            reply_to={"email": email, "name": name},
            subject=f"[ORSO RS] Nouveau message: {subject}",
            html_content=f"""
            <div style="font-family: 'Manrope', sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2e2e2e;">Nouveau message de contact</h1>
                <p><strong>Nom:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Téléphone:</strong> {phone or 'Non renseigné'}</p>
                <p><strong>Sujet:</strong> {subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>{message}</p>
            </div>
            """
        )
        
        # Send the email
        api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Contact notification sent via Brevo for {email}")
    except ApiException as e:
        logger.error(f"Brevo API error: {e}")
    except Exception as e:
        logger.error(f"Failed to send contact notification: {e}")

# ============== AUTO SYNC BEDS24 ==============

async def auto_sync_beds24():
    """Background task to sync properties from Beds24 automatically"""
    logger.info("🔄 Starting automatic Beds24 synchronization...")
    
    try:
        beds24_properties = await beds24_service.get_properties()
        
        if not beds24_properties:
            logger.warning("No properties returned from Beds24 API")
            await db.sync_status.update_one(
                {"id": "beds24_sync"},
                {
                    "$set": {
                        "last_sync": datetime.now(timezone.utc).isoformat(),
                        "status": "warning",
                        "message": "No properties returned from API",
                        "synced": 0,
                        "updated": 0
                    }
                },
                upsert=True
            )
            return
        
        synced = 0
        updated = 0
        
        # Feature code to human readable mapping
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
            'EXTRA_PILLOWS_BLANKETS': 'Oreillers supplémentaires', 'LUGGAGE_DROPOFF': 'Dépôt de bagages',
            'CLOTHES_DRYINGRACK': 'Étendoir à linge', 'VIEW_SEA': 'Vue mer', 'BEACH_ACCESS': 'Accès plage'
        }
        
        for b24_prop in beds24_properties:
            beds24_id = str(b24_prop.get("id"))
            existing = await db.properties.find_one(
                {"beds24_id": beds24_id},
                {"_id": 0}
            )
            
            # Extract room info
            rooms = b24_prop.get("roomTypes", [])
            max_guests = 4
            bedrooms = 1
            min_stay = None
            max_stay = None
            security_deposit = None
            cleaning_fee = None
            price_from = None
            room_id = None
            feature_codes_raw = []
            room_templates = {}
            
            # Get data from first room type (main listing)
            if rooms:
                room = rooms[0]
                room_id = str(room.get("id"))
                max_guests = room.get("maxPeople", 4) or 4
                min_stay = room.get("minStay")
                max_stay = room.get("maxStay")
                security_deposit = room.get("securityDeposit")
                cleaning_fee = room.get("cleaningFee")
                price_from = room.get("minPrice") or room.get("rackRate")
                
                # Get feature codes (amenities)
                raw_features = room.get("featureCodes", [])
                for feat in raw_features:
                    if isinstance(feat, list):
                        feature_codes_raw.extend(feat)
                    else:
                        feature_codes_raw.append(feat)
                
                room_templates = room.get("templates", {})
                
                # Count bedrooms
                bedroom_count = sum(1 for f in raw_features if isinstance(f, list) and 'BEDROOM' in f)
                if bedroom_count > 0:
                    bedrooms = bedroom_count
            
            # Convert feature codes to readable amenities
            amenities = []
            for code in feature_codes_raw:
                if code in FEATURE_LABELS:
                    amenities.append(FEATURE_LABELS[code])
            amenities = list(set(amenities))
            
            prop_name = b24_prop.get("name", "Propriété Sans Nom")
            
            import re
            slug = re.sub(r'[^a-z0-9]+', '-', prop_name.lower()).strip('-')
            
            # Get description from templates
            prop_templates = b24_prop.get("templates", {})
            all_templates = {**prop_templates, **room_templates}
            
            desc = ""
            for tpl_key in ["template1", "template2", "template4", "template5"]:
                tpl_val = all_templates.get(tpl_key, "")
                if tpl_val and len(tpl_val) > len(desc) and not tpl_val.startswith("http"):
                    desc = tpl_val
            
            # Get check-in/out times
            check_in_start = b24_prop.get("checkInStart", "15:00")
            check_in_end = b24_prop.get("checkInEnd", "20:00")
            check_out_end = b24_prop.get("checkOutEnd", "10:00")
            
            # Payment settings
            payment_gateways = b24_prop.get("paymentGateways", {})
            payment_collection = b24_prop.get("paymentCollection", {})
            booking_rules = b24_prop.get("bookingRules", {})
            
            booking_url = f"https://beds24.com/booking2.php?propid={beds24_id}"
            
            property_data = {
                "beds24_id": beds24_id,
                "beds24_room_id": room_id,
                "name": prop_name,
                "slug": slug,
                "description": {"fr": desc, "en": desc, "es": desc, "it": desc},
                "short_description": {"fr": desc[:200] if desc else "", "en": desc[:200] if desc else "", "es": desc[:200] if desc else "", "it": desc[:200] if desc else ""},
                "location": f"{b24_prop.get('address', '')}".strip(),
                "city": b24_prop.get("city", "") or "Corse du Sud",
                "max_guests": max_guests,
                "bedrooms": bedrooms,
                "bathrooms": 1,
                "amenities": amenities,
                "feature_codes": feature_codes_raw,
                "price_from": price_from,
                "currency": b24_prop.get("currency", "EUR"),
                "min_stay": min_stay,
                "max_stay": max_stay,
                "security_deposit": security_deposit,
                "cleaning_fee": cleaning_fee,
                "check_in_start": check_in_start,
                "check_in_end": check_in_end,
                "check_out_end": check_out_end,
                "booking_url": booking_url,
                "payment_settings": {
                    "gateways": payment_gateways,
                    "collection": payment_collection,
                    "rules": booking_rules
                },
                "templates": all_templates,
                "coordinates": {
                    "lat": float(b24_prop.get("latitude")) if b24_prop.get("latitude") else None,
                    "lng": float(b24_prop.get("longitude")) if b24_prop.get("longitude") else None
                },
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            
            if not existing:
                property_data["id"] = f"beds24-{beds24_id}"
                property_data["created_at"] = datetime.now(timezone.utc).isoformat()
                property_data["is_active"] = False  # Hidden by default
                property_data["is_showcase"] = False
                property_data["category"] = "vue_mer"
                property_data["images"] = []
                await db.properties.insert_one(property_data)
                synced += 1
                logger.info(f"  ➕ New property: {prop_name} (hidden)")
            else:
                # Preserve certain fields from existing
                property_data["id"] = existing.get("id", f"beds24-{beds24_id}")
                property_data["is_active"] = existing.get("is_active", False)
                property_data["is_showcase"] = existing.get("is_showcase", False)
                property_data["category"] = existing.get("category", "vue_mer")
                property_data["images"] = existing.get("images", [])
                property_data["created_at"] = existing.get("created_at", datetime.now(timezone.utc).isoformat())
                
                await db.properties.update_one({"beds24_id": beds24_id}, {"$set": property_data})
                updated += 1
        
        await db.sync_status.update_one(
            {"id": "beds24_sync"},
            {
                "$set": {
                    "last_sync": datetime.now(timezone.utc).isoformat(),
                    "status": "success",
                    "message": f"Synced {synced} new, updated {updated} existing",
                    "synced": synced,
                    "updated": updated,
                    "total_beds24": len(beds24_properties)
                }
            },
            upsert=True
        )
        
        logger.info(f"✅ Auto-sync complete: {synced} new, {updated} updated")
        
    except Exception as e:
        logger.error(f"❌ Auto-sync failed: {e}")
        await db.sync_status.update_one(
            {"id": "beds24_sync"},
            {"$set": {"last_sync": datetime.now(timezone.utc).isoformat(), "status": "error", "message": str(e)}},
            upsert=True
        )

@api_router.get("/sync/status")
async def get_sync_status():
    """Get the status of the last Beds24 sync"""
    status = await db.sync_status.find_one({"id": "beds24_sync"}, {"_id": 0})
    
    next_run = None
    if scheduler.running:
        jobs = scheduler.get_jobs()
        if jobs:
            next_run = jobs[0].next_run_time.isoformat() if jobs[0].next_run_time else None
    
    return {
        "sync_enabled": BEDS24_SYNC_ENABLED,
        "sync_interval_hours": BEDS24_SYNC_INTERVAL_HOURS,
        "scheduler_running": scheduler.running,
        "next_sync": next_run,
        "last_sync": status
    }

@api_router.post("/sync/trigger")
async def trigger_sync():
    """Manually trigger a Beds24 sync"""
    await auto_sync_beds24()
    status = await db.sync_status.find_one({"id": "beds24_sync"}, {"_id": 0})
    return {"success": True, "status": status}

# Include the router in the main app
app.include_router(api_router)

# CORS configuration
cors_origins_env = os.environ.get('CORS_ORIGINS', '*')
if cors_origins_env == '*':
    cors_origins = ["*"]
    allow_credentials = False
else:
    cors_origins = [origin.strip() for origin in cors_origins_env.split(',')]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_credentials=allow_credentials,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database indexes and start scheduler"""
    # Create indexes
    await db.properties.create_index("id", unique=True)
    await db.properties.create_index("beds24_id")
    await db.properties.create_index("category")
    await db.properties.create_index("city")
    await db.bookings.create_index("id", unique=True)
    await db.contact_requests.create_index("id", unique=True)
    await db.sync_status.create_index("id", unique=True)
    logger.info("Database indexes created")
    
    # Start scheduler for auto-sync
    if BEDS24_SYNC_ENABLED and BEDS24_TOKEN:
        scheduler.add_job(
            auto_sync_beds24,
            IntervalTrigger(hours=BEDS24_SYNC_INTERVAL_HOURS),
            id='beds24_auto_sync',
            name='Beds24 Auto Sync',
            replace_existing=True
        )
        scheduler.start()
        logger.info(f"🚀 Beds24 auto-sync scheduler started (every {BEDS24_SYNC_INTERVAL_HOURS} hour(s))")
        
        # Run initial sync after 30 seconds to let the server start
        import asyncio
        asyncio.create_task(delayed_initial_sync())
    else:
        logger.info("⏸️ Beds24 auto-sync is disabled or no token configured")

async def delayed_initial_sync():
    """Run initial sync after a short delay"""
    await asyncio.sleep(30)
    logger.info("Running initial Beds24 sync...")
    await auto_sync_beds24()

@app.on_event("shutdown")
async def shutdown_db_client():
    """Shutdown scheduler and close database connection"""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler stopped")
    client.close()
