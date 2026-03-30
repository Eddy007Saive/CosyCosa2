from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = "site_settings"
    images: Dict[str, str] = {}
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


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


class AdminLoginRequest(BaseModel):
    password: str


class SectorOffer(BaseModel):
    title_fr: str = ""
    title_en: str = ""
    title_es: str = ""
    title_it: str = ""
    desc_fr: str = ""
    desc_en: str = ""
    desc_es: str = ""
    desc_it: str = ""


class SectorAdvantage(BaseModel):
    title_fr: str = ""
    title_en: str = ""
    title_es: str = ""
    title_it: str = ""
    desc_fr: str = ""
    desc_en: str = ""
    desc_es: str = ""
    desc_it: str = ""


class SectorCreate(BaseModel):
    slug: str
    city_fr: str
    city_en: str = ""
    city_es: str = ""
    city_it: str = ""
    meta_description_fr: str = ""
    meta_description_en: str = ""
    intro_fr: str = ""
    intro_en: str = ""
    intro_es: str = ""
    intro_it: str = ""
    intro2_fr: str = ""
    intro2_en: str = ""
    intro2_es: str = ""
    intro2_it: str = ""
    offers: List[SectorOffer] = []
    advantages: List[SectorAdvantage] = []
    hero_image: str = ""
    is_active: bool = True
    order: int = 0


class BlogPostCreate(BaseModel):
    slug: str
    title: str
    excerpt: str = ""
    content: str = ""  # HTML content
    hero_image: str = ""
    author: str = "Cosycasa"
    meta_title: str = ""
    meta_description: str = ""
    is_published: bool = True


class CommentCreate(BaseModel):
    post_slug: str
    author_name: str
    author_email: str
    author_website: str = ""
    content: str
