// Replace this value after deploying the Google Apps Script web app.
const SUBSCRIPTION_ENDPOINT = "https://script.google.com/macros/s/AKfycbza7P7JF7FdZAVKToQnguF-XGqT6QDnueGA6Wl0CeF1MqshG67cf1zX4Hdk8UMjcDr33g/exec";
const APP_VERSION = "20260722-2";

console.info("Daily World Brief frontend version:", APP_VERSION);

const form = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const websiteInput = document.querySelector("#website");
const message = document.querySelector("#form-message");
const button = form.querySelector("button");

const states = {
  idle: "",
  loading: "Subscribing...",
  success: "Almost done. Check your inbox for the confirmation email.",
  duplicate: "That email address is already subscribed.",
  invalid: "Enter a valid email address.",
  error: "Something went wrong. Please try again later."
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const website = websiteInput.value.trim();

  if (!emailInput.checkValidity()) {
    setState("invalid-email", states.invalid);
    emailInput.focus();
    return;
  }

  setLoading(true);
  setState("loading", states.loading);

  const payload = new URLSearchParams();
  payload.set("action", "subscribe");
  payload.set("email", email);
  payload.set("website", website);

  try {
    const response = await fetch(SUBSCRIPTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload.toString()
    });

    const result = await response.json();

    if (!response.ok || !result || result.ok !== true) {
      handleFailure(result);
      return;
    }

    setState("success", states.success);
    form.reset();
  } catch (error) {
    setState("general-error", states.error);
  } finally {
    setLoading(false);
  }
});

function handleFailure(result) {
  const code = result && result.code;

  if (code === "duplicate") {
    setState("duplicate-subscription", states.duplicate);
    return;
  }

  if (code === "invalid_email") {
    setState("invalid-email", states.invalid);
    emailInput.focus();
    return;
  }

  setState("general-error", states.error);
}

function setLoading(isLoading) {
  form.classList.toggle("is-loading", isLoading);
  button.disabled = isLoading;
  emailInput.disabled = isLoading;
}

function setState(state, text) {
  message.dataset.state = state;
  message.textContent = text;
}
