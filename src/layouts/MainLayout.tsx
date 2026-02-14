import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { getMensagensAppUrl } from "../utils/appUrls";

type ThemeMode = "light" | "dark";
const THEME_KEY = "sonoplastia-theme";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark =
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  return prefersDark ? "dark" : "light";
};

type NavItem = {
  label: string;
  icon: string;
  to?: string;
  href?: string;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: "/", label: "Início", icon: "home", end: true },
  { to: "/ferramentas", label: "Ferramentas", icon: "tune" },
  { to: "/biblioteca", label: "Biblioteca", icon: "library_books" },
  { to: "/especialidades", label: "Especialidades", icon: "workspace_premium" },
  { href: getMensagensAppUrl(), label: "MesaLink", icon: "send" },
  { to: "/curso", label: "Curso", icon: "menu_book" },
];

const renderNavItem = (item: NavItem) => {
  const content = (
    <>
      <span className="nav-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="nav-label">{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <a
        key={item.label}
        className="nav-link"
        href={item.href}
        aria-label={item.label}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink
      key={item.to}
      to={item.to ?? "/"}
      className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
      end={item.end}
      aria-label={item.label}
    >
      {content}
    </NavLink>
  );
};

export default function MainLayout() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="main-layout">
      <ScrollToTop />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <NavLink className="brand" to="/">
            <span className="brand-mark">O</span>
            <span className="brand-text">
              Central de Sonoplastia
              <span>Som ao vivo para igrejas</span>
            </span>
          </NavLink>
          <div className="header-actions">
            <button
              type="button"
              className="btn btn-ghost theme-toggle"
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              aria-label={
                theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
              }
            >
              <span className="theme-icon" aria-hidden="true">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
              <span className="sr-only">
                {theme === "dark" ? "Tema claro" : "Tema escuro"}
              </span>
            </button>
          </div>
        </div>
      </header>
      <main id="conteudo">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-title">Central de Sonoplastia</p>
            <p className="text-muted">
              Conteúdo técnico e ferramentas para equipes de som ao vivo em
              igrejas, sem vinculação institucional.
            </p>
          </div>
          <div>
            <p className="footer-title">Mapa rápido</p>
            <div className="footer-links">
              {navItems.map((item) =>
                item.href ? (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <NavLink key={item.to} to={item.to ?? "/"}>
                    {item.label}
                  </NavLink>
                )
              )}
            </div>
          </div>
          <div>
            <p className="footer-title">Contato</p>
            <p className="text-muted">
              Quer sugerir ferramentas ou aulas? Envie suas ideias.
            </p>
            <a className="btn btn-secondary" href="mailto:contato@sonoplastia.com">
              contato@sonoplastia.com
            </a>
          </div>
        </div>
      </footer>
      <nav className="floating-nav" aria-label="Navegação principal">
        <div className="nav-shell">
          <div className="nav-links">{navItems.map(renderNavItem)}</div>
        </div>
      </nav>
    </div>
  );
}
