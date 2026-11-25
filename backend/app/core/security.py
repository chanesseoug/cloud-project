
from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hasher.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(user_id: int) -> str:
    now = datetime.now(UTC)

    expires_at = now + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": expires_at,
        "iss": "roombooking",
        "aud": "roombooking-api",
        "type": "access",
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict:
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
        issuer="roombooking",
        audience="roombooking-api",
        options={
            "require": [
                "sub",
                "exp",
                "iat",
                "iss",
                "aud",
                "type",
            ]
        },
    )

    if payload.get("type") != "access":
        raise jwt.InvalidTokenError(
            "Invalid token type"
        )

    return payload
