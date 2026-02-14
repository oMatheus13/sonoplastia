import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import desbravadoresEmblema from "../assets/images/emblema-d1.svg";
import badgeBase from "../assets/images/imagem@am045.png";
import badgeAvancada from "../assets/images/imagem@am046.png";

const pillars = [
  {
    title: "Som de Fé",
    description:
      "Curso completo com leitura guiada e aplicação prática no culto.",
  },
  {
    title: "Ferramentas práticas",
    description:
      "Calculadoras, checklists e fluxos para decisões rápidas na mesa.",
  },
  {
    title: "Biblioteca técnica",
    description:
      "Templates e guias para padronizar equipe, palco e documentação.",
  },
];

const workflow = [
  {
    title: "Preparação da semana",
    description: "Alinhe escala, palco, patch e cronograma do culto.",
  },
  {
    title: "Passagem de som",
    description: "Ganhos, fase, monitores e ajustes de dinâmica e EQ.",
  },
  {
    title: "Durante o culto",
    description: "Mix musical e falas com foco em inteligibilidade.",
  },
  {
    title: "Pós-culto",
    description: "Feedback rápido e registro do que funcionou.",
  },
];

const destaques = [
  {
    title: "Calculadora de delay",
    description: "Tempo e amostras para alinhar PA e delays.",
  },
  {
    title: "Checklist de passagem",
    description: "Sequência objetiva para não esquecer nenhum passo.",
  },
  {
    title: "Conversor dB",
    description: "Traduza ganho em amplitude e potência.",
  },
];

export default function Home() {
  return (
    <div className="page home">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Central de sonoplastia</p>
            <h1>Som ao vivo claro, organizado e confiável.</h1>
            <p className="lead">
              Som de Fé reúne curso completo, ferramentas e biblioteca para
              apoiar operadores de som em igrejas com foco na prática semanal.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/ferramentas">
                Explorar ferramentas
              </Link>
              <Link className="btn btn-secondary" to="/curso/som-de-fe">
                Entrar no Som de Fé
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <p className="stat">10</p>
                <p className="text-muted">Módulos do curso</p>
              </div>
              <div>
                <p className="stat">17</p>
                <p className="text-muted">Capítulos completos</p>
              </div>
              <div>
                <p className="stat">6</p>
                <p className="text-muted">Recursos na biblioteca</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Roteiro rápido</p>
            <h3>Plano da semana</h3>
            <ul className="checklist">
              <li>Combine escala e cronograma do culto.</li>
              <li>Chegue cedo para testar linhas e monitores.</li>
              <li>Guarde ajustes que funcionaram.</li>
              <li>Registre o que precisa melhorar.</li>
            </ul>
            <div className="card-actions">
              <Link className="btn btn-ghost" to="/biblioteca">
                Baixar templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="O que você encontra aqui"
            title="Três frentes para treinar, operar e organizar."
          />
          <div className="grid grid-3">
            {pillars.map((item, index) => (
              <article
                key={item.title}
                className="card reveal"
                style={{ "--delay": `${index * 120}ms` } as CSSProperties }
              >
                <h3>{item.title}</h3>
                <p className="text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt desbravadores-section">
        <div className="container desbravadores-grid">
          <div className="desbravadores-content">
            <SectionHeading
              eyebrow="Desbravadores"
              title="Especialidades oficiais de Sonoplastia."
              subtitle="Checklist base e avançado com referências diretas ao Som de Fé."
            />
            <ul className="checklist">
              <li>Requisitos organizados por nível.</li>
              <li>Links para cada capítulo do curso.</li>
              <li>Respostas ocultas para estudo em equipe.</li>
            </ul>
            <div className="section-actions">
              <Link className="btn btn-primary" to="/especialidades">
                Ver especialidades
              </Link>
              <Link className="btn btn-ghost" to="/curso/som-de-fe">
                Abrir Som de Fé
              </Link>
            </div>
          </div>
          <div className="desbravadores-card">
            <div className="desbravadores-brand">
              <img
                src={desbravadoresEmblema}
                alt="Emblema dos Desbravadores"
              />
              <div>
                <p className="eyebrow">Especialidades oficiais</p>
                <h3>Sonoplastia</h3>
                <p className="text-muted">
                  Base e avançado com checklist e respostas.
                </p>
              </div>
            </div>
            <div className="desbravadores-badges">
              <div className="desbravadores-badge">
                <img src={badgeBase} alt="Insígnia Sonoplastia Base" />
                <span>Base</span>
              </div>
              <div className="desbravadores-badge">
                <img src={badgeAvancada} alt="Insígnia Sonoplastia Avançada" />
                <span>Avançado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Fluxo de trabalho"
            title="Ritmo semanal para manter o som consistente."
          />
          <div className="grid grid-4">
            {workflow.map((item, index) => (
              <article
                key={item.title}
                className="card card-outline reveal"
                style={{ "--delay": `${index * 120}ms` } as CSSProperties }
              >
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
            eyebrow="Ferramentas em destaque"
            title="Calcule, confira e organize em poucos cliques."
          />
          <div className="grid grid-3">
            {destaques.map((item, index) => (
              <article
                key={item.title}
                className="card reveal"
                style={{ "--delay": `${index * 120}ms` } as CSSProperties }
              >
                <h3>{item.title}</h3>
                <p className="text-muted">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="section-actions">
            <Link className="btn btn-primary" to="/ferramentas">
              Ver todas as ferramentas
            </Link>
          </div>
        </div>
      </section>

      <section className="section callout">
        <div className="container callout-grid">
          <div>
            <p className="eyebrow">Som de Fé</p>
            <h2>Treine sua equipe com conteúdo técnico estruturado.</h2>
            <p className="text-muted">
              A trilha cobre fundamentos, microfones, mixagem, acústica e
              operação. Conteúdo pensado para equipes voluntárias e técnicas.
            </p>
          </div>
          <div className="callout-actions">
            <Link className="btn btn-secondary" to="/curso">
              Ver apresentação
            </Link>
            <Link className="btn btn-ghost" to="/biblioteca">
              Acessar biblioteca
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
