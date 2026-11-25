
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    Text,
    func,
    literal_column,
    text,
)
from sqlalchemy.dialects.postgresql import ExcludeConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Reservation(Base):
    __tablename__ = "reservations"

    __table_args__ = (
        CheckConstraint(
            "end_time > start_time",
            name="ck_reservations_time_range",
        ),
        CheckConstraint(
            "status IN ('confirmed', 'cancelled')",
            name="ck_reservations_status",
        ),
        ExcludeConstraint(
            ("room_id", "="),
            (
                func.tstzrange(
                    literal_column("start_time"),
                    literal_column("end_time"),
                    "[)",
                ),
                "&&",
            ),
            where=text("status = 'confirmed'"),
            using="gist",
            name="ex_reservations_no_overlap",
        ),
        Index(
            "ix_reservations_room_start",
            "room_id",
            "start_time",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        index=True,
    )

    room_id: Mapped[int] = mapped_column(
        ForeignKey("rooms.id", ondelete="RESTRICT"),
        index=True,
    )

    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )

    end_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )

    purpose: Mapped[str | None] = mapped_column(Text)

    status: Mapped[str] = mapped_column(
        String(20),
        default="confirmed",
        server_default="confirmed",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="reservations",
    )

    room = relationship(
        "Room",
        back_populates="reservations",
    )

    documents = relationship(
        "Document",
        back_populates="reservation",
    )
