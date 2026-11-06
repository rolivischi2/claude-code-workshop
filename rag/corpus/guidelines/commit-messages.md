---
id: guidelines-commit-messages
title: Messages de commit
lang: fr
tags: [directive, git, commit]
---

# Messages de commit

Des messages de commit clairs facilitent la relecture, la recherche dans l'historique et la génération des notes de version.

## Format

Les messages suivent la convention **Conventional Commits** :

```
<type>(<portée>): <résumé>

<corps facultatif>

Refs: RR-123
```

Les types autorisés sont `feat`, `fix`, `docs`, `refactor`, `test`, `build` et `chore`. La portée désigne le module concerné, par exemple `booking` ou `export`.

## Style du résumé

Le résumé est rédigé à l'**impératif**, comme une instruction : « ajouter la validation de la date de fin » et non « ajout de... » ou « ajouté ». Il tient sur une ligne, ne se termine pas par un point et reste court. Une ligne de résumé trop longue est coupée à l'écran de nombreux outils.

### Exemples

- `feat(booking): refuser les chevauchements d'horaires`
- `fix(export): ajouter la marque d'ordre des octets`
- `docs(adr): documenter le verrouillage optimiste`

## Référence au ticket

Chaque commit mentionne le ticket concerné, dans le pied de message (`Refs: RR-123`) ou dans le nom de la branche. Cette référence permet de retrouver le contexte d'un changement des mois plus tard.

## Corps du message

Le corps explique le **pourquoi** de la modification, pas le quoi, que le code montre déjà. Il mentionne les alternatives écartées et les effets de bord attendus.

## Fusion avec squash

Comme les demandes de changement sont intégrées avec squash, le message final du commit unique est celui qui compte. Il reprend le titre de la demande et le ticket.

## Changements incompatibles

Un changement incompatible est signalé par un point d'exclamation après le type (`feat!:`) et une section `BREAKING CHANGE` dans le corps.
