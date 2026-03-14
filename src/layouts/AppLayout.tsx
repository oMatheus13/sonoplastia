import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { getSiteUrl } from "../utils/appUrls";

type AppLayoutProps = {
  context: "curso" | "mensagens";
};

const appMeta = {
  curso: {
    eyebrow: "Som de Fé",
    title: "Leitura guiada do curso",
  },
  mensagens: {
    eyebrow: "MesaLink",
    title: "Envio rápido para a mesa",
  },
};

export default function AppLayout({ context }: AppLayoutProps) {
  const meta = appMeta[context];
  const siteUrl = getSiteUrl();
  const showHeader = context !== "mensagens";

  useEffect(() => {
    if (context !== "mensagens" || typeof window === "undefined") return;
    const root = document.documentElement;
    const updateViewportHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      root.style.setProperty("--mesalink-vh", `${height}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.visualViewport?.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.visualViewport?.removeEventListener("resize", updateViewportHeight);
      root.style.removeProperty("--mesalink-vh");
    };
  }, [context]);

  useEffect(() => {
    if (context !== "mensagens" || typeof window === "undefined") return;
    const head = document.head;
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "/manifest.webmanifest";
    manifest.dataset.mesalink = "true";

    const themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.content = "#d9822b";
    themeColor.dataset.mesalink = "true";

    const appleCapable = document.createElement("meta");
    appleCapable.name = "apple-mobile-web-app-capable";
    appleCapable.content = "yes";
    appleCapable.dataset.mesalink = "true";

    const appleTitle = document.createElement("meta");
    appleTitle.name = "apple-mobile-web-app-title";
    appleTitle.content = "MesaLink";
    appleTitle.dataset.mesalink = "true";

    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = "/icons/mesalink-180.png";
    appleIcon.dataset.mesalink = "true";

    const nodes = [manifest, themeColor, appleCapable, appleTitle, appleIcon];
    nodes.forEach((node) => head.appendChild(node));

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker
        .register("/mesalink-sw.js", { scope: "/" })
        .catch(() => {});
    }

    return () => {
      nodes.forEach((node) => node.remove());
    };
  }, [context]);

  return (
    <div className={`app-layout app-layout-${context}`}>
      <ScrollToTop />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      {showHeader ? (
        <header className="app-header">
          <div className="container app-header-inner">
            <a className="brand" href={siteUrl}>
              <span className="brand-mark">O</span>
              <span className="brand-text">
                Central de Sonoplastia
                <span>Som ao vivo para igrejas</span>
              </span>
            </a>
            <div className="app-header-meta">
              <p className="eyebrow">{meta.eyebrow}</p>
              <p className="app-title">{meta.title}</p>
            </div>
            <a className="btn btn-ghost" href={siteUrl}>
              Voltar ao site
            </a>
          </div>
        </header>
      ) : null}
      <main id="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
