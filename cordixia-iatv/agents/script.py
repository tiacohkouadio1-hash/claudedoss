import os
import anthropic
from datetime import date

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

PROMPT_SYSTEM = """Tu es le Rédacteur JT de CORDIXIA IA TV.
Tu écris des scripts de journal télévisé sur l'intelligence artificielle.

Règles absolues :
- Ton : sérieux, professionnel, mais accessible au grand public
- Jamais de jargon technique sans explication immédiate
- Toujours concret : "qu'est-ce que ça change pour vous ?"
- Structure JT stricte : ouverture / rubriques / clôture
- Longueur : 600 à 800 mots
- Optimisé pour être lu à voix haute (ElevenLabs)
- Marque : CORDIXIA IA TV"""

PROMPT_SCRIPT = """Voici les {nb_actus} actualités IA validées pour l'épisode d'aujourd'hui ({date}) :

{actus_formatees}

ANGLE ÉDITORIAL DU JOUR : {angle}

Rédige le script JT complet de CORDIXIA IA TV pour cet épisode.

Structure obligatoire :

[OUVERTURE]
"Bonsoir. Voici les titres de l'intelligence artificielle pour ce {date}. Je suis votre présentateur sur CORDIXIA IA TV."
Annonce les titres en 3 phrases.

[RUBRIQUE 1] — titre de l'actu 1
Développe en 3-4 phrases. Termine par "Ce que ça change pour vous : ..."

[RUBRIQUE 2] — titre de l'actu 2
Idem.

[RUBRIQUE 3] — titre de l'actu 3
Idem.

[RUBRIQUE 4] — titre de l'actu 4
Idem.

[RUBRIQUE 5] — titre de l'actu 5
Idem.

[CLÔTURE]
"C'est tout pour ce journal. CORDIXIA IA TV, l'intelligence artificielle expliquée simplement, chaque jour. À demain. Bonsoir."

IMPORTANT : Écris uniquement le script, sans commentaires ni explications."""


def generer_script(actus_validees, angle=""):
    date_fr = date.today().strftime("%d %B %Y")

    actus_formatees = ""
    for i, actu in enumerate(actus_validees, 1):
        actus_formatees += f"""
ACTU {i} :
Titre : {actu['titre']}
Source : {actu['source']}
Résumé : {actu['resume']}
Impact : {actu['impact']}
"""

    prompt = PROMPT_SCRIPT.format(
        nb_actus=len(actus_validees),
        date=date_fr,
        actus_formatees=actus_formatees,
        angle=angle if angle else "Expliquer simplement, angle terrain et business"
    )

    if not ANTHROPIC_API_KEY:
        return _script_demo(date_fr)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system=PROMPT_SYSTEM,
        messages=[{"role": "user", "content": prompt}]
    )

    return message.content[0].text


def _script_demo(date_fr):
    return f"""[OUVERTURE]

Bonsoir. Voici les titres de l'intelligence artificielle pour ce {date_fr}. Je suis votre présentateur sur CORDIXIA IA TV.

Ce soir : Claude 4 redéfinit les standards du raisonnement IA. Google intègre Gemini dans tous vos outils de travail. Et une bonne nouvelle — l'IA va créer plus d'emplois qu'elle n'en supprime.

[RUBRIQUE 1 — Claude 4 dépasse GPT-4o]

Anthropic vient de publier les résultats officiels de Claude 4. Le constat est clair : ce nouveau modèle surpasse ses concurrents sur les tâches de raisonnement complexe et d'écriture de code.

Ce que ça change pour vous : si vous utilisez l'IA pour analyser des documents, rédiger des rapports ou automatiser des processus, vous avez maintenant accès à un outil encore plus précis et fiable.

[RUBRIQUE 2 — Google Gemini dans Workspace]

Google passe à la vitesse supérieure. Gemini Ultra 2 est désormais intégré directement dans Gmail, Google Docs et Google Sheets. L'IA peut rédiger, analyser et résumer automatiquement vos documents professionnels.

Ce que ça change pour vous : sans changer vos habitudes de travail, votre productivité peut doubler. C'est l'IA qui vient à vous, pas l'inverse.

[RUBRIQUE 3 — Mistral lève 600 millions d'euros]

La France confirme sa place dans la course mondiale à l'IA. Mistral AI vient de boucler une levée de fonds de 600 millions d'euros. L'objectif est clair : devenir le champion européen face aux géants américains.

Ce que ça change pour vous : l'Europe construit son indépendance technologique. Pour les entreprises françaises et africaines, cela signifie des solutions IA conformes aux réglementations locales et sans dépendance aux États-Unis.

[RUBRIQUE 4 — LLaMA 4 en open source]

Meta joue la carte de l'ouverture. Le groupe a publié LLaMA 4, son modèle le plus puissant, en accès totalement libre. N'importe quel développeur peut le télécharger et l'utiliser gratuitement.

Ce que ça change pour vous : des milliers de startups et d'entrepreneurs vont pouvoir créer leurs propres outils IA sans payer de licence. La démocratisation de l'IA s'accélère.

[RUBRIQUE 5 — L'IA crée des emplois]

Terminons par une information qui contredit les idées reçues. Selon le Fonds Monétaire International, l'IA générative devrait créer 12 millions de nouveaux emplois d'ici 2027 — bien plus qu'elle n'en supprimera.

Ce que ça change pour vous : la vraie menace n'est pas l'IA. C'est de ne pas apprendre à l'utiliser. Ceux qui maîtrisent ces outils aujourd'hui seront les professionnels les plus recherchés demain.

[CLÔTURE]

C'est tout pour ce journal. CORDIXIA IA TV, l'intelligence artificielle expliquée simplement, chaque jour. À demain. Bonsoir."""
