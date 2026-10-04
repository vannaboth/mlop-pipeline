from unittest.mock import MagicMock, patch

from app import app


def test_home():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert b"Aura" in response.data


def test_health():
    client = app.test_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_chat_empty_message():
    client = app.test_client()
    response = client.post("/api/chat", json={"message": ""})
    assert response.status_code == 400
    assert "error" in response.get_json()


def test_chat_groq_missing_key():
    client = app.test_client()
    response = client.post("/api/chat", json={"message": "hello"})
    assert response.status_code == 200
    assert "GROQ_API_KEY is not set" in response.get_json()["reply"]


@patch("requests.post")
def test_chat_groq_success(mock_post):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "choices": [{"message": {"content": "Hello from Groq Llama 3!"}}]
    }
    mock_post.return_value = mock_resp

    with patch.dict("os.environ", {"GROQ_API_KEY": "gsk_dummy_test_key"}):
        from app import call_groq_api

        with patch("app.GROQ_API_KEY", "gsk_dummy_test_key"):
            reply = call_groq_api("hi")
            assert reply == "Hello from Groq Llama 3!"
