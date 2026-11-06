---
id: ops-disaster-recovery
title: Reprise après sinistre
lang: fr
tags: [ops, sinistre, reprise]
---

# Reprise après sinistre

Ce document décrit comment la Raumreservation redémarre après la perte complète du site principal, par exemple à la suite d'un incendie, d'une panne électrique prolongée ou d'une défaillance de l'hébergeur.

## Objectifs

| Objectif | Valeur | Signification |
|----------|--------|---------------|
| RTO | 4 heures | temps maximal pour remettre le service en fonction |
| RPO | 6 heures | quantité maximale de données pouvant être perdue |

Le RPO de 6 heures découle directement de la fréquence des sauvegardes : la base de données est sauvegardée toutes les 6 heures. Dans le pire des cas, les réservations saisies depuis la dernière sauvegarde sont perdues. Le détail des sauvegardes figure dans le document consacré à ce sujet.

## Site secondaire

Un site secondaire, situé dans une autre région que le site principal, héberge une copie de l'infrastructure sous forme de modèles de déploiement. Les sauvegardes y sont répliquées en continu. Le site secondaire n'accueille pas de trafic en temps normal ; il est activé uniquement lors d'un sinistre.

### Étapes de reprise

1. La direction technique déclare le sinistre et nomme une personne responsable de la reprise.
2. Les équipes Atlas, Boreal et Cirrus sont convoquées dans le canal de crise.
3. L'infrastructure est déployée sur le site secondaire à partir des modèles.
4. Le dernier instantané disponible est restauré.
5. Les enregistrements DNS sont modifiés pour pointer vers le site secondaire.
6. Un contrôle fonctionnel est exécuté, puis la page de statut est mise à jour.

## Exercice annuel

Un exercice de reprise est organisé une fois par an. Il simule la perte du site principal, mesure le temps réel de reprise et vérifie les objectifs ci-dessus. Les écarts donnent lieu à des actions suivies dans le système de tickets. Le rapport de l'exercice est présenté à toutes les équipes.

## Communication

Pendant un sinistre, la page de statut est mise à jour toutes les 30 minutes, comme pour un incident de gravité S1.
