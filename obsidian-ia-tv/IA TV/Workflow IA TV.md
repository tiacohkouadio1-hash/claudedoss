---
tags: [iatv, workflow, pipeline]
---

# ⚙️ Workflow IA TV

← [[Accueil IA TV]]

---

## Pipeline de production

### ÉTAPE 1 — VEILLE
**Outil :** Perplexity

**Sources :**
- OpenAI
- Anthropic
- Google
- Meta
- Mistral
- Reddit
- X
- Blogs IA
- Newsletters

---

### ÉTAPE 2 — RÉSUMÉ
**Outil :** Claude
**Mission :** Sélectionner les 5 informations les plus importantes.

---

### ÉTAPE 2.5 — VALIDATION
**Qui :** Thierry (5 min)
**Mission :** Valider / rejeter les actus + ajouter l'angle éditorial.

---

### ÉTAPE 3 — SCRIPT
**Outil :** Claude
**Mission :** Rédiger le JT.

---

### ÉTAPE 4 — VOIX
**Outil :** ElevenLabs
**Mission :** Générer la voix du présentateur.

---

### ÉTAPE 5 — VIDÉO (MONTAGE MANUEL — workflow officiel)

Le montage se fait **à la main** pour garder le contrôle total sur le rendu.

```
ElevenLabs  →  la voix (MP3 Peter - Narrator)
Canva       →  l'habillage IA TV (Kit D : générique, cartons rubriques, bandeau, conclusion)
Pexels/Canva → les images et vidéos b-roll, choisies manuellement par sujet
CapCut      →  le montage final (on assemble voix + habillage + b-roll)
```

**Pourquoi ce choix plutôt que la génération auto (InVideo) :**
- Contrôle total du rythme, des images et de l'habillage
- Cohérence visuelle garantie (vraie identité IA TV)
- Pas dépendant d'une IA qui choisit mal les visuels

**Ordre de montage dans CapCut :**
1. Importer le MP3 (voix) → c'est le squelette, tout se cale dessus
2. Poser le b-roll en fond, segment par segment (mots-clés → [[Banque de visuels - b-roll]])
3. Poser par-dessus les cartons Canva (Kit D) au moment où la voix annonce la rubrique
4. Ajouter le bandeau bas + le logo en watermark
5. Musique de fond légère (-18 dB sous la voix)
6. Export 1080p

→ Détail pas à pas : [[Montage JT 001 - pas a pas]]

---

### ÉTAPE 6 — DISTRIBUTION
**Outil :** Repurpose.io

**Mission :** Publier sur :
- YouTube
- TikTok
- Instagram
- Facebook
- LinkedIn
- Spotify
- Apple Podcast

---

## 🎯 Objectif final

```
1 script
   ↓
1 voix
   ↓
1 vidéo
   ↓
Diffusion sur toutes les plateformes
```

---

## 💰 Budget mensuel

| Outil | Prix |
|---|---|
| Perplexity Pro | ~20 $ |
| Claude Pro | ~20 $ |
| ElevenLabs | ~5 $ |
| InVideo AI | ~20 $ |
| Repurpose.io | ~25 $ |
| Beehiiv (newsletter) | gratuit au début |
| **Total** | **~90 $/mois** |

> Temps humain : **5-10 min/jour** (la validation, étape 2.5).

---

Voir aussi : [[Idées vidéos]] · [[Modèle de script]]
