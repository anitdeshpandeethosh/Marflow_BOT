// ===============================
// 🔐 VAPI CONFIG
// ===============================

// Load key from config.js
const apiKey = window.VAPI_PUBLIC_KEY;

// Assistants per language
const ASSISTANT_BY_LANGUAGE = {
  en: "41f57ad9-0001-4e6e-8fb0-bcc435c71734",
  es: "3ed636eb-3c98-4121-af56-d22aa1998aab",
  ar: "a009cf2d-51cc-4375-a541-04c409dab573"
};

// ===============================
// 📄 DOM ELEMENTS
// ===============================

const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const afterSubmit = document.getElementById("afterSubmit");

const startVapiBtn = document.getElementById("startVapiBtn");
const stepText = document.getElementById("stepText");
const helperText = document.getElementById("helperText");

const consentCheckbox = document.getElementById("consentCheckbox");

// ===============================
// 🔒 INITIAL STATE
// ===============================

submitBtn.disabled = true;

consentCheckbox.addEventListener("change", () => {
  submitBtn.disabled = !consentCheckbox.checked;
});

let vapiLoaded = false;
let vapiInstance = null;
let vapiScriptLoaded = false;

let leadContext = null;

// ===============================
// 📝 FORM SUBMIT
// ===============================

form.addEventListener("submit", (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Continuing...";

  const payload = Object.fromEntries(new FormData(form).entries());

  leadContext = {
    contact_name: payload.name.trim().toUpperCase(),
    company_name: payload.company.trim().toUpperCase(),
    email: payload.email.trim().toUpperCase(),
    language: payload.language
  };

  form.style.display = "none";
  afterSubmit.style.display = "block";
});

// ===============================
// 🎤 ENABLE MIC
// ===============================

startVapiBtn.addEventListener("click", async () => {
  startVapiBtn.disabled = true;
  startVapiBtn.innerText = "Enabling microphone...";

  await navigator.mediaDevices.getUserMedia({ audio: true });

  stepText.innerText = "Your microphone is ready.";
  helperText.innerText =
    "To start speaking with our AI assistant, tap the phone icon below.";

  startVapiBtn.style.display = "none";

  if (!vapiScriptLoaded) {
    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";

    script.async = true;

    script.onload = () => {
      vapiScriptLoaded = true;
      startVapi();
    };

    document.body.appendChild(script);

  } else {
    startVapi();
  }
});

// ===============================
// 🚀 START VAPI
// ===============================

function startVapi() {

  if (vapiLoaded) return;

  vapiLoaded = true;

  const selectedLanguage = leadContext?.language || "en";

  const selectedAssistant =
    ASSISTANT_BY_LANGUAGE[selectedLanguage] ||
    ASSISTANT_BY_LANGUAGE.en;

  vapiInstance = window.vapiSDK.run({

    apiKey,

    assistant: selectedAssistant,

    assistantOverrides: {
      variableValues: {
        contact_name: leadContext.contact_name,
        company_name: leadContext.company_name,
        email: leadContext.email,
        language: selectedLanguage
      }
    },

    config: {
      position: "bottom-right",
      idleText: "Start Call",
      loadingText: "Connecting...",
      activeText: "Listening..."
    }

  });

  vapiInstance.on("call-end", () => {
    fullDestroyVapi();
    resetUI();
  });

}

// ===============================
// 🧨 FULL VAPI DESTROY
// ===============================

function fullDestroyVapi() {

  if (vapiInstance) {

    try {
      vapiInstance.destroy();
    } catch (e) {
      console.log("Vapi destroy error:", e);
    }

  }

  const vapiElements = document.querySelectorAll("[class*='vapi']");

  vapiElements.forEach((el) => el.remove());

  vapiInstance = null;
  vapiLoaded = false;

}

// ===============================
// 🔄 UI RESET
// ===============================

function resetUI() {

  leadContext = null;

  form.reset();
  consentCheckbox.checked = false;

  form.style.display = "flex";
  afterSubmit.style.display = "none";

  submitBtn.disabled = true;
  submitBtn.innerText = "Continue";

  startVapiBtn.disabled = false;
  startVapiBtn.innerText = "Enable Microphone";
  startVapiBtn.style.display = "inline-flex";

  stepText.innerText = "Ready to talk?";
  helperText.innerText =
    "Enable your microphone to speak with our assistant.";

}