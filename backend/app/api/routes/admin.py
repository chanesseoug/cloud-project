
from fastapi import APIRouter, Query, Request
from sqlalchemy import func, select

from app.core.dependencies import AdminUser, DbSession
from app.core.logging import log_security_event
from app.models import Reservation, Room, User
from app.schemas.auth import UserResponse

router = APIRouter(
    prefix="/admin",
    tags=["Administration"],
)


@router.get(
    "/users",
    response_model=list[UserResponse],
)
def list_users(
    admin: AdminUser,
    db: DbSession,
    request: Request,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
):
    users = db.scalars(
        select(User)
        .order_by(User.id)
        .offset(offset)
        .limit(limit)
    ).all()

    log_security_event(
        event="admin_list_users",
        outcome="success",
        user_id=admin.id,
        client_ip=(
            request.client.host
            if request.client
            else None
        ),
    )

    return users


@router.get("/stats")
def get_statistics(
    admin: AdminUser,
    db: DbSession,
):
    total_users = db.scalar(
        select(func.count(User.id))
    )

    total_rooms = db.scalar(
        select(func.count(Room.id))
    )

    active_rooms = db.scalar(
        select(func.count(Room.id)).where(
            Room.is_active.is_(True)
        )
    )

    total_reservations = db.scalar(
        select(func.count(Reservation.id))
    )

    confirmed_reservations = db.scalar(
        select(func.count(Reservation.id)).where(
            Reservation.status == "confirmed"
        )
    )

    cancelled_reservations = db.scalar(
        select(func.count(Reservation.id)).where(
            Reservation.status == "cancelled"
        )
    )

    return {
        "total_users": total_users,
        "total_rooms": total_rooms,
        "active_rooms": active_rooms,
        "total_reservations": total_reservations,
        "confirmed_reservations": confirmed_reservations,
        "cancelled_reservations": cancelled_reservations,
    }
