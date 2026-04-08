import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import crypto from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = loadEnv(path.join(__dirname, ".env"));

const PORT = Number(env.PORT || 4242);
const SITE_URL = env.SITE_URL || `http://localhost:${PORT}`;
const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET || "";
const RANK_COMMAND_TEMPLATE = env.RANK_COMMAND_TEMPLATE || "";
const DATA_DIR = path.join(__dirname, "data");
const PURCHASES_FILE = path.join(DATA_DIR, "purchases.json");

const PRODUCTS = {
  SUPREME: { name: "SUPREME", amount: 3999, description: "Sandwi4 SMP donate rank SUPREME" },
  LEGEND: { name: "LEGEND", amount: 2999, description: "Sandwi4 SMP donate rank LEGEND" },
  "TITAN+": { name: "TITAN+", amount: 2499, description: "Sandwi4 SMP donate rank TITAN+" },
  TITAN: { name: "TITAN", amount: 1999, description: "Sandwi4 SMP donate rank TITAN" },
  "MVP+": { name: "MVP+", amount: 1599, description: "Sandwi4 SMP donate rank MVP+" },
  MVP: { name: "MVP", amount: 1199, description: "Sandwi4 SMP donate rank MVP" },
  "VIP+": { name: "VIP+", amount: 799, description: "Sandwi4 SMP donate rank VIP+" },
  VIP: { name: "VIP", amount: 499, description: "Sandwi4 SMP donate rank VIP" }
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", SITE_URL);

    if (req.method === "POST" && url.pathname === "/api/create-checkout-session") {
      if (!STRIPE_SECRET_KEY) {
        json(res, 500, { error: "Отсутствует секретный ключ Stripe. Добавь STRIPE_SECRET_KEY в .env." });
        return;
      }

      const body = await readJson(req);
      const rank = typeof body.rank === "string" ? body.rank.trim() : "";
      const product = PRODUCTS[rank];

      if (!product) {
        json(res, 400, { error: "Выбран недопустимый ранг." });
        return;
      }

      const origin = env.SITE_URL || `${inferProtocol(req)}://${req.headers.host}`;
      const session = await createStripeCheckoutSession({
        secretKey: STRIPE_SECRET_KEY,
        origin,
        product
      });

      json(res, 200, { url: session.url });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/stripe-webhook") {
      if (!STRIPE_WEBHOOK_SECRET) {
        json(res, 500, { error: "Отсутствует секрет webhook Stripe. Добавь STRIPE_WEBHOOK_SECRET в .env." });
        return;
      }

      const rawBody = await readRawBody(req);
      const signature = req.headers["stripe-signature"];

      verifyStripeSignature({
        payload: rawBody,
        signature: typeof signature === "string" ? signature : "",
        secret: STRIPE_WEBHOOK_SECRET
      });

      const event = JSON.parse(rawBody);
      await handleStripeEvent(event);
      json(res, 200, { received: true });
      return;
    }

    if (req.method === "GET" && url.pathname === "/health") {
      json(res, 200, { ok: true });
      return;
    }

    await serveStatic(req, res, url.pathname);
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : "Непредвиденная ошибка сервера."
    });
  }
});

server.listen(PORT, () => {
  console.log(`Sandwi4 SMP site running on ${SITE_URL}`);
});

async function serveStatic(req, res, pathname) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = path.resolve(__dirname, `.${cleanPath}`);

  if (!resolvedPath.startsWith(__dirname) || !existsSync(resolvedPath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Не найдено");
    return;
  }

  const extension = path.extname(resolvedPath).toLowerCase();
  const contentType = CONTENT_TYPES[extension] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(resolvedPath).pipe(res);
}

function inferProtocol(req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (typeof forwardedProto === "string" && forwardedProto.length > 0) {
    return forwardedProto.split(",")[0].trim();
  }

  return "http";
}

function json(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Тело запроса слишком большое."));
      }
    });

    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Некорректный JSON в теле запроса."));
      }
    });

    req.on("error", reject);
  });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      chunks.push(chunk);
      total += chunk.length;

      if (total > 1_000_000) {
        reject(new Error("Тело запроса слишком большое."));
      }
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    req.on("error", reject);
  });
}

function loadEnv(filePath) {
  const values = {};

  try {
    const content = readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      values[key] = value;
    }
  } catch {
    return values;
  }

  return values;
}

function createStripeCheckoutSession({ secretKey, origin, product }) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      mode: "payment",
      "success_url": `${origin}/?checkout=success`,
      "cancel_url": `${origin}/?checkout=cancel`,
      "payment_method_types[0]": "card",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": String(product.amount),
      "line_items[0][price_data][product_data][name]": `Sandwi4 SMP ${product.name}`,
      "line_items[0][price_data][product_data][description]": product.description,
      "custom_fields[0][key]": "minecraft_username",
      "custom_fields[0][label][type]": "custom",
      "custom_fields[0][label][custom]": "Ник в Minecraft",
      "custom_fields[0][type]": "text",
      "custom_fields[0][text][minimum_length]": "3",
      "custom_fields[0][text][maximum_length]": "16",
      "metadata[rank]": product.name
    });

    const request = https.request(
      {
        hostname: "api.stripe.com",
        path: "/v1/checkout/sessions",
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(params.toString())
        }
      },
      (response) => {
        let raw = "";

        response.on("data", (chunk) => {
          raw += chunk;
        });

        response.on("end", () => {
          const parsed = raw ? JSON.parse(raw) : {};

          if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
            resolve(parsed);
            return;
          }

          const message = parsed?.error?.message || "Запрос к Stripe завершился ошибкой.";
          reject(new Error(message));
        });
      }
    );

    request.on("error", reject);
    request.write(params.toString());
    request.end();
  });
}

function verifyStripeSignature({ payload, signature, secret }) {
  if (!signature) {
    throw new Error("Отсутствует заголовок Stripe-Signature.");
  }

  const elements = signature.split(",").map((part) => part.trim());
  const timestamp = elements.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = elements
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) {
    throw new Error("Некорректный формат подписи Stripe.");
  }

  const ageInSeconds = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (!Number.isFinite(ageInSeconds) || Math.abs(ageInSeconds) > 300) {
    throw new Error("Временная метка подписи Stripe вне допустимого диапазона.");
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const isValid = signatures.some((candidate) => safeCompare(expectedSignature, candidate));

  if (!isValid) {
    throw new Error("Не удалось проверить подпись Stripe.");
  }
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function handleStripeEvent(event) {
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return;
  }

  const session = event.data?.object;
  if (!session?.id) {
    throw new Error("В событии Stripe отсутствует checkout session.");
  }

  const purchases = await readPurchases();
  if (purchases.some((entry) => entry.sessionId === session.id)) {
    return;
  }

  const rank = session.metadata?.rank || "UNKNOWN";
  const username = readCustomField(session.custom_fields, "minecraft_username");
  const record = {
    sessionId: session.id,
    paymentIntentId: session.payment_intent || null,
    rank,
    minecraftUsername: username || "unknown",
    amountTotal: session.amount_total ?? null,
    currency: session.currency || "eur",
    paymentStatus: session.payment_status || "unknown",
    customerEmail: session.customer_details?.email || null,
    purchasedAt: new Date().toISOString(),
    fulfillmentStatus: "paid",
    commandPreview: buildRankCommand({
      username: username || "unknown",
      rank
    })
  };

  purchases.unshift(record);
  await writePurchases(purchases);
}

function readCustomField(fields, key) {
  if (!Array.isArray(fields)) {
    return "";
  }

  const match = fields.find((field) => field?.key === key);
  return match?.text?.value?.trim() || "";
}

function buildRankCommand({ username, rank }) {
  if (!RANK_COMMAND_TEMPLATE) {
    return null;
  }

  return RANK_COMMAND_TEMPLATE
    .replaceAll("{username}", username)
    .replaceAll("{rank}", rank)
    .replaceAll("{rank_lower}", rank.toLowerCase());
}

async function readPurchases() {
  try {
    const content = await readFile(PURCHASES_FILE, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writePurchases(purchases) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PURCHASES_FILE, JSON.stringify(purchases, null, 2), "utf8");
}
