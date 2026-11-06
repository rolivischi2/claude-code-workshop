---
id: ops-runbook-db-connection
title: "Runbook : pool de connexions épuisé"
lang: fr
tags: [ops, runbook, base-de-données]
---

# Runbook : pool de connexions épuisé

Ce runbook s'applique lorsque l'application ne parvient plus à obtenir de connexion vers la base de données.

## Symptôme

Le symptôme typique est l'erreur RR-5031 dans les journaux de l'application. Côté utilisateur, les requêtes échouent avec un code HTTP 503 ou restent bloquées avant d'expirer. Le tableau de bord "Database" de RR Insight montre alors un nombre de connexions utilisées égal au maximum configuré, et un nombre de requêtes en attente qui augmente.

## Diagnostic

1. Confirmer la présence de RR-5031 dans les journaux de plusieurs instances.
2. Vérifier dans le tableau de bord si la saturation est soudaine (indice d'un blocage) ou progressive (indice d'une fuite de connexions ou d'une montée en charge).
3. Contrôler si un déploiement ou une tâche planifiée a eu lieu juste avant.

## Mesure temporaire

La taille du pool peut être augmentée temporairement en modifiant le paramètre `spring.datasource.hikari.maximum-pool-size`. La valeur est relevée par paliers modérés, puis les instances sont redémarrées l'une après l'autre. Il faut veiller à ce que la somme des pools de toutes les instances reste inférieure à la limite de connexions de la base. Cette modification est une mesure d'urgence ; elle est annulée une fois la cause traitée, et tout changement durable passe par une demande de modification de configuration.

## Chercher les transactions longues

La cause la plus fréquente est une transaction qui reste ouverte trop longtemps et retient sa connexion. Pour la trouver :

- consulter la vue des sessions actives de la base et trier par ancienneté de transaction ;
- relever les requêtes en attente de verrou ;
- relier la requête fautive au module de l'application (réservations, synchronisation du calendrier, export).

Une transaction manifestement bloquée peut être terminée par la personne d'astreinte, avec l'accord d'un second membre de l'équipe. Un ticket est ensuite créé pour corriger le code en cause.

## Clôture

Une fois les connexions revenues à un niveau normal, la personne d'astreinte vérifie l'absence de nouvelles erreurs RR-5031 pendant 30 minutes, annule la modification temporaire et consigne l'incident. Les équipes Atlas, Boreal et Cirrus examinent la cause lors du postmortem si l'incident était de gravité S1 ou S2.
