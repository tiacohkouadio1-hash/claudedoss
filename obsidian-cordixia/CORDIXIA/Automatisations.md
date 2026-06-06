---
tags: [cordixia, automatisation, pipeline]
---

# ⚙️ Automatisations

← Retour : [[CORDIXIA]]

---

## Le pipeline complet

```
1. VEILLE IA          Perplexity → trouve les actus
        ↓
2. RÉSUMÉ IA          ChatGPT → Top 5 du jour
        ↓
2.5 VALIDATION        Thierry → 5 min (valide / ajuste l'angle)
        ↓
3. SCRIPT JT          Claude → 600-1000 mots
        ↓
4. VOIX               ElevenLabs → présentateur
        ↓
5. VIDÉO              InVideo → montage auto
        ↓
6. DISTRIBUTION       Repurpose.io → 9 plateformes
```

> Les outils : [[Agents IA]]

---

## Étape 2.5 — Validation

**Le garde-fou humain.** L'IA ne publie jamais sans Thierry.

- ✅ Valider / rejeter chaque actu
- ✅ Ajouter l'angle CORDIXIA (terrain, Afrique, business)
- ✅ 5 minutes maximum par jour

Interface web codée (Flask) : tableau de validation style JT.

---

## Stack technique (code)

```
cordixia-iatv/
├── agents/
│   ├── veille.py    → Perplexity
│   ├── script.py    → Claude
│   └── voix.py      → ElevenLabs
├── templates/
│   └── validation.html
└── app.py           → serveur Flask
```

---

## Budget mensuel

| Outil | Prix |
|---|---|
| Perplexity Pro | ~20 $ |
| Claude Pro | ~20 $ |
| ElevenLabs | ~5 $ |
| InVideo AI | ~20 $ |
| Repurpose.io | ~25 $ |
| Beehiiv (newsletter) | gratuit au début |
| **Total** | **~90 $/mois** |

---

## Temps quotidien

> **5 à 10 minutes** (uniquement la validation). Le reste est automatique.
