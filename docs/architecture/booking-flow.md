
# Architecture du système de réservation

## 1. Diagramme de séquence

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant R as React
    participant A as Axios
    participant F as FastAPI
    participant P as PostgreSQL

    U->>R: Recherche avec filtres
    R->>A: Demande de salles
    A->>F: GET /api/v1/rooms
    F->>P: Recherche des salles
    P-->>F: Resultats
    F-->>R: HTTP 200

    U->>R: Selection d'une salle
    U->>R: Saisie du creneau
    R->>R: Validation des dates

    R->>A: Verification de disponibilite
    A->>F: GET /rooms avec dates
    F->>P: Recherche des chevauchements
    P-->>F: Salles disponibles
    F-->>R: HTTP 200

    U->>R: Confirmation
    R->>A: Creation de reservation
    A->>F: POST /api/v1/reservations

    F->>F: Validation JWT et donnees
    F->>P: Transaction et verrouillage

    alt Creneau disponible
        P-->>F: Transaction validee
        F-->>R: HTTP 201
        R-->>U: Reservation confirmee
    else Conflit de reservation
        P-->>F: Contrainte d'exclusion
        F-->>R: HTTP 409
        R-->>U: Creneau indisponible
    end
```

## 2. Responsabilites

### Frontend React

- Affichage des salles.
- Gestion des filtres.
- Validation ergonomique des formulaires.
- Conversion des dates au format UTC.
- Verification preliminaire de disponibilite.
- Affichage des confirmations et erreurs.

### Backend FastAPI

- Validation cryptographique du JWT.
- Identification de l'utilisateur.
- Validation des donnees.
- Verification des permissions.
- Gestion transactionnelle.
- Traduction des conflits en HTTP 409.

### PostgreSQL

- Persistance des reservations.
- Integrite referentielle.
- Contraintes de non-chevauchement.
- Atomicite des transactions.

## 3. Garanties

Une verification de disponibilite effectuee
par le frontend ne garantit pas la creation
ulterieure de la reservation.

La decision definitive appartient au backend
et a la base de donnees.

Cette separation permet de conserver
les garanties d'integrite meme avec
plusieurs clients simultanes.

La validation en environnement Kubernetes
multi-replicas reste a effectuer.

## 4. Evolutions

- Calendrier interactif.
- Historique des reservations.
- Annulation des reservations.
- Administration des salles.
- Stockage objet pour les photographies.
- Generation asynchrone de documents.
