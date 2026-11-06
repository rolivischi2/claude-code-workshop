---
id: product-notifications
title: Notifications
lang: fr
tags: [produit, notifications, e-mail]
---

# Notifications

Raumreservation envoie des messages électroniques pour tenir les utilisateurs informés de leurs réservations. Ce document décrit les types de messages et leur déclenchement.

## Types de messages

| Événement | Destinataire | Contenu |
|---|---|---|
| Création d'une réservation | organisateur | confirmation avec salle, jour et horaire |
| Rappel | organisateur | rappel de la réservation à venir |
| Modification | organisateur | nouvelles données de la réservation |
| Annulation | organisateur | confirmation d'annulation |
| Salle libérée | organisateur | information sur la libération automatique |

### Confirmation

Une confirmation par e-mail est envoyée à chaque création de réservation. Pour une série, une seule confirmation récapitulative est envoyée, avec la liste des occurrences créées et refusées.

### Rappel

Un rappel est envoyé 15 minutes avant le début de la réservation. Le rappel contient le nom de la salle et un lien vers la réservation. Si la réservation est annulée entre-temps, aucun rappel n'est envoyé.

## Envoi et fiabilité

Les messages sont préparés par un travail asynchrone qui les envoie par lots. En cas d'échec temporaire du serveur de messagerie, l'envoi est répété automatiquement. Après plusieurs échecs, le message est abandonné et une entrée est écrite dans les journaux.

## Préférences

Les utilisateurs peuvent désactiver les rappels dans leur profil. Les confirmations ne peuvent pas être désactivées, car elles servent de preuve de la réservation.

## Langue

Les messages sont envoyés dans la langue configurée dans le profil de l'utilisateur (allemand, français ou anglais). À défaut, l'allemand est utilisé.
