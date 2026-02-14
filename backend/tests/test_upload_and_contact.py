"""
Test Image Upload and Showcase Property Contact Form Features
New P0-P1 features:
1) Drag-and-drop image upload in admin
2) Integrated contact form for showcase properties
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Minimal valid PNG bytes for testing
MINIMAL_PNG = bytes([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  # PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,  # IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,  # 1x1 pixels
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,  # 8-bit RGB
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,  # IDAT chunk
    0x54, 0x78, 0x9C, 0x63, 0xF8, 0x0F, 0x00, 0x00,
    0x01, 0x01, 0x00, 0x05, 0x18, 0xD8, 0x4E, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,  # IEND chunk
    0x42, 0x60, 0x82
])


class TestImageUploadAPI:
    """Test POST /api/upload/image endpoint for admin drag-and-drop uploads"""
    
    def test_upload_valid_png_image(self):
        """POST /api/upload/image with valid PNG should return success"""
        files = {'file': ('test_image.png', MINIMAL_PNG, 'image/png')}
        response = requests.post(f"{BASE_URL}/api/upload/image", files=files)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get('success') == True, "Response should indicate success"
        assert 'url' in data, "Response should contain url"
        assert 'filename' in data, "Response should contain filename"
        assert data['url'].startswith('/api/uploads/'), "URL should start with /api/uploads/"
        print(f"✓ PNG upload successful: {data['filename']}")
        
        # Store for later cleanup
        self.uploaded_file = data['filename']
        return data['filename']
    
    def test_upload_valid_jpg_image(self):
        """POST /api/upload/image with valid JPEG should return success"""
        # Minimal valid JPEG (1x1 white pixel)
        jpeg_bytes = bytes([
            0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
            0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
            0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
            0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
            0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
            0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
            0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
            0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
            0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
            0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
            0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
            0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
            0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
            0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
            0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
            0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
            0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
            0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
            0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
            0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
            0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
            0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
            0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD5, 0xDB, 0xFF, 0xD9
        ])
        files = {'file': ('test_image.jpg', jpeg_bytes, 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/api/upload/image", files=files)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get('success') == True
        print(f"✓ JPEG upload successful: {data['filename']}")
    
    def test_upload_invalid_file_type(self):
        """POST /api/upload/image with invalid type should return 400"""
        # Try uploading a text file
        files = {'file': ('test.txt', b'This is not an image', 'text/plain')}
        response = requests.post(f"{BASE_URL}/api/upload/image", files=files)
        
        assert response.status_code == 400, f"Expected 400 for invalid type, got {response.status_code}"
        data = response.json()
        assert 'detail' in data, "Error response should contain detail"
        print("✓ Invalid file type rejected with 400")
    
    def test_upload_no_file(self):
        """POST /api/upload/image without file should return 422"""
        response = requests.post(f"{BASE_URL}/api/upload/image")
        
        assert response.status_code == 422, f"Expected 422 for missing file, got {response.status_code}"
        print("✓ Missing file returns 422")


class TestUploadedImageServing:
    """Test GET /api/uploads/{filename} endpoint for serving uploaded images"""
    
    @pytest.fixture(autouse=True)
    def upload_test_image(self):
        """Upload an image before each test"""
        files = {'file': ('test_serve.png', MINIMAL_PNG, 'image/png')}
        response = requests.post(f"{BASE_URL}/api/upload/image", files=files)
        self.uploaded_filename = response.json().get('filename')
        yield
        # No cleanup needed - files persist
    
    def test_serve_uploaded_image(self):
        """GET /api/uploads/{filename} should return the uploaded image"""
        response = requests.get(f"{BASE_URL}/api/uploads/{self.uploaded_filename}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert response.headers.get('content-type') == 'image/png', "Content-Type should be image/png"
        assert len(response.content) > 0, "Response should contain image data"
        print(f"✓ Image served successfully: {self.uploaded_filename}")
    
    def test_serve_nonexistent_image(self):
        """GET /api/uploads/{filename} for non-existent file should return 404"""
        response = requests.get(f"{BASE_URL}/api/uploads/nonexistent_file_12345.png")
        
        assert response.status_code == 404, f"Expected 404 for non-existent file, got {response.status_code}"
        print("✓ Non-existent file returns 404")


class TestShowcasePropertyContactForm:
    """Test contact form for showcase properties (vitrine)"""
    
    def test_contact_form_submission(self):
        """POST /api/contact should submit contact request"""
        contact_data = {
            "name": "TEST_Contact_User",
            "email": "test_contact@example.com",
            "phone": "+33612345678",
            "subject": "Demande d'information: Domaine Exclusif",
            "message": "Je souhaite plus d'informations sur cette propriété d'exception.",
            "property_id": "domaine-exclusif-1",
            "language": "fr"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=contact_data,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get('success') == True, "Response should indicate success"
        assert 'message' in data, "Response should contain a message"
        print("✓ Contact form submission successful")
    
    def test_contact_form_with_minimal_data(self):
        """POST /api/contact with minimal required fields"""
        contact_data = {
            "name": "TEST_Minimal",
            "email": "minimal@example.com",
            "subject": "Test Subject",
            "message": "Test message content"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=contact_data,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✓ Contact form with minimal data successful")
    
    def test_contact_form_missing_required_fields(self):
        """POST /api/contact with missing required fields should return 422"""
        contact_data = {
            "name": "Test User"
            # Missing email, subject, message
        }
        
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=contact_data,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 422, f"Expected 422 for missing fields, got {response.status_code}"
        print("✓ Missing required fields returns 422")
    
    def test_contact_form_invalid_email(self):
        """POST /api/contact with invalid email should return 422"""
        contact_data = {
            "name": "Test User",
            "email": "not-a-valid-email",
            "subject": "Test",
            "message": "Test message"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=contact_data,
            headers={'Content-Type': 'application/json'}
        )
        
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
        print("✓ Invalid email returns 422")


class TestShowcaseProperty:
    """Test showcase property configuration"""
    
    def test_get_showcase_property(self):
        """GET /api/properties/domaine-exclusif-1 should return showcase property"""
        response = requests.get(f"{BASE_URL}/api/properties/domaine-exclusif-1")
        
        # May return 404 if property doesn't exist - check demo data
        if response.status_code == 404:
            # Initialize demo data first
            requests.post(f"{BASE_URL}/api/init-demo-data")
            response = requests.get(f"{BASE_URL}/api/properties/domaine-exclusif-1")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get('is_showcase') == True, "Property should be marked as showcase"
        assert data.get('name') == 'Domaine Exclusif', "Property name should match"
        print(f"✓ Showcase property retrieved: {data['name']}, is_showcase={data['is_showcase']}")
    
    def test_showcase_property_no_price(self):
        """Showcase property should have no price_from (or null)"""
        # Ensure demo data exists
        requests.post(f"{BASE_URL}/api/init-demo-data")
        
        response = requests.get(f"{BASE_URL}/api/properties/domaine-exclusif-1")
        data = response.json()
        
        # price_from should be None for showcase properties (available on request only)
        price_from = data.get('price_from')
        assert price_from is None, f"Showcase property should have no price, got {price_from}"
        print("✓ Showcase property has no price_from (as expected)")


class TestHealthAndIntegration:
    """Basic health checks for API"""
    
    def test_api_health(self):
        """API health endpoint should return healthy"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get('status') == 'healthy'
        print("✓ API health check passed")
    
    def test_uploads_directory_exists(self):
        """Uploads directory should be accessible (404 for nonexistent = dir working)"""
        response = requests.get(f"{BASE_URL}/api/uploads/nonexistent.png")
        # 404 means the endpoint is working, just file doesn't exist
        assert response.status_code == 404
        print("✓ Uploads endpoint accessible")


if __name__ == "__main__":
    pytest.main([__file__, '-v', '--tb=short'])
