---
id: architecture-integration-directory
title: Intégration de l'annuaire du personnel
lang: fr
tags: [architecture, intégration, annuaire]
---

# Intégration de l'annuaire du personnel

Raumreservation ne gère pas elle-même les comptes des utilisateurs. Les personnes, leurs équipes et leurs rôles proviennent de l'annuaire du personnel de l'entreprise. Ce document décrit comment les données sont reprises.

## Principe

Un travail planifié importe les données de l'annuaire dans la base de Raumreservation. L'application travaille ensuite sur sa copie locale, ce qui la rend indépendante de la disponibilité de l'annuaire pendant la journée. L'annuaire reste la source de référence : toute modification locale d'une fiche synchronisée est écrasée lors de l'import suivant.

## Planification

L'annuaire est synchronisé chaque nuit à 01h00. Le travail s'exécute sur une seule instance, afin d'éviter des imports simultanés, et dure en général quelques minutes. Il charge d'abord les personnes modifiées depuis la dernière exécution réussie, puis met à jour les équipes et les rôles.

### Données reprises

- identifiant technique de la personne,
- nom d'affichage et adresse e-mail,
- équipe,
- appartenance aux groupes servant à déterminer le rôle (membre, administrateur de salle, gestionnaire d'infrastructure).

Les personnes qui ne figurent plus dans l'annuaire sont désactivées, non supprimées, afin de conserver l'historique des réservations jusqu'à leur anonymisation.

## Gestion des échecs

Si l'annuaire est injoignable ou répond par une erreur, le travail s'arrête et enregistre l'erreur **RR-6010** dans les journaux. Aucune donnée n'est modifiée partiellement : l'import est transactionnel. L'application continue de fonctionner avec les données de la veille. Le travail est relancé automatiquement à l'heure suivante, puis une alerte est transmise à la personne de piquet si l'échec persiste.

## Sécurité

La connexion utilise un compte de service dédié avec des droits de lecture seule. Les identifiants sont stockés dans le coffre à secrets.
