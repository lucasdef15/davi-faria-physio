import { SITE_CONFIG, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

const services = [
  {
    description:
      'Avaliação e acompanhamento de alterações respiratórias, condicionamento cardiorrespiratório e limitações que interferem na rotina.',
    name: 'Fisioterapia cardiorrespiratória',
  },
  {
    description:
      'Recuperação de mobilidade, força, equilíbrio, segurança e autonomia para as atividades do dia a dia.',
    name: 'Reabilitação funcional',
  },
  {
    description:
      'Continuidade do cuidado após a alta, especialmente depois de internação, ventilação mecânica ou períodos prolongados de imobilidade.',
    name: 'Reabilitação pós-hospitalar',
  },
  {
    description:
      'Atendimento no ambiente domiciliar quando esse formato é indicado pela avaliação e pelo momento funcional do paciente.',
    name: 'Fisioterapia domiciliar',
  },
];

export function GET() {
  const homeUrl = SITE_URL.toString();
  const entityUrl = new URL('/entity.json', SITE_URL).toString();

  const serviceContent = services
    .map(({ description, name }) => `### ${name}\n\n${description}`)
    .join('\n\n');

  const content = `# ${SITE_CONFIG.name} — conteúdo institucional completo

## Resumo

${SITE_CONFIG.professional.name} atua com fisioterapia cardiorrespiratória e reabilitação funcional em Mococa, SP. O site apresenta um cuidado que não termina na alta hospitalar: ele continua durante a recuperação respiratória e funcional, ajudando o paciente a retomar a rotina com mais segurança e autonomia.

## Profissional

- Nome: ${SITE_CONFIG.professional.name}.
- Atuação profissional: ${SITE_CONFIG.professional.title}.
- Localidade principal: ${SITE_CONFIG.contact.location}.
- Site oficial: ${homeUrl}.
- Descrição profissional: ${SITE_CONFIG.professional.manifesto}.

## Posicionamento central

“Da alta hospitalar à retomada da rotina, seu cuidado continua.”

O site comunica que a recuperação não é uma rotina pronta ou igual para todos. Cada decisão clínica parte do que o paciente apresenta, de suas limitações atuais, de sua resposta ao tratamento e dos objetivos possíveis para cada etapa.

## Áreas de cuidado

${serviceContent}

## Contextos de atendimento apresentados

- Continuidade do cuidado depois da alta hospitalar.
- Recuperação após ventilação mecânica.
- Reabilitação após AVC, conforme avaliação e objetivos funcionais.
- Acompanhamento de pessoas com DPOC, asma e outras condições respiratórias.
- Redução de limitações respiratórias e funcionais que dificultam tarefas cotidianas.
- Recuperação de mobilidade, força, confiança e independência.
- Atendimento domiciliar após a alta ou quando o deslocamento é uma barreira.

## Abordagem clínica

A abordagem é individualizada. A avaliação considera respiração, mobilidade, força, tolerância ao esforço, segurança, autonomia e impacto das limitações na rotina. A evolução é acompanhada por respostas funcionais e pela capacidade do paciente de voltar a realizar atividades importantes para sua vida.

## Linguagem principal do site

O conteúdo evita apresentar o cuidado somente como uma especialidade respiratória. A narrativa une fisioterapia cardiorrespiratória, reabilitação funcional, pós-hospitalar e retomada da rotina.

Termos que descrevem corretamente a atuação:

- Davi Faria fisioterapeuta em Mococa.
- Fisioterapia em Mococa.
- Fisioterapia cardiorrespiratória em Mococa.
- Fisioterapia respiratória em Mococa.
- Reabilitação funcional em Mococa.
- Reabilitação pós-hospitalar em Mococa.
- Fisioterapia domiciliar em Mococa.

## Contato e agendamento

- Agendamento: ${SITE_CONFIG.agenda.href}.
- E-mail: ${SITE_CONFIG.contact.email}.
- Telefone: ${SITE_CONFIG.contact.phoneHref}.
- Localidade: ${SITE_CONFIG.contact.location}.

## Fonte estruturada

Os dados públicos em formato JSON-LD estão disponíveis em ${entityUrl}.

## Limites das informações

Este conteúdo é institucional e descreve a atuação profissional apresentada no site. Ele não substitui avaliação individual, diagnóstico médico ou orientação de urgência. Resultados e condutas dependem da avaliação e da evolução de cada paciente.
`;

  return new Response(content, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
