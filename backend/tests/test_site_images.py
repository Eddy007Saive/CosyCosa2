"""
Test Site Images API endpoints
Tests for GET /api/settings/images and PUT /api/settings/images
Feature: Admin management of site images for homepage (hero, categories, concept, CTA)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Expected default image keys
DEFAULT_IMAGE_KEYS = [
    'hero_home',
    'category_vue_mer',
    'category_plage_a_pieds',
    'category_pieds_dans_eau',
    'concept_interior',
    'cta_background'
]


class TestSiteImagesAPI:
    """Test Site Images API for admin management of homepage images"""
    
    def test_get_site_images_returns_200(self):
        """GET /api/settings/images should return 200"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ GET /api/settings/images returns 200")
    
    def test_get_site_images_returns_images_object(self):
        """GET /api/settings/images should return images object"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        data = response.json()
        assert 'images' in data, "Response should contain 'images' key"
        assert isinstance(data['images'], dict), "images should be a dictionary"
        print("✓ GET /api/settings/images returns images object")
    
    def test_get_site_images_contains_required_keys(self):
        """GET /api/settings/images should contain all required image keys"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        data = response.json()
        images = data.get('images', {})
        
        for key in DEFAULT_IMAGE_KEYS:
            assert key in images, f"Missing required image key: {key}"
            assert images[key], f"Image URL for {key} should not be empty"
        print(f"✓ All {len(DEFAULT_IMAGE_KEYS)} required image keys present")
    
    def test_get_site_images_urls_are_valid_format(self):
        """Image URLs should be valid HTTP/HTTPS URLs"""
        response = requests.get(f"{BASE_URL}/api/settings/images")
        data = response.json()
        images = data.get('images', {})
        
        for key, url in images.items():
            assert url.startswith('http'), f"Image {key} URL should start with http: {url}"
        print("✓ All image URLs have valid format")
    
    def test_put_site_images_returns_success(self):
        """PUT /api/settings/images should return success"""
        # First get current images
        get_response = requests.get(f"{BASE_URL}/api/settings/images")
        original_images = get_response.json().get('images', {})
        
        # Update with test value
        test_images = original_images.copy()
        test_images['hero_home'] = 'https://images.unsplash.com/TEST_IMAGE_URL?w=1920'
        
        response = requests.put(
            f"{BASE_URL}/api/settings/images",
            json=test_images,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get('success') == True, "Response should indicate success"
        print("✓ PUT /api/settings/images returns success")
        
        # Cleanup - restore original
        requests.put(
            f"{BASE_URL}/api/settings/images",
            json=original_images,
            headers={'Content-Type': 'application/json'}
        )
    
    def test_put_site_images_persists_data(self):
        """PUT /api/settings/images should persist changes to database"""
        # Get current images
        get_response = requests.get(f"{BASE_URL}/api/settings/images")
        original_images = get_response.json().get('images', {})
        
        # Update with test value
        test_url = 'https://images.unsplash.com/PERSISTENCE_TEST?w=1920'
        test_images = original_images.copy()
        test_images['hero_home'] = test_url
        
        # Save
        requests.put(
            f"{BASE_URL}/api/settings/images",
            json=test_images,
            headers={'Content-Type': 'application/json'}
        )
        
        # Verify persistence via GET
        verify_response = requests.get(f"{BASE_URL}/api/settings/images")
        verify_data = verify_response.json()
        
        assert verify_data['images']['hero_home'] == test_url, "Image change should persist"
        print("✓ PUT changes persist to database (verified via GET)")
        
        # Cleanup - restore original
        requests.put(
            f"{BASE_URL}/api/settings/images",
            json=original_images,
            headers={'Content-Type': 'application/json'}
        )
    
    def test_put_site_images_partial_update(self):
        """PUT /api/settings/images with partial data should work"""
        # Get current images
        get_response = requests.get(f"{BASE_URL}/api/settings/images")
        original_images = get_response.json().get('images', {})
        
        # Update just one image
        partial_images = {'hero_home': 'https://images.unsplash.com/PARTIAL_UPDATE_TEST?w=1920'}
        
        response = requests.put(
            f"{BASE_URL}/api/settings/images",
            json=partial_images,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 200, f"Partial update should return 200, got {response.status_code}"
        print("✓ Partial update accepted")
        
        # Cleanup - restore original
        requests.put(
            f"{BASE_URL}/api/settings/images",
            json=original_images,
            headers={'Content-Type': 'application/json'}
        )


class TestHealthAndIntegration:
    """Basic health checks"""
    
    def test_api_health(self):
        """API health endpoint should return healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get('status') == 'healthy'
        print("✓ API health check passed")


if __name__ == "__main__":
    pytest.main([__file__, '-v'])
