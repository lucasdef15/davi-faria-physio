import { SITE_CONFIG, SITE_URL } from './site.ts';

export const SEO_TITLE = 'Davi Faria | Fisioterapia Cardiorrespiratória e Funcional em Mococa';

export const SEO_DESCRIPTION =
  'Fisioterapia cardiorrespiratória e reabilitação funcional em Mococa, com atendimento domiciliar no pós-hospitalar e foco no retorno seguro à rotina.';

export const SEO_KEYWORDS = [
  'Davi Faria fisioterapeuta',
  'Davi Faria fisioterapia Mococa',
  'fisioterapia em Mococa',
  'fisioterapeuta em Mococa',
  'fisioterapia cardiorrespiratória',
  'fisioterapia respiratória',
  'reabilitação funcional',
  'reabilitação pós-hospitalar',
  'atendimento fisioterapêutico domiciliar',
  'retorno seguro à rotina',
];

export function getStructuredData() {
  const siteUrl = SITE_URL.toString();
  const imageUrl = new URL('/opengraph-image', SITE_URL).toString();
  const practiceId = `${siteUrl}#fisioterapia-davi-faria`;
  const professionalId = `${siteUrl}#davi-faria`;
  const websiteId = `${siteUrl}#website`;
  const webpageId = `${siteUrl}#webpage`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': practiceId,
        '@type': 'Physiotherapy',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BR',
          addressLocality: 'Mococa',
          addressRegion: 'SP',
        },
        areaServed: {
          '@type': 'City',
          containedInPlace: { '@type': 'State', name: 'São Paulo' },
          name: 'Mococa',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          areaServed: 'BR',
          availableLanguage: 'Portuguese',
          contactType: 'Agendamento e atendimento fisioterapêutico',
          email: SITE_CONFIG.contact.email,
          telephone: SITE_CONFIG.contact.phoneHref,
        },
        description: SEO_DESCRIPTION,
        email: SITE_CONFIG.contact.email,
        employee: { '@id': professionalId },
        founder: { '@id': professionalId },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          itemListElement: [
            ['Avaliação e acompanhamento de alterações respiratórias com cuidado individualizado.', 'Fisioterapia cardiorrespiratória'],
            ['Recuperação de mobilidade, força, autonomia e segurança para as atividades da rotina.', 'Reabilitação funcional'],
            ['Acompanhamento após internação, ventilação mecânica ou períodos prolongados de imobilidade.', 'Reabilitação pós-hospitalar'],
            ['Atendimento fisioterapêutico no ambiente domiciliar, conforme avaliação e necessidade clínica.', 'Fisioterapia domiciliar'],
          ].map(([description, name]) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', description, name },
          })),
          name: 'Atendimentos de fisioterapia',
        },
        image: imageUrl,
        keywords: SEO_KEYWORDS.join(', '),
        name: SITE_CONFIG.name,
        potentialAction: {
          '@type': 'ReserveAction',
          name: SITE_CONFIG.agenda.text,
          target: {
            '@type': 'EntryPoint',
            actionPlatform: [
              'https://schema.org/DesktopWebPlatform',
              'https://schema.org/MobileWebPlatform',
            ],
            urlTemplate: SITE_CONFIG.agenda.href,
          },
        },
        telephone: SITE_CONFIG.contact.phoneHref,
        url: siteUrl,
      },
      {
        '@id': professionalId,
        '@type': 'Person',
        description: SITE_CONFIG.professional.manifesto,
        email: SITE_CONFIG.contact.email,
        image: imageUrl,
        jobTitle: SITE_CONFIG.professional.title,
        knowsAbout: [
          'Fisioterapia cardiorrespiratória',
          'Fisioterapia respiratória',
          'Reabilitação funcional',
          'Reabilitação pós-hospitalar',
          'Atendimento fisioterapêutico domiciliar',
          'Recuperação pós-ventilação mecânica',
          'Reabilitação após AVC',
          'DPOC e asma',
          'Retorno seguro às atividades da rotina',
        ],
        mainEntityOfPage: { '@id': webpageId },
        name: SITE_CONFIG.professional.name,
        telephone: SITE_CONFIG.contact.phoneHref,
        url: siteUrl,
        workLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'BR',
            addressLocality: 'Mococa',
            addressRegion: 'SP',
          },
          name: SITE_CONFIG.contact.location,
        },
        worksFor: { '@id': practiceId },
      },
      {
        '@id': websiteId,
        '@type': 'WebSite',
        alternateName: SITE_CONFIG.professional.name,
        description: SEO_DESCRIPTION,
        inLanguage: 'pt-BR',
        name: SITE_CONFIG.name,
        publisher: { '@id': practiceId },
        url: siteUrl,
      },
      {
        '@id': webpageId,
        '@type': 'WebPage',
        about: [{ '@id': practiceId }, { '@id': professionalId }],
        description: SEO_DESCRIPTION,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': websiteId },
        keywords: SEO_KEYWORDS.join(', '),
        mainEntity: { '@id': professionalId },
        name: SEO_TITLE,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          height: 630,
          url: imageUrl,
          width: 1200,
        },
        specialty: 'https://schema.org/Physiotherapy',
        url: siteUrl,
      },
    ],
  };
}
