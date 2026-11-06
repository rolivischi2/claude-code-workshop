---
id: architecture-adr-003-concurrent-bookings
title: "ADR-003 : réservations concurrentes"
lang: fr
tags: [architecture, adr, concurrence]
---

# ADR-003 : réservations concurrentes

Statut : accepté

## Contexte

Deux utilisateurs peuvent tenter de réserver la même salle au même moment. Si le contrôle de chevauchement se limite à lire les réservations existantes puis à écrire la nouvelle, deux requêtes traitées en parallèle peuvent toutes deux réussir et créer des chevauchements d'horaires. Le phénomène est rare mais a été observé le lundi matin, période de forte activité.

## Décision

Nous utilisons le **verrouillage optimiste** pour éviter les chevauchements créés en parallèle. L'entité représentant la salle (ou son calendrier d'occupation) porte un numéro de version. Lors de l'enregistrement d'une réservation, ce numéro est vérifié et incrémenté dans la même transaction ; si une autre transaction l'a modifié entre-temps, l'enregistrement échoue et la requête est rejouée une fois.

Le **contrôle du chevauchement** reste réalisé dans la couche service, avant l'écriture : le service charge les réservations de la salle sur la plage concernée et refuse la demande avec le code RR-4091 si elles se recoupent. Le verrouillage optimiste garantit que ce contrôle a été fait sur un état encore valide au moment de l'écriture.

## Alternatives écartées

### Verrouillage pessimiste

Verrouiller la salle en base pendant toute la transaction est sûr, mais bloque les autres requêtes et réduit les performances en période de pointe.

### Contrainte d'exclusion en base

Une contrainte portant sur les plages horaires serait idéale, mais elle n'est pas disponible de manière identique dans la base de développement et celle de production.

### File d'attente sérialisée

Traiter les réservations une à une par salle serait complexe à exploiter et peu adapté à plusieurs instances.

## Conséquences

- Pas de verrou long, bonne performance en lecture.
- Un conflit de version rare entraîne une seconde tentative, invisible pour l'utilisateur.
- Des tests de concurrence sont requis dans la suite du backend.
