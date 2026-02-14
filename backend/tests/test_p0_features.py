"""
Test P0 Features for ORSO RS Admin
P0-1: Hidden properties visible in admin with badge 'Masqué'
P0-2: Site images management with tabs per page (Accueil, Services, Contact, Propriétés)
API /api/properties?include_hidden=true returns ALL properties
API /api/properties (no param) returns ONLY visible properties
API /api/settings/images returns new image keys (home_hero, services_hero, etc.)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Expected new image keys organized by page
NEW_SITE_IMAGE_KEYS = [
    # Page d'accueil (Home)
    'home_hero',
    'home_category_vue_mer',
    'home_category_plage_a_pieds',
    'home_category_pieds_dans_eau',
    'home_concept',
    'home_cta',
    # Page Services
    'services_hero',
    'services_lifestyle',
    # Page Contact
    'contact_hero',
    # Page Propriétés
    'properties_hero',
]


class TestPropertiesAPIFiltering:
    """Test P0-1: Hidden properties should be returned when include_hidden=true"""
    
    def test_api_properties_returns_200(self):
        """GET /api/properties should return 200"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        print("✓ GET /api/properties returns 200")
    
    def test_api_properties_without_param_returns_only_active(self):
        """GET /api/properties should return ONLY is_active=true properties"""
        response = requests.get(f"{BASE_URL}/api/properties")
        data = response.json()
        
        properties = data.get('properties', [])
        assert len(properties) > 0, "Should have at least one property"
        
        # All properties should be active
        for prop in properties:
            assert prop.get('is_active', False) == True, f"Property {prop.get('name')} should be active"
        
        print(f"✓ GET /api/properties returns only active properties ({len(properties)} total)")
    
    def test_api_properties_with_include_hidden_returns_all(self):
        """GET /api/properties?include_hidden=true should return ALL properties"""
        response = requests.get(f"{BASE_URL}/api/properties?include_hidden=true")
        data = response.json()
        
        all_properties = data.get('properties', [])
        
        # Check for properties with different is_active values
        active_count = sum(1 for p in all_properties if p.get('is_active'))
        hidden_count = sum(1 for p in all_properties if not p.get('is_active'))
        
        print(f"✓ include_hidden=true returns {len(all_properties)} properties")
        print(f"  - Active: {active_count}, Hidden: {hidden_count}")
        
        # Should have hidden properties if any exist
        # Note: This assertion depends on test data having hidden properties
        assert len(all_properties) > 0, "Should have properties"
    
    def test_include_hidden_returns_more_properties_than_default(self):
        """include_hidden=true should return >= properties than default call"""
        # Get default (only active)
        response_default = requests.get(f"{BASE_URL}/api/properties")
        default_count = response_default.json().get('total', 0)
        
        # Get with include_hidden
        response_hidden = requests.get(f"{BASE_URL}/api/properties?include_hidden=true")
        hidden_count = response_hidden.json().get('total', 0)
        
        assert hidden_count >= default_count, \
            f"include_hidden should return >= properties: hidden={hidden_count}, default={default_count}"
        
        print(f"✓ include_hidden returns {hidden_count} >= default {default_count}")
    
    def test_hidden_properties_have_is_active_false(self):
        """Hidden properties should have is_active: false"""
        response = requests.get(f"{BASE_URL}/api/properties?include_hidden=true")
        properties = response.json().get('properties', [])
        
        hidden_properties = [p for p in properties if not p.get('is_active')]
        
        for prop in hidden_properties:
            assert prop.get('is_active') == False, f"Hidden property {prop.get('name')} should have is_active=false"
        
        if len(hidden_properties) > 0:
            print(f"✓ Found {len(hidden_properties)} hidden properties with is_active=false")
        else:
            print("⚠ No hidden properties found in database (may need to hide some for full test)")


class TestSiteImagesNewKeys:
    """Test P0-2: Site images API should return new image keys organized by page"""
    
    def test_get_site_images_returns_200(self):
        """GET /api/settings/images should return 200"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        assert response.status_code == 200
        print("✓ GET /api/settings/images returns 200")
    
    def test_site_images_contains_home_page_keys(self):
        """Site images should contain home page image keys"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        images = response.json().get('images', {})
        
        home_keys = ['home_hero', 'home_category_vue_mer', 'home_category_plage_a_pieds', 
                     'home_category_pieds_dans_eau', 'home_concept', 'home_cta']
        
        for key in home_keys:
            assert key in images, f"Missing home page image key: {key}"
            assert images[key], f"Home image {key} should have a URL"
        
        print(f"✓ All {len(home_keys)} home page image keys present")
    
    def test_site_images_contains_services_page_keys(self):
        """Site images should contain services page image keys"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        images = response.json().get('images', {})
        
        services_keys = ['services_hero', 'services_lifestyle']
        
        for key in services_keys:
            assert key in images, f"Missing services page image key: {key}"
        
        print(f"✓ All {len(services_keys)} services page image keys present")
    
    def test_site_images_contains_contact_page_key(self):
        """Site images should contain contact page image key"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        images = response.json().get('images', {})
        
        assert 'contact_hero' in images, "Missing contact_hero key"
        print("✓ Contact page image key present")
    
    def test_site_images_contains_properties_page_key(self):
        """Site images should contain properties page image key"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        images = response.json().get('images', {})
        
        assert 'properties_hero' in images, "Missing properties_hero key"
        print("✓ Properties page image key present")
    
    def test_all_new_image_keys_present(self):
        """All new image keys should be present"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        images = response.json().get('images', {})
        
        missing_keys = []
        for key in NEW_SITE_IMAGE_KEYS:
            if key not in images:
                missing_keys.append(key)
        
        assert len(missing_keys) == 0, f"Missing image keys: {missing_keys}"
        print(f"✓ All {len(NEW_SITE_IMAGE_KEYS)} new image keys present")


class TestBookingAPIFlow:
    """Test P1: Booking flow APIs"""
    
    def test_price_quote_endpoint_works(self):
        """POST /api/properties/{id}/price-quote should return price quote"""
        # First get a property ID
        response = requests.get(f"{BASE_URL}/api/properties")
        properties = response.json().get('properties', [])
        
        # Find a bookable property (not showcase)
        bookable = [p for p in properties if not p.get('is_showcase')]
        assert len(bookable) > 0, "Need at least one bookable property"
        
        property_id = bookable[0]['id']
        
        # Get price quote
        quote_response = requests.post(
            f"{BASE_URL}/api/properties/{property_id}/price-quote",
            json={
                "property_id": property_id,
                "check_in": "2026-03-23",
                "check_out": "2026-03-27",
                "guests": 2
            }
        )
        
        assert quote_response.status_code == 200
        quote = quote_response.json()
        
        assert 'available' in quote
        assert 'nights' in quote
        
        if quote['available']:
            assert 'total_price' in quote
            assert quote['nights'] == 4
            print(f"✓ Price quote: {quote.get('total_price')}€ for {quote.get('nights')} nights")
        else:
            print(f"✓ Price quote returned (dates not available)")
    
    def test_create_booking_endpoint_works(self):
        """POST /api/bookings should create a booking"""
        # First get a property
        response = requests.get(f"{BASE_URL}/api/properties")
        properties = response.json().get('properties', [])
        bookable = [p for p in properties if not p.get('is_showcase')]
        assert len(bookable) > 0
        
        property_id = bookable[0]['id']
        
        # Create booking
        booking_response = requests.post(
            f"{BASE_URL}/api/bookings",
            json={
                "property_id": property_id,
                "check_in": "2026-04-10",
                "check_out": "2026-04-15",
                "guests": 2,
                "guest_name": "TEST_User BookingTest",
                "guest_email": "test_booking@test.com",
                "guest_phone": "+33600000000",
                "special_requests": "Test booking - do not process",
                "total_price": 1000,
                "currency": "EUR"
            }
        )
        
        assert booking_response.status_code == 200
        result = booking_response.json()
        
        assert result.get('success') == True
        assert 'booking_id' in result
        
        print(f"✓ Booking created with ID: {result.get('booking_id')}")
    
    def test_availability_endpoint_works(self):
        """GET /api/properties/{id}/availability should return availability"""
        response = requests.get(f"{BASE_URL}/api/properties")
        properties = response.json().get('properties', [])
        
        bookable = [p for p in properties if not p.get('is_showcase')]
        assert len(bookable) > 0
        
        property_id = bookable[0]['id']
        
        # Get availability
        avail_response = requests.get(
            f"{BASE_URL}/api/properties/{property_id}/availability",
            params={
                "from_date": "2026-03-01",
                "to_date": "2026-03-31"
            }
        )
        
        assert avail_response.status_code == 200
        avail = avail_response.json()
        
        assert 'property_id' in avail
        assert 'blocked_dates' in avail
        
        print(f"✓ Availability returned for property {property_id}")
        print(f"  - Blocked dates: {len(avail.get('blocked_dates', []))}")


class TestHealthCheck:
    """Basic health check"""
    
    def test_api_health(self):
        """API health endpoint should return healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get('status') == 'healthy'
        print("✓ API health check passed")


if __name__ == "__main__":
    pytest.main([__file__, '-v'])
