import { Link } from "react-router-dom";
import CursoIcon from "../components/CursoIcon";
import SectionHeading from "../components/SectionHeading";
import { cursoChapters } from "../data/curso";
import { cursoModulos } from "../data/cursoModulos";
import { cursoAulasByChapter } from "../utils/cursoUtils";

const totalTopics = cursoChapters.reduce(
  (total, chapter) => total + chapter.topics.length,
  0
);

const modulos = cursoModulos.map((modulo) => ({
  ...modulo,
  aulas: modulo.chapters.reduce(
    (total, chapterNumber) =>
      total + (cursoAulasByChapter[chapterNumber]?.length ?? 0),
    0
  ),
}));

const destaques = [
  {
    title: "Leitura guiada",
    description:
      "Capítulos transformados em aulas para estudo contínuo.",
  },
  {
    title: "Fiel ao material base",
    description:
      "Estrutura e linguagem respeitam o índice original.",
  },
  {
    title: "Aplicação no culto",
    description:
      "Da captação à operação, com foco na rotina semanal.",
  },
];

const estudo = [
  {
    title: "Leia com propósito",
    items: [
      "Acompanhe o índice por capítulos e tópicos.",
      "Salve os trechos que você aplica na prática.",
      "Revise os fundamentos antes do culto.",
    ],
  },
  {
    title: "Treine com a equipe",
    items: [
      "Transforme cada tema em um ensaio rápido.",
      "Defina responsáveis por cada etapa do som.",
      "Registre o que funcionou no último culto.",
    ],
  },
  {
    title: "Aplique no culto",
    items: [
      "Execute a passagem seguindo a sequência do curso.",
      "Use as ferramentas para cálculos rápidos.",
      "Feche o culto com feedback e próximos passos.",
    ],
  },
];

export default function Curso() {
  return (
    <div className="page curso">
      <section className="hero hero-compact">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Som de Fé</p>
            <h1>Som de Fé: curso de sonorização ao vivo para igrejas.</h1>
            <p className="lead">
              Conteúdo fiel ao material original, reorganizado em módulos,
              capítulos e aulas para estudo semanal.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/curso/som-de-fe">
                Entrar no app do curso
              </Link>
              <a className="btn btn-secondary" href="#indice">
                Ver índice geral
              </a>
            </div>
            <div className="hero-stats course-stats">
              <div>
                <p className="stat">{cursoChapters.length}</p>
                <p className="text-muted">Capítulos</p>
              </div>
              <div>
                <p className="stat">{totalTopics}</p>
                <p className="text-muted">Tópicos detalhados</p>
              </div>
              <div>
                <p className="stat">176</p>
                <p className="text-muted">Páginas de base</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Propósito</p>
            <blockquote>
              <p>
                "De sorte que a fé é pelo ouvir, e o ouvir pela Palavra de
                Deus."
              </p>
              <cite>Rom 10:17</cite>
            </blockquote>
            <p className="text-muted">
              Som de Fé nasce para garantir que cada mensagem seja ouvida com
              clareza e respeito.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="O que torna este curso único"
            title="Organizado para estudo contínuo e prática real."
          />
          <div className="grid grid-3">
            {destaques.map((item) => (
              <article key={item.title} className="card">
                <h3>{item.title}</h3>
                <p className="text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Módulos"
            title="Estrutura completa do Som de Fé."
            subtitle="Cada módulo agrupa capítulos e aulas para estudo semanal."
          />
          <div className="grid grid-3 module-grid">
            {modulos.map((modulo) => (
              <article key={modulo.id} className="card module-card">
                <div className="module-header">
                  <CursoIcon name={modulo.icon} />
                  <div>
                    <h3>{modulo.title}</h3>
                    <p className="text-muted">{modulo.description}</p>
                  </div>
                </div>
                <div className="module-meta">
                  <span>{modulo.chapters.length} capítulos</span>
                  <span>{modulo.aulas} aulas</span>
                </div>
                <ul className="list">
                  {modulo.focus.map((item) => (
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
            eyebrow="Como estudar"
            title="Trilha prática para equipes de som ao vivo."
          />
          <div className="grid grid-3">
            {estudo.map((item) => (
              <article key={item.title} className="card card-outline">
                <h3>{item.title}</h3>
                <ul className="list">
                  {item.items.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="indice">
        <div className="container">
          <SectionHeading
            eyebrow="Índice geral"
            title="Capítulos e tópicos do curso base."
            subtitle="Navegue por todo o conteúdo e veja o que você vai estudar."
          />
          <div className="chapter-list">
            {cursoChapters.map((chapter, index) => (
              <details
                key={chapter.number}
                className="chapter-item"
                open={index < 2}
              >
                <summary>
                  <span className="chapter-number">{chapter.number}</span>
                  <span className="chapter-title">{chapter.title}</span>
                  <span className="chapter-meta">
                    {chapter.topics.length
                      ? `${chapter.topics.length} tópicos`
                      : "Sem subtópicos"}
                  </span>
                </summary>
                {chapter.topics.length ? (
                  <ul className="chapter-topics">
                    {chapter.topics.map((topic) => (
                      <li key={topic.code}>
                        <span className="topic-code">{topic.code}</span>
                        <span>{topic.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small">
                    Capítulo sem subtítulos no índice original.
                  </p>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section callout">
        <div className="container callout-grid">
          <div>
            <p className="eyebrow">App do curso</p>
            <h2>Leitura guiada com progresso e conteúdo completo.</h2>
            <p className="text-muted">
              Acompanhe capítulos, marque o que já concluiu e use o curso como
              roteiro semanal de estudo.
            </p>
          </div>
          <div className="callout-actions">
            <Link className="btn btn-secondary" to="/curso/som-de-fe">
              Abrir app do curso
            </Link>
            <Link className="btn btn-ghost" to="/biblioteca">
              Ver biblioteca técnica
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
