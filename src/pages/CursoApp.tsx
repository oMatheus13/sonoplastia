import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CursoIcon from "../components/CursoIcon";
import { cursoChapters } from "../data/curso";
import { cursoFigurasByChapter } from "../data/cursoFiguras";
import { cursoModulos } from "../data/cursoModulos";
import { cursoNotas } from "../data/cursoNotas";
import {
  cursoAulas,
  cursoAulasByChapter,
  getAulasForChapters,
} from "../utils/cursoUtils";
import { getSiteUrl } from "../utils/appUrls";

const STORAGE_KEY = "som-de-fe-progress-v2";

function getProgress(total: number, done: number) {
  return total ? Math.round((done / total) * 100) : 0;
}

export default function CursoApp() {
  const [searchParams] = useSearchParams();
  const [activeChapter, setActiveChapter] = useState(
    cursoChapters[0]?.number ?? "1"
  );
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(
    () => {
      if (typeof window === "undefined") {
        return {};
      }
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      } catch (error) {
        console.error("Falha ao ler progresso do curso.", error);
        return {};
      }
    }
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
    } catch (error) {
      console.error("Falha ao salvar progresso do curso.", error);
    }
  }, [completedLessons]);

  useEffect(() => {
    const chapterFromQuery = searchParams.get("capitulo");
    if (!chapterFromQuery) return;
    const exists = cursoChapters.some((item) => item.number === chapterFromQuery);
    if (exists) {
      setActiveChapter(chapterFromQuery);
    }
  }, [searchParams]);

  const totalLessons = cursoAulas.length;
  const completedCount = useMemo(
    () => Object.values(completedLessons).filter(Boolean).length,
    [completedLessons]
  );
  const progress = getProgress(totalLessons, completedCount);
  const siteCursoUrl = getSiteUrl("/curso");

  const chapter = cursoChapters.find((item) => item.number === activeChapter);
  const chapterLessons = cursoAulasByChapter[activeChapter] ?? [];
  const chapterFigures = cursoFigurasByChapter[activeChapter] ?? [];

  const activeModule = useMemo(
    () => cursoModulos.find((modulo) => modulo.chapters.includes(activeChapter)),
    [activeChapter]
  );

  const moduleLessons = useMemo(
    () => (activeModule ? getAulasForChapters(activeModule.chapters) : []),
    [activeModule]
  );

  const isChapterDone =
    chapterLessons.length > 0 &&
    chapterLessons.every((lesson) => completedLessons[lesson.id]);

  const handleToggleLesson = (id: string) => {
    setCompletedLessons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleChapter = (markAsDone: boolean) => {
    if (!chapterLessons.length) return;
    setCompletedLessons((prev) => {
      const next = { ...prev };
      chapterLessons.forEach((lesson) => {
        next[lesson.id] = markAsDone;
      });
      return next;
    });
  };

  return (
    <div className="page curso-app">
      <section className="section course-app-shell">
        <div className="container">
          <div className="course-app-header">
            <div>
              <p className="eyebrow">Som de Fé</p>
              <h1>App do curso</h1>
              <p className="text-muted">
                Leitura completa com progresso por aula e capítulo.
              </p>
            </div>
            <div className="course-progress">
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <p className="text-muted">
                {completedCount}/{totalLessons} aulas concluídas ({progress}%)
              </p>
              <a className="btn btn-ghost" href={siteCursoUrl}>
                Voltar para apresentação
              </a>
            </div>
          </div>

          <aside className="course-sidebar">
            <div className="sidebar-header">
              <h2>Mapa do curso</h2>
              <p className="text-muted">Escolha um capítulo para começar.</p>
            </div>
            <div className="sidebar-progress">
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-meta">
                <strong>{progress}%</strong>
                <span className="text-muted">completo</span>
              </div>
            </div>

            <div className="module-nav">
              {cursoModulos.map((modulo) => {
                const moduleLessonsList = getAulasForChapters(modulo.chapters);
                const moduleDone = moduleLessonsList.filter(
                  (lesson) => completedLessons[lesson.id]
                ).length;
                const moduleProgress = getProgress(
                  moduleLessonsList.length,
                  moduleDone
                );

                return (
                  <details
                    key={modulo.id}
                    className="module-item"
                    open={activeModule?.id === modulo.id}
                  >
                    <summary className="module-summary">
                      <CursoIcon name={modulo.icon} size={30} />
                      <div>
                        <p className="module-title">{modulo.title}</p>
                        <p className="text-muted small">
                          {modulo.chapters.length} capítulos
                        </p>
                      </div>
                      <span className="module-progress-badge">
                        {moduleProgress}%
                      </span>
                    </summary>
                    <div className="module-chapters">
                      {modulo.chapters.map((chapterNumber) => {
                        const chapterData = cursoChapters.find(
                          (item) => item.number === chapterNumber
                        );
                        const chapterLessonList =
                          cursoAulasByChapter[chapterNumber] ?? [];
                        const chapterDone = chapterLessonList.filter(
                          (lesson) => completedLessons[lesson.id]
                        ).length;
                        const chapterProgress = getProgress(
                          chapterLessonList.length,
                          chapterDone
                        );

                        return (
                          <button
                            key={chapterNumber}
                            className={`chapter-link${
                              activeChapter === chapterNumber
                                ? " is-active"
                                : ""
                            }${
                              chapterLessonList.length > 0 &&
                              chapterProgress === 100
                                ? " is-done"
                                : ""
                            }`}
                            type="button"
                            onClick={() => setActiveChapter(chapterNumber)}
                          >
                            <span className="chapter-link-number">
                              {chapterNumber}
                            </span>
                            <span className="chapter-link-title">
                              {chapterData?.title}
                            </span>
                            <span className="chapter-link-count">
                              {chapterLessonList.length} aulas
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </aside>

          <div className="course-app-body">
            <article className="course-content">
              <div className="course-content-header">
                <div>
                  <p className="eyebrow">
                    {activeModule ? activeModule.title : "Curso"}
                  </p>
                  <h2>
                    Capítulo {chapter?.number}: {chapter?.title}
                  </h2>
                  {activeModule ? (
                    <p className="text-muted">{activeModule.description}</p>
                  ) : null}
                </div>
                <div className="chapter-actions">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleToggleChapter(true)}
                    disabled={!chapterLessons.length || isChapterDone}
                  >
                    Concluir capítulo
                  </button>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => handleToggleChapter(false)}
                    disabled={!chapterLessons.length}
                  >
                    Limpar capítulo
                  </button>
                </div>
              </div>

              {activeModule && cursoNotas[activeModule.id] ? (
                <div className="module-notes">
                  {cursoNotas[activeModule.id].map((nota) => (
                    <div key={nota.title} className="note-card">
                      <h4>{nota.title}</h4>
                      <ul className="list">
                        {nota.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}

              {chapterFigures.length ? (
                <div className="lesson-figures">
                  <div>
                    <h3>Referências visuais</h3>
                    <p className="text-muted small">
                      Modelos padronizados para representar as ilustrações do capítulo.
                    </p>
                  </div>
                  <div className="figure-grid">
                    {chapterFigures.map((figure) => (
                      <div key={figure.id} className="figure-card">
                        <CursoIcon name={figure.icon} size={36} />
                        <div>
                          <p className="figure-title">{figure.title}</p>
                          <p className="text-muted small">{figure.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="lesson-list">
                {chapterLessons.map((lesson, index) => {
                  const lessonLabel =
                    lesson.kind === "intro"
                      ? "Introdução"
                      : `Aula ${lesson.code ?? index + 1}`;
                  const lessonDone = Boolean(completedLessons[lesson.id]);

                  return (
                    <details
                      key={lesson.id}
                      className="lesson-card"
                      open={index === 0}
                    >
                      <summary className="lesson-summary">
                        <div className="lesson-heading">
                          <span className="lesson-tag">{lessonLabel}</span>
                          <h3>{lesson.title}</h3>
                        </div>
                        <label
                          className="checkbox lesson-check"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={lessonDone}
                            onChange={() => handleToggleLesson(lesson.id)}
                          />
                          <span>{lessonDone ? "Concluída" : "Marcar aula"}</span>
                        </label>
                      </summary>
                      <div className="lesson-content">
                        {lesson.blocks.map((block, blockIndex) => (
                          <p key={`${lesson.id}-${blockIndex}`}>
                            {block.text}
                          </p>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>

              {moduleLessons.length ? (
                <div className="course-footer">
                  <p className="text-muted">
                    Progresso do módulo: {getProgress(
                      moduleLessons.length,
                      moduleLessons.filter((lesson) => completedLessons[lesson.id])
                        .length
                    )}%
                  </p>
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
