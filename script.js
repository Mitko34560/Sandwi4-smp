const blockHost = document.getElementById("floating-blocks");
const copyButtons = document.querySelectorAll("[data-ip]");
const revealItems = document.querySelectorAll(".reveal");
const checkoutButtons = document.querySelectorAll("[data-rank-buy]");
const checkoutMessage = document.getElementById("checkout-message");

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

function showCheckoutMessage(message, tone = "") {
  if (!checkoutMessage) {
    return;
  }

  checkoutMessage.hidden = false;
  checkoutMessage.textContent = message;
  checkoutMessage.className = "checkout-message";

  if (tone) {
    checkoutMessage.classList.add(tone);
  }
}

if (blockHost) {
  const blockCount = 16;

  for (let index = 0; index < blockCount; index += 1) {
    const block = document.createElement("span");
    block.className = "floating-block";
    block.style.setProperty("--size", `${32 + Math.random() * 78}px`);
    block.style.setProperty("--delay", `${Math.random() * -6}s`);
    block.style.setProperty("--duration", `${4.8 + Math.random() * 3.6}s`);
    block.style.left = `${Math.random() * 100}%`;
    block.style.top = `${Math.random() * 82}%`;
    blockHost.appendChild(block);
  }
}

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
    } catch (error) {
      button.textContent = "Копирай ръчно IP";
    }

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1800);
  });
});

checkoutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const rank = button.dataset.rankBuy;
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Пренасочване...";
    showCheckoutMessage("Създаваме защитена Stripe Checkout сесия...", "");

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
      showCheckoutMessage(
        error instanceof Error ? error.message : "Възникна грешка при връзката със Stripe.",
        "error"
      );
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});

const params = new URLSearchParams(window.location.search);
const checkoutState = params.get("checkout");

if (checkoutState === "success") {
  showCheckoutMessage("Плащането беше успешно. Благодарим ти за подкрепата към Sandwi4 SMP.", "success");
  window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
} else if (checkoutState === "cancel") {
  showCheckoutMessage("Плащането беше отказано или прекъснато. Можеш да опиташ отново по всяко време.", "error");
  window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
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
    threshold: 0.18,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
