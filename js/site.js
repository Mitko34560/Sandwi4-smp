const DEFAULT_SETTINGS = {
  ip: "play.sandwi4smp.bg",
  status: "Онлайн",
  version: "1.20.1 - 1.21.x",
  season: "Сезон 1",
  newsTitle: "Откриване на Sandwi4 SMP",
  newsText: "Сървърът стартира с survival свят, spawn зона, правила и първи community event. Подготви си кирка, храна и добра идея за база.",
  adminName: "Отворена позиция",
  builderName: "Community",
  voteOne: "Портал за публикуване и гласуване за Minecraft сървъри.",
  voteTwo: "Международен server list за SMP общности и vote кампании."
};

const SETTINGS_KEY = "sandwi4-smp-settings";
const SESSION_KEY = "sandwi4-vault-session";
const LOGIN_HASH = "8782d20ced0218074cbce425e6ef92aa4282aba337149bb3732644456a5d37fe";

const readSettings = () => {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const applySettings = () => {
  const settings = readSettings();
  document.querySelectorAll("[data-admin-field]").forEach((node) => {
    const key = node.dataset.adminField;
    if (settings[key]) node.textContent = settings[key];
  });
};

const showToast = (message) => {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
};

const copyIp = async () => {
  const ip = readSettings().ip;
  try {
    await navigator.clipboard.writeText(ip);
    showToast(`Копирано: ${ip}`);
  } catch {
    showToast(ip);
  }
};

const sha256 = async (value) => {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const initAdmin = () => {
  const loginPanel = document.querySelector("[data-login-panel]");
  const adminPanel = document.querySelector("[data-admin-panel]");
  const loginForm = document.querySelector("[data-login-form]");
  const settingsForm = document.querySelector("[data-settings-form]");
  if (!loginPanel || !adminPanel || !loginForm || !settingsForm) return;

  const fillForm = () => {
    const settings = readSettings();
    Object.entries(settings).forEach(([key, value]) => {
      if (settingsForm.elements[key]) settingsForm.elements[key].value = value;
    });
  };

  const showAdmin = () => {
    loginPanel.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    fillForm();
  };

  if (sessionStorage.getItem(SESSION_KEY) === "active") showAdmin();

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    const user = String(form.get("user") || "").trim();
    const password = String(form.get("password") || "");
    const error = document.querySelector("[data-login-error]");
    const hash = await sha256(`${user}:${password}`);
    if (hash === LOGIN_HASH) {
      sessionStorage.setItem(SESSION_KEY, "active");
      showAdmin();
      return;
    }
    error.textContent = "Грешен потребител или парола.";
  });

  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = { ...DEFAULT_SETTINGS };
    Object.keys(next).forEach((key) => {
      if (settingsForm.elements[key]) next[key] = settingsForm.elements[key].value.trim() || DEFAULT_SETTINGS[key];
    });
    saveSettings(next);
    applySettings();
    showToast("Запазено");
  });

  document.querySelector("[data-reset-settings]")?.addEventListener("click", () => {
    localStorage.removeItem(SETTINGS_KEY);
    fillForm();
    showToast("Върнати начални стойности");
  });

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });
};

document.querySelector("[data-nav-toggle]")?.addEventListener("click", () => {
  document.querySelector("[data-nav]")?.classList.toggle("open");
});

document.querySelectorAll("[data-copy-ip]").forEach((button) => {
  button.addEventListener("click", copyIp);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
applySettings();
initAdmin();
