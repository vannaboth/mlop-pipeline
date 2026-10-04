PYTHON ?= python3
VENV := .venv

.PHONY: install lint format format-check test run ci clean

$(VENV):
	$(PYTHON) -m venv $(VENV)

install: $(VENV)
	$(VENV)/bin/python -m pip install --upgrade pip
	$(VENV)/bin/pip install -r requirements-dev.txt

lint:
	$(VENV)/bin/ruff check .

format:
	$(VENV)/bin/ruff format .
	$(VENV)/bin/ruff check --fix .

format-check:
	$(VENV)/bin/ruff format --check .
	$(VENV)/bin/ruff check .

test:
	$(VENV)/bin/python -m pytest -v

run:
	$(VENV)/bin/python app.py

ci: install format-check test

clean:
	rm -rf $(VENV)
	rm -rf .pytest_cache
	rm -rf .ruff_cache
	find . -type d -name "__pycache__" -exec rm -rf {} +
