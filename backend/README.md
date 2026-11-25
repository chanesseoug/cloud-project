
# RoomBooking — Backend

API REST cloud-native de réservation de salles.

## Stack technique

- Python 3.12
- FastAPI
- PostgreSQL 16
- SQLAlchemy
- Alembic
- Pydantic
- Argon2id
- JWT
- Pytest
- Ruff
- Prometheus Instrumentator

## Prérequis

- Python 3.12
- Docker et Docker Compose
- Git

## 1. Configuration

Depuis la racine du projet, copier .env.example
vers .env.

    Copy-Item .env.example .env

Configurer un mot de passe PostgreSQL unique
et une clé secrète JWT aléatoire.

La valeur du mot de passe doit être cohérente
avec celle contenue dans DATABASE_URL.

Le port PostgreSQL local est 5434.

Ne jamais publier le fichier .env.

## 2. Démarrage de PostgreSQL

Depuis la racine du projet :

    docker compose up -d --wait
    docker compose ps

## 3. Environnement Python

    cd backend
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    python -m pip install -r requirements.txt

## 4. Migrations

    python -m alembic upgrade head
    python -m alembic current

## 5. Données de démonstration

    python -m app.seed

Le script crée six salles de démonstration.

Il est idempotent et peut être exécuté plusieurs fois.

## 6. Création d'un administrateur

    python -m app.create_admin

Le script demande les informations de connexion
de manière interactive.

Aucun mot de passe administrateur n'est fourni
dans le dépôt Git.

## 7. Démarrage de l'API

    python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

## 8. Endpoints techniques

- API : http://localhost:8000
- Swagger : http://localhost:8000/docs
- ReDoc : http://localhost:8000/redoc
- Liveness : http://localhost:8000/health/live
- Readiness : http://localhost:8000/health/ready
- Prometheus : http://localhost:8000/metrics

## 9. Tests

Utiliser exclusivement une base de développement
ou une base dédiée aux tests.

    python -m pytest tests -v

Résultat de validation : 56 tests réussis.

### Qualité du code

    python -m ruff check app tests

### Cohérence des migrations

    python -m alembic check

### Test de concurrence

    python -m pytest tests/test_concurrency.py -v -s

## 10. Structure

    backend/
    |-- alembic/
    |-- app/
    |   |-- api/
    |   |-- core/
    |   |-- models/
    |   |-- schemas/
    |   |-- services/
    |   |-- main.py
    |   |-- seed.py
    |   `-- create_admin.py
    |-- tests/
    |-- alembic.ini
    |-- requirements.txt
    `-- README.md

## 11. Documentation complémentaire

- ../docs/database.md
- ../docs/security-auth.md
- ../docs/api-business.md

## 12. Sécurité

- Hachage Argon2id.
- Authentification JWT.
- Contrôle des rôles RBAC.
- Validation des entrées.
- Protection contre les doubles réservations.
- Journalisation des événements de sécurité.
- Secrets exclus du versionnement Git.

Les fonctionnalités de sécurité propres au
déploiement cloud seront ajoutées ultérieurement.
