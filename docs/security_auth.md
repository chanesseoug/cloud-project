
# Authentification et sécurité de RoomBooking

## Architecture

L'API utilise une authentification stateless reposant
sur des tokens JWT signés.

Les instances du back-end ne conservent aucune session
utilisateur en mémoire.

Cette architecture permet la réplication horizontale
des instances FastAPI dans Kubernetes.

## Protection des mots de passe

Les mots de passe sont hachés avec Argon2id.

Une longueur minimale de 12 caractères est imposée.

Les mots de passe et leurs empreintes ne sont jamais
exposés dans les réponses de l'API.

## Tokens JWT

- Signature HS256.
- Durée de validité de 30 minutes.
- Vérification de la signature et de l'expiration.
- Vérification de l'émetteur et de l'audience.
- Clé secrète fournie par variable d'environnement.

## Gestion des permissions

Deux rôles sont disponibles :

- user : utilisateur classique.
- admin : administrateur.

Les droits sont vérifiés dans PostgreSQL pour chaque
requête nécessitant une authentification.

L'inscription publique ne permet pas de devenir
administrateur.

Le premier administrateur est créé par un script
interactif dédié.

## Journalisation

Les événements de sécurité sont journalisés au format
JSON :

- Inscription réussie ou refusée.
- Connexion réussie ou refusée.
- Consultation administrative des utilisateurs.

Les logs ne contiennent ni mots de passe, ni tokens,
ni clés secrètes.

## Contrôles ISO 27001:2022

- A.5.15 : contrôle des accès.
- A.5.17 : informations d'authentification.
- A.8.2 : droits d'accès à privilèges.
- A.8.3 : restriction de l'accès à l'information.
- A.8.5 : authentification sécurisée.
- A.8.15 : journalisation.

## Tests automatisés

    python -m pytest tests/test_auth.py -v

Les tests vérifient les inscriptions, les connexions,
le hachage des mots de passe, les tokens JWT,
les comptes désactivés et les autorisations.

## Mesures complémentaires prévues

- Chiffrement TLS.
- Gestion des secrets Kubernetes et cloud.
- Limitation des tentatives de connexion.
- Centralisation et restriction des accès aux logs.
- Rotation des secrets.
- Scans de vulnérabilités.
- Contrôles IAM et RBAC Kubernetes.

Ces mesures seront mises en place lors des étapes
d'infrastructure et de sécurité.
