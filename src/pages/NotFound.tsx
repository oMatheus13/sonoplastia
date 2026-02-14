import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page not-found">
      <section className="section">
        <div className="container">
          <p className="eyebrow">404</p>
          <h1>Página não encontrada</h1>
          <p className="text-muted">
            O conteúdo que você procurou não existe ou foi movido.
          </p>
          <Link className="btn btn-primary" to="/">
            Voltar para o início
          </Link>
        </div>
      </section>
    </div>
  );
}
