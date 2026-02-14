import { useMemo, useState } from "react";
import SectionHeading from "../components/SectionHeading";

const checklistItems = [
  { id: "line-check", label: "Checar linhas e conexões" },
  { id: "gain", label: "Definir ganhos com PFL" },
  { id: "polarity", label: "Verificar fase e polaridade" },
  { id: "monitor", label: "Configurar mixes de monitores" },
  { id: "eq", label: "Ajustar EQ de voz e instrumentos" },
  { id: "fx", label: "Preparar FX e cenas" },
  { id: "record", label: "Checar gravação/streaming" },
];

const sampleRates = [44100, 48000, 96000];

function parseNumber(value: string, fallback = 0) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function Ferramentas() {
  const [distance, setDistance] = useState("12");
  const [temperature, setTemperature] = useState("20");
  const [sampleRate, setSampleRate] = useState("48000");
  const [decibels, setDecibels] = useState("-6");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const speed = useMemo(() => 331 + 0.6 * parseNumber(temperature, 20), [
    temperature,
  ]);
  const delayMs = useMemo(() => {
    const distanceValue = parseNumber(distance, 0);
    if (!distanceValue) return 0;
    return (distanceValue / speed) * 1000;
  }, [distance, speed]);

  const samples = useMemo(() => {
    const rate = parseNumber(sampleRate, 48000);
    return (delayMs / 1000) * rate;
  }, [delayMs, sampleRate]);

  const ratios = useMemo(() => {
    const value = parseNumber(decibels, 0);
    const amplitude = Math.pow(10, value / 20);
    const power = Math.pow(10, value / 10);
    return { amplitude, power };
  }, [decibels]);

  const completed = checklistItems.filter((item) => checked[item.id]).length;

  return (
    <div className="page ferramentas">
      <section className="hero hero-compact">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Ferramentas</p>
            <h1>Ferramentas rápidas para preparar e operar o culto.</h1>
            <p className="lead">
              Calcule delays, ajuste ganho e organize a passagem de som com
              recursos pensados para operadores de som ao vivo.
            </p>
          </div>
          <div className="hero-card">
            <p className="eyebrow">Dica rápida</p>
            <h3>Padrão de operação</h3>
            <p className="text-muted">
              Use sempre a mesma ordem: linha &rarr; ganho &rarr; EQ &rarr; FX.
              A consistência acelera o treinamento.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3 tools-grid">
          <article className="card tool-card">
            <div className="tool-header">
              <h3>Calculadora de delay</h3>
              <p className="text-muted">
                Ajuste atrasos entre PA, front-fill e delays.
              </p>
            </div>
            <div className="form-grid">
              <label className="field">
                Distância (m)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={distance}
                  onChange={(event) => setDistance(event.target.value)}
                />
              </label>
              <label className="field">
                Temperatura (°C)
                <input
                  type="number"
                  min="-5"
                  step="1"
                  value={temperature}
                  onChange={(event) => setTemperature(event.target.value)}
                />
              </label>
              <label className="field">
                Sample rate (Hz)
                <select
                  value={sampleRate}
                  onChange={(event) => setSampleRate(event.target.value)}
                >
                  {sampleRates.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="tool-result">
              <div>
                <p className="result-label">Delay estimado</p>
                <p className="result-value">{delayMs.toFixed(2)} ms</p>
              </div>
              <div>
                <p className="result-label">Samples</p>
                <p className="result-value">{Math.round(samples)} amostras</p>
              </div>
            </div>
          </article>

          <article className="card tool-card">
            <div className="tool-header">
              <h3>Conversor dB</h3>
              <p className="text-muted">
                Entenda o impacto de ganho em amplitude e potência.
              </p>
            </div>
            <label className="field">
              Valor em dB
              <input
                type="number"
                step="0.1"
                value={decibels}
                onChange={(event) => setDecibels(event.target.value)}
              />
            </label>
            <div className="tool-result">
              <div>
                <p className="result-label">Relação de amplitude</p>
                <p className="result-value">{ratios.amplitude.toFixed(2)}x</p>
              </div>
              <div>
                <p className="result-label">Relação de potência</p>
                <p className="result-value">{ratios.power.toFixed(2)}x</p>
              </div>
            </div>
            <p className="text-muted small">
              Ex: +6 dB dobra a amplitude aproximada.
            </p>
          </article>

          <article className="card tool-card">
            <div className="tool-header">
              <h3>Checklist de passagem</h3>
              <p className="text-muted">
                Padronize o processo e reduza esquecimentos.
              </p>
            </div>
            <div className="checklist-grid">
              {checklistItems.map((item) => (
                <label key={item.id} className="checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(checked[item.id])}
                    onChange={(event) =>
                      setChecked((prev) => ({
                        ...prev,
                        [item.id]: event.target.checked,
                      }))
                    }
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="tool-result">
              <div>
                <p className="result-label">Progresso</p>
                <p className="result-value">
                  {completed}/{checklistItems.length}
                </p>
              </div>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => setChecked({})}
              >
                Resetar
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="Próximas ferramentas"
            title="Ideias em construção para apoiar equipes."
          />
          <div className="grid grid-3">
            <article className="card card-outline">
              <h3>Planejador de patch</h3>
              <p className="text-muted">
                Gere um patch list editável e compartilhável.
              </p>
            </article>
            <article className="card card-outline">
              <h3>Guia de ganho por instrumento</h3>
              <p className="text-muted">
                Sugestões de ganho inicial para agilizar soundcheck.
              </p>
            </article>
            <article className="card card-outline">
              <h3>Mapa de palco</h3>
              <p className="text-muted">
                Layout visual para imprimir e alinhar equipe.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
