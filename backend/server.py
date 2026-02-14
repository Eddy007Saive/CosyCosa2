from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
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
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Beds24 Configuration
BEDS24_API_URL = "https://api.beds24.com/v2"
BEDS24_TOKEN = os.environ.get('BEDS24_TOKEN', '')
BEDS24_REFRESH_TOKEN = os.environ.get('BEDS24_REFRESH_TOKEN', '')

# Resend Configuration
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'hello@conciergerie-cosycasa.fr')

# Configure resend
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app
app = FastAPI(title="ORSO RS API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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
    price_from: Optional[float] = None
    currency: str = "EUR"
    is_showcase: bool = False  # True = vitrine only, no booking
    is_active: bool = True
    coordinates: Optional[Dict[str, float]] = None
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
        
    async def _get_headers(self):
        return {
            "accept": "application/json",
            "token": self.token
        }
    
    async def refresh_access_token(self):
        """Refresh the access token using refresh token"""
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
                    self.token = data.get("token", self.token)
                    logger.info("Successfully refreshed Beds24 token")
                    return True
        except Exception as e:
            logger.error(f"Failed to refresh token: {e}")
        return False
    
    async def get_properties(self) -> List[Dict]:
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
                elif response.status_code == 401:
                    await self.refresh_access_token()
                    return await self.get_properties()
        except Exception as e:
            logger.error(f"Error fetching Beds24 properties: {e}")
        return []
    
    async def get_property(self, property_id: str) -> Optional[Dict]:
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
        except Exception as e:
            logger.error(f"Error fetching Beds24 property {property_id}: {e}")
        return None
    
    async def get_calendar(self, room_id: str, from_date: str, to_date: str) -> Dict:
        """Get calendar availability and pricing"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/inventory/rooms/calendar",
                    headers=await self._get_headers(),
                    params={
                        "roomId": room_id,
                        "from": from_date,
                        "to": to_date
                    }
                )
                if response.status_code == 200:
                    return response.json()
        except Exception as e:
            logger.error(f"Error fetching calendar for room {room_id}: {e}")
        return {"data": []}
    
    async def get_offers(self, room_id: str, from_date: str, to_date: str, occupancy: int) -> Dict:
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
        except Exception as e:
            logger.error(f"Error fetching offers for room {room_id}: {e}")
        return {}
    
    async def create_booking(self, booking_data: Dict) -> Dict:
        """Create a booking in Beds24"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                payload = [{
                    "roomId": booking_data.get("room_id"),
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
                
                response = await client.post(
                    f"{self.base_url}/bookings",
                    headers=await self._get_headers(),
                    json=payload
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result and len(result) > 0:
                        return result[0]
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

# --- Properties ---
@api_router.get("/properties")
async def get_properties(
    category: Optional[str] = None,
    city: Optional[str] = None,
    guests: Optional[int] = None,
    is_showcase: Optional[bool] = None
):
    """Get all properties with optional filters"""
    query = {"is_active": True}
    
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
    """Get availability calendar for a property"""
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
            "message": "This property requires direct contact for availability"
        }
    
    beds24_id = property_data.get("beds24_id")
    if beds24_id:
        calendar = await beds24_service.get_calendar(beds24_id, from_date, to_date)
        return {
            "property_id": property_id,
            "from_date": from_date,
            "to_date": to_date,
            "calendar": calendar.get("data", [])
        }
    
    return {
        "property_id": property_id,
        "from_date": from_date,
        "to_date": to_date,
        "calendar": []
    }

@api_router.post("/properties/{property_id}/price-quote")
async def get_price_quote(property_id: str, check: AvailabilityCheck):
    """Get price quote for specific dates"""
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
    
    beds24_id = property_data.get("beds24_id")
    if beds24_id:
        offers = await beds24_service.get_offers(
            beds24_id,
            check.check_in,
            check.check_out,
            check.guests
        )
        
        if offers.get("data"):
            offer = offers["data"][0] if isinstance(offers["data"], list) else offers["data"]
            total_price = offer.get("price", 0)
            
            return PriceQuote(
                available=True,
                total_price=total_price,
                currency=property_data.get("currency", "EUR"),
                nights=nights,
                price_per_night=total_price / nights if nights > 0 else 0,
                breakdown=offer.get("breakdown", [])
            )
    
    # Fallback to base price
    base_price = property_data.get("price_from", 150)
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
    """Create a new booking"""
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
    
    # Create booking object
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
        currency=booking.currency
    )
    
    # Create in Beds24 if property is connected
    beds24_id = property_data.get("beds24_id")
    if beds24_id:
        beds24_result = await beds24_service.create_booking({
            "room_id": beds24_id,
            "check_in": booking.check_in,
            "check_out": booking.check_out,
            "guests": booking.guests,
            "guest_name": booking.guest_name,
            "guest_email": booking.guest_email,
            "guest_phone": booking.guest_phone,
            "total_price": booking.total_price,
            "currency": booking.currency,
            "special_requests": booking.special_requests
        })
        
        if beds24_result.get("success"):
            booking_obj.beds24_booking_id = beds24_result.get("bookingId")
            booking_obj.status = "confirmed"
    
    # Save to MongoDB
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    
    # Send confirmation email in background
    background_tasks.add_task(
        send_booking_confirmation,
        booking_obj.guest_email,
        booking_obj.guest_name,
        property_data.get("name"),
        booking.check_in,
        booking.check_out
    )
    
    return {
        "success": True,
        "booking_id": booking_obj.id,
        "status": booking_obj.status,
        "message": "Booking created successfully"
    }

@api_router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    """Get booking details"""
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

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
    """Sync properties from Beds24"""
    beds24_properties = await beds24_service.get_properties()
    
    synced = 0
    for b24_prop in beds24_properties:
        existing = await db.properties.find_one(
            {"beds24_id": str(b24_prop.get("id"))},
            {"_id": 0}
        )
        
        if not existing:
            # Create new property from Beds24 data
            new_property = Property(
                beds24_id=str(b24_prop.get("id")),
                name=b24_prop.get("name", "Unnamed Property"),
                slug=b24_prop.get("name", "").lower().replace(" ", "-"),
                description={
                    "fr": b24_prop.get("description", ""),
                    "en": b24_prop.get("description", ""),
                    "es": b24_prop.get("description", ""),
                    "it": b24_prop.get("description", "")
                },
                short_description={
                    "fr": b24_prop.get("description", "")[:200] if b24_prop.get("description") else "",
                    "en": "",
                    "es": "",
                    "it": ""
                },
                location=f"{b24_prop.get('address', '')}, {b24_prop.get('city', '')}",
                city=b24_prop.get("city", "Porto-Vecchio"),
                category="vue_mer",  # Default category
                images=[],
                max_guests=b24_prop.get("maxGuests", 4),
                bedrooms=1,
                bathrooms=1,
                amenities=[],
                price_from=None,
                is_showcase=False,
                coordinates={
                    "lat": float(b24_prop.get("latitude", 0)) if b24_prop.get("latitude") else None,
                    "lng": float(b24_prop.get("longitude", 0)) if b24_prop.get("longitude") else None
                }
            )
            
            doc = new_property.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            doc['updated_at'] = doc['updated_at'].isoformat()
            await db.properties.insert_one(doc)
            synced += 1
    
    return {"success": True, "synced": synced, "total_beds24": len(beds24_properties)}

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
    """Send contact notification to admin"""
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email")
        return
    
    try:
        resend.Emails.send({
            "from": "ORSO RS <noreply@orso-rs.com>",
            "to": [CONTACT_EMAIL],
            "reply_to": email,
            "subject": f"[ORSO RS] Nouveau message: {subject}",
            "html": f"""
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
        })
        logger.info(f"Contact notification sent for {email}")
    except Exception as e:
        logger.error(f"Failed to send contact notification: {e}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database indexes"""
    await db.properties.create_index("id", unique=True)
    await db.properties.create_index("beds24_id")
    await db.properties.create_index("category")
    await db.properties.create_index("city")
    await db.bookings.create_index("id", unique=True)
    await db.contact_requests.create_index("id", unique=True)
    logger.info("Database indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
