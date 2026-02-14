import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { Link } from "react-router-dom";
import { getSiteUrl } from "../utils/appUrls";

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
type ThemeMode = "light" | "dark";

type MessageFilter = "all" | "text" | "links" | "files" | "media";

type MessageRow =
  | { type: "day"; label: string }
  | { type: "message"; message: Message };

const MAX_FILE_SIZE_MB = 50;
const SCROLL_BOTTOM_THRESHOLD = 140;
const THEME_KEY = "sonoplastia-theme";
const START_KEY = "lanChatStarted";
const MENU_KEY = "lanToolbarOpen";

const MESSAGE_FILTERS: Array<{ id: MessageFilter; label: string }> = [
  { id: "all", label: "Tudo" },
  { id: "text", label: "Texto" },
  { id: "links", label: "Links" },
  { id: "files", label: "Arquivos" },
  { id: "media", label: "Midia" },
];

const QUICK_REPLIES = [
  { id: "ok", label: "Som ok", text: "Som ok, pode seguir." },
  { id: "test", label: "Testando", text: "Testando 1, 2, 3." },
  {
    id: "mic",
    label: "Microfone",
    text: "Microfone principal sem sinal.",
  },
  { id: "return", label: "Retorno", text: "Preciso de retorno no palco." },
  { id: "start", label: "Inicio", text: "Vou iniciar em 5 minutos." },
  { id: "thanks", label: "Obrigado", text: "Obrigado, tudo certo por aqui." },
];

function getStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (stored === null) return fallback;
  return stored === "true";
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  return prefersDark ? "dark" : "light";
};

function isSameDay(date: Date, other: Date) {
  return (
    date.getFullYear() === other.getFullYear() &&
    date.getMonth() === other.getMonth() &&
    date.getDate() === other.getDate()
  );
}

function getDayLabel(date: Date, formatter: Intl.DateTimeFormat) {
  const today = new Date();
  if (isSameDay(date, today)) return "Hoje";
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Ontem";
  return formatter.format(date);
}

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

function isMediaMessage(message: Message) {
  if (message.kind !== "file") return false;
  const mimeType = message.mimeType ?? "";
  return (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("audio/") ||
    mimeType.startsWith("video/")
  );
}

export default function Mensagens() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [deviceName, setDeviceName] = useState(getStoredName);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [clientId] = useState(getClientId);
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [hasStarted, setHasStarted] = useState(() =>
    getStoredBoolean(START_KEY, false)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<MessageFilter>("all");
  const [sendOnEnter, setSendOnEnter] = useState(() =>
    getStoredBoolean("lanSendOnEnter", true)
  );
  const [compactMode, setCompactMode] = useState(() =>
    getStoredBoolean("lanCompactMode", true)
  );
  const [isMenuOpen, setIsMenuOpen] = useState(() =>
    getStoredBoolean(MENU_KEY, false)
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const messageIndex = useRef<Set<string>>(new Set());

  const baseUrl = useMemo(() => getBaseUrl(), []);
  const wsUrl = useMemo(() => getWsUrl(baseUrl), [baseUrl]);
  const siteUrl = useMemo(() => getSiteUrl(), []);
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    []
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.add("mensagens-body");
    return () => {
      document.body.classList.remove("mensagens-body");
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("lanDeviceName", deviceName);
  }, [deviceName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(START_KEY, String(hasStarted));
  }, [hasStarted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("lanSendOnEnter", String(sendOnEnter));
  }, [sendOnEnter]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("lanCompactMode", String(compactMode));
  }, [compactMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MENU_KEY, String(isMenuOpen));
  }, [isMenuOpen]);

  useEffect(() => {
    if (!baseUrl) {
      setError("Servidor LAN indisponivel. Verifique a URL.");
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
            (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
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
    if (!isAtBottom) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, isAtBottom]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const distance = list.scrollHeight - list.scrollTop - list.clientHeight;
    setIsAtBottom(distance < SCROLL_BOTTOM_THRESHOLD);
  }, [messages, searchTerm, activeFilter]);

  useEffect(() => {
    if (messages.length > 0 && !hasStarted) {
      setHasStarted(true);
    }
  }, [messages.length, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const hasQuery = searchTerm.trim().length > 0 || activeFilter !== "all";
    if (!isMenuOpen && hasQuery) {
      setIsMenuOpen(true);
    }
  }, [searchTerm, activeFilter, hasStarted, isMenuOpen]);

  useEffect(() => {
    if (!hasStarted && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [hasStarted, isMenuOpen]);

  useEffect(() => {
    if (!isSidebarOpen) return;
    if (typeof window === "undefined") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    if (typeof window === "undefined") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target as Node)) return;
      setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [isMenuOpen]);

  const adjustTextareaHeight = useCallback(() => {
    const element = textareaRef.current;
    if (!element || typeof window === "undefined") return;
    element.style.height = "auto";
    const styles = window.getComputedStyle(element);
    let lineHeight = parseFloat(styles.lineHeight);
    if (Number.isNaN(lineHeight)) {
      const fontSize = parseFloat(styles.fontSize) || 16;
      lineHeight = fontSize * 1.4;
    }
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    const maxHeight = lineHeight * 5 + paddingTop + paddingBottom;
    const nextHeight = Math.min(element.scrollHeight, maxHeight);
    element.style.height = `${nextHeight}px`;
    element.style.overflowY =
      element.scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    adjustTextareaHeight();
  }, [adjustTextareaHeight, hasStarted, text]);

  useEffect(() => {
    if (!hasStarted) return;
    if (typeof window === "undefined") return;
    const handleResize = () => adjustTextareaHeight();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [adjustTextareaHeight, hasStarted]);

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

  const filteredMessages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return messages.filter((message) => {
      if (activeFilter === "text" && message.kind !== "text") return false;
      if (activeFilter === "links" && message.kind !== "link") return false;
      if (activeFilter === "files" && message.kind !== "file") return false;
      if (activeFilter === "media" && !isMediaMessage(message)) return false;
      if (!normalizedSearch) return true;
      const haystack = [
        message.text,
        message.link,
        message.fileName,
        message.senderName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [messages, activeFilter, searchTerm]);

  const groupedMessages = useMemo(() => {
    const rows: MessageRow[] = [];
    let lastLabel = "";
    filteredMessages.forEach((message) => {
      const label = getDayLabel(new Date(message.sentAt), dateFormatter);
      if (label !== lastLabel) {
        rows.push({ type: "day", label });
        lastLabel = label;
      }
      rows.push({ type: "message", message });
    });
    return rows;
  }, [filteredMessages, dateFormatter]);

  const messageStats = useMemo(() => {
    let files = 0;
    let links = 0;
    messages.forEach((message) => {
      if (message.kind === "file") files += 1;
      if (message.kind === "link") links += 1;
    });
    return { files, links };
  }, [messages]);

  const lastMessageSummary = useMemo(() => {
    if (!messages.length) {
      return { time: "--:--", preview: "Nenhuma mensagem ainda." };
    }
    const last = messages[messages.length - 1];
    const time = timeFormatter.format(new Date(last.sentAt));
    let preview = "";
    if (last.kind === "file") {
      preview = last.fileName
        ? `Arquivo: ${last.fileName}`
        : "Arquivo enviado";
    } else if (last.kind === "link") {
      preview = last.text?.trim() || last.link || "Link enviado";
    } else {
      preview = last.text?.trim() || "Mensagem enviada";
    }
    return { time, preview };
  }, [messages, timeFormatter]);

  const lastActivityLabel = messages.length
    ? `Ultima atividade ${lastMessageSummary.time}`
    : "Sem atividade";

  const resultsLabel =
    searchTerm.trim() || activeFilter !== "all"
      ? `${filteredMessages.length} de ${messages.length}`
      : `${messages.length} mensagens`;

  const trimmedInput = text.trimStart();
  const isQuickReplyMode =
    trimmedInput.startsWith("/") || trimmedInput.startsWith("\\");
  const quickReplyQuery = isQuickReplyMode
    ? trimmedInput.slice(1).toLowerCase()
    : "";
  const quickReplyMatches = useMemo(() => {
    if (!isQuickReplyMode) return [];
    if (!quickReplyQuery) return QUICK_REPLIES;
    return QUICK_REPLIES.filter((reply) => {
      const label = reply.label.toLowerCase();
      const message = reply.text.toLowerCase();
      return label.includes(quickReplyQuery) || message.includes(quickReplyQuery);
    });
  }, [isQuickReplyMode, quickReplyQuery]);
  const shouldShowQuickReplies =
    hasStarted && isQuickReplyMode && quickReplyMatches.length > 0;

  const themeLabel =
    theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
  const themeIcon = theme === "dark" ? "light_mode" : "dark_mode";
  const deviceLabel = deviceName.trim() || "Dispositivo sem nome";
  const canSendMessage =
    text.trim().length > 0 &&
    !isUploading &&
    !(isQuickReplyMode && text.trim().length <= 1);

  const scrollToBottom = () => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
    setIsAtBottom(true);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const sendMessage = async () => {
    if (isUploading) return;
    const trimmed = text.trim();
    if (!trimmed || !baseUrl) return;
    if (isQuickReplyMode && trimmed.length <= 1) return;
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

  const handleListScroll = () => {
    const list = listRef.current;
    if (!list) return;
    const distance = list.scrollHeight - list.scrollTop - list.clientHeight;
    setIsAtBottom(distance < SCROLL_BOTTOM_THRESHOLD);
  };

  const handleStartChat = (prefill?: string) => {
    if (prefill) {
      setText(prefill);
    }
    setHasStarted(true);
    setIsSidebarOpen(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleQuickReply = (reply: string) => {
    if (!hasStarted) {
      handleStartChat(reply);
      return;
    }
    setText(reply);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleClearChat = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Limpar conversa local? Isso nao remove mensagens do servidor."
      );
      if (!confirmed) return;
    }
    setMessages([]);
    messageIndex.current.clear();
  };

  return (
    <div className="page mensagens">
      <section
        className={`mensagens-shell${
          isSidebarOpen ? " is-sidebar-open" : ""
        }${compactMode ? " is-compact" : ""}`}
      >
        <aside className="mensagens-sidebar" aria-label="Conversas">
          <div className="mensagens-sidebar-header">
            <div className="mensagens-sidebar-top">
              <div className="mensagens-brand">
                <div className="mensagens-brand-mark" aria-hidden="true">
                  ML
                </div>
                <div>
                  <p className="mensagens-brand-title">MesaLink</p>
                  <p className="mensagens-brand-subtitle text-muted small">
                    Mensagens rapidas para a mesa
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mensagens-sidebar-close"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Fechar conversas"
              >
                <span className="mensagens-icon" aria-hidden="true">
                  close
                </span>
              </button>
            </div>
            <p className="mensagens-sidebar-status text-muted small">
              {statusLabel} · Rede local
            </p>
          </div>

          <div className="mensagens-sidebar-scroll">
            <div className="mensagens-section">
              <p className="mensagens-section-title">Canal</p>
              <button
                type="button"
                className="mensagens-channel is-active"
                onClick={() => setIsSidebarOpen(false)}
              >
                <div>
                  <p className="mensagens-channel-title">MesaLink</p>
                  <p className="mensagens-channel-preview text-muted small">
                    {lastMessageSummary.preview}
                  </p>
                </div>
                <div className="mensagens-channel-meta">
                  <span className="mensagens-channel-time">
                    {lastMessageSummary.time}
                  </span>
                  <span className="pill">{messages.length}</span>
                </div>
              </button>
            </div>

            <div className="mensagens-section mensagens-stats">
              <div>
                <p className="mensagens-stat-label">Mensagens</p>
                <p className="mensagens-stat-value">{messages.length}</p>
              </div>
              <div>
                <p className="mensagens-stat-label">Arquivos</p>
                <p className="mensagens-stat-value">{messageStats.files}</p>
              </div>
              <div>
                <p className="mensagens-stat-label">Links</p>
                <p className="mensagens-stat-value">{messageStats.links}</p>
              </div>
            </div>

            <div className="card mensagens-config" id="mensagens-config">
              <p className="eyebrow">Seu dispositivo</p>
              <h3>Nome da fonte</h3>
              <p className="text-muted">
                Defina um nome curto para identificar quem enviou.
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
              <label className="mensagens-switch">
                <span>Enviar com Enter</span>
                <input
                  type="checkbox"
                  checked={sendOnEnter}
                  onChange={(event) => setSendOnEnter(event.target.checked)}
                />
              </label>
              <label className="mensagens-switch">
                <span>Modo compacto</span>
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(event) => setCompactMode(event.target.checked)}
                />
              </label>
              <button
                type="button"
                className="btn btn-ghost mensagens-clear-btn"
                onClick={handleClearChat}
              >
                Limpar conversa local
              </button>
              <p className="text-muted small">
                Limite atual: {MAX_FILE_SIZE_MB} MB por arquivo.
              </p>
              {error ? (
                <p className="mensagens-alert" role="status">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <div
          className={`mensagens-chat${hasStarted ? "" : " is-start"}`}
          id="mensagens-chat"
        >
          <div className="mensagens-header">
            <button
              type="button"
              className="mensagens-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Abrir conversas"
              aria-expanded={isSidebarOpen}
            >
              <span className="mensagens-icon" aria-hidden="true">
                menu
              </span>
            </button>
            <div className="mensagens-header-main">
              <div className="mensagens-avatar" aria-hidden="true">
                ML
              </div>
              <div className="mensagens-header-text">
                <p className="mensagens-title">MesaLink</p>
                <p className="mensagens-subtitle">
                  {statusLabel} · {lastActivityLabel}
                </p>
              </div>
            </div>
            <div className="mensagens-header-actions">
              <a
                className="mensagens-icon-btn is-ghost"
                href={siteUrl}
                aria-label="Voltar ao site"
              >
                <span className="mensagens-icon" aria-hidden="true">
                  arrow_back
                </span>
              </a>
              <button
                type="button"
                className={`mensagens-icon-btn is-ghost${
                  theme === "dark" ? " is-active" : ""
                }`}
                onClick={toggleTheme}
                aria-pressed={theme === "dark"}
                aria-label={themeLabel}
              >
                <span className="mensagens-icon" aria-hidden="true">
                  {themeIcon}
                </span>
              </button>
              {hasStarted ? (
                <div className="mensagens-menu" ref={menuRef}>
                  <button
                    type="button"
                    className={`mensagens-icon-btn is-ghost${
                      isMenuOpen ? " is-active" : ""
                    }`}
                    onClick={toggleMenu}
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    aria-label="Abrir menu de filtros"
                  >
                    <span className="mensagens-icon" aria-hidden="true">
                      more_vert
                    </span>
                  </button>
                  {isMenuOpen ? (
                    <div className="mensagens-menu-panel" role="menu">
                      <div className="mensagens-menu-section">
                        <p className="mensagens-menu-title">Buscar</p>
                        <div className="mensagens-search">
                          <span className="mensagens-icon" aria-hidden="true">
                            search
                          </span>
                          <input
                            type="text"
                            placeholder="Buscar mensagens, links ou arquivos"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                          />
                          {searchTerm ? (
                            <button
                              type="button"
                              className="mensagens-icon-btn is-ghost"
                              onClick={() => setSearchTerm("")}
                              aria-label="Limpar busca"
                            >
                              <span className="mensagens-icon" aria-hidden="true">
                                close
                              </span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <div className="mensagens-menu-section">
                        <p className="mensagens-menu-title">Filtros</p>
                        <div className="mensagens-filter-row">
                          {MESSAGE_FILTERS.map((filter) => (
                            <button
                              key={filter.id}
                              type="button"
                              className={`mensagens-filter${
                                activeFilter === filter.id ? " is-active" : ""
                              }`}
                              onClick={() => setActiveFilter(filter.id)}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                        <span className="mensagens-results">{resultsLabel}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <span className={`status-pill is-${status}`}>{lanPillLabel}</span>
              <Link
                className="mensagens-help"
                to="/guia"
                aria-label="Abrir guia de uso"
              >
                <span className="mensagens-help-icon" aria-hidden="true">
                  help
                </span>
                <span className="mensagens-tooltip">Guia de uso</span>
              </Link>
            </div>
          </div>

          {!hasStarted ? (
            <div className="mensagens-start">
              <div className="mensagens-start-card">
                <div className="mensagens-start-hero">
                  <p className="mensagens-start-eyebrow">MesaLink</p>
                  <h3>Central rapida de mensagens</h3>
                  <p className="text-muted">
                    Envie avisos para a equipe e acompanhe tudo em tempo real.
                  </p>
                </div>
                <div className="mensagens-start-grid">
                  <div className="mensagens-start-panel">
                    <p className="mensagens-start-label">Status da rede</p>
                    <p className="mensagens-start-value">{lanPillLabel}</p>
                    <p className="mensagens-start-sub text-muted">
                      {lastActivityLabel}
                    </p>
                  </div>
                  <div className="mensagens-start-panel">
                    <p className="mensagens-start-label">Seu dispositivo</p>
                    <p className="mensagens-start-value">{deviceLabel}</p>
                    <button
                      type="button"
                      className="mensagens-link-btn"
                      onClick={() => setIsSidebarOpen(true)}
                    >
                      Editar configuracoes
                    </button>
                  </div>
                  <div className="mensagens-start-panel">
                    <p className="mensagens-start-label">Resumo rapido</p>
                    <div className="mensagens-start-metrics">
                      <span>{messages.length} msgs</span>
                      <span>{messageStats.files} arquivos</span>
                      <span>{messageStats.links} links</span>
                    </div>
                  </div>
                </div>
                <div className="mensagens-start-shortcuts">
                  <p className="mensagens-start-label">Atalhos rapidos</p>
                  <div className="mensagens-start-quick">
                    {QUICK_REPLIES.slice(0, 4).map((reply) => (
                      <button
                        key={reply.id}
                        type="button"
                        className="mensagens-chip"
                        onClick={() => handleQuickReply(reply.text)}
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mensagens-start-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleStartChat()}
                  >
                    Entrar no chat
                  </button>
                  <Link className="btn btn-ghost" to="/guia">
                    Abrir guia
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`mensagens-list${compactMode ? " is-compact" : ""}`}
                ref={listRef}
                onScroll={handleListScroll}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
              >
                {isLoading ? (
                  <div className="mensagens-empty">Carregando mensagens...</div>
                ) : groupedMessages.length === 0 ? (
                  <div className="mensagens-empty">
                    {messages.length === 0
                      ? "Nenhuma mensagem ainda. Envie a primeira pelo celular."
                      : "Nenhum resultado com os filtros atuais."}
                  </div>
                ) : (
                  groupedMessages.map((row) => {
                    if (row.type === "day") {
                      return (
                        <div key={`day-${row.label}`} className="mensagens-day">
                          {row.label}
                        </div>
                      );
                    }

                    const message = row.message;
                    const isMine = message.senderId === clientId;
                    const senderLabel = isMine
                      ? "Voce"
                      : message.senderName?.trim() || "Visitante";
                    const senderInitial = senderLabel.slice(0, 1).toUpperCase();
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
                        {!isMine ? (
                          <div className="mensagem-avatar" aria-hidden="true">
                            {senderInitial}
                          </div>
                        ) : null}
                        <div className="mensagem-body">
                          {!isMine ? (
                            <div className="mensagem-meta">{senderLabel}</div>
                          ) : null}
                          <div className="mensagem-bubble">
                            <div className="mensagem-content">
                              {message.kind === "text" ? (
                                <p>{message.text}</p>
                              ) : null}

                              {message.kind === "link" ? (
                                <>
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
                                </>
                              ) : null}

                              {message.kind === "file" ? (
                                <div className="mensagem-file">
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
                            <div className="mensagem-footer">
                              <span className="mensagem-time">{timeLabel}</span>
                              {isMine ? (
                                <span
                                  className="mensagem-status"
                                  aria-hidden="true"
                                >
                                  <span className="mensagens-icon">done_all</span>
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
                {!isAtBottom ? (
                  <button
                    type="button"
                    className="mensagens-jump"
                    onClick={scrollToBottom}
                  >
                    <span className="mensagens-icon" aria-hidden="true">
                      arrow_downward
                    </span>
                    Ir para o fim
                  </button>
                ) : null}
              </div>

              <form className="mensagens-compose" onSubmit={handleSend}>
                {shouldShowQuickReplies ? (
                  <div className="mensagens-quick">
                    <p className="mensagens-quick-title">
                      {"Atalhos / ou \\"}
                    </p>
                    <div className="mensagens-quick-list">
                      {quickReplyMatches.map((reply) => (
                        <button
                          key={reply.id}
                          type="button"
                          className="mensagens-chip"
                          onClick={() => handleQuickReply(reply.text)}
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mensagens-compose-row">
                  <div className="mensagens-compose-input">
                    <input
                      id="mensagens-upload"
                      className="mensagens-upload-input"
                      type="file"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      accept="image/*,audio/*,video/*,application/pdf"
                    />
                    <label
                      className="mensagens-attach-btn"
                      htmlFor="mensagens-upload"
                      aria-label="Anexar midia"
                    >
                      <span className="mensagens-icon" aria-hidden="true">
                        attach_file
                      </span>
                    </label>
                    <label className="sr-only" htmlFor="mensagens-text">
                      Mensagem
                    </label>
                    <textarea
                      id="mensagens-text"
                      ref={textareaRef}
                      rows={1}
                      placeholder="Mensagem... (use / ou \\)"
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      onKeyDown={(event) => {
                        if (!sendOnEnter) return;
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          if (isQuickReplyMode && quickReplyMatches.length > 0) {
                            handleQuickReply(quickReplyMatches[0].text);
                            return;
                          }
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <button
                    className="mensagens-icon-btn is-primary"
                    type="submit"
                    disabled={!canSendMessage}
                    aria-label="Enviar mensagem"
                  >
                    <span className="mensagens-icon" aria-hidden="true">
                      send
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <button
          type="button"
          className="mensagens-backdrop"
          aria-hidden={!isSidebarOpen}
          onClick={() => setIsSidebarOpen(false)}
        />
      </section>
    </div>
  );
}
