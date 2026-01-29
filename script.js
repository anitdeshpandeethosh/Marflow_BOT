const API_BASE = "http://localhost:3001";
const assistant = "ebea6f63-70c8-407e-9af5-1c0980aefc5a";
const apiKey = "a1c29cb3-95ce-4cb4-bcad-d90df153576d";

const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const afterSubmit = document.getElementById("afterSubmit");

const startVapiBtn = document.getElementById("startVapiBtn");
const stepText = document.getElementById("stepText");
const helperText = document.getElementById("helperText");

let vapiLoaded = false;

/* FORM SUBMIT */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  const payload = Object.fromEntries(new FormData(form).entries());

  await fetch(`${API_BASE}/api/submit-form`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  form.style.display = "none";
  afterSubmit.style.display = "block";
});

/* ENABLE MIC + LOAD VAPI */
startVapiBtn.addEventListener("click", async () => {
  startVapiBtn.disabled = true;
  startVapiBtn.innerText = "Enabling microphone...";

  await navigator.mediaDevices.getUserMedia({ audio: true });

  stepText.innerText = "Your microphone is ready.";
  helperText.innerText =
    "To start speaking with our AI assistant, tap the phone icon below.";

  startVapiBtn.style.display = "none";

  if (!vapiLoaded) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.async = true;
    script.onload = startVapi;
    document.body.appendChild(script);
  }
});

function startVapi() {
  if (vapiLoaded) return;
  vapiLoaded = true;

  window.vapiSDK.run({
    apiKey,
    assistant,
    config: {
      position: "bottom-right",
      idleText: "Start Call",
      loadingText: "Connecting...",
      activeText: "Listening..."
    }
  });
}
