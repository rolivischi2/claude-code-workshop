---
id: ops-backup-restore
title: Sauvegarde et restauration
lang: fr
tags: [ops, sauvegarde, restauration]
---

# Sauvegarde et restauration

Ce document décrit comment les données de la Raumreservation sont sauvegardées et comment les restaurer en cas de perte.

## Fréquence et conservation

La base de données est sauvegardée toutes les 6 heures, à 00h, 06h, 12h et 18h. Chaque sauvegarde produit un instantané (snapshot) portant un identifiant unique. Les instantanés sont conservés pendant 30 jours, puis supprimés automatiquement par la tâche de purge.

Les sauvegardes sont stockées sur un espace distinct de la base principale, dans une zone d'hébergement séparée. Elles sont chiffrées au repos.

## Restauration

Une restauration complète est une opération exceptionnelle. Elle n'est envisagée qu'en cas de perte ou de corruption de données, et non pour un simple problème de déploiement (voir le document sur le rollback, qui rend la restauration inutile dans la plupart des cas).

La commande est la suivante :

```
rr-deploy db-restore --snapshot <id>
```

Le paramètre `<id>` correspond à l'identifiant de l'instantané choisi. La liste des instantanés disponibles s'obtient avec `rr-deploy db-snapshots`.

### Procédure

1. Décider du moment cible de la restauration et choisir l'instantané le plus proche, antérieur à l'incident.
2. Obtenir l'accord de la personne d'astreinte et d'un second membre de l'équipe (principe des quatre yeux).
3. Mettre l'application en mode maintenance et publier un message sur la page de statut.
4. Lancer la restauration, puis contrôler le nombre de salles et de réservations.
5. Rouvrir l'application et documenter l'intervention dans le ticket.

Les données saisies entre l'instantané et l'incident sont perdues. Il faut donc en informer les équipes Atlas, Boreal et Cirrus ainsi que les utilisatrices et utilisateurs concernés.

## Test de restauration

Une restauration de test est effectuée chaque trimestre sur l'environnement int. Elle vérifie que les instantanés sont lisibles, que la commande fonctionne et que le temps nécessaire reste compatible avec les objectifs de reprise. Le résultat est consigné par l'équipe responsable du trimestre ; un échec est traité comme un incident de gravité S3.
