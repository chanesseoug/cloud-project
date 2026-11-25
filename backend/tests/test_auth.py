
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import jwt
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, get_db
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.main import app
from app.models import User


@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()

    session = Session(
        bind=connection,
        join_transaction_mode="create_savepoint",
    )

    try:
        yield session
    finally:
        session.close()

        if transaction.is_active:
            transaction.rollback()

        connection.close()


@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_db, None)


@pytest.fixture
def user_data():
    return {
        "full_name": "Test User",
        "email": f"test-{uuid4().hex}@example.com",
        "password": "SecureTest@2026!",
    }


@pytest.fixture
def registered_user(client, user_data):
    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 201

    return response.json()


def login(client, email, password):
    return client.post(
        "/api/v1/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )


def auth_headers(token):
    return {
        "Authorization": f"Bearer {token}"
    }


def test_password_hashing():
    password = "SecureTest@2026!"

    hashed = hash_password(password)

    assert hashed != password
    assert hashed.startswith("$argon2id$")
    assert verify_password(password, hashed)
    assert not verify_password("WrongPassword", hashed)


def test_register_user(client, user_data):
    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == user_data["email"]
    assert data["role"] == "user"
    assert "password" not in data
    assert "password_hash" not in data


def test_password_is_hashed_in_database(
    db, registered_user, user_data
):
    user = db.scalar(
        select(User).where(
            User.id == registered_user["id"]
        )
    )

    assert user.password_hash != user_data["password"]

    assert verify_password(
        user_data["password"],
        user.password_hash,
    )


def test_duplicate_email_rejected(
    client, user_data, registered_user
):
    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 409


def test_short_password_rejected(client, user_data):
    user_data["password"] = "short"

    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 422


def test_invalid_email_rejected(client, user_data):
    user_data["email"] = "invalid-email"

    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 422


def test_admin_self_registration_rejected(
    client, user_data
):
    user_data["role"] = "admin"

    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 422


def test_valid_login(
    client, user_data, registered_user
):
    response = login(
        client,
        user_data["email"],
        user_data["password"],
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_wrong_password_rejected(
    client, user_data, registered_user
):
    response = login(
        client,
        user_data["email"],
        "WrongPassword",
    )

    assert response.status_code == 401


def test_unknown_user_rejected(client):
    response = login(
        client,
        "unknown@example.com",
        "WrongPassword",
    )

    assert response.status_code == 401


def test_authenticated_profile(
    client, registered_user
):
    token = create_access_token(
        registered_user["id"]
    )

    response = client.get(
        "/api/v1/auth/me",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    assert response.json()["id"] == registered_user["id"]


def test_missing_token_rejected(client):
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401


def test_invalid_token_rejected(client):
    response = client.get(
        "/api/v1/auth/me",
        headers=auth_headers("invalid-token"),
    )

    assert response.status_code == 401


def test_expired_token_rejected(
    client, registered_user
):
    now = datetime.now(UTC)

    token = jwt.encode(
        {
            "sub": str(registered_user["id"]),
            "iat": now - timedelta(hours=1),
            "exp": now - timedelta(minutes=1),
            "iss": "roombooking",
            "aud": "roombooking-api",
            "type": "access",
        },
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    response = client.get(
        "/api/v1/auth/me",
        headers=auth_headers(token),
    )

    assert response.status_code == 401


def test_user_cannot_access_admin(
    client, registered_user
):
    token = create_access_token(
        registered_user["id"]
    )

    response = client.get(
        "/api/v1/admin/users",
        headers=auth_headers(token),
    )

    assert response.status_code == 403


def test_admin_can_access_admin(
    client, db
):
    admin = User(
        full_name="Test Administrator",
        email=f"admin-{uuid4().hex}@example.com",
        password_hash=hash_password(
            "SecureAdmin@2026!"
        ),
        role="admin",
        is_active=True,
    )

    db.add(admin)
    db.flush()

    token = create_access_token(admin.id)

    response = client.get(
        "/api/v1/admin/users",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)

    for user in response.json():
        assert "password_hash" not in user


def test_inactive_user_cannot_login(
    client, db, user_data, registered_user
):
    user = db.get(User, registered_user["id"])

    user.is_active = False
    db.flush()

    response = login(
        client,
        user_data["email"],
        user_data["password"],
    )

    assert response.status_code == 401


def test_inactive_user_token_rejected(
    client, db, registered_user
):
    token = create_access_token(
        registered_user["id"]
    )

    user = db.get(User, registered_user["id"])

    user.is_active = False
    db.flush()

    response = client.get(
        "/api/v1/auth/me",
        headers=auth_headers(token),
    )

    assert response.status_code == 401
