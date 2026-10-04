# DevOps / CI/CD Lab Pipeline

Python Flask web application with automated GitHub Actions CI and free Render hosting.

---

## 1. Local Development

### Prerequisites
- Python 3.13+
- Make

### Quickstart
```bash
# Setup virtual environment and install dependencies
make install

# Check code formatting & linting
make format-check
make lint

# Auto-format and fix linter issues
make format

# Run unit tests
make test

# Start local server (http://localhost:5000)
make run
```

### Endpoints
- `GET /` — Returns greeting JSON message.
- `GET /health` — Health check endpoint returning HTTP 200.

---

## 2. CI/CD Pipeline (GitHub Actions)

Workflow file: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Runs on push and pull requests to `main`/`master`:
- Ruff formatting check
- Ruff linting
- Pytest unit tests

---

## 3. 100% Free Deployment on Render (with Free LLM API)

This project runs 100% free on **Render Free Web Service** using **Groq Free Cloud LLM** (Llama 3.1 8B):

### Steps:
1. **Get Free Groq API Key**:
   - Go to [Groq Console](https://console.groq.com/).
   - Sign up (free, no credit card required).
   - Create an API key (`gsk_...`).

2. **Deploy on Render**:
   - Push this repo to GitHub.
   - Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
   - Select your repository.
   - When prompted for `GROQ_API_KEY`, paste your key.
   - Click **Apply**.

Render deploys your frontend web service on the **Free Plan ($0/month)** with instant, ultra-fast AI responses powered by `llama-3.1-8b-instant`.

---

## 4. Load Testing (Locust)

```bash
# Activate venv and run load tests
source .venv/bin/activate
locust -f locustfile.py --host http://localhost:5000
```
Open `http://localhost:8089` in your browser to configure virtual users and run benchmarks.
