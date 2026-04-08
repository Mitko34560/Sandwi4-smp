import {
  buildRankCommand,
  json,
  readCustomField,
  readRawBody,
  verifyStripeSignature
} from "../lib/stripe.mjs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    json(res, 405, { error: "Метод не поддерживается." });
    return;
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    if (!webhookSecret) {
      json(res, 500, {
        error: "Отсутствует секрет webhook Stripe. Добавь STRIPE_WEBHOOK_SECRET в Vercel."
      });
      return;
    }

    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];

    verifyStripeSignature({
      payload: rawBody,
      signature: typeof signature === "string" ? signature : "",
      secret: webhookSecret
    });

    const event = JSON.parse(rawBody);
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data?.object;
      const rank = session?.metadata?.rank || "UNKNOWN";
      const username = readCustomField(session?.custom_fields, "minecraft_username") || "unknown";
      const commandPreview = buildRankCommand({
        username,
        rank,
        template: process.env.RANK_COMMAND_TEMPLATE || ""
      });

      console.log(
        JSON.stringify({
          type: "stripe_checkout_paid",
          sessionId: session?.id || null,
          paymentIntentId: session?.payment_intent || null,
          rank,
          minecraftUsername: username,
          amountTotal: session?.amount_total ?? null,
          currency: session?.currency || "eur",
          paymentStatus: session?.payment_status || "unknown",
          customerEmail: session?.customer_details?.email || null,
          commandPreview,
          receivedAt: new Date().toISOString()
        })
      );
    }

    json(res, 200, { received: true });
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : "Непредвиденная ошибка сервера."
    });
  }
}
