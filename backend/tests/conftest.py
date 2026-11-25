from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.database import engine, get_db
from app.core.security import create_access_token, hash_password
from app.main import app
from app.models import Room, User


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


@pytest.fixture(scope="session")
def test_password_hash():
    return hash_password(uuid4().hex)


@pytest.fixture
def user_factory(db, test_password_hash):
    def create_user(role="user"):
        user = User(
            full_name="API Test User",
            email=f"{uuid4().hex}@example.com",
            password_hash=test_password_hash,
            role=role,
            is_active=True,
        )

        db.add(user)
        db.flush()

        return user

    return create_user


@pytest.fixture
def regular_user(user_factory):
    return user_factory("user")


@pytest.fixture
def admin_user(user_factory):
    return user_factory("admin")


@pytest.fixture
def headers_factory():
    def create_headers(user):
        return {
            "Authorization": (
                f"Bearer {create_access_token(user.id)}"
            )
        }

    return create_headers


@pytest.fixture
def user_headers(regular_user, headers_factory):
    return headers_factory(regular_user)


@pytest.fixture
def admin_headers(admin_user, headers_factory):
    return headers_factory(admin_user)


@pytest.fixture
def room(db):
    room = Room(
        name=f"Test Room {uuid4().hex}",
        capacity=12,
        equipment=["Wi-Fi", "Projecteur"],
        is_active=True,
    )

    db.add(room)
    db.flush()

    return room