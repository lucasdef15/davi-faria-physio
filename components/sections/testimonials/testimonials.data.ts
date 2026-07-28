export interface Testimonial {
  context: string;
  initials: string;
  quote: string;
  result: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    context: 'Reabilitação pulmonar',
    initials: 'M. A.',
    quote:
      'Voltei a caminhar com mais segurança e entendi como respeitar meu ritmo sem deixar de evoluir. O acompanhamento próximo fez toda a diferença.',
    result: 'Mais confiança na rotina',
  },
  {
    context: 'Recuperação pós-cirúrgica',
    initials: 'R. S.',
    quote:
      'Cada etapa foi explicada com calma. Perceber minha respiração e minha disposição melhorando tornou o processo de recuperação muito mais leve.',
    result: 'Evolução acompanhada',
  },
  {
    context: 'Condicionamento respiratório',
    initials: 'C. L.',
    quote:
      'O plano respeitou minhas limitações e foi avançando no momento certo. Hoje consigo realizar atividades que antes me deixavam insegura.',
    result: 'Mais autonomia',
  },
];
