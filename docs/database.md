
# Architecture de la base de données

## Technologie

RoomBooking utilise PostgreSQL 16 comme base
de données relationnelle.

La persistance est assurée localement par un
volume Docker dédié.

## Modèle relationnel

La base comprend quatre entités métier :

- users : utilisateurs et administrateurs.
- rooms : salles et équipements.
- reservations : réservations de créneaux.
- documents : suivi des générations de PDF.

## Intégrité des données

- Unicité des adresses e-mail.
- Unicité des noms des salles.
- Capacité strictement positive.
- Date de fin postérieure à la date de début.
- Contrôle des valeurs de statut.
- Intégrité référentielle par clés étrangères.

## Prévention des doubles réservations

Une contrainte d'exclusion PostgreSQL utilisant
un index GiST interdit les chevauchements de
réservations confirmées pour une même salle.

L'extension btree_gist est activée par migration.

Les intervalles sont de type [debut, fin), ce qui
autorise deux créneaux consécutifs.

Les réservations annulées ne bloquent pas les
créneaux disponibles.

Cette protection est indépendante du nombre
d'instances du back-end.

## Gestion des migrations

Alembic assure le versionnement du schéma.

Depuis le dossier backend :

    python -m alembic upgrade head
    python -m alembic current
    python -m alembic history

## Données de démonstration

    python -m app.seed

Le script est idempotent et permet de créer
six salles de démonstration.

## Tests

    python -m pytest tests/test_reservations.py -v

Les tests couvrent notamment les chevauchements,
les créneaux adjacents, les annulations et les
intervalles invalides.
