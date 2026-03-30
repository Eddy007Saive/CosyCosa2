import httpx
import logging
from typing import List, Optional, Dict
from datetime import datetime, timezone
from database import db
from config import BEDS24_API_URL, BEDS24_TOKEN, BEDS24_REFRESH_TOKEN

logger = logging.getLogger(__name__)


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
                params = {
                    "roomId": room_id,
                    "arrival": from_date,
                    "departure": to_date
                }
                if occupancy:
                    params["numAdult"] = str(occupancy)

                response = await client.get(
                    f"{self.base_url}/inventory/rooms/offers",
                    headers=await self._get_headers(),
                    params=params
                )
                logger.info(f"Beds24 offers API response status: {response.status_code}")
                logger.info(f"Beds24 offers API response: {response.text[:1000] if response.text else 'empty'}")
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 401 and retry:
                    # Token expired, refresh and retry
                    await self.refresh_access_token()
                    return await self.get_offers(room_id, from_date, to_date, occupancy, retry=False)
        except Exception as e:
            logger.error(f"Error fetching offers for room {room_id}: {e}")
        return {}

    async def get_daily_prices(self, room_id: str, from_date: str, to_date: str, retry: bool = True) -> Dict:
        """Get daily prices for specific dates with BeyondPricing support"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/inventory/rooms/calendar",
                    headers=await self._get_headers(),
                    params={
                        "roomId": room_id,
                        "startDate": from_date,
                        "endDate": to_date,
                        "includePrices": "true",
                        "includeLinkedPrices": "true",
                        "includeChannels": "true"
                    }
                )
                logger.info(f"Beds24 daily prices response: {response.text[:500] if response.text else 'empty'}")
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 401 and retry:
                    await self.refresh_access_token()
                    return await self.get_daily_prices(room_id, from_date, to_date, retry=False)
        except Exception as e:
            logger.error(f"Error fetching daily prices for room {room_id}: {e}")
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
