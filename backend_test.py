#!/usr/bin/env python3

import requests
import sys
import json
import time
from datetime import datetime, timedelta

class ORSOBackendTester:
    def __init__(self, base_url="https://orso-preview-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.critical_failures = []
        
    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}" if not endpoint.startswith('/api/') else f"{self.base_url}{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.text else {}
                    if response_data:
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    response_data = {}
                return True, response_data
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:500]
                })
                if expected_status == 200 and response.status_code >= 500:
                    self.critical_failures.append(name)
                return False, {}
                
        except requests.exceptions.Timeout:
            print(f"❌ FAILED - Request timeout (>10s)")
            self.failed_tests.append({'name': name, 'error': 'timeout'})
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ FAILED - Connection error")
            self.failed_tests.append({'name': name, 'error': 'connection_error'})
            self.critical_failures.append(name)
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e)})
            return False, {}
    
    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n" + "="*60)
        print("🏥 TESTING HEALTH & BASIC ENDPOINTS")
        print("="*60)
        
        # Test API root
        self.run_test("API Root", "GET", "", 200)
        
        # Test health check
        self.run_test("Health Check", "GET", "health", 200)
    
    def test_categories(self):
        """Test categories endpoints"""
        print("\n" + "="*60)
        print("📂 TESTING CATEGORIES")
        print("="*60)
        
        success, categories_data = self.run_test("Get Categories", "GET", "categories", 200)
        
        if success and categories_data:
            print(f"   Found {len(categories_data)} categories")
            expected_categories = ['vue_mer', 'plage_a_pieds', 'pieds_dans_eau']
            found_categories = [cat.get('id') for cat in categories_data if isinstance(cat, dict)]
            
            for expected in expected_categories:
                if expected in found_categories:
                    print(f"   ✅ Category '{expected}' found")
                else:
                    print(f"   ❌ Category '{expected}' missing")
        
        return success
    
    def test_properties(self):
        """Test properties endpoints"""
        print("\n" + "="*60)
        print("🏠 TESTING PROPERTIES")
        print("="*60)
        
        # Get all properties
        success, props_data = self.run_test("Get All Properties", "GET", "properties", 200)
        
        properties = []
        if success and props_data:
            properties = props_data.get('properties', [])
            total = props_data.get('total', 0)
            print(f"   Found {len(properties)} properties (total: {total})")
            
            if properties:
                # Test first property details
                first_prop = properties[0]
                prop_id = first_prop.get('id')
                if prop_id:
                    self.run_test(f"Get Property Details ({prop_id})", "GET", f"properties/{prop_id}", 200)
        
        # Test property filters
        self.run_test("Filter by Vue Mer", "GET", "properties?category=vue_mer", 200)
        self.run_test("Filter by City", "GET", "properties?city=Porto-Vecchio", 200)
        self.run_test("Filter by Guests", "GET", "properties?guests=4", 200)
        
        # Test invalid property
        self.run_test("Invalid Property ID", "GET", "properties/invalid-id", 404)
        
        return success and len(properties) > 0, properties
    
    def test_availability_and_pricing(self, properties):
        """Test availability and pricing endpoints"""
        print("\n" + "="*60)
        print("📅 TESTING AVAILABILITY & PRICING")
        print("="*60)
        
        if not properties:
            print("❌ No properties available for testing")
            return False
        
        # Test with first bookable property (not showcase)
        bookable_props = [p for p in properties if not p.get('is_showcase', False)]
        if not bookable_props:
            print("❌ No bookable properties found")
            return False
            
        test_property = bookable_props[0]
        prop_id = test_property.get('id')
        
        # Test availability check
        from_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        to_date = (datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d')
        
        self.run_test(
            "Get Property Availability", 
            "GET", 
            f"properties/{prop_id}/availability?from_date={from_date}&to_date={to_date}", 
            200
        )
        
        # Test price quote
        quote_data = {
            "property_id": prop_id,
            "check_in": from_date,
            "check_out": to_date,
            "guests": 2
        }
        
        success, quote_response = self.run_test(
            "Get Price Quote", 
            "POST", 
            f"properties/{prop_id}/price-quote", 
            200,
            data=quote_data
        )
        
        if success and quote_response:
            available = quote_response.get('available')
            total_price = quote_response.get('total_price')
            print(f"   Available: {available}, Price: {total_price}€")
        
        return success
    
    def test_booking_system(self, properties):
        """Test booking system"""
        print("\n" + "="*60)
        print("📝 TESTING BOOKING SYSTEM")
        print("="*60)
        
        if not properties:
            print("❌ No properties available for testing")
            return False
        
        # Find bookable property
        bookable_props = [p for p in properties if not p.get('is_showcase', False)]
        if not bookable_props:
            print("❌ No bookable properties found")
            return False
            
        test_property = bookable_props[0]
        prop_id = test_property.get('id')
        
        # Test booking creation
        booking_data = {
            "property_id": prop_id,
            "check_in": (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            "check_out": (datetime.now() + timedelta(days=32)).strftime('%Y-%m-%d'),
            "guests": 2,
            "guest_name": "Test User",
            "guest_email": "test@example.com",
            "guest_phone": "+33600000000",
            "special_requests": "Test booking from automated testing",
            "total_price": 200.0,
            "currency": "EUR"
        }
        
        success, booking_response = self.run_test(
            "Create Booking", 
            "POST", 
            "bookings", 
            200,
            data=booking_data
        )
        
        booking_id = None
        if success and booking_response:
            booking_id = booking_response.get('booking_id')
            print(f"   Booking ID: {booking_id}")
            
            # Test get booking details
            if booking_id:
                self.run_test(
                    "Get Booking Details", 
                    "GET", 
                    f"bookings/{booking_id}", 
                    200
                )
        
        # Test invalid booking
        invalid_booking = booking_data.copy()
        invalid_booking['property_id'] = 'invalid-id'
        self.run_test("Invalid Property Booking", "POST", "bookings", 404, data=invalid_booking)
        
        return success
    
    def test_contact_system(self):
        """Test contact form submission"""
        print("\n" + "="*60)
        print("📧 TESTING CONTACT SYSTEM")
        print("="*60)
        
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+33600000000",
            "subject": "Test Subject",
            "message": "This is a test message from automated testing.",
            "language": "fr"
        }
        
        success, contact_response = self.run_test(
            "Submit Contact Form", 
            "POST", 
            "contact", 
            200,
            data=contact_data
        )
        
        if success and contact_response:
            success_flag = contact_response.get('success')
            message = contact_response.get('message', '')
            print(f"   Success: {success_flag}")
            print(f"   Message: {message[:100]}...")
        
        # Test invalid contact (missing required fields)
        invalid_contact = {"name": "Test"}  # Missing required email
        self.run_test("Invalid Contact Form", "POST", "contact", 422, data=invalid_contact)
        
        return success
    
    def test_demo_data_initialization(self):
        """Test demo data initialization"""
        print("\n" + "="*60)
        print("🎭 TESTING DEMO DATA INITIALIZATION")
        print("="*60)
        
        success, init_response = self.run_test(
            "Initialize Demo Data", 
            "POST", 
            "init-demo-data", 
            200
        )
        
        if success and init_response:
            inserted = init_response.get('inserted', 0)
            total = init_response.get('total', 0)
            print(f"   Inserted: {inserted}, Total: {total}")
        
        return success
    
    def test_beds24_sync(self):
        """Test Beds24 synchronization"""
        print("\n" + "="*60)
        print("🔄 TESTING BEDS24 SYNC")
        print("="*60)
        
        success, sync_response = self.run_test(
            "Sync Beds24 Properties", 
            "POST", 
            "sync/beds24", 
            200
        )
        
        if success and sync_response:
            synced = sync_response.get('synced', 0)
            total_beds24 = sync_response.get('total_beds24', 0)
            print(f"   Synced: {synced}, Total from Beds24: {total_beds24}")
            
            # Note: This might fail if Beds24 API is not accessible
            # but it should still return a proper response format
        
        return success
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"\n{'='*80}")
        print(f"🚀 STARTING ORSO RS BACKEND API TESTING")
        print(f"{'='*80}")
        print(f"Testing against: {self.base_url}")
        
        start_time = time.time()
        
        # Test basic health
        self.test_health_endpoints()
        
        # Test core functionality
        self.test_categories()
        has_properties, properties = self.test_properties()
        
        if has_properties:
            self.test_availability_and_pricing(properties)
            self.test_booking_system(properties)
        
        self.test_contact_system()
        
        # Test admin functionality
        self.test_demo_data_initialization()
        self.test_beds24_sync()
        
        # Print final results
        end_time = time.time()
        duration = round(end_time - start_time, 2)
        
        print(f"\n{'='*80}")
        print(f"📊 BACKEND TEST RESULTS")
        print(f"{'='*80}")
        print(f"✅ Tests passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests failed: {len(self.failed_tests)}")
        print(f"⚠️  Critical failures: {len(self.critical_failures)}")
        print(f"⏱️  Duration: {duration}s")
        
        if self.failed_tests:
            print(f"\n💥 FAILED TESTS:")
            for failure in self.failed_tests[:5]:  # Show first 5 failures
                print(f"   • {failure['name']}: {failure.get('error', 'HTTP error')}")
        
        if self.critical_failures:
            print(f"\n🚨 CRITICAL FAILURES:")
            for critical in self.critical_failures:
                print(f"   • {critical}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        return success_rate >= 80  # Consider success if 80%+ tests pass

def main():
    """Main test runner"""
    tester = ORSOBackendTester()
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())