export type CursoTopic = {
  code: string;
  title: string;
};

export type CursoChapter = {
  number: string;
  title: string;
  topics: CursoTopic[];
};

export const cursoChapters: CursoChapter[] = [
  {
    number: "1",
    title: "A importância do trabalho de sonorização de Igrejas",
    topics: [
    ],
  },
  {
    number: "2",
    title: "Organização do louvor nas Igrejas",
    topics: [
    ],
  },
  {
    number: "3",
    title: "Os 7 elos da corrente de sonorização ao vivo (PA)",
    topics: [
      {
        code: "3.1",
        title: "Captação",
      },
      {
        code: "3.2",
        title: "Processamento",
      },
      {
        code: "3.3",
        title: "Projeção",
      },
      {
        code: "3.4",
        title: "Interligação",
      },
      {
        code: "3.5",
        title: "Acústica",
      },
      {
        code: "3.6",
        title: "Operação",
      },
      {
        code: "3.7",
        title: "O sétimo elo da corrente: a parte espiritual",
      },
    ],
  },
  {
    number: "4",
    title: "O primeiro elo: Interligação - Cabos",
    topics: [
      {
        code: "4.1",
        title: "Cabos utilizados em sonorização – parte geral",
      },
      {
        code: "4.2",
        title: "Cabos utilizados em sonorização – parte específica",
      },
      {
        code: "4.3",
        title: "Cabo Paralelo:",
      },
      {
        code: "4.4",
        title: "Cabos Coaxiais:",
      },
      {
        code: "4.5",
        title: "Cabos Balanceados (ou coaxial duplo ou Blindado Estéreo):",
      },
      {
        code: "4.6",
        title: "Multicabos",
      },
      {
        code: "4.7",
        title: "Casos Reais envolvendo cabos",
      },
    ],
  },
  {
    number: "5",
    title: "Conectores (ou plugues)",
    topics: [
      {
        code: "5.1",
        title: "Conectores XLR ou Canon",
      },
      {
        code: "5.2",
        title: "Conectores P10 (ou ¼”) :",
      },
      {
        code: "5.3",
        title: "Conector Combo",
      },
      {
        code: "5.4",
        title: "Conectores RCA",
      },
      {
        code: "5.5",
        title: "Conectores Speakon",
      },
      {
        code: "5.6",
        title: "Conectores Banana",
      },
      {
        code: "5.7",
        title: "Conector P2",
      },
      {
        code: "5.8",
        title: "Adaptadores",
      },
      {
        code: "5.9",
        title: "Casos Reais envolvendo cabos e conectores",
      },
      {
        code: "5.10",
        title: "Soldagem de cabos e conectores",
      },
      {
        code: "5.11",
        title: "Teste de cabos",
      },
    ],
  },
  {
    number: "6",
    title: "Captação – os Microfones",
    topics: [
      {
        code: "6.1",
        title: "Vazamento de captação",
      },
      {
        code: "6.2",
        title: "Microfonia (Realimentação ou Feedback)",
      },
      {
        code: "6.3",
        title: "Efeito de Proximidade",
      },
      {
        code: "6.4",
        title: "Sibilância e efeito PB",
      },
      {
        code: "6.5",
        title: "Tipos de microfone quanto à cápsula",
      },
      {
        code: "6.6",
        title: "Microfones de Lapela",
      },
      {
        code: "6.7",
        title: "Microfones Goosenecks",
      },
      {
        code: "6.8",
        title: "Microfones de mão",
      },
      {
        code: "6.9",
        title: "Microfones Headsets",
      },
      {
        code: "6.10",
        title: "Microfones Earsets",
      },
      {
        code: "6.11",
        title: "Microfones para coral",
      },
      {
        code: "6.12",
        title: "Microfones Overs",
      },
      {
        code: "6.13",
        title: "Microfones de estúdio",
      },
      {
        code: "6.14",
        title: "Microfones específicos",
      },
      {
        code: "6.15",
        title: "Microfones sem fio",
      },
      {
        code: "6.16",
        title: "Teste de sonoridade de microfones",
      },
      {
        code: "6.17",
        title: "Casos reais envolvendo microfones",
      },
    ],
  },
  {
    number: "7",
    title: "Processamento de sinal",
    topics: [
      {
        code: "7.1",
        title: "Caixas Amplificadas (ou Amplificadores Multi-Uso)",
      },
      {
        code: "7.2",
        title: "Cabeçotes",
      },
      {
        code: "7.3",
        title: "Cubos",
      },
    ],
  },
  {
    number: "8",
    title: "A mesa de som (ou Console ou Mixer)",
    topics: [
      {
        code: "8.1",
        title: "Visão Geral",
      },
      {
        code: "8.2",
        title: "Mesa Ciclotron série MXS",
      },
      {
        code: "8.3",
        title: "Entradas de microfone e de linha (MIC IN e LINE IN)",
      },
      {
        code: "8.4",
        title: "Seção de equalização de Agudo, Médio e Grave",
      },
      {
        code: "8.5",
        title: "Como equalizar",
      },
      {
        code: "8.6",
        title: "Potenciômetro de Efeito (EFF) do canal",
      },
      {
        code: "8.7",
        title: "Potenciômetro de ajuste de Panorama (PAN)",
      },
      {
        code: "8.8",
        title: "Fader de volume de canal",
      },
      {
        code: "8.9",
        title: "Seção Master",
      },
      {
        code: "8.10",
        title: "Faders de Master Left e Master Right (Master ou Main ou MIX)",
      },
      {
        code: "8.11",
        title: "Luzes indicadoras Peak Level Master (PEAK ou CLIP ou OL)",
      },
      {
        code: "8.12",
        title: "Saída Rec Out (plugue RCA)",
      },
      {
        code: "8.13",
        title: "Entrada CD/MD/Tape In (plug RCA) e Volume CD/MD/Tape In",
      },
      {
        code: "8.14",
        title: "Conectores Efeito Send e Return (plugues P10)",
      },
      {
        code: "8.15",
        title: "Conectores Master L OUT e Master R OUT (plugues P10)",
      },
      {
        code: "8.16",
        title: "Phone (ou Headphone) - plugue P10 - e botão Phone Volume",
      },
      {
        code: "8.17",
        title: "Mesa Ciclotron série AMBW",
      },
      {
        code: "8.18",
        title: "Entrada MIC IN com plugue XLR",
      },
      {
        code: "8.19",
        title: "Entrada/Saída INSERT (plugue P10)",
      },
      {
        code: "8.20",
        title: "Controle de Ganho (GAIN ou TRIM)",
      },
      {
        code: "8.21",
        title: "Regulagem de ganho",
      },
      {
        code: "8.22",
        title: "Controle de Auxiliar 1 (MON – monitor, Aux Pré)",
      },
      {
        code: "8.23",
        title: "Chave MUTE (ou MIX ou ON)",
      },
      {
        code: "8.24",
        title: "Chave PFL (ou SOLO)",
      },
      {
        code: "8.25",
        title: "Controles de equalização de graves e agudos por Master",
      },
      {
        code: "8.26",
        title: "Volume de Retorno do Auxiliar 2 Eff por Master",
      },
      {
        code: "8.27",
        title: "Volume Master do Auxiliar 1 Monitor",
      },
      {
        code: "8.28",
        title: "Volume de Retorno do Auxiliar 2 Eff para Monitor",
      },
      {
        code: "8.29",
        title: "Luzes indicativas de sinal por Master (VU Meter)",
      },
      {
        code: "8.30",
        title: "Controle de Volume de Rec OUT",
      },
      {
        code: "8.31",
        title: "Phone (plugue P10), Phone Volume e chave L/R – Aux 1/PFL",
      },
      {
        code: "8.32",
        title: "Saídas Balanced Main Outs (saídas dos masters), com plugues XLR",
      },
      {
        code: "8.33",
        title: "Saída Auxiliar 1 Monitor Out, com plugue P10",
      },
      {
        code: "8.34",
        title: "Entrada Stereo Auxiliar 2 Effect Return, com P10 por canal",
      },
      {
        code: "8.35",
        title: "A série CSM e CMC",
      },
      {
        code: "8.36",
        title: "Saída Direct Out (plugue P10)",
      },
      {
        code: "8.37",
        title: "Chave de acionamento do Phantom Power",
      },
      {
        code: "8.38",
        title: "Chave de corte de graves (LOW CUT) a 100Hz",
      },
      {
        code: "8.39",
        title: "Equalização e Varredura de freqüência de médios",
      },
      {
        code: "8.40",
        title: "VU Indicativo por canal, com 3 leds, incluindo led de sinal.",
      },
      {
        code: "8.41",
        title: "Chave Mute",
      },
      {
        code: "8.42",
        title: "Fader de volume do canal",
      },
      {
        code: "8.43",
        title: "Seção Master",
      },
      {
        code: "8.44",
        title: "Utilizando mesas com Subgrupos (ou Submasters)",
      },
      {
        code: "8.45",
        title: "Mesas de grande porte (ou Consoles)",
      },
      {
        code: "8.46",
        title: "Mesas com recursos integrados",
      },
      {
        code: "8.47",
        title: "Mesas Digitais (ou Consoles Digitais)",
      },
      {
        code: "8.48",
        title: "Casos reais envolvendo mesas de som",
      },
    ],
  },
  {
    number: "9",
    title: "Teoria geral de áudio e sonorização",
    topics: [
      {
        code: "9.1",
        title: "O que é som",
      },
      {
        code: "9.2",
        title: "Características da Onda Senoidal",
      },
      {
        code: "9.3",
        title: "Frequência ou Tom",
      },
      {
        code: "9.4",
        title: "Amplitude (ou Intensidade ou Volume)",
      },
      {
        code: "9.5",
        title: "Comprimento de Onda:",
      },
      {
        code: "9.6",
        title: "Fase de onda",
      },
      {
        code: "9.7",
        title: "Vibração",
      },
      {
        code: "9.8",
        title: "Fundamentais, Harmônicos, Oitavas e Timbre",
      },
      {
        code: "9.9",
        title: "Tessitura Musical",
      },
      {
        code: "9.10",
        title: "Envelope do Som",
      },
      {
        code: "9.11",
        title: "Decibel – decibéis (dB).",
      },
      {
        code: "9.12",
        title: "O decibel como fator de multiplicação",
      },
      {
        code: "9.13",
        title: "Frequências graves, médias e agudas",
      },
    ],
  },
  {
    number: "10",
    title: "Equalizadores Gráficos",
    topics: [
    ],
  },
  {
    number: "11",
    title: "Compressores / Expansores / Limitadores / Gates",
    topics: [
    ],
  },
  {
    number: "12",
    title: "Amplificadores de potência",
    topics: [
      {
        code: "12.1",
        title: "Componentes dos amplificadores",
      },
      {
        code: "12.2",
        title: "Consumo elétrico e potência do amplificador",
      },
      {
        code: "12.3",
        title: "Consumo elétrico e instalações elétricas",
      },
      {
        code: "12.4",
        title: "Parâmetros e circuitos de proteção dos amplificadores",
      },
      {
        code: "12.5",
        title: "Circuitos de Proteção",
      },
      {
        code: "12.6",
        title: "Painel Frontal de um Amplificador",
      },
      {
        code: "12.7",
        title: "Atenuadores de Volume",
      },
      {
        code: "12.8",
        title: "Painel Traseiro de um Amplificador",
      },
      {
        code: "12.9",
        title: "Entradas de sinal",
      },
      {
        code: "12.10",
        title: "Conexões para as caixas acústicas",
      },
      {
        code: "12.11",
        title: "Comprando amplificadores",
      },
      {
        code: "12.12",
        title: "Casos reais envolvendo amplificadores",
      },
    ],
  },
  {
    number: "13",
    title: "Conexões e interligações entre equipamentos",
    topics: [
      {
        code: "13.1",
        title: "Mono x Estéreo",
      },
    ],
  },
  {
    number: "14",
    title: "Projeção de Som",
    topics: [
      {
        code: "14.1",
        title: "Alto-Falantes",
      },
      {
        code: "14.2",
        title: "Caixas acústicas",
      },
      {
        code: "14.3",
        title: "Impedância de caixas acústicas",
      },
      {
        code: "14.4",
        title: "Associação de caixas acústicas",
      },
      {
        code: "14.5",
        title: "Posicionamento das caixas acústicas",
      },
      {
        code: "14.6",
        title: "Crossovers Passivos e Ativos.",
      },
      {
        code: "14.7",
        title: "Queima de alto-falantes",
      },
      {
        code: "14.8",
        title: "Relação Potência RMS x Sensibilidade da Caixa Acústica",
      },
      {
        code: "14.9",
        title: "Caixas Ativas",
      },
      {
        code: "14.10",
        title: "Comprando caixas de som",
      },
    ],
  },
  {
    number: "15",
    title: "Acústica",
    topics: [
      {
        code: "15.1",
        title: "Reverberação",
      },
      {
        code: "15.2",
        title: "Materiais absorventes e não absorventes",
      },
      {
        code: "15.3",
        title: "Arquitetura absorvente e não absorvente",
      },
      {
        code: "15.4",
        title: "Acústica de igrejas",
      },
    ],
  },
  {
    number: "16",
    title: "Operação de Som",
    topics: [
      {
        code: "16.1",
        title: "Responsabilidade",
      },
      {
        code: "16.2",
        title: "Dedicação",
      },
      {
        code: "16.3",
        title: "Compromisso ou Comprometimento",
      },
      {
        code: "16.4",
        title: "Pontualidade",
      },
      {
        code: "16.5",
        title: "Zelo e Organização",
      },
      {
        code: "16.6",
        title: "Planejamento",
      },
      {
        code: "16.7",
        title: "Estudo",
      },
      {
        code: "16.8",
        title: "Atenção",
      },
    ],
  },
  {
    number: "17",
    title: "Anexo II – Bibliografia e Direitos Autorais",
    topics: [
    ],
  },
];
