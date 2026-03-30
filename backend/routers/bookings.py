from fastapi import APIRouter, HTTPException, BackgroundTasks
from datetime import datetime, timezone
from urllib.parse import urlencode

from models import BookingRequest, Booking
from database import db
from emails import send_booking_confirmation

router = APIRouter()

import logging
logger = logging.getLogger(__name__)


@router.post("/bookings")
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


@router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str):
    """Get booking details"""
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.post("/properties/{property_id}/booking-url")
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
