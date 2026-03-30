from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

from models import Property, PropertyCreate, PropertyCategory, AvailabilityCheck, PriceQuote
from database import db
from services.beds24 import beds24_service

router = APIRouter()

import logging
logger = logging.getLogger(__name__)


@router.get("/categories")
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


@router.get("/properties")
async def get_properties(
    category: Optional[str] = None,
    city: Optional[str] = None,
    guests: Optional[int] = None,
    min_guests: Optional[int] = None,
    max_guests: Optional[int] = None,
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
    if min_guests is not None or max_guests is not None:
        guests_filter = {}
        if min_guests is not None:
            guests_filter["$gte"] = min_guests
        if max_guests is not None:
            guests_filter["$lte"] = max_guests
        query["max_guests"] = guests_filter
    if is_showcase is not None:
        query["is_showcase"] = is_showcase

    properties = await db.properties.find(query, {"_id": 0}).to_list(100)
    return {"properties": properties, "total": len(properties)}


@router.get("/properties/{property_id}")
async def get_property(property_id: str):
    """Get single property by ID"""
    property_data = await db.properties.find_one(
        {"id": property_id, "is_active": True},
        {"_id": 0}
    )
    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_data


@router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate):
    """Create a new property"""
    property_obj = Property(**property_data.model_dump())
    doc = property_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()

    await db.properties.insert_one(doc)
    return property_obj


@router.put("/properties/{property_id}")
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


@router.delete("/properties/{property_id}")
async def delete_property(property_id: str):
    """Soft delete a property"""
    result = await db.properties.update_one(
        {"id": property_id},
        {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")

    return {"success": True, "message": "Property deleted"}


@router.get("/properties/{property_id}/availability")
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
                    from datetime import datetime as dt, timedelta
                    start = dt.strptime(entry_from, "%Y-%m-%d")
                    end = dt.strptime(entry_to or entry_from, "%Y-%m-%d")

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


@router.post("/properties/{property_id}/price-quote")
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
    from datetime import datetime as dt
    from_dt = dt.strptime(check.check_in, "%Y-%m-%d")
    to_dt = dt.strptime(check.check_out, "%Y-%m-%d")
    nights = (to_dt - from_dt).days

    if nights <= 0:
        return PriceQuote(
            available=False,
            nights=0,
            message="Invalid date range"
        )

    beds24_id = property_data.get("beds24_id")
    room_id = property_data.get("beds24_room_id")

    if beds24_id and room_id:
        # Use the room_id directly for availability and pricing

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

        logger.info(f"Beds24 offers response for room {room_id}: {offers}")

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

        # Try to get prices from calendar with BeyondPricing
        daily_prices = await beds24_service.get_daily_prices(room_id, check.check_in, check.check_out)
        if daily_prices.get("data"):
            calendar_data = daily_prices.get("data", [])
            if isinstance(calendar_data, list) and len(calendar_data) > 0:
                room_data = calendar_data[0]
                calendar = room_data.get("calendar", [])

                # Calculate total from daily prices
                total_price = 0
                price_per_night = 0

                for day in calendar:
                    # price1 is the primary price from BeyondPricing (per night)
                    day_price = day.get("price1") or day.get("price") or 0
                    if day_price > 0:
                        # Calculate number of days in this price range
                        from_date = day.get("from")
                        to_date = day.get("to")
                        if from_date and to_date:
                            range_start = dt.strptime(from_date, "%Y-%m-%d")
                            range_end = dt.strptime(to_date, "%Y-%m-%d")
                            days_in_range = (range_end - range_start).days
                            if days_in_range <= 0:
                                days_in_range = 1
                            total_price += day_price * days_in_range
                            price_per_night = day_price
                        else:
                            total_price += day_price
                            price_per_night = day_price

                if total_price > 0:
                    return PriceQuote(
                        available=True,
                        total_price=total_price,
                        currency=property_data.get("currency", "EUR"),
                        nights=nights,
                        price_per_night=price_per_night
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


@router.get("/properties/{property_id}/beds24-details")
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


@router.get("/properties/{property_id}/daily-prices")
async def get_property_daily_prices(property_id: str, from_date: str, to_date: str):
    """Get daily prices from Beds24 for a property"""
    property_data = await db.properties.find_one(
        {"id": property_id},
        {"_id": 0}
    )

    if not property_data:
        raise HTTPException(status_code=404, detail="Property not found")

    room_id = property_data.get("beds24_room_id")
    if not room_id:
        raise HTTPException(status_code=400, detail="Property not connected to Beds24")

    daily_prices = await beds24_service.get_daily_prices(room_id, from_date, to_date)

    return {
        "property_id": property_id,
        "room_id": room_id,
        "from_date": from_date,
        "to_date": to_date,
        "beds24_response": daily_prices
    }


@router.put("/properties/{property_id}/images")
async def update_property_images(property_id: str, images: List[str]):
    """Update property images"""
    result = await db.properties.update_one(
        {"$or": [{"id": property_id}, {"beds24_id": property_id}]},
        {"$set": {"images": images, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")

    return {"success": True, "message": "Images updated", "count": len(images)}


@router.put("/properties/{property_id}/category")
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
