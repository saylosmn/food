"""Backend API tests for Mongolian Food Delivery"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://steppe-table.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Menu endpoints
class TestMenu:
    def test_get_menu_returns_12_items(self, client):
        r = client.get(f"{API}/menu")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 12
        # verify shape
        for item in data:
            assert "id" in item and "name" in item and "price" in item
            assert "portions" in item and isinstance(item["portions"], list)
            assert "img" in item and "category" in item
            assert "_id" not in item

    def test_menu_categories_present(self, client):
        r = client.get(f"{API}/menu")
        cats = {i["category"] for i in r.json()}
        assert {"pizza", "meat", "chicken", "set", "noodle", "drink"}.issubset(cats)


# Orders endpoints
class TestOrders:
    def test_create_order_empty_items_returns_400(self, client):
        r = client.post(f"{API}/orders", json={
            "items": [], "phone": "99112233", "address": "УБ хот", "bank_name": "Хаан банк", "account_name": "TEST"
        })
        assert r.status_code == 400

    def test_create_order_missing_field(self, client):
        r = client.post(f"{API}/orders", json={"items": []})
        assert r.status_code in (400, 422)

    def test_create_order_invalid_product(self, client):
        r = client.post(f"{API}/orders", json={
            "items": [{"id": "999", "name": "Fake", "price": 100, "quantity": 1}],
            "phone": "99112233", "address": "УБ хот", "bank_name": "Хаан банк", "account_name": "TEST"
        })
        assert r.status_code == 400

    def test_create_order_success_and_get(self, client):
        menu = client.get(f"{API}/menu").json()
        item1 = next(m for m in menu if m["id"] == "1")
        item11 = next(m for m in menu if m["id"] == "11")
        payload = {
            "items": [
                {"id": item1["id"], "name": item1["name"], "price": 1, "quantity": 2},  # price ignored server-side
                {"id": item11["id"], "name": item11["name"], "price": 1, "quantity": 3},
            ],
            "phone": "99112233",
            "address": "УБ Сүхбаатар дүүрэг",
            "bank_name": "Хаан банк",
            "account_name": "TEST_USER",
            "notes": "TEST order",
        }
        r = client.post(f"{API}/orders", json=payload)
        assert r.status_code == 200, r.text
        order = r.json()
        assert order["order_number"].startswith("MH-")
        assert len(order["order_number"]) == 9  # MH- + 6 digits
        assert order["delivery_time"] == "20-60 минут"
        assert order["status"] == "Баталгаажсан"
        # Server computes total from menu prices
        expected_total = item1["price"] * 2 + item11["price"] * 3
        assert order["total"] == expected_total
        assert "id" in order and order["phone"] == "99112233"

        # Verify persistence via GET
        oid = order["id"]
        r2 = client.get(f"{API}/orders/{oid}")
        assert r2.status_code == 200
        got = r2.json()
        assert got["order_number"] == order["order_number"]
        assert got["total"] == expected_total
        assert "_id" not in got

    def test_get_nonexistent_order_404(self, client):
        r = client.get(f"{API}/orders/nonexistent-id-xyz")
        assert r.status_code == 404
