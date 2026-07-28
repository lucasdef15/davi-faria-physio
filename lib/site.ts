const deploymentHost =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  'http://localhost:3000';

const normalizedDeploymentUrl = deploymentHost.startsWith('http')
  ? deploymentHost
  : `https://${deploymentHost}`;

export const SITE_URL = new URL(normalizedDeploymentUrl);

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
