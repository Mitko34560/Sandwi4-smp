import {
  PRODUCTS,
  createStripeCheckoutSession,
  inferOrigin,
  json,
  normalizeBaseUrl,
  readJson
} from "../lib/stripe.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    json(res, 405, { error: "Метод не поддерживается." });
    return;
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY || "";
    if (!secretKey) {
      json(res, 500, { error: "Отсутствует секретный ключ Stripe. Добавь STRIPE_SECRET_KEY в Vercel." });
      return;
    }

    const body = await readJson(req);
    const rank = typeof body.rank === "string" ? body.rank.trim() : "";
    const product = PRODUCTS[rank];

    if (!product) {
      json(res, 400, { error: "Выбран недопустимый ранг." });
      return;
    }

    const origin = process.env.SITE_URL
      ? normalizeBaseUrl(process.env.SITE_URL)
      : inferOrigin(req);
    const session = await createStripeCheckoutSession({
      secretKey,
      origin,
      product
    });

    json(res, 200, { url: session.url });
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : "Непредвиденная ошибка сервера."
    });
  }
}
