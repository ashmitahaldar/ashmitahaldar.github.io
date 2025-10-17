#!/usr/bin/env python3
"""
Backend API Testing Script for Portfolio Application
Tests all portfolio API endpoints with proper error handling and validation.
"""

import requests
import json
import sys
from typing import Dict, Any, List

# Get backend URL from frontend .env file
BACKEND_URL = "https://retro-terminal-4.preview.emergentagent.com/api"

class PortfolioAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.results = []
        
    def log_result(self, endpoint: str, method: str, status: str, details: str = ""):
        """Log test result"""
        result = {
            'endpoint': endpoint,
            'method': method,
            'status': status,
            'details': details
        }
        self.results.append(result)
        status_symbol = "✅" if status == "PASS" else "❌"
        print(f"{status_symbol} {method} {endpoint} - {status}")
        if details:
            print(f"   Details: {details}")
    
    def test_endpoint(self, endpoint: str, method: str = "GET", expected_status: int = 200, 
                     data: Dict = None, validate_json: bool = True) -> bool:
        """Test a single endpoint"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method == "GET":
                response = self.session.get(url, timeout=10)
            elif method == "POST":
                response = self.session.post(url, json=data, timeout=10)
            elif method == "PUT":
                response = self.session.put(url, json=data, timeout=10)
            elif method == "DELETE":
                response = self.session.delete(url, timeout=10)
            else:
                self.log_result(endpoint, method, "FAIL", f"Unsupported method: {method}")
                return False
                
            # Check status code
            if response.status_code != expected_status:
                self.log_result(endpoint, method, "FAIL", 
                              f"Expected status {expected_status}, got {response.status_code}")
                return False
            
            # Validate JSON response if required
            if validate_json:
                try:
                    json_data = response.json()
                    if not isinstance(json_data, (dict, list)):
                        self.log_result(endpoint, method, "FAIL", "Response is not valid JSON object/array")
                        return False
                except json.JSONDecodeError:
                    self.log_result(endpoint, method, "FAIL", "Response is not valid JSON")
                    return False
            
            self.log_result(endpoint, method, "PASS", f"Status: {response.status_code}")
            return True
            
        except requests.exceptions.ConnectionError:
            self.log_result(endpoint, method, "FAIL", "Connection error - backend may not be running")
            return False
        except requests.exceptions.Timeout:
            self.log_result(endpoint, method, "FAIL", "Request timeout")
            return False
        except Exception as e:
            self.log_result(endpoint, method, "FAIL", f"Unexpected error: {str(e)}")
            return False
    
    def test_profile_endpoints(self):
        """Test profile-related endpoints"""
        print("\n=== Testing Profile Endpoints ===")
        
        # Test GET /api/profile
        success = self.test_endpoint("/profile", "GET")
        
        if success:
            # Validate profile structure
            try:
                response = self.session.get(f"{self.base_url}/profile")
                profile_data = response.json()
                
                required_fields = ['name', 'title', 'email']
                missing_fields = [field for field in required_fields if field not in profile_data]
                
                if missing_fields:
                    self.log_result("/profile", "GET", "FAIL", 
                                  f"Missing required fields: {missing_fields}")
                else:
                    self.log_result("/profile", "GET", "PASS", "Profile structure valid")
                    
            except Exception as e:
                self.log_result("/profile", "GET", "FAIL", f"Profile validation error: {str(e)}")
    
    def test_skills_endpoints(self):
        """Test skills-related endpoints"""
        print("\n=== Testing Skills Endpoints ===")
        
        # Test GET /api/skills
        success = self.test_endpoint("/skills", "GET")
        
        if success:
            # Validate skills structure
            try:
                response = self.session.get(f"{self.base_url}/skills")
                skills_data = response.json()
                
                expected_fields = ['languages', 'frameworks', 'tools']
                missing_fields = [field for field in expected_fields if field not in skills_data]
                
                if missing_fields:
                    self.log_result("/skills", "GET", "FAIL", 
                                  f"Missing expected fields: {missing_fields}")
                else:
                    self.log_result("/skills", "GET", "PASS", "Skills structure valid")
                    
            except Exception as e:
                self.log_result("/skills", "GET", "FAIL", f"Skills validation error: {str(e)}")
    
    def test_experience_endpoints(self):
        """Test experience-related endpoints"""
        print("\n=== Testing Experience Endpoints ===")
        
        # Test GET /api/experience
        success = self.test_endpoint("/experience", "GET")
        
        if success:
            # Validate experience structure
            try:
                response = self.session.get(f"{self.base_url}/experience")
                experience_data = response.json()
                
                if not isinstance(experience_data, list):
                    self.log_result("/experience", "GET", "FAIL", "Experience should return an array")
                else:
                    self.log_result("/experience", "GET", "PASS", 
                                  f"Experience array returned with {len(experience_data)} items")
                    
            except Exception as e:
                self.log_result("/experience", "GET", "FAIL", f"Experience validation error: {str(e)}")
    
    def test_education_endpoints(self):
        """Test education-related endpoints"""
        print("\n=== Testing Education Endpoints ===")
        
        # Test GET /api/education
        success = self.test_endpoint("/education", "GET")
        
        if success:
            # Validate education structure
            try:
                response = self.session.get(f"{self.base_url}/education")
                education_data = response.json()
                
                if not isinstance(education_data, list):
                    self.log_result("/education", "GET", "FAIL", "Education should return an array")
                else:
                    self.log_result("/education", "GET", "PASS", 
                                  f"Education array returned with {len(education_data)} items")
                    
            except Exception as e:
                self.log_result("/education", "GET", "FAIL", f"Education validation error: {str(e)}")
    
    def test_projects_endpoints(self):
        """Test projects-related endpoints"""
        print("\n=== Testing Projects Endpoints ===")
        
        # Test GET /api/projects
        success = self.test_endpoint("/projects", "GET")
        
        if success:
            # Validate projects structure
            try:
                response = self.session.get(f"{self.base_url}/projects")
                projects_data = response.json()
                
                if not isinstance(projects_data, list):
                    self.log_result("/projects", "GET", "FAIL", "Projects should return an array")
                else:
                    self.log_result("/projects", "GET", "PASS", 
                                  f"Projects array returned with {len(projects_data)} items")
                    
            except Exception as e:
                self.log_result("/projects", "GET", "FAIL", f"Projects validation error: {str(e)}")
    
    def test_blog_endpoints(self):
        """Test blog-related endpoints"""
        print("\n=== Testing Blog Endpoints ===")
        
        # Test GET /api/blog
        success = self.test_endpoint("/blog", "GET")
        
        if success:
            # Validate blog structure
            try:
                response = self.session.get(f"{self.base_url}/blog")
                blog_data = response.json()
                
                if not isinstance(blog_data, list):
                    self.log_result("/blog", "GET", "FAIL", "Blog should return an array")
                else:
                    self.log_result("/blog", "GET", "PASS", 
                                  f"Blog array returned with {len(blog_data)} items")
                    
                    # Test specific blog post if any exist
                    if len(blog_data) > 0:
                        # Try to get the first blog post
                        first_post = blog_data[0]
                        if 'id' in first_post:
                            post_id = first_post['id']
                            self.test_endpoint(f"/blog/{post_id}", "GET")
                        else:
                            self.log_result("/blog/{id}", "GET", "FAIL", "Blog posts missing 'id' field")
                    
                    # Test the specific blog1 endpoint mentioned in requirements
                    self.test_endpoint("/blog/blog1", "GET", expected_status=200)
                    
            except Exception as e:
                self.log_result("/blog", "GET", "FAIL", f"Blog validation error: {str(e)}")
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        print("\n=== Testing Root Endpoint ===")
        self.test_endpoint("/", "GET")
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"Starting Portfolio API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 50)
        
        # Test all endpoints
        self.test_root_endpoint()
        self.test_profile_endpoints()
        self.test_skills_endpoints()
        self.test_experience_endpoints()
        self.test_education_endpoints()
        self.test_projects_endpoints()
        self.test_blog_endpoints()
        
        # Summary
        print("\n" + "=" * 50)
        print("TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for r in self.results if r['status'] == 'PASS')
        failed = sum(1 for r in self.results if r['status'] == 'FAIL')
        
        print(f"Total Tests: {len(self.results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        
        if failed > 0:
            print("\nFAILED TESTS:")
            for result in self.results:
                if result['status'] == 'FAIL':
                    print(f"❌ {result['method']} {result['endpoint']} - {result['details']}")
        
        return failed == 0

def main():
    """Main test execution"""
    tester = PortfolioAPITester(BACKEND_URL)
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print("\n💥 Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()