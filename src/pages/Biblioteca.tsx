import SectionHeading from "../components/SectionHeading";

const recursos = [
  {
    title: "Templates de checklist",
    description: "Modelos prontos para passagem de som e preparo semanal.",
    tag: "Template",
  },
  {
    title: "Mapa de palco editável",
    description: "Organize posicionamento, microfones e DIs.",
    tag: "Layout",
  },
  {
    title: "Guia de microfones",
    description: "Sugestões de escolha e posicionamento por instrumento.",
    tag: "Guia",
  },
  {
    title: "Fluxo de mix para streaming",
    description: "Checklist de envio de sinal e controle de dinâmica.",
    tag: "Streaming",
  },
  {
    title: "Roteiro de passagem",
    description: "Sequência sugerida para soundcheck eficiente.",
    tag: "Processo",
  },
  {
    title: "Glossário técnico",
    description: "Termos essenciais para alinhar comunicação da equipe.",
    tag: "Base",
  },
];

const colecoes = [
  {
    title: "Fundamentos",
    items: [
      "Níveis de sinal e ganho",
      "Fase, polaridade e alinhamento",
      "Acústica básica",
    ],
  },
  {
    title: "Mix ao vivo",
    items: [
      "Balanceamento musical",
      "Voz principal e inteligibilidade",
      "Uso de dinâmica",
    ],
  },
  {
    title: "Organização",
    items: ["Padrões de equipe", "Documentação", "Treinamento"],
  },
];

export default function Biblioteca() {
  return (
    <div className="page biblioteca">
      <section className="hero hero-compact">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Biblioteca técnica</p>
            <h1>Recursos para organizar equipe e operação.</h1>
            <p className="lead">
              Templates e guias editáveis para padronizar o som ao vivo e
              acelerar o treinamento da equipe.
            </p>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Sugestão</p>
            <h3>Monte seu kit mínimo</h3>
            <p className="text-muted">
              Checklist semanal, mapa de palco e roteiro de passagem são o trio
              mínimo para evitar improvisos.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Coleções"
            title="Conteúdo organizado por trilhas de estudo."
          />
          <div className="grid grid-3">
            {colecoes.map((colecao) => (
              <article key={colecao.title} className="card">
                <h3>{colecao.title}</h3>
                <ul className="list">
                  {colecao.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="Downloads"
            title="Templates e guias prontos para baixar."
          />
          <div className="grid grid-3">
            {recursos.map((recurso) => (
              <article key={recurso.title} className="card card-outline">
                <span className="pill">{recurso.tag}</span>
                <h3>{recurso.title}</h3>
                <p className="text-muted">{recurso.description}</p>
                <button className="btn btn-ghost" type="button">
                  Baixar em breve
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
