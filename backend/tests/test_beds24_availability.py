"""
Test suite for Beds24 Availability and Price Quote APIs
Tests: 
- /api/properties/{id}/availability - Get blocked dates from Beds24
- /api/properties/{id}/price-quote - Verify availability before returning price
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')

# Test property IDs
# Beds24 test property - has beds24_id configured
BEDS24_TEST_PROPERTY_ID = "a24bdc95-f38e-49d5-8f7c-8e55e5815757"
# Demo properties without Beds24
DEMO_PROPERTY_ID = "villa-mare-1"
SHOWCASE_PROPERTY_ID = "domaine-exclusif-1"


class TestHealthAndBasics:
    """Basic API health checks"""
    
    def test_api_health(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("API health check: PASSED")

    def test_get_properties(self):
        """Test properties list endpoint"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        data = response.json()
        assert "properties" in data
        print(f"Properties endpoint: PASSED - {len(data['properties'])} properties found")


class TestAvailabilityEndpoint:
    """Tests for /api/properties/{id}/availability"""
    
    def test_availability_demo_property(self):
        """Test availability for demo property (no beds24_id) - should return empty blocked dates"""
        from_date = datetime.now().strftime('%Y-%m-%d')
        to_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        
        response = requests.get(
            f"{BASE_URL}/api/properties/{DEMO_PROPERTY_ID}/availability",
            params={"from_date": from_date, "to_date": to_date}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Demo property without Beds24 should have note about not synced
        assert "property_id" in data
        assert data["property_id"] == DEMO_PROPERTY_ID
        assert "blocked_dates" in data
        assert isinstance(data["blocked_dates"], list)
        
        # Check for note about Beds24 not connected
        if "note" in data:
            assert "not connected" in data["note"].lower() or "not synced" in data["note"].lower()
            print(f"Availability (demo property): PASSED - Note: {data.get('note')}")
        else:
            print(f"Availability (demo property): PASSED - Blocked dates: {len(data['blocked_dates'])}")
    
    def test_availability_showcase_property(self):
        """Test availability for showcase property - should indicate direct contact required"""
        from_date = datetime.now().strftime('%Y-%m-%d')
        to_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        
        response = requests.get(
            f"{BASE_URL}/api/properties/{SHOWCASE_PROPERTY_ID}/availability",
            params={"from_date": from_date, "to_date": to_date}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Showcase property should indicate it requires direct contact
        assert "is_showcase" in data and data["is_showcase"] == True
        assert "message" in data
        print(f"Availability (showcase): PASSED - Message: {data.get('message')}")
    
    def test_availability_beds24_property(self):
        """Test availability for Beds24 connected property"""
        from_date = datetime.now().strftime('%Y-%m-%d')
        to_date = (datetime.now() + timedelta(days=60)).strftime('%Y-%m-%d')
        
        # First check if property exists
        prop_response = requests.get(f"{BASE_URL}/api/properties/{BEDS24_TEST_PROPERTY_ID}")
        if prop_response.status_code == 404:
            pytest.skip(f"Beds24 test property {BEDS24_TEST_PROPERTY_ID} not found - may need to sync")
        
        response = requests.get(
            f"{BASE_URL}/api/properties/{BEDS24_TEST_PROPERTY_ID}/availability",
            params={"from_date": from_date, "to_date": to_date}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "property_id" in data
        assert "blocked_dates" in data
        assert isinstance(data["blocked_dates"], list)
        
        # Check if beds24_id is in response
        if "beds24_id" in data:
            print(f"Availability (Beds24): PASSED - beds24_id: {data['beds24_id']}")
            if "room_ids" in data:
                print(f"  Room IDs: {data['room_ids']}")
        
        print(f"  Blocked dates count: {len(data['blocked_dates'])}")
        if data['blocked_dates']:
            print(f"  Sample blocked dates: {data['blocked_dates'][:5]}")
    
    def test_availability_invalid_property(self):
        """Test availability for non-existent property"""
        from_date = datetime.now().strftime('%Y-%m-%d')
        to_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        
        response = requests.get(
            f"{BASE_URL}/api/properties/invalid-property-id-123/availability",
            params={"from_date": from_date, "to_date": to_date}
        )
        assert response.status_code == 404
        print("Availability (invalid property): PASSED - Returns 404")


class TestPriceQuoteEndpoint:
    """Tests for /api/properties/{id}/price-quote"""
    
    def test_price_quote_demo_property(self):
        """Test price quote for demo property - should return fallback price"""
        check_in = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d')
        
        response = requests.post(
            f"{BASE_URL}/api/properties/{DEMO_PROPERTY_ID}/price-quote",
            json={
                "property_id": DEMO_PROPERTY_ID,
                "check_in": check_in,
                "check_out": check_out,
                "guests": 4
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "available" in data
        assert data["available"] == True
        assert "total_price" in data
        assert "nights" in data
        assert data["nights"] == 5
        assert "price_per_night" in data
        assert data["total_price"] == data["price_per_night"] * data["nights"]
        
        print(f"Price quote (demo): PASSED - {data['nights']} nights @ {data['price_per_night']}€/night = {data['total_price']}€")
    
    def test_price_quote_showcase_property(self):
        """Test price quote for showcase property - should indicate not available for online booking"""
        check_in = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d')
        
        response = requests.post(
            f"{BASE_URL}/api/properties/{SHOWCASE_PROPERTY_ID}/price-quote",
            json={
                "property_id": SHOWCASE_PROPERTY_ID,
                "check_in": check_in,
                "check_out": check_out,
                "guests": 4
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert data["available"] == False
        print(f"Price quote (showcase): PASSED - Available: {data['available']}, Message: {data.get('message', 'N/A')}")
    
    def test_price_quote_beds24_property(self):
        """Test price quote for Beds24 connected property"""
        check_in = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=35)).strftime('%Y-%m-%d')
        
        # First check if property exists
        prop_response = requests.get(f"{BASE_URL}/api/properties/{BEDS24_TEST_PROPERTY_ID}")
        if prop_response.status_code == 404:
            pytest.skip(f"Beds24 test property {BEDS24_TEST_PROPERTY_ID} not found")
        
        response = requests.post(
            f"{BASE_URL}/api/properties/{BEDS24_TEST_PROPERTY_ID}/price-quote",
            json={
                "property_id": BEDS24_TEST_PROPERTY_ID,
                "check_in": check_in,
                "check_out": check_out,
                "guests": 2
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "available" in data
        assert "nights" in data
        assert data["nights"] == 5
        
        if data["available"]:
            assert "total_price" in data
            assert data["total_price"] > 0
            print(f"Price quote (Beds24): PASSED - Available, {data['nights']} nights = {data['total_price']}€")
        else:
            print(f"Price quote (Beds24): PASSED - Not available: {data.get('message', 'No message')}")
    
    def test_price_quote_invalid_dates(self):
        """Test price quote with invalid dates (checkout before checkin)"""
        check_in = (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')  # Before check_in
        
        response = requests.post(
            f"{BASE_URL}/api/properties/{DEMO_PROPERTY_ID}/price-quote",
            json={
                "property_id": DEMO_PROPERTY_ID,
                "check_in": check_in,
                "check_out": check_out,
                "guests": 2
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Should return not available due to invalid date range
        assert data["available"] == False or data["nights"] <= 0
        print(f"Price quote (invalid dates): PASSED - Handled invalid date range")
    
    def test_price_quote_invalid_property(self):
        """Test price quote for non-existent property"""
        check_in = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')
        check_out = (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d')
        
        response = requests.post(
            f"{BASE_URL}/api/properties/invalid-property-id-123/price-quote",
            json={
                "property_id": "invalid-property-id-123",
                "check_in": check_in,
                "check_out": check_out,
                "guests": 2
            }
        )
        assert response.status_code == 404
        print("Price quote (invalid property): PASSED - Returns 404")


class TestBeds24Sync:
    """Tests for Beds24 sync endpoints"""
    
    def test_get_beds24_properties_raw(self):
        """Test raw Beds24 properties endpoint (for debugging)"""
        response = requests.get(f"{BASE_URL}/api/sync/beds24/properties")
        assert response.status_code == 200
        data = response.json()
        
        assert "properties" in data
        assert "count" in data
        
        print(f"Beds24 raw properties: PASSED - {data['count']} properties from Beds24 API")
        if data["properties"]:
            sample = data["properties"][0]
            print(f"  Sample property: id={sample.get('id')}, name={sample.get('name')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
