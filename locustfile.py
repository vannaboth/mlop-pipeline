from locust import HttpUser, between, task


class WebsiteUser(HttpUser):
    wait_time = between(1, 2)

    @task(3)
    def home(self):
        self.client.get("/")

    @task(2)
    def chat(self):
        self.client.post("/api/chat", json={"message": "Hello from load test"})
