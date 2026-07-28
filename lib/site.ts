type SiteEnvironment = Record<string, string | undefined>;

export function getContentLastModified(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    throw new Error('NEXT_PUBLIC_CONTENT_LAST_MODIFIED must use the YYYY-MM-DD format.');
  }

  const date = new Date(`${normalizedValue}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalizedValue) {
    throw new Error('NEXT_PUBLIC_CONTENT_LAST_MODIFIED must contain a valid calendar date.');
  }

  return date;
}

export function isPreviewDeployment(environment: SiteEnvironment = process.env): boolean {
  return environment.VERCEL_ENV === 'preview';
}

export function resolveSiteUrl(environment: SiteEnvironment = process.env): URL {
  const configuredUrl = environment.NEXT_PUBLIC_SITE_URL?.trim();
  const productionHost = environment.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const isPreview = isPreviewDeployment(environment);
  const deploymentUrl = isPreview ? productionHost || configuredUrl : configuredUrl || productionHost;

  if (!deploymentUrl) {
    if (environment.VERCEL_ENV === 'production' || isPreview) {
      throw new Error('A public Production URL must be configured for Vercel deployments.');
    }

    return new URL('http://localhost:3000');
  }

  const normalizedUrl = deploymentUrl.includes('://') ? deploymentUrl : `https://${deploymentUrl}`;
  const siteUrl = new URL(normalizedUrl);

  if (!['http:', 'https:'].includes(siteUrl.protocol)) {
    throw new Error('NEXT_PUBLIC_SITE_URL must use the HTTP or HTTPS protocol.');
  }

  if (siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash || siteUrl.pathname !== '/') {
    throw new Error('NEXT_PUBLIC_SITE_URL must contain only the public site origin.');
  }

  if (environment.VERCEL_ENV === 'production' && siteUrl.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS in production.');
  }

  const isVercelPreviewHost =
    siteUrl.hostname.endsWith('.vercel.app') && siteUrl.hostname.includes('-git-');

  if (isPreview && isVercelPreviewHost) {
    throw new Error('Preview deployments must use the public Production URL as canonical.');
  }

  return siteUrl;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_CONFIG = {
  agenda: {
    href: 'https://calendly.com/davifaria/consulta-fisioterapia-cardiorrespiratoria',
    text: 'Agende uma consulta',
  },

  contact: {
    email: 'davifariafisio@gmail.com',
    location: 'Mococa, SP',
    phoneDisplay: '(19) 99112-7205',
    phoneHref: '+5519991127205',
  },

  description:
    'Reabilitação cardiorrespiratória em Mococa, SP, guiada por evidências científicas. Recupere fôlego, força e qualidade de vida com acompanhamento próximo e humano.',

  name: 'Davi Faria Physio',

  professional: {
    manifesto:
      'Acredito que a recuperação não termina no momento da alta hospitalar. Cada paciente precisa de um acompanhamento cuidadoso para recuperar sua capacidade respiratória, seus movimentos, sua segurança e sua autonomia para retomar a rotina.',
    name: 'Dr. Davi Faria',
    title: 'Fisioterapeuta com atuação hospitalar e cardiorrespiratória',
  },

  title: 'Davi Faria Physio | Fisioterapia Cardiorrespiratória em Mococa',

  whatsapp: {
    href: 'https://api.whatsapp.com/send?phone=5519991127205',
    text: 'Olá, Dr. Davi! Conheci seu trabalho pelo site e gostaria de agendar uma avaliação.',
  },
} as const;
