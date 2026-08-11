import os
import requests
from datetime import date

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")

# Dossier où sont sauvegardées les voix générées
AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "audio")


def nettoyer_script(script):
    """Retire les annotations de mise en scène ([OUVERTURE], [RUBRIQUE 1]...)
    pour ne garder que le texte parlé."""
    lignes = []
    for ligne in script.split("\n"):
        ligne = ligne.strip()
        # On saute les annotations entre crochets et les lignes vides
        if ligne.startswith("[") and ligne.endswith("]"):
            continue
        if ligne:
            lignes.append(ligne)
    return "\n\n".join(lignes)


def generer_voix(script, voice_id=None, apercu=False):
    """Génère la voix du présentateur via ElevenLabs.
    - voice_id : voix à utiliser (sinon celle du .env)
    - apercu : si True, ne lit que les 2 premières phrases (test rapide d'un présentateur)
    Retourne le chemin du fichier audio ou une info de démo."""
    os.makedirs(AUDIO_DIR, exist_ok=True)

    voix_choisie = voice_id or ELEVENLABS_VOICE_ID
    texte = nettoyer_script(script)

    if apercu:
        # On garde seulement le début pour tester rapidement une voix
        phrases = texte.replace("\n", " ").split(". ")
        texte = ". ".join(phrases[:2]).strip()
        if not texte.endswith("."):
            texte += "."
        nom_fichier = f"apercu-{voix_choisie}.mp3"
    else:
        date_str = date.today().isoformat()
        nom_fichier = f"cordixia-iatv-{date_str}.mp3"

    chemin = os.path.join(AUDIO_DIR, nom_fichier)

    if not ELEVENLABS_API_KEY:
        return {
            "ok": False,
            "demo": True,
            "message": "Clé ElevenLabs non configurée. Renseigne ELEVENLABS_API_KEY dans .env.",
            "texte_nettoye": texte,
            "fichier": None
        }

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voix_choisie}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "text": texte,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.3,
            "use_speaker_boost": True
        }
    }

    response = requests.post(url, headers=headers, json=payload, timeout=120)
    response.raise_for_status()

    with open(chemin, "wb") as f:
        f.write(response.content)

    return {
        "ok": True,
        "demo": False,
        "message": "Voix générée avec succès.",
        "texte_nettoye": texte,
        "fichier": f"/static/audio/{nom_fichier}"
    }


# Quelques voix ElevenLabs publiques par défaut, utiles pour la démo
# et comme présentateurs de départ pour CORDIXIA IA TV.
VOIX_DEMO = [
    {"id": "JBFqnCBsd6RMkjVDRZzb", "nom": "George — grave, posé (présentateur JT)", "genre": "homme"},
    {"id": "onwK4e9ZLuTAKqWW03F9", "nom": "Daniel — clair, autoritaire", "genre": "homme"},
    {"id": "TX3LPaxmHKxFdv7VOQHJ", "nom": "Liam — jeune, dynamique", "genre": "homme"},
    {"id": "EXAVITQu4vr4xnSDxMaL", "nom": "Sarah — douce, professionnelle", "genre": "femme"},
    {"id": "XB0fDUnXU5powFXDhCwa", "nom": "Charlotte — chaleureuse, posée", "genre": "femme"},
]


def lister_voix_disponibles():
    """Liste les voix du compte ElevenLabs pour choisir le présentateur.
    Si pas de clé API, retourne une sélection de voix de démo."""
    if not ELEVENLABS_API_KEY:
        return VOIX_DEMO

    try:
        response = requests.get(
            "https://api.elevenlabs.io/v1/voices",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            timeout=30
        )
        response.raise_for_status()
        voices = response.json().get("voices", [])
        return [
            {
                "id": v["voice_id"],
                "nom": v["name"],
                "genre": v.get("labels", {}).get("gender", "")
            }
            for v in voices
        ]
    except Exception:
        # En cas d'erreur réseau/API, on retombe sur les voix de démo
        return VOIX_DEMO
