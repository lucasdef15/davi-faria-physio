import { SITE_CONFIG, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const siteUrl = SITE_URL.toString();
  const imageUrl = new URL('/opengraph-image', SITE_URL).toString();
  const professionalId = `${siteUrl}#davi-faria`;
  const practiceId = `${siteUrl}#fisioterapia-davi-faria`;

  const data = {
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
          name: 'Mococa',
        },
        description:
          'Fisioterapia cardiorrespiratória e reabilitação funcional em Mococa, com atendimento domiciliar no pós-hospitalar e foco no retorno seguro à rotina.',
        email: SITE_CONFIG.contact.email,
        employee: {
          '@id': professionalId,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          itemListElement: [
            'Fisioterapia cardiorrespiratória',
            'Reabilitação funcional',
            'Reabilitação pós-hospitalar',
            'Fisioterapia domiciliar',
          ].map((name) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name,
            },
          })),
          name: 'Atendimentos de fisioterapia',
        },
        image: imageUrl,
        name: SITE_CONFIG.name,
        potentialAction: {
          '@type': 'ReserveAction',
          name: SITE_CONFIG.agenda.text,
          target: SITE_CONFIG.agenda.href,
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
        ],
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
        worksFor: {
          '@id': practiceId,
        },
      },
    ],
  };

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'application/ld+json; charset=utf-8',
    },
  });
}
