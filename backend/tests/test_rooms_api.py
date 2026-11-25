
from uuid import uuid4

BASE = "/api/v1/rooms"


def room_payload():
    return {
        "name": f"Room {uuid4().hex}",
        "description": "API test room",
        "capacity": 15,
        "equipment": ["Wi-Fi"],
    }


def test_rooms_require_authentication(client):
    response = client.get(BASE)
    assert response.status_code == 401


def test_list_rooms(client, user_headers, room):
    response = client.get(
        BASE,
        headers=user_headers,
    )

    assert response.status_code == 200

    assert any(
        item["id"] == room.id
        for item in response.json()
    )


def test_get_room(client, user_headers, room):
    response = client.get(
        f"{BASE}/{room.id}",
        headers=user_headers,
    )

    assert response.status_code == 200
    assert response.json()["id"] == room.id


def test_room_not_found(client, user_headers):
    response = client.get(
        f"{BASE}/2147483647",
        headers=user_headers,
    )

    assert response.status_code == 404


def test_capacity_filter(client, user_headers, room):
    response = client.get(
        BASE,
        headers=user_headers,
        params={"min_capacity": 12},
    )

    assert response.status_code == 200

    assert all(
        item["capacity"] >= 12
        for item in response.json()
    )


def test_equipment_filter(client, user_headers, room):
    response = client.get(
        BASE,
        headers=user_headers,
        params={"equipment": "Projecteur"},
    )

    assert response.status_code == 200

    assert any(
        item["id"] == room.id
        for item in response.json()
    )


def test_user_cannot_create_room(client, user_headers):
    response = client.post(
        BASE,
        headers=user_headers,
        json=room_payload(),
    )

    assert response.status_code == 403


def test_admin_can_create_room(client, admin_headers):
    payload = room_payload()

    response = client.post(
        BASE,
        headers=admin_headers,
        json=payload,
    )

    assert response.status_code == 201
    assert response.json()["name"] == payload["name"]


def test_invalid_capacity(client, admin_headers):
    payload = room_payload()
    payload["capacity"] = 0

    response = client.post(
        BASE,
        headers=admin_headers,
        json=payload,
    )

    assert response.status_code == 422


def test_duplicate_room_name(client, admin_headers, room):
    payload = room_payload()
    payload["name"] = room.name

    response = client.post(
        BASE,
        headers=admin_headers,
        json=payload,
    )

    assert response.status_code == 409


def test_admin_can_update_room(
    client, admin_headers, room
):
    response = client.patch(
        f"{BASE}/{room.id}",
        headers=admin_headers,
        json={"capacity": 25},
    )

    assert response.status_code == 200
    assert response.json()["capacity"] == 25


def test_admin_can_deactivate_room(
    client, admin_headers, user_headers, room
):
    response = client.delete(
        f"{BASE}/{room.id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    response = client.get(
        f"{BASE}/{room.id}",
        headers=user_headers,
    )

    assert response.status_code == 404


def test_user_cannot_update_room(
    client, user_headers, room
):
    response = client.patch(
        f"{BASE}/{room.id}",
        headers=user_headers,
        json={"capacity": 20},
    )

    assert response.status_code == 403
