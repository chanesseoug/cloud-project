
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
from threading import Barrier
from uuid import uuid4

from fastapi.testclient import TestClient
from pwdlib import PasswordHash
from sqlalchemy import delete, func, select

from app.core.database import SessionLocal
from app.core.security import create_access_token
from app.main import app
from app.models import Reservation, Room, User


def test_concurrent_booking_api():
    unique = uuid4().hex

    user_ids = []
    room_id = None

    try:
        with SessionLocal() as db:
            users = [
                User(
                    full_name=f"Concurrent API User {i}",
                    email=f"api-{unique}-{i}@example.com",
                    password_hash=PasswordHash.recommended().hash(
                        uuid4().hex
                    ),
                    role="user",
                    is_active=True,
                )
                for i in range(2)
            ]

            room = Room(
                name=f"Concurrent API Room {unique}",
                capacity=10,
                equipment=["Wi-Fi"],
                is_active=True,
            )

            db.add_all([*users, room])
            db.flush()

            user_ids = [user.id for user in users]
            room_id = room.id

            db.commit()

        start = datetime.now(UTC) + timedelta(days=3)
        end = start + timedelta(hours=2)

        payload = {
            "room_id": room_id,
            "start_time": start.isoformat(),
            "end_time": end.isoformat(),
            "purpose": "Concurrent API booking test",
        }

        tokens = [
            create_access_token(user_id)
            for user_id in user_ids
        ]

        barrier = Barrier(2, timeout=15)

        def attempt_booking(token):
            headers = {
                "Authorization": f"Bearer {token}"
            }

            with TestClient(
                app,
                raise_server_exceptions=False,
            ) as client:
                barrier.wait()

                response = client.post(
                    "/api/v1/reservations",
                    headers=headers,
                    json=payload,
                )

                return (
                    response.status_code,
                    response.text,
                )

        with ThreadPoolExecutor(max_workers=2) as executor:
            results = list(
                executor.map(attempt_booking, tokens)
            )

        status_codes = [
            result[0] for result in results
        ]

        print("\nConcurrent API responses:")

        for status_code, body in results:
            print(f"HTTP {status_code}: {body}")

        assert sorted(status_codes) == [201, 409], results

        with SessionLocal() as db:
            count = db.scalar(
                select(func.count(Reservation.id)).where(
                    Reservation.room_id == room_id,
                    Reservation.status == "confirmed",
                )
            )

            assert count == 1

        print(
            "Confirmed reservations in database:",
            count,
        )

        print(
            "Concurrent HTTP booking protection validated."
        )

    finally:
        with SessionLocal() as db:
            if room_id is not None:
                db.execute(
                    delete(Reservation).where(
                        Reservation.room_id == room_id
                    )
                )

                db.execute(
                    delete(Room).where(
                        Room.id == room_id
                    )
                )

            if user_ids:
                db.execute(
                    delete(User).where(
                        User.id.in_(user_ids)
                    )
                )

            db.commit()
