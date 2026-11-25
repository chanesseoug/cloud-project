
from datetime import UTC, datetime

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)


class ReservationCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    room_id: int = Field(gt=0)

    start_time: AwareDatetime
    end_time: AwareDatetime

    purpose: str | None = Field(
        default=None,
        max_length=500,
    )

    @model_validator(mode="after")
    def validate_time_range(self):
        if self.end_time <= self.start_time:
            raise ValueError(
                "End time must be after start time"
            )

        if self.start_time <= datetime.now(UTC):
            raise ValueError(
                "Cannot book a room in the past"
            )

        return self


class ReservationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    room_id: int
    start_time: datetime
    end_time: datetime
    purpose: str | None
    status: str
    created_at: datetime
