# 2409-wns-rouge-hopin-go

## Présentation

Ce projet est une application développée dans le cadre de la Wild Code School. Il s'agit d'un projet nommé "Hopin Go", qui est une application de covoiturage permettant aux automobilistes de proposer des trajets et aux passagers de rechercher et réserver un covoiturage en fonction de leur ville de départ, de leur destination et de la date souhaitée.

## Fonctionnalités principales

- [Fonctionnalité 1 : Réservation de covoiturage]

  - Permet aux passagers de rechercher des trajets disponibles en fonction de leur ville de départ, de leur destination et de la date souhaitée.

- [Fonctionnalité 1 : Proposition de trajets]

  - Permet aux automobilistes de créer des offres de covoiturage en spécifiant les détails du trajet (ville de départ, destination, date, etc.).

- [Fonctionnalité 2 : Gestion des utilisateurs]
  - Inscription et authentification des utilisateurs (conducteurs et passagers).

## Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/WildCodeSchool/2409-wns-rouge-hopin-go.git
```

2. Renseigner les variables d'environnement dans un fichier `.env` dans le dossier frontend et `backend.env` et `database.env` à la racine du projet (voir `backend.env.sample` et `database.env.sample` pour les variables nécessaires).
   Pour les tests, renseigner la variable d'environnement `.env.test` dans le dossier backend (voir `.env.test.example` pour les variables nécessaires).

3. Lancer l'application(à la racine du projet) :

```bash
docker compose up --build
```

## Technologies utilisées

- backend :
  apollo-server,
  graphql,
  type-graphql,
  typeorm,
  jsonwebtoken,
  node-mailjet,
  graphql-scalars,
  jest,
  typescript

- frontend :
  react,
  apollo-client,
  graphql,
  react-router-dom,
  tailwindcss,
  react-toastify,
  typescript,,
  codegen,
  mapbox-gl,
  vite,
  vitest
