import crypto from "crypto";
import fs from "fs";
import { createServer } from "http";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";
import { WebSocket, WebSocketServer } from "ws";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const uploadsDir = path.join(rootDir, "uploads");
const distDir = path.join(rootDir, "dist");
const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT || 4174);
const maxMessages = Number(process.env.MAX_MESSAGES || 200);
const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 50);
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxFileSizeBytes },
});

const messages = [];

function normalizeText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function isValidLink(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
}

function createMessage({
  kind,
  text,
  link,
  fileName,
  fileUrl,
  mimeType,
  size,
  senderId,
  senderName,
}) {
  return {
    id: crypto.randomUUID(),
    kind,
    text,
    link,
    fileName,
    fileUrl,
    mimeType,
    size,
    senderId,
    senderName,
    sentAt: new Date().toISOString(),
  };
}

function storeMessage(message) {
  messages.push(message);
  if (messages.length > maxMessages) {
    messages.splice(0, messages.length - maxMessages);
  }
  return message;
}

function broadcastMessage(message) {
  const payload = JSON.stringify({ type: "message", payload: message });
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

app.get("/api/messages", (_req, res) => {
  res.json({ messages });
});

app.post("/api/message", (req, res) => {
  const text = normalizeText(req.body?.text);
  const rawLink = normalizeText(req.body?.link);
  const senderId = normalizeText(req.body?.senderId);
  const senderName = normalizeText(req.body?.senderName);
  const link = isValidLink(rawLink) ? rawLink : "";
  const kind = req.body?.kind === "link" || link ? "link" : "text";

  if (!text && !link) {
    res.status(400).json({ error: "Mensagem vazia." });
    return;
  }

  const message = createMessage({
    kind,
    text: text || undefined,
    link: link || undefined,
    senderId: senderId || undefined,
    senderName: senderName || undefined,
  });

  storeMessage(message);
  broadcastMessage(message);
  res.json({ ok: true, message });
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Arquivo ausente." });
    return;
  }
  const senderId = normalizeText(req.body?.senderId);
  const senderName = normalizeText(req.body?.senderName);
  const message = createMessage({
    kind: "file",
    fileName: req.file.originalname,
    fileUrl: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    senderId: senderId || undefined,
    senderName: senderName || undefined,
  });

  storeMessage(message);
  broadcastMessage(message);
  res.json({ ok: true, message });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Erro interno." });
});

const hasDist = fs.existsSync(path.join(distDir, "index.html"));
if (hasDist) {
  app.use(express.static(distDir));
  app.get("*", (req, res) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/uploads") ||
      req.path.startsWith("/ws")
    ) {
      res.status(404).end();
      return;
    }
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res
      .status(200)
      .type("text")
      .send("Build nao encontrado. Rode npm run build.");
  });
}

function getLanUrls(portNumber) {
  const interfaces = os.networkInterfaces();
  const urls = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        urls.push(`http://${net.address}:${portNumber}`);
      }
    }
  }
  return urls;
}

server.listen(port, host, () => {
  console.log(`Servidor LAN ativo em http://localhost:${port}`);
  const urls = getLanUrls(port);
  if (urls.length) {
    console.log("Acesse pelo celular:");
    urls.forEach((url) => console.log(`- ${url}`));
  }
});
