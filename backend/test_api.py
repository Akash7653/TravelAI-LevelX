import unittest
import json
from app import app

class TravelAIUpgradedTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.test_email = "testpilot@example.com"
        self.test_password = "supersecurepassword123"

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("port"), 5002)

    def test_auth_flow(self):
        # Register
        reg_payload = {
            "name": "Test Traveler",
            "email": self.test_email,
            "password": self.test_password
        }
        res = self.client.post("/api/auth/register", json=reg_payload)
        self.assertIn(res.status_code, [201, 409])

        # Login
        login_payload = {
            "email": self.test_email,
            "password": self.test_password
        }
        login_res = self.client.post("/api/auth/login", json=login_payload)
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        self.assertTrue(login_data.get("success"))
        token = login_data["data"]["token"]
        self.assertTrue(bool(token))

        # Check /api/auth/me
        headers = {"Authorization": f"Bearer {token}"}
        me_res = self.client.get("/api/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.get_json()
        self.assertEqual(me_data["data"]["user"]["email"], self.test_email)

        # Check /api/history (empty or list)
        hist_res = self.client.get("/api/history", headers=headers)
        self.assertEqual(hist_res.status_code, 200)
        hist_data = hist_res.get_json()
        self.assertTrue(isinstance(hist_data["data"]["history"], list))

    def test_unauthorized_access(self):
        # Attempting history without token
        res = self.client.get("/api/history")
        self.assertEqual(res.status_code, 401)

    def test_invalid_input_validation(self):
        res = self.client.post("/api/generate-audio-guide", json={})
        self.assertEqual(res.status_code, 400)

if __name__ == "__main__":
    unittest.main()
