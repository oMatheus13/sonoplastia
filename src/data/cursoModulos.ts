import type { CursoIconName } from "../types/curso";

export type CursoModulo = {
  id: string;
  title: string;
  description: string;
  icon: CursoIconName;
  chapters: string[];
  focus: string[];
};

export const cursoModulos: CursoModulo[] = [
  {
    id: "fundamentos",
    title: "Fundamentos e propósito",
    description:
      "Base espiritual e organizacional do som ao vivo, alinhando equipe e ministério.",
    icon: "fundamentos",
    chapters: ["1", "2", "3"],
    focus: [
      "Importância da sonorização",
      "Organização do louvor",
      "Os 7 elos do sistema",
    ],
  },
  {
    id: "interligacao",
    title: "Interligação e conectores",
    description:
      "Cabos, plugs e boas práticas para manter o sinal limpo e confiável.",
    icon: "cabos",
    chapters: ["4", "5"],
    focus: ["Tipos de cabos", "Conectores essenciais", "Testes e soldagem"],
  },
  {
    id: "captacao",
    title: "Captação e microfones",
    description:
      "Escolha, posicionamento e cuidados com microfones em cultos ao vivo.",
    icon: "microfone",
    chapters: ["6"],
    focus: [
      "Tipos de microfone",
      "Controle de microfonia",
      "Aplicações por instrumento",
    ],
  },
  {
    id: "processamento",
    title: "Processamento e mesas",
    description:
      "Estrutura de mesas, ajustes de ganho e controles fundamentais de mix.",
    icon: "mixer",
    chapters: ["7", "8"],
    focus: [
      "Fluxo de sinal",
      "Equalização de canais",
      "Operação de consoles",
    ],
  },
  {
    id: "teoria",
    title: "Teoria do áudio",
    description:
      "Conceitos essenciais para entender frequências, timbre e energia sonora.",
    icon: "onda",
    chapters: ["9"],
    focus: ["Som e frequência", "Harmônicos", "Decibéis"],
  },
  {
    id: "dinamica",
    title: "Equalização e dinâmica",
    description:
      "Controladores que moldam o som: EQs, compressores, gates e limiters.",
    icon: "eq",
    chapters: ["10", "11"],
    focus: ["Equalizadores gráficos", "Compressores", "Gates e limiters"],
  },
  {
    id: "amplificacao",
    title: "Amplificação e conexões",
    description:
      "Potência, consumo elétrico e ligações entre equipamentos.",
    icon: "amplificador",
    chapters: ["12", "13"],
    focus: ["Amplificadores", "Proteção", "Conexões mono e estéreo"],
  },
  {
    id: "projecao",
    title: "Projeção e acústica",
    description:
      "Caixas, posicionamento e ajustes para cobrir todo o ambiente.",
    icon: "caixa",
    chapters: ["14", "15"],
    focus: ["Caixas acústicas", "Impedância", "Acústica de igrejas"],
  },
  {
    id: "operacao",
    title: "Operação e rotina",
    description:
      "Postura, responsabilidade e boas práticas do operador de som.",
    icon: "headset",
    chapters: ["16"],
    focus: ["Responsabilidade", "Planejamento", "Atenção"],
  },
  {
    id: "bibliografia",
    title: "Anexos e bibliografia",
    description:
      "Materiais complementares para aprofundamento e consulta técnica.",
    icon: "livro",
    chapters: ["17"],
    focus: ["Bibliografia", "Direitos autorais", "Fontes de pesquisa"],
  },
];
