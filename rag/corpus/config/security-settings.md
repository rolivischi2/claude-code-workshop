---
id: config-security-settings
title: Configuration de sécurité
lang: fr
tags: [config, sécurité, session]
---

# Configuration de sécurité

Cette page présente les clés de configuration liées à l'authentification et aux sessions de la Raumreservation. Les valeurs sont définies par environnement.

## Clés

| Clé | Valeur par défaut | Description |
|-----|-------------------|-------------|
| `rr.security.session-timeout` | PT30M | Inactivité maximale avant l'expiration de la session |
| `rr.security.max-login-attempts` | 5 | Nombre de tentatives de connexion échouées avant le blocage du compte |
| `rr.security.lockout-period` | PT15M | Durée de blocage automatique après dépassement du maximum de tentatives |
| `rr.security.cookie-secure` | true | Transmission du cookie de session uniquement par HTTPS |
| `rr.security.csrf-enabled` | true | Active la protection contre la falsification de requêtes |
| `rr.security.allowed-origins` | `https://rr.example.invalid` | Origines autorisées pour les appels de l'interface |

## Remarques

### Expiration de session

Avec la valeur par défaut PT30M, une session est fermée après 30 minutes sans activité. L'utilisateur voit alors l'erreur RR-4101 et doit se reconnecter. Une valeur plus courte renforce la protection sur les postes partagés, une valeur plus longue améliore le confort mais augmente le risque en cas d'écran laissé ouvert.

### Tentatives de connexion

Après 5 tentatives échouées, le compte est bloqué et l'erreur RR-4105 est renvoyée. Le blocage est levé automatiquement à l'issue de la période définie, ou plus tôt par une personne autorisée du support. Les tentatives échouées sont inscrites dans le journal d'audit sans nom de personne.

### Cookies et origines

En dev, `rr.security.cookie-secure` peut être mis à false pour travailler en local sans certificat. Cette exception est interdite en int et en production. La liste des origines ne doit jamais contenir de caractère générique.

## Modification

Toute modification de ces clés exige une revue de sécurité et l'approbation de deux personnes, selon le principe des quatre yeux. Les équipes Atlas, Boreal et Cirrus documentent la raison du changement dans le ticket. La modification prend effet lors du déploiement suivant.
