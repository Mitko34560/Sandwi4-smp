import { json } from "../lib/stripe.mjs";
import {
  createApplication,
  ensureAdmin,
  listApplications,
  updateApplicationStatus
} from "../lib/content-store.mjs";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const body = await readJson(req);
      const application = createApplication(body);
      await listApplications("write", application);
      json(res, 201, { ok: true, application });
      return;
    }

    if (req.method === "GET") {
      ensureAdmin(req);
      const applications = await listApplications("read");
      json(res, 200, { applications });
      return;
    }

    if (req.method === "PATCH") {
      ensureAdmin(req);
      const body = await readJson(req);
      const applications = await updateApplicationStatus(body);
      json(res, 200, { applications });
      return;
    }

    res.setHeader("Allow", "POST, GET, PATCH");
    json(res, 405, { error: "Методът не се поддържа." });
  } catch (error) {
    json(res, error?.statusCode || 400, {
      error: error instanceof Error ? error.message : "Възникна неочаквана сървърна грешка."
    });
  }
}

function readJson(req) {
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
