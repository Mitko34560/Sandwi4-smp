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
    json(res, 405, { error: "Метод не поддерживается." });
  } catch (error) {
    json(res, error?.statusCode || 400, {
      error: error instanceof Error ? error.message : "Непредвиденная ошибка сервера."
    });
  }
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
