import type { CursoIconName } from "../types/curso";

export type CursoFigura = {
  id: string;
  title: string;
  description: string;
  icon: CursoIconName;
};

export const cursoFigurasByChapter: Record<string, CursoFigura[]> = {
  "3": [
    {
      id: "corrente-elos",
      title: "Corrente dos 7 elos",
      description:
        "Diagrama em cadeia com captação, processamento, projeção e a parte espiritual.",
      icon: "fundamentos",
    },
  ],
  "4": [
    {
      id: "tipos-cabos",
      title: "Tipos de cabos",
      description:
        "Comparativo entre paralelo, coaxial e balanceado para uso em igreja.",
      icon: "cabos",
    },
  ],
  "5": [
    {
      id: "conectores-base",
      title: "Conectores essenciais",
      description: "Modelo padrão de XLR, P10, RCA e Speakon.",
      icon: "cabos",
    },
  ],
  "6": [
    {
      id: "diagrama-polar",
      title: "Diagrama polar",
      description: "Padrões de captação para microfones cardioide e supercardioide.",
      icon: "microfone",
    },
    {
      id: "posicao-retorno",
      title: "Posicionamento de retorno",
      description: "Mapa rápido de caixas de retorno em relação ao microfone.",
      icon: "caixa",
    },
  ],
  "9": [
    {
      id: "ondas-frequencias",
      title: "Ondas e frequências",
      description: "Comparativo visual de frequências baixas e altas no tempo.",
      icon: "onda",
    },
  ],
  "10": [
    {
      id: "eq-grafico",
      title: "Curvas de equalização",
      description: "Exemplo de ajuste gráfico para limpeza de voz e instrumentos.",
      icon: "eq",
    },
  ],
  "11": [
    {
      id: "dinamica-sinal",
      title: "Dinâmica do sinal",
      description: "Ataque, release e limiares em compressores e gates.",
      icon: "eq",
    },
  ],
  "12": [
    {
      id: "amplificador-partes",
      title: "Componentes do amplificador",
      description: "Diagrama simplificado com entradas, controles e saídas.",
      icon: "amplificador",
    },
  ],
  "14": [
    {
      id: "posicionamento-caixas",
      title: "Posicionamento de caixas",
      description: "Cobertura do ambiente com ângulos e alturas recomendadas.",
      icon: "caixa",
    },
  ],
  "15": [
    {
      id: "tratamento-acustico",
      title: "Tratamento acústico",
      description: "Materiais absorvedores e difusores para igrejas.",
      icon: "onda",
    },
  ],
};
