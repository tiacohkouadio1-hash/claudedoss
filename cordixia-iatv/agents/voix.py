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


def generer_voix(script):
    """Génère la voix du présentateur via ElevenLabs.
    Retourne le chemin du fichier audio ou une info de démo."""
    os.makedirs(AUDIO_DIR, exist_ok=True)

    texte = nettoyer_script(script)
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

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
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


def lister_voix_disponibles():
    """Liste les voix du compte ElevenLabs pour choisir le présentateur."""
    if not ELEVENLABS_API_KEY:
        return []

    response = requests.get(
        "https://api.elevenlabs.io/v1/voices",
        headers={"xi-api-key": ELEVENLABS_API_KEY},
        timeout=30
    )
    response.raise_for_status()
    voices = response.json().get("voices", [])
    return [{"id": v["voice_id"], "nom": v["name"]} for v in voices]
