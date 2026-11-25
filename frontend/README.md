
# RoomBooking - Frontend

Interface utilisateur cloud-native de
réservation de salles de réunion.

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- date-fns
- React Hot Toast
- Oxlint
- Vitest
- Testing Library

## Installation

    npm ci

## Démarrage

    npm run dev

Adresse : http://127.0.0.1:5173

Le backend FastAPI doit être démarré sur
le port 8000 dans le même environnement WSL.

## Communication API

Le proxy Vite transmet les requêtes
/api et /health vers FastAPI.

Les chemins relatifs permettent de préparer
le futur routage par Kubernetes Ingress.

## Vérification du code

    npm run lint

## Compilation de production

    npm run build

Les fichiers générés sont disponibles
dans le dossier dist/.

## Résultats initiaux

- 0 erreur Oxlint.
- 0 avertissement Oxlint.
- Build réussi en 13,86 secondes.
- 2134 modules transformés.
- Dossier dist : 264 Kio.

## Fonctionnalités réalisées

- Initialisation React et TypeScript.
- Configuration Tailwind CSS.
- Identité visuelle RoomBooking.
- Page de diagnostic.
- Proxy Vite opérationnel.

## Fonctionnalités à venir

- Authentification JWT.
- Inscription et connexion.
- Tableau de bord.
- Catalogue des salles.
- Calendrier.
- Réservations.
- Administration.
- Tests frontend.

## Documentation

- ../docs/development-environment.md
- ../docs/concurrency-management.md
- ../docs/api-business.md
