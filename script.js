const API_BASE = "https://marflow-backend.onrender.com";
const assistant = "41f57ad9-0001-4e6e-8fb0-bcc435c71734";
const apiKey = "a1c29cb3-95ce-4cb4-bcad-d90df153576d";

const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const afterSubmit = document.getElementById("afterSubmit");

const startVapiBtn = document.getElementById("startVapiBtn");
const stepText = document.getElementById("stepText");
const helperText = document.getElementById("helperText");

const consentCheckbox = document.getElementById("consentCheckbox");

// Disable submit on load
submitBtn.disabled = true;

consentCheckbox.addEventListener("change", () => {
  submitBtn.disabled = !consentCheckbox.checked;
});

let vapiLoaded = false;

// 🔑 GLOBAL LEAD CONTEXT (CRITICAL)
let leadContext = null;

/* FORM SUBMIT */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  const payload = Object.fromEntries(new FormData(form).entries());

  // 🔑 STORE CONTEXT FOR VAPI
  leadContext = {
    contact_name: payload.name.trim().toUpperCase(),
    company_name: payload.company.trim().toUpperCase(),
    email: payload.email.trim().toUpperCase()
  };

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

    // 🔥 THIS IS THE BREAKTHROUGH
    assistantOverrides: {
      variableValues: {
        contact_name: leadContext?.contact_name || "",
        company_name: leadContext?.company_name || "",
        email: leadContext?.email || ""
      }
    },

    config: {
      position: "bottom-right",
      idleText: "Start Call",
      loadingText: "Connecting...",
      activeText: "Listening..."
    }
  });
}