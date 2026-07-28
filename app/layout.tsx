import type { Metadata } from 'next';

import { Geist, Montserrat_Alternates, Space_Grotesk } from 'next/font/google';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { SITE_CONFIG, SITE_URL } from '@/lib/site';

import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
});

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  variable: '--font-montserrat-alternates',
  weight: ['700'],
});

const SEO_TITLE = 'Davi Faria | Fisioterapia Cardiorrespiratória e Funcional em Mococa';

const SEO_DESCRIPTION =
  'Fisioterapia cardiorrespiratória e reabilitação funcional em Mococa, com atendimento domiciliar no pós-hospitalar e foco no retorno seguro à rotina.';

const SEO_KEYWORDS = [
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

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

const verification =
  googleSiteVerification || bingSiteVerification
    ? {
        ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
        ...(bingSiteVerification
          ? {
              other: {
                'msvalidate.01': bingSiteVerification,
              },
            }
          : {}),
      }
    : undefined;

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    types: {
      'application/ld+json': '/entity.json',
      'text/plain': '/llms.txt',
    },
  },

  applicationName: SITE_CONFIG.name,

  authors: [
    {
      name: SITE_CONFIG.professional.name,
      url: '/',
    },
  ],

  category: 'Saúde, fisioterapia e reabilitação',
  creator: SITE_CONFIG.professional.name,
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  metadataBase: SITE_URL,

  openGraph: {
    description: SEO_DESCRIPTION,
    locale: 'pt_BR',
    siteName: SITE_CONFIG.name,
    title: SEO_TITLE,
    type: 'website',
    url: '/',
  },

  publisher: SITE_CONFIG.name,

  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },

  title: {
    default: SEO_TITLE,
    template: `%s | ${SITE_CONFIG.name}`,
  },

  twitter: {
    card: 'summary_large_image',
    description: SEO_DESCRIPTION,
    title: SEO_TITLE,
  },

  ...(verification ? { verification } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = SITE_URL.toString();
  const imageUrl = new URL('/opengraph-image', SITE_URL).toString();
  const practiceId = `${siteUrl}#fisioterapia-davi-faria`;
  const professionalId = `${siteUrl}#davi-faria`;
  const websiteId = `${siteUrl}#website`;
  const webpageId = `${siteUrl}#webpage`;

  const jsonLd = {
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
          containedInPlace: {
            '@type': 'State',
            name: 'São Paulo',
          },
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

        employee: {
          '@id': professionalId,
        },

        founder: {
          '@id': professionalId,
        },

        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                description:
                  'Avaliação e acompanhamento de alterações respiratórias com cuidado individualizado.',
                name: 'Fisioterapia cardiorrespiratória',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                description:
                  'Recuperação de mobilidade, força, autonomia e segurança para as atividades da rotina.',
                name: 'Reabilitação funcional',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                description:
                  'Acompanhamento após internação, ventilação mecânica ou períodos prolongados de imobilidade.',
                name: 'Reabilitação pós-hospitalar',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                description:
                  'Atendimento fisioterapêutico no ambiente domiciliar, conforme avaliação e necessidade clínica.',
                name: 'Fisioterapia domiciliar',
              },
            },
          ],
          name: 'Atendimentos de fisioterapia',
        },

        image: imageUrl,

        keywords: SEO_KEYWORDS.join(', '),

        medicalSpecialty: [
          'https://schema.org/Physiotherapy',
          'https://schema.org/RespiratoryTherapy',
        ],

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

        mainEntityOfPage: {
          '@id': webpageId,
        },

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

      {
        '@id': websiteId,
        '@type': 'WebSite',

        alternateName: SITE_CONFIG.professional.name,
        description: SEO_DESCRIPTION,
        inLanguage: 'pt-BR',
        name: SITE_CONFIG.name,

        publisher: {
          '@id': practiceId,
        },

        url: siteUrl,
      },

      {
        '@id': webpageId,
        '@type': 'WebPage',

        about: [
          {
            '@id': practiceId,
          },
          {
            '@id': professionalId,
          },
        ],

        description: SEO_DESCRIPTION,
        inLanguage: 'pt-BR',

        isPartOf: {
          '@id': websiteId,
        },

        keywords: SEO_KEYWORDS.join(', '),

        mainEntity: {
          '@id': professionalId,
        },

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

  return (
    <html
      className={`${geistSans.variable} ${spaceGrotesk.variable} ${montserratAlternates.variable} h-full antialiased`}
      lang="pt-BR"
    >
      <body className="flex min-h-screen flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
          type="application/ld+json"
        />

        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
