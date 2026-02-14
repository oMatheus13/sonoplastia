import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Biblioteca from "./pages/Biblioteca";
import Curso from "./pages/Curso";
import Ferramentas from "./pages/Ferramentas";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const CursoApp = lazy(() => import("./pages/CursoApp"));
const Especialidades = lazy(() => import("./pages/Especialidades"));

export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="page">
          <section className="section">
            <div className="container">Carregando...</div>
          </section>
        </div>
      }
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="curso" element={<Curso />} />
          <Route path="curso/som-de-fe" element={<CursoApp />} />
          <Route path="ferramentas" element={<Ferramentas />} />
          <Route path="biblioteca" element={<Biblioteca />} />
          <Route path="especialidades" element={<Especialidades />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
