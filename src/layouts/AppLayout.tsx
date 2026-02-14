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
