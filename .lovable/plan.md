

## Diagnostic

Les logs montrent que :
- L'authentification OAuth2 **fonctionne** (le token est obtenu)
- L'erreur 403 vient de l'appel à `sheets.googleapis.com` → le service account n'a pas les droits sur ce sheet spécifique

**Deux causes probables :**

1. **Le `client_email` extrait par le regex n'est peut-être pas celui que tu as partagé.** Le parsing via regex fallback peut extraire un email incorrect si le JSON est mal formaté. Il faut loguer le `client_email` utilisé pour vérifier.

2. **Le nom de feuille `Sheet1` dans l'URL** — si ton Google Sheet est en français, l'onglet s'appelle probablement `Feuille 1` ou un autre nom. Ceci donnerait cependant une erreur 400, pas 403.

## Plan

1. **Ajouter un log du `client_email`** extrait des credentials pour vérifier qu'il correspond bien à `recrutement@clever-bounty-489615-f2.iam.gserviceaccount.com`

2. **Ajouter un log de la réponse complète** du Google Sheets API (headers, status, body) pour avoir plus de détails sur le refus

3. **Redéployer** et retester pour analyser les logs

Ceci permettra de confirmer si le problème vient du mauvais `client_email` extrait (à cause du regex fallback sur un JSON cassé) ou d'un autre problème de permissions.

