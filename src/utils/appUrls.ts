export type AppContext = "site" | "curso" | "mensagens";

const COURSE_SUBDOMAIN = "curso.sonoplastia";
const MENSAGENS_SUBDOMAIN = "mesalink.sonoplastia";

const normalizeUrl = (value?: string) => (value ? value.replace(/\/$/, "") : "");

const isIpAddress = (hostname: string) =>
  /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);

const stripSubdomain = (hostname: string) => {
  if (hostname === "localhost") return "localhost";
  if (hostname.endsWith(".localhost")) return "localhost";
  if (isIpAddress(hostname)) return hostname;

  const parts = hostname.split(".");
  if (parts.length <= 2) return hostname;
  return parts.slice(1).join(".");
};

const buildOrigin = (hostname: string) => {
  if (typeof window === "undefined") return "";
  const { protocol, port } = window.location;
  const portSuffix = port ? `:${port}` : "";
  return `${protocol}//${hostname}${portSuffix}`;
};

const joinUrl = (origin: string, path?: string) => {
  if (!origin) return path ?? "";
  if (!path) return origin;
  if (path.startsWith("?") || path.startsWith("#")) {
    return `${origin}${path}`;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
};

export const getAppContext = (): AppContext => {
  const envContext = import.meta.env.VITE_APP_CONTEXT as string | undefined;
  if (envContext === "curso" || envContext === "mensagens" || envContext === "site") {
    return envContext;
  }
  if (typeof window === "undefined") return "site";
  const hostname = window.location.hostname;
  if (hostname.startsWith(`${COURSE_SUBDOMAIN}.`)) return "curso";
  if (hostname.startsWith(`${MENSAGENS_SUBDOMAIN}.`)) return "mensagens";
  return "site";
};

export const getSiteOrigin = () => {
  const envUrl = normalizeUrl(import.meta.env.VITE_SITE_URL as string | undefined);
  if (envUrl) return envUrl;
  if (typeof window === "undefined") return "";
  const baseHost = stripSubdomain(window.location.hostname);
  return buildOrigin(baseHost);
};

const getAppOrigin = (subdomain: string, envKey: string) => {
  const env = import.meta.env as Record<string, string | undefined>;
  const envUrl = normalizeUrl(env[envKey]);
  if (envUrl) return envUrl;
  if (typeof window === "undefined") return "";
  const baseHost = stripSubdomain(window.location.hostname);
  if (isIpAddress(baseHost)) {
    return buildOrigin(baseHost);
  }
  return buildOrigin(`${subdomain}.${baseHost}`);
};

export const getCursoAppOrigin = () =>
  getAppOrigin(COURSE_SUBDOMAIN, "VITE_CURSO_APP_URL");

export const getMensagensAppOrigin = () =>
  getAppOrigin(MENSAGENS_SUBDOMAIN, "VITE_MENSAGENS_APP_URL");

export const getSiteUrl = (path?: string) => joinUrl(getSiteOrigin(), path);

export const getCursoAppUrl = (path?: string) =>
  joinUrl(getCursoAppOrigin(), path);

export const getMensagensAppUrl = (path?: string) =>
  joinUrl(getMensagensAppOrigin(), path);
