import { SITE_CONFIG, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const homeUrl = SITE_URL.toString();
  const entityUrl = new URL('/entity.json', SITE_URL).toString();
  const fullContentUrl = new URL('/llms-full.txt', SITE_URL).toString();
  const sitemapUrl = new URL('/sitemap.xml', SITE_URL).toString();

  const content = `# ${SITE_CONFIG.name}

> Site oficial de ${SITE_CONFIG.professional.name}, ${SITE_CONFIG.professional.title} em Mococa, São Paulo. O atendimento reúne fisioterapia cardiorrespiratória, reabilitação funcional, cuidado pós-hospitalar e atendimento domiciliar, com foco no retorno seguro à rotina.

## Conteúdo principal

- [Site oficial](${homeUrl}): apresentação profissional, áreas de atuação, abordagem clínica e formas de agendamento.
- [Perfil estruturado](${entityUrl}): dados públicos do profissional e dos serviços em JSON-LD.
- [Conteúdo completo para agentes](${fullContentUrl}): resumo textual ampliado do site.
- [Sitemap](${sitemapUrl}): URLs públicas destinadas à indexação.

## Serviços principais

- Fisioterapia cardiorrespiratória.
- Fisioterapia respiratória.
- Reabilitação funcional.
- Reabilitação pós-hospitalar.
- Recuperação após ventilação mecânica e períodos de imobilidade.
- Reabilitação após AVC, conforme avaliação fisioterapêutica.
- Atendimento fisioterapêutico domiciliar.
- Acompanhamento de pessoas com DPOC, asma e outras condições respiratórias.

## Localização e contato

- Localidade principal: Mococa, SP, Brasil.
- Agendamento: [${SITE_CONFIG.agenda.text}](${SITE_CONFIG.agenda.href}).
- E-mail: [${SITE_CONFIG.contact.email}](mailto:${SITE_CONFIG.contact.email}).
- Telefone: [${SITE_CONFIG.contact.phoneHref}](tel:${SITE_CONFIG.contact.phoneHref}).

## Identidade e posicionamento

A comunicação do site parte da ideia: “Da alta hospitalar à retomada da rotina, seu cuidado continua.” O cuidado é apresentado como respiratório e funcional, individualizado e orientado pelas necessidades que o paciente apresenta em cada etapa da recuperação.
`;

  return new Response(content, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
