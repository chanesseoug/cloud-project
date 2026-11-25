
from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException, Query, Request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.core.dependencies import CurrentUser, DbSession
from app.core.logging import log_security_event
from app.models import Reservation, Room
from app.schemas.reservation import (
    ReservationCreate,
    ReservationResponse,
)

router = APIRouter(
    prefix="/reservations",
    tags=["Reservations"],
)


def get_owned_reservation(db, reservation_id, user, lock=False):
    statement = select(Reservation).where(
        Reservation.id == reservation_id
    )

    if lock:
        statement = statement.with_for_update()

    reservation = db.scalar(statement)

    if reservation is None:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found",
        )

    if (
        reservation.user_id != user.id
        and user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    return reservation


@router.post(
    "",
    response_model=ReservationResponse,
    status_code=201,
)
def create_reservation(
    data: ReservationCreate,
    user: CurrentUser,
    db: DbSession,
    request: Request,
):
    room = db.scalar(
        select(Room)
        .where(Room.id == data.room_id)
        .with_for_update(read=True)
    )

    if room is None or not room.is_active:
        raise HTTPException(
            status_code=404,
            detail="Room not available",
        )

    if data.start_time <= datetime.now(UTC):
        raise HTTPException(
            status_code=422,
            detail="Cannot book a room in the past",
        )

    reservation = Reservation(
        user_id=user.id,
        room_id=room.id,
        start_time=data.start_time,
        end_time=data.end_time,
        purpose=data.purpose,
        status="confirmed",
    )

    db.add(reservation)

    try:
        db.commit()
        db.refresh(reservation)

    except IntegrityError as exc:
        db.rollback()

        if getattr(exc.orig, "sqlstate", None) == "23P01":
            raise HTTPException(
                status_code=409,
                detail="Room already booked for this time slot",
            ) from exc

        raise

    log_security_event(
        event="reservation_created",
        outcome="success",
        user_id=user.id,
        client_ip=request.client.host if request.client else None,
    )

    return reservation


@router.get(
    "",
    response_model=list[ReservationResponse],
)
def list_reservations(
    user: CurrentUser,
    db: DbSession,
    all_users: bool = False,
    booking_status: str | None = None,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
):
    statement = select(Reservation)

    if all_users:
        if user.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Administrator privileges required",
            )
    else:
        statement = statement.where(
            Reservation.user_id == user.id
        )

    if booking_status is not None:
        if booking_status not in {"confirmed", "cancelled"}:
            raise HTTPException(
                status_code=422,
                detail="Invalid reservation status",
            )

        statement = statement.where(
            Reservation.status == booking_status
        )

    return db.scalars(
        statement
        .order_by(Reservation.start_time.desc())
        .offset(offset)
        .limit(limit)
    ).all()


@router.get(
    "/{reservation_id}",
    response_model=ReservationResponse,
)
def get_reservation(
    reservation_id: int,
    user: CurrentUser,
    db: DbSession,
):
    return get_owned_reservation(
        db,
        reservation_id,
        user,
    )


@router.patch(
    "/{reservation_id}/cancel",
    response_model=ReservationResponse,
)
def cancel_reservation(
    reservation_id: int,
    user: CurrentUser,
    db: DbSession,
    request: Request,
):
    reservation = get_owned_reservation(
        db,
        reservation_id,
        user,
        lock=True,
    )

    if reservation.status == "cancelled":
        return reservation

    if reservation.start_time <= datetime.now(UTC):
        raise HTTPException(
            status_code=409,
            detail="Cannot cancel a started reservation",
        )

    reservation.status = "cancelled"

    db.commit()
    db.refresh(reservation)

    log_security_event(
        event="reservation_cancelled",
        outcome="success",
        user_id=user.id,
        client_ip=request.client.host if request.client else None,
    )

    return reservation
