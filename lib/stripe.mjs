import https from "node:https";
import crypto from "node:crypto";

export const PRODUCTS = {
  SUPREME: { name: "SUPREME", amount: 1250, description: "Ранг SUPREME за Sandwi4 SMP" },
  LEGEND: { name: "LEGEND", amount: 820, description: "Ранг LEGEND за Sandwi4 SMP" },
  "TITAN+": { name: "TITAN+", amount: 690, description: "Ранг TITAN+ за Sandwi4 SMP" },
  TITAN: { name: "TITAN", amount: 400, description: "Ранг TITAN за Sandwi4 SMP" },
  "MVP+": { name: "MVP+", amount: 339, description: "Ранг MVP+ за Sandwi4 SMP" },
  MVP: { name: "MVP", amount: 299, description: "Ранг MVP за Sandwi4 SMP" },
  VIP: { name: "VIP", amount: 199, description: "Ранг VIP за Sandwi4 SMP" }
};

export function json(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export function inferOrigin(req) {
  const protocolHeader = req.headers["x-forwarded-proto"];
  const hostHeader = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = Array.isArray(protocolHeader)
    ? protocolHeader[0]
    : String(protocolHeader || "https").split(",")[0].trim();
  const host = Array.isArray(hostHeader) ? hostHeader[0] : String(hostHeader || "").trim();

  return normalizeBaseUrl(`${protocol}://${host}`);
}

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Тялото на заявката е твърде голямо."));
      }
    });

    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Невалиден JSON в тялото на заявката."));
      }
    });

    req.on("error", reject);
  });
}

export function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      chunks.push(chunk);
      total += chunk.length;

      if (total > 1_000_000) {
        reject(new Error("Тялото на заявката е твърде голямо."));
      }
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    req.on("error", reject);
  });
}

export function createStripeCheckoutSession({ secretKey, origin, product }) {
  return new Promise((resolve, reject) => {
    const baseUrl = normalizeBaseUrl(origin);
    const params = new URLSearchParams({
      mode: "payment",
      "success_url": `${baseUrl}/?checkout=success`,
      "cancel_url": `${baseUrl}/?checkout=cancel`,
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

          const message = parsed?.error?.message || "Заявката към Stripe завърши с грешка.";
          reject(new Error(message));
        });
      }
    );

    request.on("error", reject);
    request.write(params.toString());
    request.end();
  });
}

export function normalizeBaseUrl(value) {
  const cleaned = String(value || "").trim().replace(/\/+$/, "");

  try {
    const url = new URL(cleaned);
    return url.origin;
  } catch {
    throw new Error("SITE_URL е зададен неправилно. Използвай пълен HTTPS адрес, например https://sandwi4-smp.vercel.app");
  }
}

export function verifyStripeSignature({ payload, signature, secret }) {
  if (!signature) {
    throw new Error("Липсва заглавка Stripe-Signature.");
  }

  const elements = signature.split(",").map((part) => part.trim());
  const timestamp = elements.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = elements.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) {
    throw new Error("Невалиден формат на Stripe подписа.");
  }

  const ageInSeconds = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (!Number.isFinite(ageInSeconds) || Math.abs(ageInSeconds) > 300) {
    throw new Error("Времевият печат на Stripe подписа е извън допустимия диапазон.");
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");
  const isValid = signatures.some((candidate) => safeCompare(expectedSignature, candidate));

  if (!isValid) {
    throw new Error("Подписът на Stripe не можа да бъде потвърден.");
  }
}

export function readCustomField(fields, key) {
  if (!Array.isArray(fields)) {
    return "";
  }

  const match = fields.find((field) => field?.key === key);
  return match?.text?.value?.trim() || "";
}

export function buildRankCommand({ username, rank, template }) {
  if (!template) {
    return null;
  }

  return template
    .replaceAll("{username}", username)
    .replaceAll("{rank}", rank)
    .replaceAll("{rank_lower}", rank.toLowerCase());
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
