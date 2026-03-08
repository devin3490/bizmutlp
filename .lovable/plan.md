

## Problème

La validation `validateTextInput` (ligne 171-173) applique un minimum de 7 mots à **tous** les champs texte, y compris le prénom, nom, âge, téléphone, email et ville (étape 1). Ces champs ne devraient pas avoir de minimum de mots.

## Plan

Modifier `validateTextInput` dans `ApplicationForm.tsx` pour appliquer le minimum de 7 mots **uniquement aux questions textarea** (étape 2), pas aux champs `text` de l'étape 1 (nom, prénom, âge, etc.).

**Changement** (ligne 170-174) :
- Remplacer la condition `if (question?.type === "textarea" || (question?.type === "text" && !isEmailQuestion))` par simplement `if (question?.type === "textarea")`.
- Les champs `text` (prénom, nom, âge, téléphone, ville) n'auront plus de minimum de mots — un seul mot suffit.
- Les champs `textarea` gardent le minimum de 7 mots.

