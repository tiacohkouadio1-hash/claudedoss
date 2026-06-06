import os
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

load_dotenv()

from agents.veille import fetch_actus_ia
from agents.script import generer_script

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


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
