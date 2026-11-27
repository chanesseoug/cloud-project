
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

- Authentificatio
## Catalogue et réservations

Le frontend permet désormais :

- La consultation des salles actives.
- La recherche textuelle.
- Le filtrage par capacité et équipement.
- La recherche de disponibilité par créneau.
- La consultation des détails d'une salle.
- La création réelle de réservations.
- La confirmation avec référence unique.
- La gestion des conflits HTTP 409.
- L'actualisation du tableau de bord.

## Tests automatisés

    npm test

Résultat actuel : 119 tests réussis.

## Couverture

    npm run test:coverage

Rapport HTML :

    coverage/index.html

## Qualité du code

    npm run lint
    npm run build

## Validation fonctionnelle cumulée

| Étape | Tests manuels réussis |
|---|---:|
| 3B - Authentification | 17 |
| 3C - Tableau de bord | 18 |
| 3D - Catalogue et réservation | 25 |


## Catalogue et réservations

Le frontend permet désormais :

- La consultation des salles actives.
- La recherche textuelle.
- Le filtrage par capacité et équipement.
- La recherche de disponibilité par créneau.
- La consultation des détails d'une salle.
- La création réelle de réservations.
- La confirmation avec référence unique.
- La gestion des conflits HTTP 409.
- L'actualisation du tableau de bord.

## Tests automatisés

    npm test

Résultat actuel : 119 tests réussis.

## Couverture

    npm run test:coverage

Rapport HTML :

    coverage/index.html

## Qualité du code

    npm run lint
    npm run build

## Validation fonctionnelle cumulée

| Étape | Tests manuels réussis |
|---|---:|
| 3B - Authentification | 17 |
| 3C - Tableau de bord | 18 |
| 3D - Catalogue et réservation | 25 |
| Total | 60 |

## Documentation

- ../docs/frontend-auth.md
- ../docs/frontend-dashboard.md
- ../docs/frontend-rooms.md
- ../docs/architecture/frontend-auth.md
- ../docs/architecture/booking-flow.md
