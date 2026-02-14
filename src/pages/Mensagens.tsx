import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

type MessageKind = "text" | "link" | "file";

type Message = {
  id: string;
  kind: MessageKind;
  text?: string;
  link?: string;
  fileName?: string;
  fileUrl?: string;
  mimeType?: string;
  size?: number;
  sentAt: string;
  senderId?: string;
  senderName?: string;
};

type ConnectionStatus = "connecting" | "connected" | "offline";

const MAX_FILE_SIZE_MB = 50;

function getBaseUrl() {
  const envBase = import.meta.env.VITE_MESSAGING_BASE_URL as
    | string
    | undefined;
  if (envBase) {
    return envBase.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

function getWsUrl(baseUrl: string) {
  const envWs = import.meta.env.VITE_MESSAGING_WS_URL as string | undefined;
  if (envWs) {
    return envWs;
  }
  if (!baseUrl) return "";
  try {
    const parsed = new URL(baseUrl);
    parsed.protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    parsed.pathname = "/ws";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function joinUrl(base: string, path: string | undefined) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!base) return path;
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = value < 10 && unitIndex > 0 ? 1 : 0;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

function detectLink(text: string) {
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match ? match[0] : "";
}

function getClientId() {
  if (typeof window === "undefined") return "server";
  const stored = window.localStorage.getItem("lanClientId");
  if (stored) return stored;
  const generated =
    window.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem("lanClientId", generated);
  return generated;
}

function getStoredName() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("lanDeviceName") ?? "";
}

export default function Mensagens() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [deviceName, setDeviceName] = useState(getStoredName);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientId] = useState(getClientId);
  const listRef = useRef<HTMLDivElement | null>(null);
  const messageIndex = useRef<Set<string>>(new Set());

  const baseUrl = useMemo(() => getBaseUrl(), []);
  const wsUrl = useMemo(() => getWsUrl(baseUrl), [baseUrl]);
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("lanDeviceName", deviceName);
  }, [deviceName]);

  useEffect(() => {
    if (!baseUrl) {
      setError("Servidor LAN indisponível. Verifique a URL.");
      setIsLoading(false);
      return;
    }
    let ignore = false;
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/api/messages`);
        if (!response.ok) {
          throw new Error("Falha ao carregar mensagens.");
        }
        const data = (await response.json()) as { messages?: Message[] };
        if (ignore) return;
        const loaded = Array.isArray(data.messages) ? data.messages : [];
        messageIndex.current = new Set(loaded.map((item) => item.id));
        loaded.sort(
          (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );
        setMessages(loaded);
        setError(null);
      } catch (err) {
        if (!ignore) {
          setError(
            "Nao foi possivel carregar mensagens. Confirme se o servidor esta ativo."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };
    loadMessages();
    return () => {
      ignore = true;
    };
  }, [baseUrl]);

  useEffect(() => {
    if (!wsUrl) return;
    let active = true;
    const socket = new WebSocket(wsUrl);
    setStatus("connecting");

    socket.onopen = () => {
      if (active) setStatus("connected");
    };
    socket.onclose = () => {
      if (active) setStatus("offline");
    };
    socket.onerror = () => {
      if (active) setStatus("offline");
    };
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          type?: string;
          payload?: Message;
        };
        if (payload.type !== "message" || !payload.payload) return;
        const message = payload.payload;
        if (messageIndex.current.has(message.id)) return;
        messageIndex.current.add(message.id);
        setMessages((prev) => {
          const next = [...prev, message];
          next.sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
          return next;
        });
      } catch (err) {
        // ignore invalid payloads
      }
    };

    return () => {
      active = false;
      socket.close();
    };
  }, [wsUrl]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "connecting":
        return "Conectando";
      default:
        return "Offline";
    }
  }, [status]);

  const lanPillLabel =
    status === "connected"
      ? "LAN ativa"
      : status === "connecting"
        ? "Conectando..."
        : "LAN offline";

  const sendMessage = async () => {
    if (isUploading) return;
    const trimmed = text.trim();
    if (!trimmed || !baseUrl) return;
    const link = detectLink(trimmed);
    const payload = {
      text: trimmed,
      link: link || undefined,
      kind: link ? "link" : "text",
      senderId: clientId,
      senderName: deviceName.trim() || undefined,
    };
    try {
      setError(null);
      const response = await fetch(`${baseUrl}/api/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Falha ao enviar.");
      }
      setText("");
    } catch (err) {
      setError("Nao foi possivel enviar a mensagem.");
    }
  };

  const handleSend = async (event: SyntheticEvent) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !baseUrl) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Arquivo acima de ${MAX_FILE_SIZE_MB} MB.`);
      event.target.value = "";
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", clientId);
    if (deviceName.trim()) {
      formData.append("senderName", deviceName.trim());
    }
    try {
      setIsUploading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Falha ao enviar arquivo.");
      }
    } catch (err) {
      setError("Nao foi possivel enviar a midia.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleCopy = async () => {
    if (!baseUrl || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(baseUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
    }
  };

  const statusClass = `status-pill is-${status}`;
  const resolvedBaseUrl = baseUrl || "http://SEU-IP:4174";

  return (
    <div className="page mensagens">
      <section className="hero hero-compact">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Mensagens LAN</p>
            <h1>Envie links e midia do celular direto para o PC.</h1>
            <p className="lead">
              Compartilhe arquivos, links e anotacoes em tempo real, sem login e
              sem nuvem. Tudo fica na rede local para responder rapido durante o
              culto.
            </p>
            <div className="mensagens-status">
              <span className={statusClass}>{statusLabel}</span>
              <span className="text-muted">Servidor: {resolvedBaseUrl}</span>
            </div>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Passo a passo</p>
            <h3>Como usar no celular</h3>
            <ul className="checklist">
              <li>Conecte celular e PC no mesmo Wi-Fi.</li>
              <li>Abra este painel no PC e copie o endereco.</li>
              <li>Digite o link no navegador do celular.</li>
              <li>Envie links, imagens, audio ou video.</li>
            </ul>
            <p className="text-muted small">
              Sem login. Tudo acontece localmente.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container mensagens-grid">
          <aside className="card mensagens-config">
            <p className="eyebrow">Configurar envio</p>
            <h3>Seu dispositivo na sala.</h3>
            <p className="text-muted">
              Defina um nome rapido para identificar quem enviou. Ele fica
              salvo apenas no navegador.
            </p>
            <label className="field">
              Nome do dispositivo
              <input
                type="text"
                placeholder="Ex: Celular do Louvor"
                value={deviceName}
                onChange={(event) => setDeviceName(event.target.value)}
                onBlur={() => setDeviceName((prev) => prev.trim())}
              />
            </label>
            <div className="mensagens-address">
              <span className="tag">Endereco atual</span>
              <span className="mensagens-url">{resolvedBaseUrl}</span>
              <div className="mensagens-address-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCopy}
                  disabled={!baseUrl}
                >
                  {copied ? "Copiado!" : "Copiar endereco"}
                </button>
              </div>
              <p className="text-muted small">
                Dica: se aparecer localhost, troque pelo IP do PC na rede.
              </p>
              <p className="text-muted small">
                Limite atual: {MAX_FILE_SIZE_MB} MB por arquivo.
              </p>
            </div>
            {error ? <p className="mensagens-alert">{error}</p> : null}
          </aside>

          <div className="card mensagens-board">
            <div className="mensagens-header">
              <div>
                <h3>Caixa de mensagens</h3>
                <p className="text-muted small">
                  {messages.length} itens recebidos
                </p>
              </div>
              <span className="pill">{lanPillLabel}</span>
            </div>

            <div className="mensagens-list" ref={listRef} aria-live="polite">
              {isLoading ? (
                <div className="mensagens-empty">Carregando mensagens...</div>
              ) : messages.length === 0 ? (
                <div className="mensagens-empty">
                  Nenhuma mensagem ainda. Envie a primeira pelo celular.
                </div>
              ) : (
                messages.map((message) => {
                  const isMine = message.senderId === clientId;
                  const senderLabel = isMine
                    ? "Voce"
                    : message.senderName?.trim() || "Visitante";
                  const timeLabel = timeFormatter.format(
                    new Date(message.sentAt)
                  );
                  const fileUrl = joinUrl(baseUrl, message.fileUrl);
                  const isImage = message.mimeType?.startsWith("image/");
                  const isAudio = message.mimeType?.startsWith("audio/");
                  const isVideo = message.mimeType?.startsWith("video/");

                  return (
                    <article
                      key={message.id}
                      className={`mensagem-item${isMine ? " is-mine" : ""}`}
                    >
                      <div className="mensagem-meta">
                        <span>{senderLabel}</span>
                        <span>{timeLabel}</span>
                      </div>
                      <div className="mensagem-bubble">
                        {message.kind === "text" ? (
                          <p>{message.text}</p>
                        ) : null}

                        {message.kind === "link" ? (
                          <div className="mensagem-content">
                            {message.text ? <p>{message.text}</p> : null}
                            {message.link ? (
                              <a
                                className="mensagem-link"
                                href={message.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {message.link}
                              </a>
                            ) : null}
                          </div>
                        ) : null}

                        {message.kind === "file" ? (
                          <div className="mensagem-content">
                            {isImage && fileUrl ? (
                              <img
                                className="mensagem-media"
                                src={fileUrl}
                                alt={message.fileName || "Imagem enviada"}
                              />
                            ) : null}
                            {isAudio && fileUrl ? (
                              <audio controls src={fileUrl} />
                            ) : null}
                            {isVideo && fileUrl ? (
                              <video controls src={fileUrl} />
                            ) : null}
                            <div className="mensagem-attachment">
                              <div>
                                <p className="mensagem-file-name">
                                  {message.fileName || "Arquivo enviado"}
                                </p>
                                <p className="mensagem-file-meta">
                                  {formatBytes(message.size)}{" "}
                                  {message.mimeType
                                    ? `· ${message.mimeType}`
                                    : ""}
                                </p>
                              </div>
                              {fileUrl ? (
                                <a
                                  className="btn btn-ghost"
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Abrir
                                </a>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <form className="mensagens-compose" onSubmit={handleSend}>
              <label className="field">
                Mensagem
                <textarea
                  rows={3}
                  placeholder="Cole um link, escreva um recado rapido ou envie um arquivo."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                />
              </label>
              <div className="mensagens-actions">
                <div className="mensagens-uploads">
                  <input
                    id="mensagens-upload"
                    className="mensagens-upload-input"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    accept="image/*,audio/*,video/*,application/pdf"
                  />
                  <label className="btn btn-ghost" htmlFor="mensagens-upload">
                    {isUploading ? "Enviando..." : "Anexar midia"}
                  </label>
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!text.trim() || isUploading}
                >
                  Enviar mensagem
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
