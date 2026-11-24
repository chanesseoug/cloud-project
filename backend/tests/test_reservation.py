
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest
from pwdlib import PasswordHash
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import engine
from app.models import Reservation, Room, User


@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()

    session = Session(bind=connection)

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def booking_data(db):
    unique = uuid4().hex

    user = User(
        full_name="Test User",
        email=f"test-{unique}@example.com",
        password_hash=PasswordHash.recommended().hash(
            uuid4().hex
        ),
    )

    room = Room(
        name=f"Test Room {unique}",
        capacity=8,
        equipment=["Wi-Fi"],
    )

    db.add_all([user, room])
    db.flush()

    start = datetime.now(UTC) + timedelta(days=1)

    return user, room, start


def add_reservation(
    db, user, room, start, end, status="confirmed"
):
    reservation = Reservation(
        user_id=user.id,
        room_id=room.id,
        start_time=start,
        end_time=end,
        status=status,
    )

    db.add(reservation)
    db.flush()

    return reservation


def test_valid_reservation(db, booking_data):
    user, room, start = booking_data

    reservation = add_reservation(
        db,
        user,
        room,
        start,
        start + timedelta(hours=2),
    )

    assert reservation.id is not None
    assert reservation.status == "confirmed"


def test_overlapping_reservation_rejected(db, booking_data):
    user, room, start = booking_data

    add_reservation(
        db,
        user,
        room,
        start,
        start + timedelta(hours=2),
    )

    with pytest.raises(IntegrityError) as exc:
        add_reservation(
            db,
            user,
            room,
            start + timedelta(hours=1),
            start + timedelta(hours=3),
        )

    assert exc.value.orig.sqlstate == "23P01"


def test_adjacent_reservations_allowed(db, booking_data):
    user, room, start = booking_data

    end = start + timedelta(hours=2)

    add_reservation(db, user, room, start, end)

    second = add_reservation(
        db,
        user,
        room,
        end,
        end + timedelta(hours=2),
    )

    assert second.id is not None


def test_cancelled_reservation_does_not_block(db, booking_data):
    user, room, start = booking_data

    end = start + timedelta(hours=2)

    add_reservation(
        db,
        user,
        room,
        start,
        end,
        status="cancelled",
    )

    second = add_reservation(db, user, room, start, end)

    assert second.id is not None


def test_invalid_time_range_rejected(db, booking_data):
    user, room, start = booking_data

    with pytest.raises(IntegrityError) as exc:
        add_reservation(
            db,
            user,
            room,
            start,
            start - timedelta(hours=1),
        )

    assert exc.value.orig.sqlstate == "23514"


def test_same_time_different_rooms_allowed(db, booking_data):
    user, room, start = booking_data

    second_room = Room(
        name=f"Second Room {uuid4().hex}",
        capacity=10,
        equipment=[],
    )

    db.add(second_room)
    db.flush()

    end = start + timedelta(hours=2)

    add_reservation(db, user, room, start, end)

    second = add_reservation(
        db, user, second_room, start, end
    )

    assert second.id is not None
