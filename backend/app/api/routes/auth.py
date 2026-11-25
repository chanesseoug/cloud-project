
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.core.dependencies import CurrentUser, DbSession
from app.core.logging import log_security_event
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models import User
from app.schemas.auth import (
    TokenResponse,
    UserRegister,
    UserResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

DUMMY_PASSWORD_HASH = hash_password(
    "dummy-password-not-used-for-login"
)


def get_client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: UserRegister,
    request: Request,
    db: DbSession,
):
    user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="user",
        is_active=True,
    )

    db.add(user)

    try:
        db.commit()
        db.refresh(user)

    except IntegrityError as exc:
        db.rollback()

        if getattr(exc.orig, "sqlstate", None) != "23505":
            raise

        log_security_event(
            event="register",
            outcome="failure",
            client_ip=get_client_ip(request),
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        ) from exc

    log_security_event(
        event="register",
        outcome="success",
        user_id=user.id,
        client_ip=get_client_ip(request),
    )

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    form: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
    request: Request,
    db: DbSession,
):
    email = form.username.strip().lower()

    user = db.scalar(
        select(User).where(User.email == email)
    )

    password_hash = (
        user.password_hash
        if user is not None
        else DUMMY_PASSWORD_HASH
    )

    password_valid = (
        len(form.password) <= 128
        and verify_password(
            form.password,
            password_hash,
        )
    )

    if (
        user is None
        or not password_valid
        or not user.is_active
    ):
        log_security_event(
            event="login",
            outcome="failure",
            client_ip=get_client_ip(request),
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(user.id)

    log_security_event(
        event="login",
        outcome="success",
        user_id=user.id,
        client_ip=get_client_ip(request),
    )

    return TokenResponse(
        access_token=token,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_profile(user: CurrentUser):
    return user
