
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'processing', 'completed', 'failed')",
            name="ck_documents_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    reservation_id: Mapped[int] = mapped_column(
        ForeignKey("reservations.id", ondelete="RESTRICT"),
        index=True,
    )

    object_key: Mapped[str | None] = mapped_column(
        String(500)
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        server_default="pending",
    )

    error_message: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    generated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    reservation = relationship(
        "Reservation",
        back_populates="documents",
    )
