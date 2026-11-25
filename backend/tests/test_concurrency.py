
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime, timedelta
from threading import Barrier
from uuid import uuid4

from pwdlib import PasswordHash
from sqlalchemy import delete, func, select, text
from sqlalchemy.exc import IntegrityError

from app.core.database import SessionLocal
from app.models import Reservation, Room, User


def test_concurrent_booking():
    unique = uuid4().hex

    user_ids = []
    room_id = None

    try:
        with SessionLocal() as db:
            users = [
                User(
                    full_name=f"Concurrency User {i}",
                    email=f"concurrent-{unique}-{i}@example.com",
                    password_hash=PasswordHash.recommended().hash(
                        uuid4().hex
                    ),
                    role="user",
                )
                for i in range(2)
            ]

            room = Room(
                name=f"Concurrent Room {unique}",
                capacity=10,
                equipment=[],
            )

            db.add_all([*users, room])
            db.flush()

            user_ids = [user.id for user in users]
            room_id = room.id

            db.commit()

        start = datetime.now(UTC) + timedelta(days=3)
        end = start + timedelta(hours=2)

        barrier = Barrier(2, timeout=15)

        def attempt_booking(user_id):
            with SessionLocal() as db:
                db.execute(
                    text("SET LOCAL lock_timeout = '10s'")
                )

                reservation = Reservation(
                    user_id=user_id,
                    room_id=room_id,
                    start_time=start,
                    end_time=end,
                    status="confirmed",
                )

                db.add(reservation)

                barrier.wait()

                try:
                    db.commit()
                    return "confirmed"

                except IntegrityError as exc:
                    db.rollback()

                    if getattr(exc.orig, "sqlstate", None) == "23P01":
                        return "conflict"

                    raise

        with ThreadPoolExecutor(max_workers=2) as executor:
            results = list(
                executor.map(attempt_booking, user_ids)
            )

        assert sorted(results) == [
            "confirmed",
            "conflict",
        ]

        with SessionLocal() as db:
            count = db.scalar(
                select(func.count(Reservation.id)).where(
                    Reservation.room_id == room_id,
                    Reservation.status == "confirmed",
                )
            )

            assert count == 1

        print("\nConcurrent booking results:", results)
        print("Confirmed reservations in database:", count)

    finally:
        with SessionLocal() as db:
            if room_id is not None:
                db.execute(
                    delete(Reservation).where(
                        Reservation.room_id == room_id
                    )
                )

                db.execute(
                    delete(Room).where(Room.id == room_id)
                )

            if user_ids:
                db.execute(
                    delete(User).where(User.id.in_(user_ids))
                )

            db.commit()
