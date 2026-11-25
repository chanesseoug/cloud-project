
# Réservation de salle

Application web cloud-native de réservation de salles.

## Contexte académique

- École : École Hexagone
- Formation : Master 2 Intelligence Artificielle
- Année universitaire : 2026-2027
- Certification : RNCP40875
- Bloc : BC3
- Compétences : C6.1 à C8.2

## Objectif

Concevoir, déployer, automatiser, superviser, sécuriser
et optimiser une application web cloud-native de
réservation de salles de réunion.

## Fonctionnalités

- Authentification et gestion des utilisateurs
- Gestion des salles de réunion
- Consultation des disponibilités
- Réservation et annulation de créneaux
- Prévention des réservations simultanées
- Téléversement de photos des salles
- Génération asynchrone de confirmations PDF
- Administration de la plateforme

## Stack technique

- Front-end : React, TypeScript, Tailwind CSS
- Back-end : Python, FastAPI
- Base de données : PostgreSQL
- File de messages : Redis
- Worker : Celery
- Stockage objet : MinIO / S3
- Conteneurisation : Docker, Docker Compose
- Orchestration : Kubernetes
- Infrastructure as Code : Terraform
- CI/CD : GitHub Actions
- Observabilité : Prometheus, Grafana, Loki
- Sécurité : Trivy, RBAC, TLS
- Tests de charge : k6

## Structure du projet

- frontend/ : interface utilisateur
- backend/ : API REST
- worker/ : traitements asynchrones
- database/ : configuration de la base de données
- kubernetes/ : manifests Kubernetes
- terraform/ : infrastructure as Code
- monitoring/ : observabilité
- security/ : sécurité et contrôles ISO 27001
- tests/ : tests automatisés
- scripts/ : scripts d'automatisation
- docs/ : documentation technique


## État du projet

Version actuelle : 0.3.0

### Progression

- [x] Initialisation du projet
- [x] Fondations du back-end FastAPI
- [x] Base de données PostgreSQL
- [x] Modèles SQLAlchemy et migrations Alembic
- [x] Authentification JWT et Argon2id
- [x] Gestion des permissions RBAC
- [x] API métier de réservation
- [x] Tests automatisés du back-end
- [ ] Interface utilisateur React
- [ ] Stockage objet MinIO / S3
- [ ] Traitement asynchrone Redis / Celery
- [ ] Conteneurisation Docker complète
- [ ] Orchestration Kubernetes
- [ ] Infrastructure Terraform
- [ ] Pipeline CI/CD
- [ ] Observabilité et supervision
- [ ] Sécurité cloud et ISO 27001
- [ ] Optimisation FinOps
- [ ] Rapport académique final

## Validation du back-end

| Indicateur | Résultat |
|---|---|
| Tests automatisés | 56/56 |
| Tests manuels API métier | 10/10 |
| Tests manuels authentification | 9/9 |
| Analyse Ruff | Validée |
| Vérification Alembic | Validée |
| Protection contre les doubles réservations | Validée |
| Test de concurrence PostgreSQL | Validé |

## Documentation technique

- [Installation du backend](backend/README.md)
- [Architecture de la base de données](docs/database.md)
- [Authentification et sécurité](docs/security-auth.md)
- [Documentation API métier](docs/api-business.md)

## Prochaine étape

Développement de l'interface utilisateur React
avec TypeScript.

