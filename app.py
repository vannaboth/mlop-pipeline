import os

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.get("/health")
def health():
    return jsonify(status="ok"), 200


@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    reply = f"Echo from AI service: '{message}'. Hook model pipeline here."
    return jsonify({"reply": reply}), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)
