
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RoomCreate(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    name: str = Field(min_length=2, max_length=100)
    description: str | None = Field(
        default=None,
        max_length=2000,
    )
    capacity: int = Field(gt=0, le=10000)
    equipment: list[str] = Field(default_factory=list)


class RoomUpdate(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
    )
    capacity: int | None = Field(
        default=None,
        gt=0,
        le=10000,
    )
    equipment: list[str] | None = None
    is_active: bool | None = None


class RoomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    capacity: int
    equipment: list[str]
    photo_object_key: str | None
    is_active: bool
    created_at: datetime
