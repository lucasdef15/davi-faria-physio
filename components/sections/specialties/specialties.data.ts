interface PracticeArea {
  description: string;
  featured?: boolean;
  id: number;
  title: string;
}

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    description:
      'Continuidade do cuidado após a alta, com foco em força, mobilidade e segurança para retomar atividades.',
    featured: true,
    id: 1,
    title: 'Recuperação após internação',
  },
  {
    description:
      'Acompanhamento da recuperação respiratória e funcional após períodos de suporte ventilatório.',
    id: 2,
    title: 'Após ventilação mecânica',
  },
  {
    description:
      'Cuidado voltado à mobilidade, ao equilíbrio e à independência nas atividades do dia a dia.',
    id: 3,
    title: 'Reabilitação após AVC',
  },
  {
    description:
      'Atendimento para limitações respiratórias, falta de ar e redução da tolerância aos esforços da rotina.',
    id: 4,
    title: 'DPOC, asma e outras condições',
  },
  {
    description:
      'Plano realizado em casa e adaptado à condição clínica, ao ambiente e às necessidades do paciente.',
    id: 5,
    title: 'Reabilitação no domicílio',
  },
  {
    description:
      'Progressão de força, condicionamento e tolerância ao esforço após imobilidade ou perda funcional.',
    id: 6,
    title: 'Recuperação funcional',
  },
];
