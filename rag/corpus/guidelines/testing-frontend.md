---
id: guidelines-testing-frontend
title: Tests du frontend
lang: fr
tags: [directive, tests, frontend]
---

# Tests du frontend

Le frontend Angular de Raumreservation est testé à deux niveaux : des tests unitaires rapides et quelques tests de bout en bout pour les parcours essentiels.

## Tests unitaires

Les tests unitaires couvrent en priorité :

- les **validateurs** de formulaire (heure de début, heure de fin, capacité) ;
- les **services** qui appellent l'API et transforment les réponses ;
- les fonctions utilitaires pour les dates.

Ils s'exécutent avec le lanceur de tests configuré dans le projet, sans navigateur complet, et se terminent en quelques secondes. Les appels HTTP sont simulés avec le module de test fourni par le framework. Les composants purement présentationnels n'ont pas besoin de test dédié si leur logique est nulle.

### Règles

- Un test vérifie un seul comportement.
- Pas de dépendance à l'heure réelle : la date est fournie par un service remplaçable.
- Les données sont fictives.

## Tests de bout en bout

Playwright est utilisé pour les parcours critiques, en particulier **réserver une salle** : choisir une salle, indiquer un horaire, confirmer et voir la réservation dans la liste. D'autres parcours couverts sont l'annulation et l'affichage d'un conflit de réservation avec un message compréhensible.

### Environnement

Ces tests s'exécutent contre l'environnement d'intégration, rempli avec des données synthétiques. Ils sont lancés à chaque fusion sur la branche principale et pas à chaque commit, afin de limiter le temps de la pipeline.

## Stabilité

Un test instable est corrigé ou désactivé dans les deux jours, avec un ticket. Les sélecteurs reposent sur des attributs dédiés (`data-testid`) et non sur le style ou la structure de la page.

## Accessibilité

Les parcours critiques sont aussi vérifiés avec un contrôle automatique d'accessibilité.
