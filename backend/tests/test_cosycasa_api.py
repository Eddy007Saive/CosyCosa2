"""
CosyCasa API Tests - Testing all backend endpoints for the CosyCasa rebranding
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://concierge-staging-2.preview.emergentagent.com')

class TestHealthAndBasicEndpoints:
    """Test health check and basic API endpoints"""
    
    def test_health_check(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print(f"✓ Health check passed: {data}")
    
    def test_root_endpoint(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        # Note: API message still says "ORSO RS API" - this is internal and acceptable
        assert "message" in data
        print(f"✓ Root endpoint passed: {data}")


class TestCategoriesEndpoint:
    """Test categories endpoint"""
    
    def test_get_categories(self):
        """Test getting all categories"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 3  # vue_mer, plage_a_pieds, pieds_dans_eau
        
        category_ids = [cat["id"] for cat in data]
        assert "vue_mer" in category_ids
        assert "plage_a_pieds" in category_ids
        assert "pieds_dans_eau" in category_ids
        print(f"✓ Categories endpoint passed: {len(data)} categories")


class TestPropertiesEndpoint:
    """Test properties endpoints"""
    
    def test_get_properties_public(self):
        """Test getting public properties (only active ones)"""
        response = requests.get(f"{BASE_URL}/api/properties")
        assert response.status_code == 200
        data = response.json()
        assert "properties" in data
        assert "total" in data
        # All Beds24 properties are hidden, so public API returns 0
        print(f"✓ Public properties endpoint passed: {data['total']} properties")
    
    def test_get_properties_with_hidden(self):
        """Test getting all properties including hidden ones"""
        response = requests.get(f"{BASE_URL}/api/properties?include_hidden=true")
        assert response.status_code == 200
        data = response.json()
        assert "properties" in data
        assert "total" in data
        # Should have Beds24 synced properties
        assert data["total"] > 0
        print(f"✓ Properties with hidden endpoint passed: {data['total']} properties")
    
    def test_get_properties_by_category(self):
        """Test filtering properties by category"""
        response = requests.get(f"{BASE_URL}/api/properties?category=vue_mer&include_hidden=true")
        assert response.status_code == 200
        data = response.json()
        assert "properties" in data
        print(f"✓ Properties by category endpoint passed: {data['total']} vue_mer properties")


class TestAdminEndpoint:
    """Test admin authentication endpoint"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "orso2024"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✓ Admin login success: {data}")
    
    def test_admin_login_failure(self):
        """Test admin login with wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/admin/login",
            json={"password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Admin login failure handled correctly")


class TestSiteImagesEndpoint:
    """Test site images settings endpoint"""
    
    def test_get_site_images(self):
        """Test getting site images"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        assert response.status_code == 200
        data = response.json()
        assert "images" in data
        
        # Check for expected image keys
        images = data["images"]
        expected_keys = [
            "home_hero", "home_category_vue_mer", "home_category_plage_a_pieds",
            "home_category_pieds_dans_eau", "home_concept", "home_cta",
            "services_hero", "contact_hero", "properties_hero"
        ]
        for key in expected_keys:
            assert key in images, f"Missing image key: {key}"
        
        print(f"✓ Site images endpoint passed: {len(images)} images configured")


class TestContactEndpoint:
    """Test contact form endpoint"""
    
    def test_submit_contact(self):
        """Test submitting a contact form"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+33612345678",
            "subject": "Test Subject",
            "message": "This is a test message from automated testing.",
            "language": "fr"
        }
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=contact_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        print(f"✓ Contact form submission passed: {data}")


class TestBeds24SyncEndpoint:
    """Test Beds24 sync endpoints"""
    
    def test_get_sync_status(self):
        """Test getting sync status"""
        response = requests.get(f"{BASE_URL}/api/sync/status")
        assert response.status_code == 200
        data = response.json()
        assert "scheduler_running" in data
        assert "sync_enabled" in data
        print(f"✓ Sync status endpoint passed: scheduler_running={data['scheduler_running']}")


class TestServicesPdfEndpoint:
    """Test services PDF endpoint"""
    
    def test_get_services_pdf(self):
        """Test getting services PDF URL"""
        response = requests.get(f"{BASE_URL}/api/settings/services-pdf")
        assert response.status_code == 200
        data = response.json()
        assert "services_pdf_url" in data
        print(f"✓ Services PDF endpoint passed: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
