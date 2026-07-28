import type { Metadata } from 'next';

import { Geist, Montserrat_Alternates, Space_Grotesk } from 'next/font/google';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getStructuredData, SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from '@/lib/seo';
import { isPreviewDeployment, SITE_CONFIG, SITE_URL } from '@/lib/site';

import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
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

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
const isPreview = isPreviewDeployment();

const verification =
  googleSiteVerification || bingSiteVerification
    ? {
        ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
        ...(bingSiteVerification ? { other: { 'msvalidate.01': bingSiteVerification } } : {}),
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
  authors: [{ name: SITE_CONFIG.professional.name, url: '/' }],
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
  robots: isPreview
    ? { follow: false, googleBot: { follow: false, index: false }, index: false }
    : {
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
  title: { default: SEO_TITLE, template: `%s | ${SITE_CONFIG.name}` },
  twitter: { card: 'summary_large_image', description: SEO_DESCRIPTION, title: SEO_TITLE },
  ...(verification ? { verification } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = getStructuredData();

  return (
    <html
      className={`${geistSans.variable} ${spaceGrotesk.variable} ${montserratAlternates.variable} h-full antialiased`}
      lang="pt-BR"
    >
      <body className="flex min-h-screen flex-col">
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
          type="application/ld+json"
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
