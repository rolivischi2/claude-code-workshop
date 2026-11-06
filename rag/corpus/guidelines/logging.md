---
id: guidelines-logging
title: Journalisation
lang: fr
tags: [directive, journaux, observabilité]
---

# Journalisation

Les journaux servent à comprendre le comportement de l'application en production et à diagnostiquer les incidents. Ils doivent être utiles, sobres et sûrs.

## Pas de données personnelles

Aucune donnée personnelle ne doit apparaître dans les journaux : ni nom, ni adresse e-mail, ni identifiant permettant de remonter à une personne. On consigne à la place des identifiants techniques (numéro de réservation, identifiant de salle) et la corrélation avec une personne se fait, si nécessaire, dans la base de données avec les droits appropriés. Les corps de requêtes et de réponses ne sont pas journalisés en entier.

## Niveaux

| Niveau | Usage |
|---|---|
| ERROR | échec nécessitant une intervention |
| WARN | situation anormale mais gérée |
| INFO | événements métier importants |
| DEBUG | détails pour le développement |

Le niveau **INFO** est utilisé en production. Le niveau DEBUG n'est activé que temporairement et ciblé sur un module, jamais de façon durable. Les environnements de développement peuvent utiliser DEBUG.

## Format JSON

Les journaux sont écrits au **format JSON**, un objet par ligne. Chaque entrée contient au minimum : horodatage, niveau, nom du logger, message, identifiant de corrélation et, en cas d'erreur, le code d'erreur applicatif (par exemple RR-5031). Ce format permet l'analyse automatique dans l'outil de monitoring.

### Exemple de champs

- `timestamp`, `level`, `logger`
- `message`
- `correlationId`
- `errorCode` (facultatif)

## Bonnes pratiques

- Un message décrit un fait, pas une intention.
- Les exceptions sont journalisées une seule fois, à l'endroit où elles sont traitées.
- Pas de journalisation dans les boucles serrées.
- Les messages ne contiennent pas de secrets.

## Conservation

La durée de conservation est définie dans le document consacré à la conservation des journaux.
