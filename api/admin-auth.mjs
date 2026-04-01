import { json } from "../lib/stripe.mjs";
import { ensureAdmin } from "../lib/content-store.mjs";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      json(res, 405, { error: "Method not allowed." });
      return;
    }

    ensureAdmin(req);
    json(res, 200, { ok: true });
  } catch (error) {
    json(res, error?.statusCode || 400, {
      error: error instanceof Error ? error.message : "Unexpected server error."
    });
  }
}
