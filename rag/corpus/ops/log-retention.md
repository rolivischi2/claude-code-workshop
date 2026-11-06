---
id: ops-log-retention
title: Conservation des journaux
lang: fr
tags: [ops, journaux, conservation]
---

# Conservation des journaux

Ce document fixe la durée de conservation des différents journaux de la Raumreservation et les règles qui les entourent.

## Journaux applicatifs

Les journaux applicatifs, produits par le backend et par le frontend, sont conservés pendant 45 jours, puis supprimés automatiquement. Ils servent au diagnostic des erreurs, à l'analyse des incidents et au suivi des performances. Passé ce délai, ils ne peuvent plus être consultés, même sur demande d'une équipe.

Si un incident de gravité S1 ou S2 nécessite une analyse plus longue, l'équipe peut extraire les lignes pertinentes et les joindre au rapport d'incident. L'extrait ne doit contenir aucune donnée personnelle.

## Journaux d'audit

Les journaux d'audit enregistrent les accès à l'environnement de production, les modifications de données sensibles et les changements de configuration. Ils sont conservés 1 an. Leur suppression est automatique à l'échéance. Seules les personnes habilitées de l'équipe de sécurité y ont accès en lecture ; personne ne peut les modifier.

| Type de journal | Conservation | Accès |
|-----------------|--------------|-------|
| Applicatif | 45 jours | Équipes Atlas, Boreal, Cirrus |
| Audit | 1 an | Personnes habilitées uniquement |

## Contenu autorisé

Aucun nom de personne ne doit figurer dans les journaux. Les événements font référence à des identifiants techniques opaques, jamais à des noms, adresses e-mail ou numéros de téléphone. Les paramètres de requête susceptibles de contenir de telles informations sont masqués avant l'écriture.

### Contrôle

Un contrôle automatique recherche des motifs d'adresses e-mail dans les journaux de l'environnement int chaque nuit. Une détection crée un ticket pour l'équipe responsable du module concerné, qui corrige la source du problème dans un délai de cinq jours ouvrables.

## Stockage

Les journaux sont écrits au format structuré et envoyés vers l'espace de stockage central. La purge est exécutée chaque nuit.
