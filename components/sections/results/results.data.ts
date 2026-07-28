interface EvolutionArea {
  description: string;
  id: number;
  indicators: readonly string[];
  title: string;
}

export const EVOLUTION_AREAS: EvolutionArea[] = [
  {
    description:
      'Observação do ritmo, das pausas e do desconforto ao falar, caminhar ou realizar tarefas do dia a dia.',
    id: 1,
    indicators: ['Ritmo respiratório', 'Pausas', 'Conforto'],
    title: 'Respiração nas atividades',
  },
  {
    description:
      'Acompanhamento de como o corpo responde ao caminhar, permanecer em pé e sustentar atividades por mais tempo.',
    id: 2,
    indicators: ['Resistência', 'Recuperação', 'Esforço percebido'],
    title: 'Tolerância ao esforço',
  },
  {
    description:
      'Trabalho de força, equilíbrio e controle para levantar, sentar, mudar de posição e se deslocar.',
    id: 3,
    indicators: ['Força', 'Equilíbrio', 'Deslocamento'],
    title: 'Mobilidade com segurança',
  },
  {
    description:
      'Retomada gradual do autocuidado, das tarefas domésticas e das atividades importantes para o paciente.',
    id: 4,
    indicators: ['Autocuidado', 'Rotina', 'Participação'],
    title: 'Independência na rotina',
  },
];

export const EVOLUTION_DIMENSIONS = ['Respiração', 'Esforço', 'Movimento', 'Rotina'] as const;
