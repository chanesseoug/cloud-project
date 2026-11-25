
from datetime import UTC, datetime, timedelta

import pytest

BASE = "/api/v1/reservations"


@pytest.fixture
def booking_payload(room):
    start = datetime.now(UTC) + timedelta(days=2)

    return {
        "room_id": room.id,
        "start_time": start.isoformat(),
        "end_time": (
            start + timedelta(hours=2)
        ).isoformat(),
        "purpose": "API test booking",
    }


@pytest.fixture
def booking(client, user_headers, booking_payload):
    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 201

    return response.json()


def test_booking_requires_authentication(
    client, booking_payload
):
    response = client.post(BASE, json=booking_payload)
    assert response.status_code == 401


def test_create_booking(
    client, user_headers, booking_payload
):
    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 201
    assert response.json()["status"] == "confirmed"


def test_duplicate_booking(
    client, user_headers, booking_payload, booking
):
    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 409


def test_booking_in_past(
    client, user_headers, booking_payload
):
    start = datetime.now(UTC) - timedelta(days=1)

    booking_payload["start_time"] = start.isoformat()
    booking_payload["end_time"] = (
        start + timedelta(hours=2)
    ).isoformat()

    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 422


def test_invalid_time_range(
    client, user_headers, booking_payload
):
    booking_payload["end_time"] = (
        booking_payload["start_time"]
    )

    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 422


def test_missing_timezone(
    client, user_headers, booking_payload
):
    booking_payload["start_time"] = (
        booking_payload["start_time"].replace("+00:00", "")
    )

    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 422


def test_unknown_room(
    client, user_headers, booking_payload
):
    booking_payload["room_id"] = 2147483647

    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 404


def test_list_own_bookings(
    client, user_headers, booking
):
    response = client.get(
        BASE,
        headers=user_headers,
    )

    assert response.status_code == 200

    assert any(
        item["id"] == booking["id"]
        for item in response.json()
    )


def test_cancel_own_booking(
    client, user_headers, booking
):
    response = client.patch(
        f"{BASE}/{booking['id']}/cancel",
        headers=user_headers,
    )

    assert response.status_code == 200
    assert response.json()["status"] == "cancelled"


def test_other_user_cannot_read_booking(
    client, booking, user_factory, headers_factory
):
    other_user = user_factory()

    response = client.get(
        f"{BASE}/{booking['id']}",
        headers=headers_factory(other_user),
    )

    assert response.status_code == 403


def test_other_user_cannot_cancel_booking(
    client, booking, user_factory, headers_factory
):
    other_user = user_factory()

    response = client.patch(
        f"{BASE}/{booking['id']}/cancel",
        headers=headers_factory(other_user),
    )

    assert response.status_code == 403


def test_admin_can_list_all_bookings(
    client, admin_headers, booking
):
    response = client.get(
        BASE,
        headers=admin_headers,
        params={"all_users": "true"},
    )

    assert response.status_code == 200

    assert any(
        item["id"] == booking["id"]
        for item in response.json()
    )


def test_user_cannot_list_all_bookings(
    client, user_headers
):
    response = client.get(
        BASE,
        headers=user_headers,
        params={"all_users": "true"},
    )

    assert response.status_code == 403


def test_availability_after_booking(
    client, user_headers, booking, booking_payload
):
    response = client.get(
        "/api/v1/rooms",
        headers=user_headers,
        params={
            "start_time": booking_payload["start_time"],
            "end_time": booking_payload["end_time"],
        },
    )

    assert response.status_code == 200

    assert all(
        item["id"] != booking["room_id"]
        for item in response.json()
    )


def test_availability_after_cancellation(
    client, user_headers, booking, booking_payload
):
    response = client.patch(
        f"{BASE}/{booking['id']}/cancel",
        headers=user_headers,
    )

    assert response.status_code == 200

    response = client.get(
        "/api/v1/rooms",
        headers=user_headers,
        params={
            "start_time": booking_payload["start_time"],
            "end_time": booking_payload["end_time"],
            "search": "Test Room",
        },
    )

    assert response.status_code == 200

    assert any(
        item["id"] == booking["room_id"]
        for item in response.json()
    )


def test_admin_can_access_statistics(
    client, admin_headers
):
    response = client.get(
        "/api/v1/admin/stats",
        headers=admin_headers,
    )

    assert response.status_code == 200
    assert "total_rooms" in response.json()
    assert "total_reservations" in response.json()


def test_user_cannot_access_statistics(
    client, user_headers
):
    response = client.get(
        "/api/v1/admin/stats",
        headers=user_headers,
    )

    assert response.status_code == 403


def test_booking_inactive_room_rejected(
    client, user_headers, admin_headers,
    booking_payload, room
):
    response = client.delete(
        f"/api/v1/rooms/{room.id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    response = client.post(
        BASE,
        headers=user_headers,
        json=booking_payload,
    )

    assert response.status_code == 404
        