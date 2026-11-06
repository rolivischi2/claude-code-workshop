---
id: product-room-search
title: Recherche de salles
lang: fr
tags: [produit, recherche, salles]
---

# Recherche de salles

La recherche de salles aide les utilisateurs à trouver rapidement une salle adaptée à leur besoin, sans parcourir toute la liste. Elle est disponible depuis la page d'accueil de Raumreservation.

## Critères de recherche

La recherche combine plusieurs critères, tous facultatifs :

- **capacité minimale** : nombre de places requis ;
- **étage** : un ou plusieurs étages du bâtiment ;
- **équipement** : visioconférence, projecteur, tableau blanc, etc.

Les critères sont combinés par un ET logique : seules les salles qui remplissent tous les critères sont affichées.

### Disponibilité

En indiquant un jour et un horaire, l'utilisateur ne voit que les salles libres pendant cette plage. Sans indication de temps, la recherche porte uniquement sur les caractéristiques des salles.

## Tri des résultats

Les résultats sont triés par capacité, de la plus petite à la plus grande salle répondant aux critères. Ainsi, une personne qui cherche une salle pour quatre personnes voit d'abord les petites salles, et les grandes salles restent disponibles pour les groupes plus importants.

## Exemple

Une recherche avec une capacité minimale de 10 places et l'équipement « visioconférence » renvoie par exemple la salle Eiger. Une recherche sans critère renvoie les quatre salles.

## Limites

- La recherche porte sur les salles actives ; les salles bloquées pour maintenance n'apparaissent pas.
- L'accessibilité physique n'est pas un critère de recherche ; elle est décrite dans le document dédié à l'accessibilité.
- La fonction peut être désactivée par un indicateur de fonctionnalité selon l'environnement.

## Performance

Les résultats s'affichent en général en moins d'une seconde, car la liste des salles est mise en cache.
