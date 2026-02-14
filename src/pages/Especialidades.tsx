import { type CSSProperties, useState } from "react";
import { Link } from "react-router-dom";
import {
  desbravadoresEmblema,
  especialidades,
} from "../data/especialidades";
import { especialidadesRespostas } from "../data/especialidadesRespostas";
import { getCursoAppUrl } from "../utils/appUrls";

const getThemeStyle = (primary: string, secondary: string) =>
  ({
    "--especialidade-primary": primary,
    "--especialidade-secondary": secondary,
  }) as CSSProperties;

const formatSubtitle = (subtitle: string) =>
  subtitle === "Avancado" ? "Avançado" : subtitle;

const formatSubitemAnswer = (detail: string) => {
  const separatorIndex = detail.indexOf(":");
  if (separatorIndex === -1) return detail;
  return detail.slice(separatorIndex + 1).trim();
};

export default function Especialidades() {
  const [showRespostas, setShowRespostas] = useState(false);
  const respostasPorEspecialidade = new Map(
    especialidadesRespostas.map((item) => [item.id, item])
  );
  const cursoAppUrl = getCursoAppUrl();

  return (
    <div className="page especialidades">
      <section className="hero hero-compact">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Desbravadores</p>
            <h1>Especialidades oficiais de Sonoplastia.</h1>
            <p className="lead">
              Requisitos oficiais organizados para estudo em equipe e aplicação
              prática no culto.
            </p>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Como usar</p>
            <h3>Roteiro de estudo</h3>
            <p className="text-muted">
              Checklist detalhado com respostas ocultas e links para cada
              capítulo do Som de Fé.
            </p>
          </div>
        </div>
      </section>

      <section className="section especialidade-navigation">
        <div className="container">
          <div className="especialidade-tabs">
            <div className="especialidade-tablist">
              {especialidades.map((especialidade) => (
                <a
                  key={especialidade.id}
                  href={`#${especialidade.id}`}
                  className="especialidade-tab"
                >
                  {formatSubtitle(especialidade.subtitle)}
                </a>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowRespostas((prev) => !prev)}
            >
              {showRespostas ? "Ocultar respostas" : "Mostrar respostas"}
            </button>
          </div>
        </div>
      </section>

      {especialidades.map((especialidade) => {
        const subtitleLabel = formatSubtitle(especialidade.subtitle);
        const respostas = respostasPorEspecialidade.get(especialidade.id);
        const respostaMap = new Map(
          respostas?.items.map((item) => [item.id, item]) ?? []
        );
        const requisitosOrdenados = [...especialidade.requirements].sort(
          (a, b) => Number(a.id) - Number(b.id)
        );

        return (
          <section
            key={especialidade.id}
            id={especialidade.id}
            className="section especialidade-section"
            style={getThemeStyle(
              especialidade.theme.primary,
              especialidade.theme.secondary
            )}
          >
            <div className="container">
              <div className="especialidade-header">
                <div className="especialidade-title">
                  <h2>{especialidade.title}</h2>
                </div>
                <div className="especialidade-header-grid">
                  <div className="especialidade-logo">
                    <img
                      src={desbravadoresEmblema}
                      alt="Emblema dos Desbravadores"
                    />
                  </div>
                  <div className="especialidade-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Área</th>
                          <th>Código</th>
                          <th>Nível</th>
                          <th>Ano</th>
                          <th>Origem</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{especialidade.area}</td>
                          <td>{especialidade.code}</td>
                          <td>{especialidade.level}</td>
                          <td>{especialidade.year}</td>
                          <td>{especialidade.origin}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="especialidade-badge">
                    <img
                      src={especialidade.badge}
                      alt={`Insígnia ${especialidade.code}`}
                    />
                  </div>
                </div>
              </div>

              <ol className="especialidade-list">
                {requisitosOrdenados.map((req) => {
                  const resposta = respostaMap.get(req.id);
                  const subitemsOrdenados = req.subitems ?? null;
                  const hasSubitems = Boolean(subitemsOrdenados?.length);

                  return (
                    <li
                      key={req.id}
                      value={Number(req.id)}
                      className="especialidade-item"
                    >
                      <p>
                        {req.text}
                        {req.references?.length ? (
                          <span className="especialidade-links">
                            <span className="especialidade-links-label">
                              {" "}Ver no curso:
                            </span>
                            {req.references.map((ref, index) => (
                              <span key={`${req.id}-${ref.chapter}`}>
                                {index > 0 ? " • " : " "}
                                <a
                                  href={getCursoAppUrl(`?capitulo=${ref.chapter}`)}
                                >
                                  {ref.label}
                                </a>
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </p>
                      {showRespostas && resposta?.answer && hasSubitems ? (
                        <p className="especialidade-resposta-intro">
                          {resposta.answer}
                        </p>
                      ) : null}
                      {subitemsOrdenados ? (
                        <ol className="especialidade-sublist" type="a">
                          {subitemsOrdenados.map((item, index) => {
                            const detail = resposta?.details?.[index];
                            return (
                            <li key={item.text}>
                              <span>{item.text}</span>
                              {item.references?.length ? (
                                <span className="especialidade-links">
                                  <span className="especialidade-links-label">
                                    {" "}Ver no curso:
                                  </span>
                                  {item.references.map((ref, index) => (
                                    <span key={`${item.text}-${ref.chapter}`}>
                                      {index > 0 ? " • " : " "}
                                      <a
                                        href={getCursoAppUrl(
                                          `?capitulo=${ref.chapter}`
                                        )}
                                      >
                                        {ref.label}
                                      </a>
                                    </span>
                                  ))}
                                </span>
                              ) : null}
                              {showRespostas && detail ? (
                                <span className="especialidade-subanswer">
                                  {formatSubitemAnswer(detail)}
                                </span>
                              ) : null}
                            </li>
                          );
                          })}
                        </ol>
                      ) : null}
                      {req.note ? (
                        <p className="especialidade-note">{req.note}</p>
                      ) : null}
                      {showRespostas && resposta && !hasSubitems ? (
                        <div className="especialidade-resposta">
                          <div className="especialidade-resposta-body">
                            <p>{resposta.answer}</p>
                            {resposta.details ? (
                              <ul>
                                {resposta.details.map((detail) => (
                                  <li key={detail}>{detail}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        );
      })}

      <section className="section section-alt">
        <div className="container callout-grid">
          <div>
            <p className="eyebrow">Som de Fé</p>
            <h2>Som de Fé como base de estudo.</h2>
            <p className="text-muted">
              A estrutura do material apoia líderes e instrutores. As
              especialidades seguem o mesmo roteiro.
            </p>
          </div>
          <div className="callout-actions">
            <a className="btn btn-secondary" href={cursoAppUrl}>
              Abrir Som de Fé
            </a>
            <Link className="btn btn-ghost" to="/curso">
              Ver apresentação
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
