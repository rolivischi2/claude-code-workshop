---
id: guidelines-dependency-updates
title: Mises à jour des dépendances
lang: fr
tags: [directive, dépendances, maintenance]
---

# Mises à jour des dépendances

Des dépendances à jour réduisent les risques de sécurité et évitent une dette technique qui deviendrait coûteuse à rattraper. Ce document décrit le processus appliqué au backend et au frontend.

## Bot de mise à jour

Un bot de mise à jour s'exécute chaque lundi. Il analyse les fichiers de dépendances de chaque module et ouvre une demande de changement par groupe de mises à jour :

- un groupe pour les mises à jour mineures et correctives du backend ;
- un groupe pour celles du frontend ;
- une demande séparée pour chaque mise à jour majeure.

Le bot ne fusionne jamais lui-même une demande. Les équipes Atlas, Boreal et Cirrus se partagent la relecture à tour de rôle ; le lundi, la personne désignée par la rotation traite les demandes ouvertes.

## Types de mises à jour

### Mises à jour mineures et correctives

Si la pipeline est verte et que les notes de version ne signalent aucun changement de comportement, la demande est relue et intégrée dans la semaine. Les correctifs de sécurité sont traités en priorité, sans attendre le lundi suivant.

### Mises à jour majeures

Les mises à jour majeures donnent lieu à une revue d'architecture avant l'intégration. L'équipe vérifie la compatibilité avec les autres bibliothèques, les changements de comportement, la durée de support de la nouvelle version et le plan de retour arrière. Le résultat est consigné dans un ADR lorsque la décision a un impact durable.

## Vérifications

- La pipeline de build et tous les tests passent.
- L'analyse des vulnérabilités n'indique aucune nouvelle alerte critique.
- Les licences des nouvelles bibliothèques restent compatibles avec l'usage interne.

## Dépendances abandonnées

Une bibliothèque qui n'est plus maintenue est remplacée. Le remplacement est planifié comme un ticket ordinaire et suivi par l'équipe propriétaire du module.
