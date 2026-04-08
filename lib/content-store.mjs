import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DATA_DIR = path.join(__dirname, "..", "data");
const DATA_DIR = resolveDataDir();
const APPLICATIONS_FILE = path.join(DATA_DIR, "applications.json");
const NEWS_FILE = path.join(DATA_DIR, "news.json");
const APPLICATIONS_SEED_FILE = path.join(PROJECT_DATA_DIR, "applications.json");
const NEWS_SEED_FILE = path.join(PROJECT_DATA_DIR, "news.json");
const APPLICATIONS_PATH = "content/applications.json";
const NEWS_PATH = "content/news.json";
const DEFAULT_ADMIN_PASSWORD = "AdminSandwi4smp202614";

export function ensureAdmin(req) {
  const configuredPassword = process.env.ADMIN_PANEL_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const providedPassword = String(req.headers["x-admin-password"] || "").trim();

  if (!isValidAdminPassword(providedPassword, configuredPassword)) {
    const error = new Error("Неверный пароль администратора.");
    error.statusCode = 401;
    throw error;
  }
}

export function createApplication(body) {
  const minecraftUsername = String(body.minecraftUsername || "").trim();
  const discordUsername = String(body.discordUsername || "").trim();
  const position = String(body.position || "").trim();
  const age = String(body.age || "").trim();
  const timezone = String(body.timezone || "").trim();
  const experience = String(body.experience || "").trim();
  const motivation = String(body.motivation || "").trim();
  const availability = String(body.availability || "").trim();

  if (!minecraftUsername || !discordUsername || !position || !age || !timezone || !experience || !motivation || !availability) {
    throw new Error("Пожалуйста, заполните все поля.");
  }

  return {
    id: crypto.randomUUID(),
    minecraftUsername,
    discordUsername,
    position,
    age,
    timezone,
    experience,
    motivation,
    availability,
    status: "pending",
    submittedAt: new Date().toISOString()
  };
}

export function createNewsItem(body) {
  const title = String(body.title || "").trim();
  const tag = String(body.tag || "Новость").trim() || "Новость";
  const bodyText = String(body.body || "").trim();
  const pinned = Boolean(body.pinned);

  if (!title || !bodyText) {
    throw new Error("У новости должен быть заголовок и содержание.");
  }

  return {
    id: crypto.randomUUID(),
    title,
    tag,
    body: bodyText,
    pinned,
    createdAt: new Date().toISOString()
  };
}

export async function listApplications(mode, newApplication) {
  const applications = await readCollection(APPLICATIONS_FILE, APPLICATIONS_PATH, APPLICATIONS_SEED_FILE);

  if (mode === "write") {
    applications.unshift(newApplication);
    await writeCollection(APPLICATIONS_FILE, APPLICATIONS_PATH, applications);
    return applications;
  }

  return applications.sort((left, right) => new Date(right.submittedAt) - new Date(left.submittedAt));
}

export async function updateApplicationStatus(body) {
  const id = String(body.id || "").trim();
  const status = String(body.status || "").trim();

  if (!id || !["pending", "reviewed", "accepted", "rejected"].includes(status)) {
    throw new Error("Недопустимое изменение заявки.");
  }

  const applications = await readCollection(APPLICATIONS_FILE, APPLICATIONS_PATH, APPLICATIONS_SEED_FILE);
  const updated = applications.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          status,
          updatedAt: new Date().toISOString()
        }
      : entry
  );

  await writeCollection(APPLICATIONS_FILE, APPLICATIONS_PATH, updated);
  return updated;
}

export async function listNews() {
  const news = await readCollection(NEWS_FILE, NEWS_PATH, NEWS_SEED_FILE);
  return news.sort(sortNews);
}

export async function saveNewsItem(newsItem) {
  const news = await readCollection(NEWS_FILE, NEWS_PATH, NEWS_SEED_FILE);
  news.unshift(newsItem);
  news.sort(sortNews);
  await writeCollection(NEWS_FILE, NEWS_PATH, news);
  return news;
}

export async function deleteNewsItem(id) {
  const news = await readCollection(NEWS_FILE, NEWS_PATH, NEWS_SEED_FILE);
  const filtered = news.filter((entry) => entry.id !== id);
  await writeCollection(NEWS_FILE, NEWS_PATH, filtered);
  return filtered;
}

function sortNews(left, right) {
  if (left.pinned !== right.pinned) {
    return left.pinned ? -1 : 1;
  }

  return new Date(right.createdAt) - new Date(left.createdAt);
}

async function readCollection(localPath, blobPath, seedPath) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return readBlobJson(blobPath);
  }

  return readLocalJson(localPath, seedPath);
}

async function writeCollection(localPath, blobPath, data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeBlobJson(blobPath, data);
    return;
  }

  await writeLocalJson(localPath, data);
}

async function readLocalJson(filePath, seedPath = "") {
  try {
    const content = await readFile(filePath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    if (seedPath && seedPath !== filePath) {
      try {
        const content = await readFile(seedPath, "utf8");
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  }
}

async function writeLocalJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function readBlobJson(pathname) {
  const { get } = await import("@vercel/blob");
  const result = await get(pathname, { access: "private" });

  if (!result || !result.stream) {
    return [];
  }

  const content = await new Response(result.stream).text();
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeBlobJson(pathname, data) {
  const { put } = await import("@vercel/blob");
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 0,
    overwrite: true,
    addRandomSuffix: false
  });
}

function resolveDataDir() {
  if (process.env.VERCEL || process.env.LAMBDA_TASK_ROOT) {
    return path.join(os.tmpdir(), "sandwi4-smp-data");
  }

  return PROJECT_DATA_DIR;
}

function isValidAdminPassword(providedPassword, configuredPassword) {
  const providedBuffer = Buffer.from(providedPassword, "utf8");
  const configuredBuffer = Buffer.from(configuredPassword, "utf8");

  if (providedBuffer.length !== configuredBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, configuredBuffer);
}
