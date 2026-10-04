// Elements
const chatStream = document.getElementById("chatStream");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const clearChatBtn = document.getElementById("clearChatBtn");
const promptChips = document.querySelectorAll(".prompt-chip");
const themeToggle = document.getElementById("themeToggle");
const yearSpan = document.getElementById("year");

// Init Year
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Theme Switcher
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// Format Time
function getTimeString() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Append Message to Console
function appendMessage(sender, text) {
  const card = document.createElement("div");
  card.className = `msg-card ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = sender === "user" ? "👤" : "🤖";

  const body = document.createElement("div");
  body.className = "msg-body";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";

  const p = document.createElement("p");
  p.textContent = text;
  bubble.appendChild(p);

  const time = document.createElement("span");
  time.className = "msg-time";
  time.textContent = getTimeString();

  body.appendChild(bubble);
  body.appendChild(time);

  card.appendChild(avatar);
  card.appendChild(body);

  chatStream.appendChild(card);
  chatStream.scrollTop = chatStream.scrollHeight;
  return card;
}

// Typing Indicator
function showTypingIndicator() {
  const card = document.createElement("div");
  card.className = "msg-card bot";
  card.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = "🤖";

  const body = document.createElement("div");
  body.className = "msg-body";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

  body.appendChild(bubble);
  card.appendChild(avatar);
  card.appendChild(body);

  chatStream.appendChild(card);
  chatStream.scrollTop = chatStream.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

// Send Message Handler (calls backend API or fallback)
async function sendMessage(text) {
  if (!text.trim()) return;

  appendMessage("user", text);
  chatInput.value = "";
  chatInput.style.height = "auto";

  showTypingIndicator();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    if (res.ok) {
      const data = await res.json();
      removeTypingIndicator();
      appendMessage("bot", data.reply || "Message received.");
      return;
    }
  } catch (err) {
    // API not reachable, fallback to mock response
  }

  // Realistic mock reply when backend model is not yet connected
  setTimeout(() => {
    removeTypingIndicator();
    appendMessage(
      "bot",
      `Simulated response: Received "${text}". Your backend AI model can now be connected to /api/chat to return streaming or generated answers.`
    );
  }, 500);
}

// Form Submission
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(chatInput.value);
});

// Auto-expand textarea & Enter to submit
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage(chatInput.value);
  }
});

chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 120)}px`;
});

// Quick Prompt Chips
promptChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const prompt = chip.dataset.prompt;
    if (prompt) {
      sendMessage(prompt);
    }
  });
});

// Clear Chat
clearChatBtn.addEventListener("click", () => {
  chatStream.innerHTML = "";
  appendMessage("bot", "Conversation cleared. Feel free to ask another question!");
});
