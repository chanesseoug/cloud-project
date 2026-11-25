
from getpass import getpass

from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import User
from app.schemas.auth import UserRegister


def create_admin():
    print("=== RoomBooking - Create administrator ===")

    full_name = input("Full name: ").strip()
    email = input("Email: ").strip().lower()

    password = getpass("Password: ")
    confirmation = getpass("Confirm password: ")

    if password != confirmation:
        print("Passwords do not match.")
        return

    try:
        data = UserRegister(
            full_name=full_name,
            email=email,
            password=password,
        )

    except ValueError:
        print(
            "Invalid input. Check email, name and password."
        )
        return

    with SessionLocal() as db:
        existing_user = db.scalar(
            select(User).where(
                User.email == data.email
            )
        )

        if existing_user:
            print("This email is already registered.")
            return

        admin = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Administrator created successfully.")


if __name__ == "__main__":
    create_admin()
