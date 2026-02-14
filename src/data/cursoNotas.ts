export type CursoNota = {
  title: string;
  items: string[];
};

export const cursoNotas: Record<string, CursoNota[]> = {
  fundamentos: [
    {
      title: "Comentário do instrutor",
      items: [
        "Abra cada encontro lembrando o propósito: tornar a mensagem inteligível.",
        "Use exemplos da sua igreja para conectar a equipe ao conteúdo.",
      ],
    },
    {
      title: "Aplicação no culto",
      items: [
        "Revise os 7 elos antes de cada passagem de som.",
        "Defina um responsável por cada elo da cadeia de áudio.",
      ],
    },
  ],
  interligacao: [
    {
      title: "Padrão da equipe",
      items: [
        "Padronize etiquetas e cores para cabos e conectores.",
        "Tenha um kit de teste rápido sempre ao lado da mesa.",
      ],
    },
  ],
  captacao: [
    {
      title: "Dica prática",
      items: [
        "Teste o microfone no mesmo local onde o músico vai tocar.",
        "Priorize inteligibilidade de voz antes de volume.",
      ],
    },
  ],
  processamento: [
    {
      title: "Cuidado com ganhos",
      items: [
        "Ganho correto resolve metade dos problemas da mix.",
        "Regule o PFL antes de equalizar e comprimir.",
      ],
    },
  ],
  teoria: [
    {
      title: "Treino de ouvido",
      items: [
        "Separe 10 minutos por semana para treinar frequências.",
        "Use referências musicais conhecidas pela equipe.",
      ],
    },
  ],
  dinamica: [
    {
      title: "Aplicação",
      items: [
        "Use EQ para limpar e compressor para controlar, não o contrário.",
        "Registre ajustes que funcionaram para repetir na próxima semana.",
      ],
    },
  ],
  amplificacao: [
    {
      title: "Segurança",
      items: [
        "Verifique disjuntores e aterramento antes de ligar o sistema.",
        "Evite sobrecarga ajustando volumes e impedâncias.",
      ],
    },
  ],
  projecao: [
    {
      title: "Cobertura",
      items: [
        "Evite pontos mortos ajustando ângulos e alturas das caixas.",
        "Use medição simples de SPL para comparar áreas.",
      ],
    },
  ],
  operacao: [
    {
      title: "Rotina do operador",
      items: [
        "Chegue cedo, teste tudo e documente o culto.",
        "Equipe alinhada evita improvisos durante a mensagem.",
      ],
    },
  ],
};
