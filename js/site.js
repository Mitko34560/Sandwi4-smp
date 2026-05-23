const DEFAULT_SETTINGS = {
  ip: "mc.sandwi4smp.xyz",
  status: "Онлайн",
  version: "1.21.11 - 26.1",
  newsTitle: "Откриване на Sandwi4 SMP",
  newsText: "Сървърът стартира с survival свят, spawn зона, правила и първи community event. Подготви си кирка, храна и добра идея за база.",
  ownerName: "Mitacheto",
  adminName: "Boris_131",
  voteOne: "Портал за публикуване и гласуване за Minecraft сървъри.",
  voteTwo: "Международен server list за SMP общности и vote кампании."
};

const SETTINGS_KEY = "sandwi4-smp-settings";
const SETTINGS_VERSION_KEY = "sandwi4-smp-settings-version";
const SETTINGS_VERSION = "2026-05-23-motion-refresh";
const SESSION_KEY = "sandwi4-vault-session";
const LOGIN_HASH = "8782d20ced0218074cbce425e6ef92aa4282aba337149bb3732644456a5d37fe";

const readSettings = () => {
  try {
    if (localStorage.getItem(SETTINGS_VERSION_KEY) !== SETTINGS_VERSION) {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.setItem(SETTINGS_VERSION_KEY, SETTINGS_VERSION);
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_VERSION_KEY, SETTINGS_VERSION);
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
    localStorage.setItem(SETTINGS_VERSION_KEY, SETTINGS_VERSION);
    fillForm();
    showToast("Върнати начални стойности");
  });

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });
};

const initMotion = () => {
  document.body.classList.add("motion-ready");

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.setProperty("--progress", `${value}%`);
  }, { passive: true });

  window.addEventListener("pointermove", (event) => {
    document.body.style.setProperty("--mouse-x", `${(event.clientX / window.innerWidth) * 100}%`);
    document.body.style.setProperty("--mouse-y", `${(event.clientY / window.innerHeight) * 100}%`);
  }, { passive: true });

  const layer = document.createElement("div");
  layer.className = "pixel-field";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 26; i += 1) {
    const pixel = document.createElement("span");
    pixel.style.setProperty("--x", `${Math.random() * 100}%`);
    pixel.style.setProperty("--delay", `${Math.random() * 7}s`);
    pixel.style.setProperty("--size", `${6 + Math.random() * 12}px`);
    pixel.style.setProperty("--speed", `${7 + Math.random() * 8}s`);
    layer.append(pixel);
  }
  document.body.prepend(layer);

  const cards = document.querySelectorAll(".feature, .member, .vote-card, .detail, .connect-card, .admin-login, .admin-panel, .news-panel, .rule, .timeline");
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.setProperty("--tilt-x", `${y}deg`);
      card.style.setProperty("--tilt-y", `${x}deg`);
      card.style.setProperty("--shine-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--shine-y", `${event.clientY - rect.top}px`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  document.querySelectorAll(".primary-btn, .ghost-btn, .nav-toggle, .site-nav a").forEach((button) => {
    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.append(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const url = new URL(link.href, location.href);
    const current = location.pathname.replace(/\/index\.html$/, "/");
    const target = url.pathname.replace(/\/index\.html$/, "/");
    if (target === current || (current === "/vote/" && target.endsWith("/vote"))) {
      link.classList.add("active");
    }
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
initMotion();
