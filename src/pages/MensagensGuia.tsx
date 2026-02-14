import { Link } from "react-router-dom";

export default function MensagensGuia() {
  return (
    <div className="page mensagens-guia">
      <section className="section">
        <div className="container">
          <p className="eyebrow">MesaLink</p>
          <h1>Guia rapido de uso</h1>
          <p className="lead">
            MesaLink funciona na rede local para enviar links e arquivos direto
            para a mesa, sem login.
          </p>
          <ul className="checklist">
            <li>Conecte celular e PC na mesma rede Wi-Fi.</li>
            <li>Abra o painel MesaLink no computador.</li>
            <li>Digite o endereco do painel no navegador do celular.</li>
            <li>Envie links, imagens, audio ou video.</li>
          </ul>
          <div className="section-actions">
            <Link className="btn btn-primary" to="/">
              Voltar para o MesaLink
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
