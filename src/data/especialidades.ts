import badgeBase from "../assets/images/imagem@am045.png";
import badgeAvancada from "../assets/images/imagem@am046.png";
import desbravadoresLogo from "../assets/images/emblema-d1.svg";

export type EspecialidadeReferencia = {
  chapter: string;
  label: string;
};

export type EspecialidadeSubitem = {
  text: string;
  references?: EspecialidadeReferencia[];
};

export type EspecialidadeRequisito = {
  id: string;
  text: string;
  subitems?: EspecialidadeSubitem[];
  note?: string;
  references?: EspecialidadeReferencia[];
};

export type Especialidade = {
  id: string;
  title: string;
  subtitle: string;
  area: string;
  code: string;
  level: string;
  year: string;
  origin: string;
  badge: string;
  theme: {
    primary: string;
    secondary: string;
  };
  requirements: EspecialidadeRequisito[];
};

export const desbravadoresEmblema = desbravadoresLogo;

export const especialidades: Especialidade[] = [
  {
    id: "sonoplastia-base",
    title: "Especialidade de Sonoplastia",
    subtitle: "Base",
    area: "AM",
    code: "045",
    level: "2",
    year: "2012",
    origin: "Divisão Sul Americana",
    badge: badgeBase,
    theme: {
      primary: "#101F5B",
      secondary: "#25408F",
    },
    requirements: [
      {
        id: "1",
        text: "Defina o que é sonoplastia.",
        references: [{ chapter: "1", label: "Capítulo 1" }],
      },
      {
        id: "2",
        text: "Quais as qualidades de um sonoplasta?",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "3",
        text: "Conhecer e mencionar a utilização dos equipamentos a seguir:",
        subitems: [
          {
            text: "Mesa de som",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Microfone",
            references: [{ chapter: "6", label: "Capítulo 6" }],
          },
          {
            text: "Fones de ouvido",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Multicabo",
            references: [{ chapter: "4", label: "Capítulo 4" }],
          },
          {
            text: "Equalizador",
            references: [{ chapter: "10", label: "Capítulo 10" }],
          },
          {
            text: "Retorno",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Compressor",
            references: [{ chapter: "11", label: "Capítulo 11" }],
          },
          {
            text: "Caixa de som",
            references: [{ chapter: "14", label: "Capítulo 14" }],
          },
        ],
      },
      {
        id: "4",
        text:
          "Qual a função de uma mesa de som? Utilizando a mesa de som de sua igreja, mencionar suas principais entradas e saídas e dizer o que faz cada botão.",
        references: [{ chapter: "7", label: "Capítulo 7" }],
      },
      {
        id: "5",
        text: "Quais os tipos de cabos mais usados na sonoplastia? Defina os usos de cada um.",
        references: [{ chapter: "4", label: "Capítulo 4" }],
      },
      {
        id: "6",
        text: "Quais os tipos de microfones mais utilizados?",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
      {
        id: "7",
        text: "O que pode atrapalhar o bom funcionamento de um microfone sem fio?",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
      {
        id: "8",
        text: "O que é equalização?",
        references: [{ chapter: "10", label: "Capítulo 10" }],
      },
      {
        id: "9",
        text: "Qual a função de um compressor?",
        references: [{ chapter: "11", label: "Capítulo 11" }],
      },
      {
        id: "10",
        text: "Como se dá a reverberação e como evitá-la?",
        references: [{ chapter: "15", label: "Capítulo 15" }],
      },
      {
        id: "11",
        text:
          "Qual a importância de se possuir o cronograma do culto para poder operar o som?",
        references: [{ chapter: "2", label: "Capítulo 2" }],
      },
      {
        id: "12",
        text:
          "Operar a mesa de som em, pelo menos, 2 programas, sob orientação do sonoplasta de sua igreja.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "13",
        text: "Auxiliar a equipe de sonoplastia da sua Igreja por, ao menos, 3 meses.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
    ],
  },
  {
    id: "sonoplastia-avancada",
    title: "Especialidade de Sonoplastia",
    subtitle: "Avançado",
    area: "AM",
    code: "046",
    level: "3",
    year: "2012",
    origin: "Divisão Sul Americana",
    badge: badgeAvancada,
    theme: {
      primary: "#101F5B",
      secondary: "#25408F",
    },
    requirements: [
      {
        id: "1",
        text: "Ter a especialidade de Sonoplastia.",
      },
      {
        id: "2",
        text:
          "Ter um certificado de curso de sonoplastia de, no mínimo, 4 horas, ministrado por um profissional, com data inferior a 2 anos.",
      },
      {
        id: "3",
        text: "Atuar como operador de áudio em sua igreja por, no mínimo, 6 meses.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "4",
        text:
          "O que significa e qual a importância de observar a compatibilidade de potência dos componentes da aparelhagem de som?",
        references: [{ chapter: "12", label: "Capítulo 12" }],
      },
      {
        id: "5",
        text:
          "Listar 10 cuidados que devem ser seguidos para manter a aparelhagem de som em bom estado.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "6",
        text: "Explicar o que causa e como é possível evitar a microfonia.",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
      {
        id: "7",
        text:
          "Explicar a importância de utilizar músicas apropriadas para cada situação. Em seguida fazer uma lista com, no mínimo, 5 hinos congregacionais indicados para as seguintes ocasiões:",
        subitems: [
          {
            text: "Programa do Clube de Desbravadores",
            references: [{ chapter: "2", label: "Capítulo 2" }],
          },
          {
            text: "Batismo",
            references: [{ chapter: "2", label: "Capítulo 2" }],
          },
          {
            text: "Doxologia",
            references: [{ chapter: "2", label: "Capítulo 2" }],
          },
          {
            text: "Funeral",
            references: [{ chapter: "2", label: "Capítulo 2" }],
          },
          {
            text: "Ação de Graças",
            references: [{ chapter: "2", label: "Capítulo 2" }],
          },
        ],
        note:
          "Para cada hino, citar o porquê de tê-lo escolhido, o título original e o nome do autor.",
      },
      {
        id: "8",
        text:
          "Realizar uma pesquisa e listar as vantagens de um sistema integrado a um computador que utiliza algum programa de mixagem digital.",
        references: [{ chapter: "8", label: "Capítulo 8" }],
      },
      {
        id: "9",
        text:
          "Ser capaz de desconectar e conectar toda a aparelhagem de som (mesa, amplificador, DVD player, etc.). Em seguida, ligar e demonstrar o funcionamento do sistema de som.",
        references: [{ chapter: "13", label: "Capítulo 13" }],
      },
      {
        id: "10",
        text:
          "Operar sozinho a mesa de som de sua Igreja, identificando, explicando e demonstrando a função de cada um dos seguintes:",
        subitems: [
          {
            text: "Canais de entrada",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Canais de saída",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Volume (geral e de canais individuais)",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Ganho",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Grave, médio e agudo",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
          {
            text: "Efeito",
            references: [{ chapter: "7", label: "Capítulo 7" }],
          },
        ],
      },
      {
        id: "11",
        text:
          "Explicar como utilizar corretamente diferentes tipos de microfone. Que cuidados devem ser observados quando guardados ou em uso?",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
    ],
  },
];
