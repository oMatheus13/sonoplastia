import type { EspecialidadeReferencia } from "./especialidades";

export type EspecialidadeRespostaItem = {
  id: string;
  answer: string;
  details?: string[];
  references?: EspecialidadeReferencia[];
};

export type EspecialidadeResposta = {
  id: string;
  title: string;
  subtitle: string;
  items: EspecialidadeRespostaItem[];
};

export const especialidadesRespostas: EspecialidadeResposta[] = [
  {
    id: "sonoplastia-base",
    title: "Especialidade de Sonoplastia",
    subtitle: "Base",
    items: [
      {
        id: "1",
        answer:
          "Sonoplastia é o conjunto de técnicas para captar, tratar e distribuir o som, garantindo que a mensagem chegue com clareza.",
        references: [{ chapter: "1", label: "Capítulo 1" }],
      },
      {
        id: "2",
        answer:
          "Qualidades: ouvido atento, organização, disciplina, comunicação clara, humildade, calma sob pressão e responsabilidade espiritual.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "3",
        answer: "Equipamentos e uso básico:",
        details: [
          "Mesa de som: mistura e roteia sinais.",
          "Microfone: converte som em sinal elétrico.",
          "Fones: monitoramento detalhado.",
          "Multicabo: organiza vários canais.",
          "Equalizador: ajusta frequências.",
          "Retorno: monitora som para músicos.",
          "Compressor: controla picos.",
          "Caixa: projeta o áudio no ambiente.",
        ],
        references: [
          { chapter: "4", label: "Cabos e multicabos" },
          { chapter: "6", label: "Microfones" },
          { chapter: "7", label: "Mesas e retornos" },
          { chapter: "10", label: "Equalização" },
          { chapter: "11", label: "Compressores" },
          { chapter: "14", label: "Caixas acústicas" },
        ],
      },
      {
        id: "4",
        answer:
          "A mesa recebe entradas, ajusta ganho e EQ, envia para retornos e efeitos, e entrega o mix final ao PA. Mapeie entradas, saídas, auxiliares e subgrupos da mesa local.",
        references: [{ chapter: "7", label: "Capítulo 7" }],
      },
      {
        id: "5",
        answer:
          "Cabos comuns: paralelo (potência), coaxial (sinal não balanceado), balanceado (microfones e longas distâncias) e multicabo (organizar canais).",
        references: [{ chapter: "4", label: "Capítulo 4" }],
      },
      {
        id: "6",
        answer:
          "Microfones mais usados: dinâmicos (robustos), condensadores (sensibilidade maior), lapelas/headsets (apresentação).",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
      {
        id: "7",
        answer:
          "Microfone sem fio falha por bateria fraca, interferência, frequências conflitantes, antenas mal posicionadas e obstáculos físicos.",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
      {
        id: "8",
        answer:
          "Equalização é o ajuste de frequências (graves, médios, agudos) para clareza e controle de timbre.",
        references: [{ chapter: "10", label: "Capítulo 10" }],
      },
      {
        id: "9",
        answer:
          "Compressor reduz a diferença entre sons fracos e fortes, controla picos e estabiliza o volume.",
        references: [{ chapter: "11", label: "Capítulo 11" }],
      },
      {
        id: "10",
        answer:
          "Reverberação é o excesso de reflexões no ambiente. Evita-se com volume correto, posicionamento de caixas e tratamento acústico simples.",
        references: [{ chapter: "15", label: "Capítulo 15" }],
      },
      {
        id: "11",
        answer:
          "O cronograma do culto evita surpresas, prepara transições e garante que microfones e volumes estejam prontos em cada etapa.",
        references: [{ chapter: "2", label: "Capítulo 2" }],
      },
      {
        id: "12",
        answer:
          "Exemplo: operar no culto principal e em um encontro de jovens, sob supervisão do sonoplasta.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "13",
        answer:
          "Auxiliar por 3 meses inclui montagem, passagem de som, organização de cabos e suporte durante os cultos.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
    ],
  },
  {
    id: "sonoplastia-avancada",
    title: "Especialidade de Sonoplastia",
    subtitle: "Avançado",
    items: [
      {
        id: "1",
        answer: "Requisito atendido ao concluir a especialidade base (AM045).",
      },
      {
        id: "2",
        answer:
          "Apresentar certificado de curso recente (mínimo 4 horas) ministrado por profissional habilitado.",
      },
      {
        id: "3",
        answer:
          "Comprovar atuação regular por pelo menos 6 meses em cultos e eventos da igreja.",
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "4",
        answer:
          "Compatibilidade de potência garante que amplificadores e caixas trabalhem na mesma impedância e faixa de potência, evitando queima e distorção.",
        references: [{ chapter: "12", label: "Capítulo 12" }],
      },
      {
        id: "5",
        answer: "Cuidados básicos:",
        details: [
          "1. Enrolar cabos sem nós.",
          "2. Guardar equipamentos em locais secos.",
          "3. Limpar conectores regularmente.",
          "4. Evitar clip constante.",
          "5. Usar filtros de linha e aterramento.",
          "6. Manter ventilação de racks.",
          "7. Apertar suportes e parafusos.",
          "8. Testar microfones e baterias.",
          "9. Etiquetar cabos e canais.",
          "10. Fazer manutenção preventiva.",
        ],
        references: [{ chapter: "16", label: "Capítulo 16" }],
      },
      {
        id: "6",
        answer:
          "Microfonia é o loop entre microfone e caixa. Evite com ganho correto, posicionamento adequado, EQ cirúrgica e controle de retorno.",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
      {
        id: "7",
        answer:
          "Músicas apropriadas respeitam o momento espiritual e mantêm a congregação focada. Sugestão de hinos:",
        details: [
          "Programa do Clube de Desbravadores: Castelo Forte; Firme nas Promessas; Vencendo Vem Jesus; A Deus Demos Glória; Santo, Santo, Santo.",
          "Batismo: Alvo Mais Que a Neve; Amazing Grace; Ao Pé da Cruz; Meu Jesus, Eu Te Amo; Porque Ele Vive.",
          "Doxologia: A Deus Demos Glória; Santo, Santo, Santo; Ó Vinde Adoremos; Tu És Fiel, Senhor; Ao Deus de Abraão Louvai.",
          "Funeral: Sou Feliz com Jesus; Mais Perto Quero Estar; Rocha Eterna; Porque Ele Vive; Amazing Grace.",
          "Ação de Graças: Conta as Bênçãos; A Deus Demos Glória; Tu És Fiel, Senhor; Quão Grande És Tu; Ó Vinde Adoremos.",
          "Para cada hino, citar motivo, título original e autor.",
        ],
        references: [{ chapter: "2", label: "Capítulo 2" }],
      },
      {
        id: "8",
        answer:
          "Vantagens do sistema integrado: salvar cenas, recall rápido, gravação multitrack, uso de plugins, controle remoto e padronização de mix.",
        references: [{ chapter: "8", label: "Capítulo 8" }],
      },
      {
        id: "9",
        answer:
          "Demonstrar montagem completa (fontes > mesa > processamento > amplificadores > caixas) e desligar na ordem inversa.",
        references: [{ chapter: "13", label: "Capítulo 13" }],
      },
      {
        id: "10",
        answer:
          "Demonstrar canais de entrada e saída, volume geral e individual, ganho, EQ (grave/médio/agudo) e efeitos.",
        references: [{ chapter: "7", label: "Capítulo 7" }],
      },
      {
        id: "11",
        answer:
          "Usar dinâmicos e condensadores conforme o contexto, guardar em cápsulas, evitar quedas e testar antes do uso.",
        references: [{ chapter: "6", label: "Capítulo 6" }],
      },
    ],
  },
];
