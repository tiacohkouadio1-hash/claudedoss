import os
import requests


PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

SOURCES_IA = [
    "OpenAI", "Anthropic", "Google DeepMind", "Mistral AI", "Meta AI",
    "Hugging Face", "Reddit IA", "X/Twitter IA"
]

PROMPT_VEILLE = """Tu es un agent de veille spécialisé en intelligence artificielle.
Recherche les 5 actualités IA les plus importantes des dernières 24 heures.

Sources prioritaires : OpenAI, Anthropic, Google DeepMind, Mistral, Meta AI, Hugging Face.

Pour chaque actualité, fournis :
- TITRE : (court et accrocheur)
- SOURCE : (nom de la source)
- RÉSUMÉ : (2-3 phrases simples, compréhensibles par un non-expert)
- IMPACT : (ce que ça change concrètement pour les gens)

Format de réponse : JSON strict avec une liste "actus" contenant 5 objets.
Exemple :
{
  "actus": [
    {
      "titre": "...",
      "source": "...",
      "resume": "...",
      "impact": "..."
    }
  ]
}"""


def fetch_actus_ia():
    if not PERPLEXITY_API_KEY:
        return _actus_demo()

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.1-sonar-large-128k-online",
        "messages": [
            {"role": "system", "content": "Tu es un agent de veille IA professionnel."},
            {"role": "user", "content": PROMPT_VEILLE}
        ],
        "temperature": 0.2,
        "search_recency_filter": "day"
    }

    response = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers=headers,
        json=payload,
        timeout=30
    )
    response.raise_for_status()

    content = response.json()["choices"][0]["message"]["content"]

    import json
    start = content.find("{")
    end = content.rfind("}") + 1
    return json.loads(content[start:end])["actus"]


def _actus_demo():
    """Actus de démonstration quand Perplexity n'est pas configuré."""
    return [
        {
            "titre": "Claude 4 d'Anthropic dépasse GPT-4o sur les benchmarks de raisonnement",
            "source": "Anthropic",
            "resume": "Anthropic vient de publier les résultats officiels de Claude 4. Le modèle surpasse ses concurrents sur les tâches de raisonnement complexe et de code.",
            "impact": "Les développeurs et entreprises ont désormais une alternative encore plus puissante pour automatiser leurs processus."
        },
        {
            "titre": "Google lance Gemini Ultra 2 intégré dans tous les produits Workspace",
            "source": "Google DeepMind",
            "resume": "Google intègre Gemini Ultra 2 directement dans Gmail, Docs et Sheets. L'IA peut maintenant rédiger, analyser et résumer automatiquement.",
            "impact": "Des millions d'utilisateurs professionnels vont voir leur productivité augmenter sans changer d'outil."
        },
        {
            "titre": "Mistral AI lève 600 millions d'euros pour concurrencer OpenAI en Europe",
            "source": "Mistral AI",
            "resume": "La startup française Mistral confirme une levée de fonds record. L'objectif : devenir le champion européen de l'IA face aux géants américains.",
            "impact": "L'Europe renforce son indépendance technologique dans la course à l'IA."
        },
        {
            "titre": "Meta publie LLaMA 4 en open source : l'IA gratuite pour tous",
            "source": "Meta AI",
            "resume": "Meta rend public son nouveau modèle LLaMA 4, plus puissant que jamais. Tout développeur peut le télécharger et l'utiliser librement.",
            "impact": "Des milliers de startups vont pouvoir créer des produits IA sans payer de licence."
        },
        {
            "titre": "L'IA générative crée 12 millions de nouveaux emplois selon le FMI",
            "source": "FMI / Reuters",
            "resume": "Contrairement aux craintes, le Fonds Monétaire International prédit que l'IA va créer plus d'emplois qu'elle n'en détruira d'ici 2027.",
            "impact": "Les travailleurs qui apprennent à utiliser l'IA seront les grands gagnants de cette révolution."
        }
    ]
