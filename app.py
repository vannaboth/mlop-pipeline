import os

import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Config: Cloud Free API (Groq) or Local SLM (Ollama)
AI_PROVIDER = os.getenv("AI_PROVIDER", "groq").lower()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")
SLM_MODEL = os.getenv("SLM_MODEL", "qwen2.5:0.5b")


@app.route("/")
def home():
    return render_template("index.html")


@app.get("/health")
def health():
    return jsonify(status="ok"), 200


def call_groq_api(prompt: str) -> str:
    if not GROQ_API_KEY:
        return (
            "GROQ_API_KEY is not set. Get a free API key at https://console.groq.com "
            "and set it in your Render environment variables."
        )

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are Aura, a friendly, concise, and helpful AI assistant.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 512,
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=25)
    if resp.status_code == 200:
        data = resp.json()
        return data["choices"][0]["message"]["content"]

    return f"Groq API error ({resp.status_code}): {resp.text}"


def call_ollama_api(prompt: str) -> str:
    url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    resp = requests.post(
        url,
        json={"model": SLM_MODEL, "prompt": prompt, "stream": False},
        timeout=30,
    )
    if resp.status_code == 200:
        return resp.json().get("response", "")
    return f"SLM error ({resp.status_code})"


@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    try:
        if AI_PROVIDER == "groq":
            reply = call_groq_api(user_message)
        else:
            reply = call_ollama_api(user_message)
        return jsonify({"reply": reply}), 200
    except requests.exceptions.RequestException as err:
        return (
            jsonify(
                {
                    "reply": f"AI service unreachable ({err.__class__.__name__}). Check network / API settings."
                }
            ),
            200,
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port)
