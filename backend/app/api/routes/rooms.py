
from datetime import datetime

from fastapi import (
    APIRouter,
    HTTPException,
    Query,
    Request,
    Response,
)
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.core.dependencies import AdminUser, CurrentUser, DbSession
from app.core.logging import log_security_event
from app.models import Reservation, Room
from app.schemas.room import RoomCreate, RoomResponse, RoomUpdate

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"],
)


def get_room_or_404(db, room_id, active_only=False):
    room = db.get(Room, room_id)

    if room is None or (active_only and not room.is_active):
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    return room


def commit_room(db, room):
    try:
        db.commit()
        db.refresh(room)

    except IntegrityError as exc:
        db.rollback()

        if getattr(exc.orig, "sqlstate", None) != "23505":
            raise

        raise HTTPException(
            status_code=409,
            detail="Room name already exists",
        ) from exc

    return room


@router.get("", response_model=list[RoomResponse])
def list_rooms(
    user: CurrentUser,
    db: DbSession,
    min_capacity: int | None = Query(default=None, ge=1),
    equipment: str | None = None,
    search: str | None = None,
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    include_inactive: bool = False,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
):
    if include_inactive and user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Administrator privileges required",
        )

    statement = select(Room)

    if not include_inactive:
        statement = statement.where(Room.is_active.is_(True))

    if min_capacity is not None:
        statement = statement.where(
            Room.capacity >= min_capacity
        )

    if equipment:
        statement = statement.where(
            Room.equipment.contains([equipment])
        )

    if search:
        statement = statement.where(
            Room.name.ilike(f"%{search}%")
        )

    if (start_time is None) != (end_time is None):
        raise HTTPException(
            status_code=422,
            detail="Both start_time and end_time are required",
        )

    if start_time is not None and end_time is not None:
        if (
            start_time.utcoffset() is None
            or end_time.utcoffset() is None
            or end_time <= start_time
        ):
            raise HTTPException(
                status_code=422,
                detail="Invalid time range or missing timezone",
            )

        conflicts = select(Reservation.room_id).where(
            Reservation.status == "confirmed",
            Reservation.start_time < end_time,
            Reservation.end_time > start_time,
        )

        statement = statement.where(
            Room.id.not_in(conflicts)
        )

    return db.scalars(
        statement
        .order_by(Room.name)
        .offset(offset)
        .limit(limit)
    ).all()


@router.get("/{room_id}", response_model=RoomResponse)
def get_room(
    room_id: int,
    user: CurrentUser,
    db: DbSession,
):
    return get_room_or_404(
        db,
        room_id,
        active_only=user.role != "admin",
    )


@router.post(
    "",
    response_model=RoomResponse,
    status_code=201,
)
def create_room(
    data: RoomCreate,
    admin: AdminUser,
    db: DbSession,
    request: Request,
):
    room = Room(**data.model_dump())

    db.add(room)
    commit_room(db, room)

    log_security_event(
        event="room_created",
        outcome="success",
        user_id=admin.id,
        client_ip=request.client.host if request.client else None,
    )

    return room


@router.patch(
    "/{room_id}",
    response_model=RoomResponse,
)
def update_room(
    room_id: int,
    data: RoomUpdate,
    admin: AdminUser,
    db: DbSession,
    request: Request,
):
    room = get_room_or_404(db, room_id)

    changes = data.model_dump(exclude_unset=True)

    for field in ("name", "capacity", "equipment", "is_active"):
        if field in changes and changes[field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{field} cannot be null",
            )

    for key, value in changes.items():
        setattr(room, key, value)

    commit_room(db, room)

    log_security_event(
        event="room_updated",
        outcome="success",
        user_id=admin.id,
        client_ip=request.client.host if request.client else None,
    )

    return room


@router.delete("/{room_id}", status_code=204)
def deactivate_room(
    room_id: int,
    admin: AdminUser,
    db: DbSession,
    request: Request,
):
    room = get_room_or_404(db, room_id)

    room.is_active = False
    db.commit()

    log_security_event(
        event="room_deactivated",
        outcome="success",
        user_id=admin.id,
        client_ip=request.client.host if request.client else None,
    )

    return Response(status_code=204)
