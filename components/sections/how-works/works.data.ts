import type { LucideIcon } from 'lucide-react';

import { Activity, ClipboardPlus, House, ShieldCheck } from 'lucide-react';

export interface PillarProps {
  description: string;
  icon: LucideIcon;
  id: number;
  title: string;
}

export const PILLARS: PillarProps[] = [
  {
    description:
      'Avaliação do histórico clínico, da respiração, da mobilidade e da tolerância ao esforço para orientar o cuidado.',
    icon: ClipboardPlus,
    id: 1,
    title: 'Avaliação completa',
  },
  {
    description:
      'Exercícios respiratórios e funcionais são combinados para recuperar força, equilíbrio, condicionamento e autonomia.',
    icon: Activity,
    id: 2,
    title: 'Respiração e movimento',
  },
  {
    description:
      'A intensidade do atendimento é ajustada conforme os sintomas, a resposta ao esforço e a evolução do paciente.',
    icon: ShieldCheck,
    id: 3,
    title: 'Progressão segura',
  },
  {
    description:
      'Após a alta, a reabilitação continua em casa, respeitando a rotina, as necessidades e os objetivos do paciente.',
    icon: House,
    id: 4,
    title: 'Continuidade em casa',
  },
];
