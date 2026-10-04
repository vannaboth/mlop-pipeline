from locust import HttpUser, between, task


class WebsiteUser(HttpUser):
    wait_time = between(1, 2)

    @task(3)
    def home(self):
        self.client.get("/")

    @task(1)
    def health(self):
        self.client.get("/health")
