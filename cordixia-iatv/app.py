import os
from flask import Flask, render_template, jsonify, request, send_from_directory
from dotenv import load_dotenv

load_dotenv()

from agents.veille import fetch_actus_ia
from agents.script import generer_script
from agents.voix import generer_voix, lister_voix_disponibles

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("validation.html")


@app.route("/api/actus")
def api_actus():
    actus = fetch_actus_ia()
    return jsonify(actus)


@app.route("/api/generer-script", methods=["POST"])
def api_generer_script():
    data = request.get_json()
    actus_validees = data.get("actus", [])
    angle = data.get("angle", "")

    if not actus_validees:
        return jsonify({"error": "Aucune actu sélectionnée"}), 400

    script = generer_script(actus_validees, angle)
    return jsonify({"script": script})


@app.route("/api/generer-voix", methods=["POST"])
def api_generer_voix():
    data = request.get_json()
    script = data.get("script", "")

    if not script:
        return jsonify({"error": "Aucun script fourni"}), 400

    resultat = generer_voix(script)
    return jsonify(resultat)


@app.route("/api/voix-disponibles")
def api_voix_disponibles():
    return jsonify(lister_voix_disponibles())


@app.route("/static/audio/<path:filename>")
def serve_audio(filename):
    audio_dir = os.path.join(os.path.dirname(__file__), "static", "audio")
    return send_from_directory(audio_dir, filename)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
