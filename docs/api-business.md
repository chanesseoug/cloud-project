
# API métier RoomBooking

## 1. Présentation

RoomBooking est une application cloud-native de
réservation de salles de réunion.

Le back-end repose sur une API REST FastAPI,
une base PostgreSQL 16 et une authentification JWT.

L'API est stateless afin de permettre son déploiement
sur plusieurs instances Kubernetes.

## 2. Gestion des salles

Les utilisateurs authentifiés peuvent consulter
les salles actives et effectuer des recherches.

Filtres disponibles :

- Nom de la salle.
- Capacité minimale.
- Équipement.
- Disponibilité sur un intervalle horaire.

Les administrateurs peuvent créer, modifier,
désactiver et réactiver les salles.

La suppression logique préserve l'historique
des réservations.

## 3. Gestion des réservations

Les utilisateurs peuvent créer, consulter
et annuler leurs propres réservations.

Les administrateurs peuvent consulter
et gérer toutes les réservations.

### Règles métier

- Une réservation ne peut pas être dans le passé.
- La date de fin doit être postérieure au début.
- Le fuseau horaire est obligatoire.
- Une salle inactive ne peut pas être réservée.
- Deux réservations confirmées ne peuvent pas
  se chevaucher pour une même salle.
- Un utilisateur ne peut pas accéder aux
  réservations d'un autre utilisateur.
- Une réservation commencée ne peut pas être annulée.
- Une réservation annulée libère son créneau.

## 4. Gestion des accès

L'authentification repose sur des tokens JWT.

Les mots de passe sont hachés avec Argon2id.

Deux rôles sont disponibles :

- user : utilisateur classique.
- admin : administrateur.

Les permissions sont contrôlées côté serveur
à chaque requête protégée.

## 5. Endpoints REST

### Système

| Méthode | Endpoint | Description |
|---|---|---|
| GET | / | Informations API |
| GET | /health/live | Liveness probe |
| GET | /health/ready | Readiness probe |
| GET | /metrics | Métriques Prometheus |
| GET | /docs | Documentation Swagger |

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/register | Inscription |
| POST | /api/v1/auth/login | Connexion |
| GET | /api/v1/auth/me | Profil utilisateur |

### Salles

| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/v1/rooms | Liste et filtres |
| GET | /api/v1/rooms/{id} | Détail |
| POST | /api/v1/rooms | Création |
| PATCH | /api/v1/rooms/{id} | Modification |
| DELETE | /api/v1/rooms/{id} | Désactivation |

### Réservations

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/v1/reservations | Création |
| GET | /api/v1/reservations | Liste |
| GET | /api/v1/reservations/{id} | Détail |
| PATCH | /api/v1/reservations/{id}/cancel | Annulation |

### Administration

| Méthode | Endpoint | Description |
|---|---|---|
| GET | /api/v1/admin/users | Liste des utilisateurs |
| GET | /api/v1/admin/stats | Statistiques |

## 6. Codes HTTP

| Code | Signification |
|---|---|
| 200 | Requête réussie |
| 201 | Ressource créée |
| 204 | Désactivation réussie |
| 401 | Authentification absente ou invalide |
| 403 | Permission insuffisante |
| 404 | Ressource introuvable |
| 409 | Conflit métier |
| 422 | Données invalides |
| 503 | Service indisponible |

## 7. Prévention des doubles réservations

La base PostgreSQL utilise une contrainte
d'exclusion GiST associée à l'extension btree_gist.

Cette contrainte interdit les chevauchements
de réservations confirmées pour une même salle.

La protection est assurée au niveau de la base
et non par un verrou local en mémoire.

Une violation de cette contrainte est convertie
en réponse HTTP 409 Conflict par FastAPI.

Un test automatisé utilisant deux connexions
PostgreSQL indépendantes valide ce mécanisme
dans un contexte de transactions concurrentes.

## 8. Validation technique

La suite de tests comprend :

| Catégorie | Tests réussis |
|---|---:|
| Intégrité PostgreSQL | 6/6 |
| Authentification | 18/18 |
| API des salles | 13/13 |
| API des réservations | 18/18 |
| Concurrence PostgreSQL | 1/1 |
| Total | 56/56 |

Les dix tests manuels de l'API métier
ont également été validés.

Ruff ne détecte aucune erreur de lint.

Alembic ne détecte aucune nouvelle migration
nécessaire selon ses contrôles automatiques.

## 9. Observabilité

Les endpoints de santé sont disponibles.

L'API expose des métriques compatibles Prometheus.

Les événements de sécurité et les principales
actions métier sont journalisés au format JSON.

## 10. Limites et évolutions

Les fonctionnalités suivantes restent à implémenter :

- Interface utilisateur React.
- Téléversement des photos des salles.
- Stockage objet MinIO et S3.
- File de messages Redis.
- Worker Celery.
- Génération asynchrone des confirmations PDF.
- Conteneurisation complète.
- Déploiement Kubernetes.
- Infrastructure Terraform.
- Pipeline CI/CD.
- Supervision Grafana et Loki.
- Durcissement de la sécurité.
- Optimisation des coûts et FinOps.
