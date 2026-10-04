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

## 3. Free Deployment on Render

This project includes [`render.yaml`](render.yaml) for zero-cost hosting.

### Setup Instructions:
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com/) (free tier).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render detects `render.yaml` and deploys the web service as a free Docker service.
6. Auto-deploy updates your app on every git push.

---

## 4. Load Testing (Locust)

```bash
# Activate venv and run load tests
source .venv/bin/activate
locust -f locustfile.py --host http://localhost:5000
```
Open `http://localhost:8089` in your browser to configure virtual users and run benchmarks.
