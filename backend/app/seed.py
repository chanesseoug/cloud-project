
from sqlalchemy.dialects.postgresql import insert

from app.core.database import SessionLocal
from app.models import Room

ROOMS = [
    {
        "name": "Atlas",
        "description": "Salle de réunion pour petites équipes.",
        "capacity": 6,
        "equipment": ["Wi-Fi", "Écran TV"],
    },
    {
        "name": "Orion",
        "description": "Salle adaptée aux présentations.",
        "capacity": 12,
        "equipment": ["Vidéoprojecteur", "Wi-Fi"],
    },
    {
        "name": "Nova",
        "description": "Espace de travail collaboratif.",
        "capacity": 4,
        "equipment": ["Tableau blanc"],
    },
    {
        "name": "Titan",
        "description": "Grande salle de conférence.",
        "capacity": 24,
        "equipment": [
            "Visioconférence",
            "Vidéoprojecteur",
            "Wi-Fi",
        ],
    },
    {
        "name": "Vega",
        "description": "Salle de réunion polyvalente.",
        "capacity": 8,
        "equipment": ["Wi-Fi", "Écran TV"],
    },
    {
        "name": "Horizon",
        "description": "Espace pour événements et formations.",
        "capacity": 40,
        "equipment": [
            "Sonorisation",
            "Vidéoprojecteur",
            "Wi-Fi",
        ],
    },
]


def seed():
    with SessionLocal() as db:
        statement = (
            insert(Room)
            .values(ROOMS)
            .on_conflict_do_nothing(index_elements=["name"])
            .returning(Room.id)
        )

        result = db.execute(statement)
        inserted_ids = result.scalars().all()

        db.commit()

        print(f"{len(inserted_ids)} salle(s) ajoutée(s).")
        print("Initialisation terminée.")


if __name__ == "__main__":
    seed()
