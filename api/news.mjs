import { json } from "../lib/stripe.mjs";
import { createNewsItem, deleteNewsItem, ensureAdmin, listNews, saveNewsItem } from "../lib/content-store.mjs";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const news = await listNews("read");
      json(res, 200, { news });
      return;
    }

    if (req.method === "POST") {
      ensureAdmin(req);
      const body = await readJson(req);
      const newsItem = createNewsItem(body);
      const news = await saveNewsItem(newsItem);
      json(res, 201, { news });
      return;
    }

    if (req.method === "DELETE") {
      ensureAdmin(req);
      const body = await readJson(req);
      const news = await deleteNewsItem(body.id);
      json(res, 200, { news });
      return;
    }

    res.setHeader("Allow", "GET, POST, DELETE");
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
