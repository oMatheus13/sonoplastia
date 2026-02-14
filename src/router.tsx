import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Biblioteca from "./pages/Biblioteca";
import Curso from "./pages/Curso";
import Ferramentas from "./pages/Ferramentas";
import Home from "./pages/Home";
import Mensagens from "./pages/Mensagens";
import NotFound from "./pages/NotFound";
import {
  getAppContext,
  getCursoAppUrl,
  getMensagensAppUrl,
} from "./utils/appUrls";

const CursoApp = lazy(() => import("./pages/CursoApp"));
const Especialidades = lazy(() => import("./pages/Especialidades"));
const MensagensGuia = lazy(() => import("./pages/MensagensGuia"));

type RedirectProps = {
  to: string;
};

function ExternalRedirect({ to }: RedirectProps) {
  useEffect(() => {
    if (!to || typeof window === "undefined") return;
    window.location.assign(to);
  }, [to]);

  return (
    <div className="page">
      <section className="section">
        <div className="container">Redirecionando...</div>
      </section>
    </div>
  );
}

export function AppRoutes() {
  const appContext = getAppContext();
  const cursoAppUrl = getCursoAppUrl();
  const mensagensAppUrl = getMensagensAppUrl();
  const mensagensGuiaUrl = getMensagensAppUrl("/guia");

  const fallback = (
    <div className="page">
      <section className="section">
        <div className="container">Carregando...</div>
      </section>
    </div>
  );

  if (appContext === "curso") {
    return (
      <Suspense fallback={fallback}>
        <Routes>
          <Route element={<AppLayout context="curso" />}>
            <Route index element={<CursoApp />} />
            <Route path="*" element={<CursoApp />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  if (appContext === "mensagens") {
    return (
      <Suspense fallback={fallback}>
        <Routes>
          <Route element={<AppLayout context="mensagens" />}>
            <Route path="guia" element={<MensagensGuia />} />
            <Route index element={<Mensagens />} />
            <Route path="*" element={<Mensagens />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="curso" element={<Curso />} />
          <Route
            path="curso/som-de-fe"
            element={<ExternalRedirect to={cursoAppUrl} />}
          />
          <Route path="ferramentas" element={<Ferramentas />} />
          <Route
            path="mensagens"
            element={<ExternalRedirect to={mensagensAppUrl} />}
          />
          <Route
            path="mensagens/guia"
            element={<ExternalRedirect to={mensagensGuiaUrl} />}
          />
          <Route path="biblioteca" element={<Biblioteca />} />
          <Route path="especialidades" element={<Especialidades />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
