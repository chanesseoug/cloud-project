
# Incident technique - Incompatibilité FullCalendar

## 1. Contexte

Lors de l'étape 3E de RoomBooking, une
bibliothèque de calendrier a été intégrée
afin de permettre la visualisation des
réservations personnelles.

## 2. Symptômes

La page Calendrier ne fonctionnait pas,
alors que les autres pages de l'application
restaient opérationnelles.

La compilation TypeScript retournait
huit erreurs dans BookingCalendar.tsx.

Les principaux codes étaient :

- TS2749
- TS2322

## 3. Analyse de la cause racine

Le package @fullcalendar/react utilisait
la version majeure 7.

Les packages core, daygrid, timegrid
et interaction utilisaient la version
majeure 6.

Les interfaces TypeScript et les plugins
de ces versions étaient incompatibles.

## 4. Résolution

Toutes les dépendances FullCalendar
ont été alignées sur la version 6.1.22 :

- @fullcalendar/core
- @fullcalendar/react
- @fullcalendar/daygrid
- @fullcalendar/timegrid
- @fullcalendar/interaction

L'option npm --save-exact a été utilisée
pour verrouiller les versions.

Le type DateClickArg est importé depuis
@fullcalendar/interaction.

## 5. Validation corrective

Les dix vérifications suivantes ont
été réalisées avec succès :

1. Compilation TypeScript.
2. Affichage du calendrier.
3. Vue mensuelle.
4. Vue hebdomadaire.
5. Vue journalière.
6. Affichage des réservations réelles.
7. Consultation des détails.
8. Navigation vers le catalogue.
9. Affichage des réservations annulées.
10. Compatibilité mobile.

## 6. Mesures préventives

- Versionnement du fichier package-lock.json.
- Utilisation de versions compatibles.
- Verrouillage des dépendances sensibles.
- Utilisation de npm ci dans le futur CI/CD.
- Compilation TypeScript avant déploiement.
- Exécution des tests de non-régression.

## 7. Impact

L'incident concernait uniquement le frontend.

Aucune modification de FastAPI,
PostgreSQL ou des règles métier de
réservation n'a été nécessaire.

## 8. Preuves techniques

Les résultats sont conservés dans :

- docs/results/09-fullcalendar-versions.txt
- docs/results/09-calendar-build.txt
- docs/results/09-npm-ci.txt
- docs/results/09-reproducible-build.txt
