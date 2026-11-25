
# Environnement de développement RoomBooking

## Stack locale

- Windows avec WSL / Ubuntu.
- Python 3.12.3.
- Node.js sous WSL.
- Docker 29.1.3.
- Docker Compose 5.7.0.
- PostgreSQL 16 Alpine.
- React, TypeScript, Vite 8.3.8.
- Tailwind CSS.
- Oxlint.

## Incident réseau

Le frontend Vite retournait initialement
des erreurs HTTP 502 Bad Gateway.

FastAPI était exécuté sous Windows tandis
que React était exécuté sous WSL.

Les requêtes Windows vers FastAPI
retournaient HTTP 200.

Les requêtes WSL vers le backend Windows
échouaient avec ECONNREFUSED ou un timeout.

La cause précise du blocage réseau n'a
pas été déterminée.

## Solution

React et FastAPI sont désormais exécutés
dans le même environnement WSL.

Un environnement virtuel Python indépendant
a été créé dans :

    ~/.venvs/roombooking

La base PostgreSQL existante a été conservée.

Aucun changement des règles du pare-feu
Windows n'a été nécessaire.

## Démarrage

### PostgreSQL

Depuis la racine du projet :

    docker compose up -d --wait

### Backend

    cd backend
    source ~/.venvs/roombooking/bin/activate
    python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

### Frontend

    cd frontend
    npm ci
    npm run dev

## Ports

| Service | Port |
|---|---:|
| React / Vite | 5173 |
| FastAPI | 8000 |
| PostgreSQL | 5434 |

## Validation du proxy

| Endpoint | Résultat |
|---|---|
| /health/live | HTTP 200 |
| /health/ready | HTTP 200 |
| /api/v1/auth/me sans token | HTTP 401 |

## Validation frontend

| Indicateur | Résultat |
|---|---|
| Oxlint | 0 erreur, 0 avertissement |
| Règles Oxlint | 116 |
| Compilation | Réussie |
| Modules transformés | 2134 |
| Durée du build | 13,86 s |
| Taille du dossier dist | 264 Kio |
| JavaScript | 229,32 ko |
| JavaScript Gzip estimé | 72,28 ko |
| CSS | 14,54 ko |
| CSS Gzip estimé | 3,85 ko |
| HTML | 0,70 ko |
| HTML Gzip estimé | 0,39 ko |

## Validation backend

- 57 tests automatisés réussis sous WSL.
- Ruff validé.
- Alembic validé.
- Durée totale des tests : 4,64 secondes.
- 10 tests répétés de concurrence PostgreSQL.
- 10 tests répétés de concurrence API.

Voir concurrency-management.md pour le détail
de la correction de concurrence.
