---
id: guidelines-feature-flags-usage
title: Utilisation des feature flags
lang: fr
tags: [directive, feature-flags, releases]
---

# Utilisation des feature flags

Les feature flags permettent de livrer du code avant d'activer la fonction correspondante. Mal gérés, ils s'accumulent et compliquent le code. Cette directive fixe les règles d'usage ; la liste des flags existants et leurs valeurs se trouve dans la documentation de configuration.

## Quand utiliser un flag

- Une fonction est livrée par étapes et ne doit pas être visible avant d'être complète.
- Une fonction doit être testée dans un environnement avant d'être activée en production.
- Un comportement risqué doit pouvoir être désactivé rapidement sans nouvelle livraison.

Un flag n'est pas un moyen de contourner une revue : le code derrière un flag désactivé est relu comme tout autre code.

## Un propriétaire par flag

Chaque flag a un **propriétaire**, une équipe (Atlas, Boreal ou Cirrus) et une personne de référence. Le propriétaire est inscrit dans la description du flag et dans le ticket de création. Il décide de l'activation, suit l'état du flag et veille à sa suppression.

### Nommage

Les noms suivent le schéma `ff.<fonction>.enabled`. Le nom décrit la fonction et non l'équipe ou la date.

## Durée de vie

Le flag est **supprimé au plus tard deux releases après son activation complète**. Le code des deux branches (activée et désactivée) est alors réduit à la seule voie retenue, et la clé de configuration est retirée de tous les environnements.

### Suivi

Une revue des flags a lieu à chaque trimestre. Les flags dont l'échéance est dépassée font l'objet d'un ticket de nettoyage assigné au propriétaire.

## Tests

Les tests couvrent les deux états du flag tant qu'il existe. Les tests de bout en bout s'exécutent avec les valeurs de l'environnement d'intégration.
