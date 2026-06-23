# Leçon 1 — Prompt Engineering (bases pratiques)

> On commence par le commencement, comme prévu dans `FORMATION_IA.md` (Étape 1).
> Objectif : savoir écrire des prompts efficaces et comprendre comment un LLM "pense".

---

## 1. Comment un LLM répond (en 5 min)

Un LLM (Claude, GPT...) ne "comprend" pas comme un humain : il prédit le texte le plus probable, mot par mot, en fonction de tout ce que tu lui as donné comme contexte (le "prompt").

Conséquences pratiques :
- **Plus le contexte est précis, meilleure est la réponse.** Un prompt vague → réponse vague.
- **Le modèle peut "halluciner"** : inventer des faits avec assurance. Toujours vérifier les infos factuelles importantes.
- **L'ordre des informations compte** : ce qui est dit en dernier a souvent plus de poids.

---

## 2. Les 4 techniques essentielles

### a) Zero-shot
Tu demandes directement, sans exemple.
```
Résume ce texte en 3 points clés : [texte]
```

### b) Few-shot
Tu donnes 1-3 exemples du résultat attendu avant ta vraie demande. Très utile pour un format précis (ex: classification, extraction de données).
```
Classe ces avis clients en Positif/Négatif/Neutre.

Avis: "Livraison rapide, produit conforme" → Positif
Avis: "Colis cassé, aucune réponse du SAV" → Négatif

Avis: "Le produit fonctionne mais l'emballage était abîmé" →
```

### c) Chain-of-thought (raisonnement étape par étape)
Tu demandes explicitement au modèle de réfléchir avant de répondre. Utile pour les tâches logiques/complexes.
```
Réfléchis étape par étape avant de donner ta réponse finale : [problème]
```

### d) System prompt (rôle + contraintes)
Tu définis le rôle, le ton, le format et les limites dès le départ. C'est ce qui transforme un "chatbot générique" en "assistant métier".
```
Tu es un assistant support client pour une boutique e-commerce.
Réponds toujours en français, ton poli et concis, maximum 3 phrases.
Si tu ne sais pas, dis-le et propose de transférer à un humain.
```

---

## 3. La structure d'un bon prompt (à retenir)

1. **Rôle** — qui doit être le modèle (ex: "Tu es expert en...")
2. **Contexte** — les infos nécessaires (données, texte, situation)
3. **Tâche** — ce que tu veux exactement, formulé sans ambiguïté
4. **Format de sortie** — JSON, liste à puces, longueur max, langue
5. **Contraintes/garde-fous** — ce qu'il ne doit pas faire

---

## 4. Exercices pratiques (à faire toi-même)

Fais ces 5 exercices avec l'API Claude ou directement sur claude.ai. Note tes résultats.

1. **Zero-shot vs précis** : demande "Écris-moi un email" puis recommence avec un prompt précisant destinataire, ton, longueur, objectif. Compare les deux réponses.
2. **Few-shot** : crée un prompt qui classe 5 avis clients (positif/négatif/neutre) en donnant 2 exemples.
3. **Chain-of-thought** : donne un petit problème de logique ou de calcul et compare la réponse avec et sans "réfléchis étape par étape".
4. **System prompt métier** : écris un system prompt pour un assistant qui répond aux questions FAQ d'une entreprise fictive (toi de choisir le secteur).
5. **Format structuré** : demande au modèle d'extraire nom, date et montant d'une facture texte, en sortie JSON strict.

---

## 5. Pour aller plus loin (gratuit)

- [docs.anthropic.com/prompt-engineering](https://docs.anthropic.com) — guide officiel Claude
- Cours "ChatGPT Prompt Engineering for Developers" (DeepLearning.AI, gratuit, ~1h30)

---

## ✅ Quand tu es prêt
Une fois les 5 exercices faits, on passe à la **Leçon 2 — Automatisation Make.com/n8n + IA** (premier cas d'usage vendable en freelance).
