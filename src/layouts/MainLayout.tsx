import { NavLink, Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/curso", label: "Curso" },
  { to: "/ferramentas", label: "Ferramentas" },
  { to: "/mensagens", label: "Mensagens" },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/especialidades", label: "Especialidades" },
];

export default function MainLayout() {
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
          <nav className="site-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " is-active" : ""}`
                }
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <NavLink className="btn btn-ghost" to="/biblioteca">
              Ver templates
            </NavLink>
            <NavLink className="btn btn-primary" to="/curso/som-de-fe">
              Entrar no curso
            </NavLink>
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
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
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
    </div>
  );
}
