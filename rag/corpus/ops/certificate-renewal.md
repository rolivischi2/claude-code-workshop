---
id: ops-certificate-renewal
title: Renouvellement des certificats
lang: fr
tags: [ops, certificats, tls]
---

# Renouvellement des certificats

Les certificats TLS protègent les échanges entre les navigateurs, l'API de la Raumreservation et les systèmes voisins. Ce document décrit leur cycle de vie.

## Renouvellement automatique

Les certificats TLS sont renouvelés automatiquement 30 jours avant leur expiration. Le renouvellement est géré par un composant de la plateforme, qui demande un nouveau certificat à l'autorité interne, le dépose dans le coffre et recharge les services concernés sans interruption. Aucune action manuelle n'est prévue en fonctionnement normal.

Les noms couverts sont notamment :

- `rr.example.invalid` pour l'application
- `status.rr.example.invalid` pour la page de statut
- `bastion.rr.example.invalid` pour l'accès à la production

## Alerte

Si un certificat n'a pas été renouvelé et qu'il reste 14 jours avant son expiration, une alerte est déclenchée. Elle crée un ticket de priorité haute pour l'équipe de la semaine d'astreinte. La personne d'astreinte vérifie alors :

1. que le composant de renouvellement fonctionne et qu'il n'y a pas d'erreur dans ses journaux ;
2. que l'autorité de certification répond ;
3. que la validation du domaine est possible.

Si le problème n'est pas résolu rapidement, le renouvellement est effectué à la main selon la procédure de l'équipe d'infrastructure.

## Surveillance

| Étape | Délai avant expiration | Action |
|-------|------------------------|--------|
| Renouvellement | 30 jours | automatique |
| Alerte | 14 jours | ticket et vérification |

Un certificat expiré rend l'application inaccessible pour les navigateurs. Ce cas est classé S1 et suit la procédure habituelle des incidents.

### Environnements

Les environnements dev et int utilisent des certificats d'une autorité de test. Le même mécanisme y est appliqué, ce qui permet de détecter les défauts de renouvellement avant la production.
