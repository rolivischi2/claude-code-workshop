---
id: ops-capacity-planning
title: Planification de la capacité
lang: fr
tags: [ops, capacité, planification]
---

# Planification de la capacité

Ce document explique comment les équipes Atlas, Boreal et Cirrus anticipent les besoins en ressources de la Raumreservation.

## Revue trimestrielle

La capacité est examinée lors d'une revue trimestrielle. Elle réunit un représentant de chaque équipe et la personne responsable de l'infrastructure. Les participants analysent l'évolution du nombre de salles, du nombre d'utilisateurs actifs, du volume de réservations et de la taille de la base de données. Les tableaux de bord de RR Insight servent de support.

À l'issue de la revue, un compte rendu est publié. Il contient les constats, les décisions (par exemple modifier les limites de l'autoscaling ou la taille de la base) et les actions avec un responsable et une échéance.

## Profil de charge

L'observation de plusieurs trimestres montre un pic d'utilisation le lundi matin, entre 08h00 et 10h00. Les utilisateurs planifient alors leur semaine et réservent les salles Eiger, Moench, Jungfrau et Pilatus. Un second pic, plus modeste, apparaît en début d'après-midi. Le week-end, la charge est très faible.

Conséquences pratiques :

- Aucune opération lourde (réindexation, import) n'est planifiée le lundi matin.
- Les tests de charge reproduisent le profil du lundi matin.
- Les vacances scolaires modifient légèrement la courbe ; la revue en tient compte.

## Réserve cible

L'objectif est de conserver une réserve de 40 % de capacité par rapport au pic observé. Autrement dit, au moment le plus chargé, l'infrastructure ne devrait pas dépasser environ 60 % de ses ressources. Cette marge permet d'absorber une hausse soudaine, la perte d'une instance ou un déploiement en pleine période d'activité.

| Indicateur | Cible |
|------------|-------|
| Réserve au pic | 40 % |
| Croissance de la base | suivie chaque mois |
| Instances en service | selon les règles d'autoscaling |

Lorsque la réserve passe sous la cible deux trimestres de suite, l'équipe propose une extension et la soumet à la revue d'architecture.
