---
id: errors-integration-errors-rr60xx
title: Codes d'erreur RR-60xx
lang: fr
tags: [erreurs, intégration, api]
---

# Codes d'erreur RR-60xx

Les codes de la plage RR-60xx signalent un problème avec un système externe auquel la Raumreservation est reliée : l'annuaire du personnel et le serveur de messagerie. Ils sont renvoyés dans la propriété `code` de la réponse d'erreur et inscrits dans les journaux avec un identifiant de corrélation.

## Aperçu

| Code | HTTP | Signification | Mesure |
|------|------|---------------|--------|
| RR-6010 | 502 | L'annuaire est indisponible | Vérifier l'état de l'annuaire ; réessayer lors de la synchronisation suivante |
| RR-6023 | 502 | Le serveur SMTP refuse le message (expéditeur non autorisé) | Contrôler l'adresse d'expédition configurée et son autorisation auprès de l'équipe messagerie |

## Détails

### RR-6010

Ce code apparaît lorsque la synchronisation avec l'annuaire n'aboutit pas, par exemple parce que le service ne répond pas ou refuse la connexion. Les données de la veille restent utilisables : l'application continue de fonctionner avec les informations déjà présentes. La personne d'astreinte n'est pas alertée la nuit pour ce seul code. Si l'erreur se répète plusieurs jours de suite, un ticket est ouvert pour l'équipe Boreal, responsable de cette intégration.

### RR-6023

Le serveur SMTP a refusé l'envoi parce que l'adresse d'expéditeur n'est pas autorisée. La cause la plus fréquente est une modification de la clé `rr.notify.sender` sans accord préalable. Les notifications concernées ne sont pas envoyées ; après le nombre maximal de tentatives, elles sont abandonnées. Il faut corriger la configuration et, si nécessaire, relancer l'envoi manuellement pour les réservations récentes.

## Gravité habituelle

- RR-6010 : S3, sauf si l'annuaire est indisponible plus de deux jours.
- RR-6023 : S3 ; S2 si plus aucune confirmation ne part.

## Remarques

Ces erreurs ne signifient pas que l'application elle-même est défaillante. Les réservations restent possibles, seuls les services périphériques sont touchés. Chaque nouveau code est ajouté ici avec sa mesure, selon le schéma RR-<statut HTTP><numéro courant>.
