const page = document.body.dataset.page || "home";
const blockHost = document.getElementById("floating-blocks");
const copyButtons = document.querySelectorAll("[data-ip]");
const revealItems = document.querySelectorAll(".reveal");
const checkoutButtons = document.querySelectorAll("[data-rank-buy]");
const checkoutMessage = document.getElementById("checkout-message");

const ADMIN_STORAGE_KEY = "sandwi4-admin-password";

if (blockHost) {
  createFloatingBlocks(blockHost);
}

bindCopyButtons();
bindCheckoutButtons();
bindRevealAnimations();
bindCheckoutStateMessage();

if (page === "home") {
  loadNewsFeed();
}

if (page === "apply") {
  bindApplicationForm();
}

if (page === "admin") {
  bindAdminPanel();
}

function createFloatingBlocks(host) {
  const blockCount = 16;

  for (let index = 0; index < blockCount; index += 1) {
    const block = document.createElement("span");
    block.className = "floating-block";
    block.style.setProperty("--size", `${32 + Math.random() * 78}px`);
    block.style.setProperty("--delay", `${Math.random() * -6}s`);
    block.style.setProperty("--duration", `${4.8 + Math.random() * 3.6}s`);
    block.style.left = `${Math.random() * 100}%`;
    block.style.top = `${Math.random() * 82}%`;
    host.appendChild(block);
  }
}

function bindCopyButtons() {
  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const ip = button.dataset.ip;
      if (!ip) {
        return;
      }

      const originalText = button.textContent;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(ip);
        } else if (!fallbackCopy(ip)) {
          throw new Error("Clipboard unavailable");
        }

        button.textContent = "IP копиран";
      } catch {
        button.textContent = "Копирай IP ръчно";
      }

      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1800);
    });
  });
}

function bindCheckoutButtons() {
  checkoutButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const rank = button.dataset.rankBuy;
      const originalText = button.textContent;

      button.disabled = true;
      button.textContent = "Пренасочване...";
      showMessage(checkoutMessage, "Създаваме защитена Stripe Checkout сесия...", "");

      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ rank })
        });

        const payload = await response.json();

        if (!response.ok || !payload.url) {
          throw new Error(payload.error || "Неуспешно създаване на Checkout сесия.");
        }

        window.location.href = payload.url;
      } catch (error) {
        showMessage(
          checkoutMessage,
          error instanceof Error ? error.message : "Възникна грешка при връзката със Stripe.",
          "error"
        );
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  });
}

function bindRevealAnimations() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function bindCheckoutStateMessage() {
  const params = new URLSearchParams(window.location.search);
  const checkoutState = params.get("checkout");

  if (checkoutState === "success") {
    showMessage(
      checkoutMessage,
      "Плащането мина успешно. Благодарим ти за подкрепата към Sandwi4 SMP.",
      "success"
    );
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  } else if (checkoutState === "cancel") {
    showMessage(
      checkoutMessage,
      "Плащането беше отменено или прекъснато. Можеш да опиташ отново по всяко време.",
      "error"
    );
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  }
}

async function loadNewsFeed() {
  const newsList = document.getElementById("news-list");
  if (!newsList) {
    return;
  }

  try {
    const response = await fetch("/api/news");
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Новините не можаха да бъдат заредени.");
    }

    if (!payload.news.length) {
      newsList.innerHTML = `
        <article class="news-card">
          <span class="role-tag">Няма новини</span>
          <h3>Все още няма публикувани новини.</h3>
          <p>Когато публикуваш първата новина от админ панела, тя ще се появи тук.</p>
        </article>
      `;
      return;
    }

    newsList.innerHTML = payload.news
      .map(
        (item) => `
          <article class="news-card${item.pinned ? " pinned-card" : ""}">
            <span class="role-tag">${escapeHtml(item.tag || "Новина")}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
            <small>${formatDate(item.createdAt)}</small>
          </article>
        `
      )
      .join("");
  } catch (error) {
    newsList.innerHTML = `
      <article class="news-card">
        <span class="role-tag">Грешка</span>
        <h3>Новините не можаха да бъдат заредени.</h3>
        <p>${escapeHtml(error instanceof Error ? error.message : "Опитай отново по-късно.")}</p>
      </article>
    `;
  }
}

function bindApplicationForm() {
  const form = document.getElementById("application-form");
  const message = document.getElementById("application-message");

  if (!form || !message) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());
    const button = form.querySelector("button[type='submit']");
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Изпращане...";
    showMessage(message, "Изпращаме заявката...", "");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Заявката не можа да бъде изпратена.");
      }

      form.reset();
      showMessage(message, "Заявката е изпратена успешно.", "success");
    } catch (error) {
      showMessage(
        message,
        error instanceof Error ? error.message : "Възникна грешка при изпращането.",
        "error"
      );
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}

async function loadAdminNews() {
  const list = document.getElementById("admin-news-list");
  if (!list) {
    return;
  }

  const payload = await fetchAdminJson("/api/news", { method: "GET" });
  const news = payload.news || [];

  if (!news.length) {
    list.innerHTML = `<div class="admin-empty">Все още няма публикувани новини.</div>`;
    return;
  }

  list.innerHTML = news
    .map(
      (item) => `
        <article class="admin-card">
          <div class="admin-card-head">
            <span class="role-tag">${escapeHtml(item.tag || "Новина")}</span>
            <button class="ghost-button" data-delete-news="${item.id}">Изтрий</button>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <small>${formatDate(item.createdAt)}${item.pinned ? " • Закачена" : ""}</small>
        </article>
      `
    )
    .join("");

  list.querySelectorAll("[data-delete-news]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await fetchAdminJson(
          "/api/news",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: button.dataset.deleteNews })
          }
        );
        await loadAdminNews();
      } catch (error) {
        const panelMessage = document.getElementById("admin-panel-message");
        showMessage(
          panelMessage,
          error instanceof Error ? error.message : "Новината не можа да бъде изтрита.",
          "error"
        );
      }
    });
  });
}

async function loadAdminApplications() {
  const list = document.getElementById("admin-applications-list");
  if (!list) {
    return;
  }

  const payload = await fetchAdminJson("/api/applications", { method: "GET" });
  const applications = payload.applications || [];

  if (!applications.length) {
    list.innerHTML = `<div class="admin-empty">Все още няма заявки.</div>`;
    return;
  }

  list.innerHTML = applications
    .map(
      (item) => `
        <article class="admin-card">
          <div class="admin-card-head">
            <span class="role-tag">${escapeHtml(labelForPosition(item.position))}</span>
            <span class="status-pill status-${escapeHtml(item.status)}">${labelForStatus(item.status)}</span>
          </div>
          <h3>${escapeHtml(item.minecraftUsername)} • ${escapeHtml(item.discordUsername)}</h3>
          <p><strong>Възраст:</strong> ${escapeHtml(item.age)} • <strong>Часова зона:</strong> ${escapeHtml(item.timezone)}</p>
          <p><strong>Опит:</strong> ${escapeHtml(item.experience)}</p>
          <p><strong>Мотивация:</strong> ${escapeHtml(item.motivation)}</p>
          <p><strong>Активност:</strong> ${escapeHtml(item.availability)}</p>
          <small>${formatDate(item.submittedAt)}</small>
          <div class="status-actions">
            <button class="ghost-button" data-status-action="${item.id}" data-status-value="reviewed">Прегледана</button>
            <button class="ghost-button" data-status-action="${item.id}" data-status-value="accepted">Приета</button>
            <button class="ghost-button" data-status-action="${item.id}" data-status-value="rejected">Отхвърлена</button>
          </div>
        </article>
      `
    )
    .join("");

  list.querySelectorAll("[data-status-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await fetchAdminJson(
          "/api/applications",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: button.dataset.statusAction,
              status: button.dataset.statusValue
            })
          }
        );
        await loadAdminApplications();
      } catch (error) {
        const panelMessage = document.getElementById("admin-panel-message");
        showMessage(
          panelMessage,
          error instanceof Error ? error.message : "Статусът не можа да бъде променен.",
          "error"
        );
      }
    });
  });
}

function bindAdminPanel() {
  const loginPanel = document.getElementById("admin-login-panel");
  const dashboard = document.getElementById("admin-dashboard");
  const loginForm = document.getElementById("admin-login-form");
  const loginMessage = document.getElementById("admin-login-message");
  const panelMessage = document.getElementById("admin-panel-message");
  const logoutButton = document.getElementById("admin-logout");
  const newsForm = document.getElementById("news-form");

  const setAuthenticatedState = (isAuthenticated) => {
    if (loginPanel) {
      loginPanel.hidden = isAuthenticated;
    }
    if (dashboard) {
      dashboard.hidden = !isAuthenticated;
    }
  };

  const showDashboard = async (password) => {
    sessionStorage.setItem(ADMIN_STORAGE_KEY, password);
    setAuthenticatedState(true);
    await Promise.all([loadAdminNews(), loadAdminApplications()]);
  };

  const storedPassword = sessionStorage.getItem(ADMIN_STORAGE_KEY);
  if (storedPassword) {
    verifyAdminPassword(storedPassword)
      .then(() => showDashboard(storedPassword))
      .catch((error) => {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setAuthenticatedState(false);
        showMessage(
          loginMessage,
          error instanceof Error ? error.message : "Панелът не можа да бъде зареден.",
          "error"
        );
      });
  } else {
    setAuthenticatedState(false);
  }

  if (loginForm && loginMessage) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const password = String(formData.get("password") || "");
      const submitButton = loginForm.querySelector("button[type='submit']");
      const originalText = submitButton ? submitButton.textContent : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Проверка...";
      }

      try {
        await verifyAdminPassword(password);
        await showDashboard(password);
        showMessage(loginMessage, "Влизането е успешно.", "success");
      } catch (error) {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setAuthenticatedState(false);
        showMessage(
          loginMessage,
          error instanceof Error ? error.message : "Невалидна парола.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      window.location.reload();
    });
  }

  if (newsForm && panelMessage) {
    newsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(newsForm);
      const body = {
        title: formData.get("title"),
        tag: formData.get("tag"),
        body: formData.get("body"),
        pinned: formData.get("pinned") === "on"
      };

      try {
        await fetchAdminJson(
          "/api/news",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          }
        );

        newsForm.reset();
        showMessage(panelMessage, "Новината е публикувана.", "success");
        await loadAdminNews();
        if (page === "home") {
          await loadNewsFeed();
        }
      } catch (error) {
        showMessage(
          panelMessage,
          error instanceof Error ? error.message : "Новината не можа да бъде публикувана.",
          "error"
        );
      }
    });
  }
}

async function fetchAdminJson(url, options = {}, overridePassword = "") {
  const password = overridePassword || sessionStorage.getItem(ADMIN_STORAGE_KEY) || "";
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "x-admin-password": password
    }
  });
  const payload = await response.json();

  if (response.status === 401) {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
  }

  if (!response.ok) {
    throw new Error(payload.error || "Неуспешна заявка към админ API.");
  }

  return payload;
}

async function verifyAdminPassword(password) {
  await fetchAdminJson("/api/admin-auth", { method: "GET" }, password);
}

function labelForStatus(status) {
  if (status === "accepted") {
    return "Приета";
  }

  if (status === "rejected") {
    return "Отхвърлена";
  }

  if (status === "reviewed") {
    return "Прегледана";
  }

  return "Изчаква";
}

function labelForPosition(position) {
  if (position === "Helper") {
    return "Хелпер";
  }

  if (position === "Moderator") {
    return "Модератор";
  }

  if (position === "Admin") {
    return "Администратор";
  }

  if (position === "Builder") {
    return "Строител";
  }

  return position;
}

function fallbackCopy(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(helper);
  return copied;
}

function showMessage(node, message, tone = "") {
  if (!node) {
    return;
  }

  node.hidden = false;
  node.textContent = message;
  node.className = "checkout-message";

  if (tone) {
    node.classList.add(tone);
  }
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString("bg-BG", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch {
    return value;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
