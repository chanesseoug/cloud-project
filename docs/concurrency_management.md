
# Gestion de la concurrence - RoomBooking

## 1. Contexte

RoomBooking doit garantir qu'une salle ne puisse
pas être réservée simultanément par plusieurs
utilisateurs sur des créneaux qui se chevauchent.

Cette exigence est particulièrement importante
dans une architecture distribuée où plusieurs
instances du backend pourront traiter des
requêtes simultanément.

## 2. Incident détecté

Date : 25 novembre 2026.

Lors des tests de non-régression sous WSL,
un test de concurrence PostgreSQL a échoué.

Erreur :

    psycopg.errors.DeadlockDetected
    SQLSTATE 40P01

PostgreSQL a détecté un verrouillage mutuel
entre deux transactions concurrentes lors
de la vérification de la contrainte d'exclusion.

Résultat initial :

- 55 tests réussis.
- 1 test échoué.
- Durée : 6,43 secondes.
- Code de sortie : 1.

## 3. Analyse de la cause

Deux transactions tentaient d'insérer une
réservation sur la même salle et le même créneau.

La contrainte d'exclusion PostgreSQL empêchait
la validation de réservations incompatibles.

Cependant, les transactions pouvaient entrer
dans une situation de verrouillage mutuel.

Le test initial ne traitait que les erreurs
de violation de contrainte d'exclusion (23P01).

Le cas du deadlock (40P01) n'était pas géré.

## 4. Corrections apportées

### 4.1. Verrouillage transactionnel

Le verrou partagé FOR SHARE a été remplacé
par un verrou exclusif de ligne FOR UPDATE
lors de la création d'une réservation via l'API.

Les créations de réservations concernant une
même salle sont ainsi sérialisées.

Les transactions concernant des salles
différentes peuvent progresser en parallèle.

### 4.2. Contrainte d'exclusion

La contrainte PostgreSQL GiST est conservée.

Elle constitue une protection supplémentaire
contre les chevauchements de réservations.

### 4.3. Gestion des deadlocks dans les tests

Le test de concurrence PostgreSQL dispose
désormais d'un mécanisme de reprise :

- Détection du SQLSTATE 40P01.
- Annulation de la transaction.
- Nouvelle transaction indépendante.
- Trois tentatives maximum.
- Délai progressif entre les tentatives.

Une violation de contrainte 23P01 est
interprétée comme un conflit de réservation.

Les erreurs inattendues ne sont pas masquées.

Ce mécanisme de reprise est implémenté dans
le test PostgreSQL. L'API utilise quant à elle
le verrouillage transactionnel FOR UPDATE.

## 5. Validation PostgreSQL

Dix exécutions consécutives ont été réalisées.

| Indicateur | Résultat |
|---|---:|
| Exécutions réussies | 10/10 |
| Durée minimale | 0,44 s |
| Durée maximale | 0,84 s |
| Durée moyenne | 0,56 s |
| Doubles réservations constatées | 0 |

Chaque exécution confirme une seule réservation
et refuse la réservation concurrente.

## 6. Validation de l'API

Un test d'intégration supplémentaire a été créé :

    tests/test_concurrency_api.py

Deux clients FastAPI indépendants utilisent
deux identités et deux tokens JWT différents.

Les deux clients tentent de réserver la même
salle sur le même créneau.

| Indicateur | Résultat |
|---|---:|
| Exécutions réussies | 10/10 |
| Requêtes HTTP | 20 |
| Réponses HTTP 201 | 10 |
| Réponses HTTP 409 | 10 |
| Réponses HTTP 500 | 0 |
| Doubles réservations constatées | 0 |
| Durée minimale du test | 0,49 s |
| Durée maximale du test | 0,58 s |
| Durée moyenne du test | 0,52 s |

Les durées correspondent à l'exécution complète
des tests et non à la latence HTTP seule.

## 7. Tests de non-régression

| Indicateur | Avant | Après |
|---|---:|---:|
| Tests réussis | 55 | 57 |
| Tests échoués | 1 | 0 |
| Durée totale | 6,43 s | 4,64 s |
| Code de sortie Pytest | 1 | 0 |

Un test d'intégration supplémentaire explique
le passage de 56 à 57 tests.

Ruff et Alembic sont également validés.

Aucune migration supplémentaire n'est nécessaire.

## 8. Compatibilité avec Kubernetes

Les mécanismes de verrouillage sont gérés
par PostgreSQL et ne dépendent pas de la
mémoire locale d'une instance FastAPI.

Cette approche est compatible avec une
architecture comportant plusieurs réplicas
du backend.

## 9. Limites

Le verrou exclusif sérialise également
les créations concernant des créneaux
différents pour une même salle.

Les tests réalisés sont des tests locaux
PostgreSQL et des tests d'intégration ASGI.

Ils ne constituent pas encore une validation
en charge sur plusieurs réplicas Kubernetes.

Des tests de charge distribués seront
réalisés ultérieurement.

## 10. Preuves techniques

- results/05-pytest-wsl-before-fix.txt
- results/05-concurrency-stability.txt
- results/05-concurrency-api.txt
- results/05-concurrency-api-stability.txt
- results/05-pytest-wsl.txt
- results/05-ruff-wsl.txt
- results/05-alembic-wsl.txt
