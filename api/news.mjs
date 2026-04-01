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
    json(res, 405, { error: "Method not allowed." });
  } catch (error) {
    json(res, 400, {
      error: error instanceof Error ? error.message : "Unexpected server error."
    });
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Request body too large."));
      }
    });

    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}
