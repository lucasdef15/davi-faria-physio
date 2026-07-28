import { SITE_CONFIG } from '@/lib/site';

export interface AboutDataProps {
  manifesto: string;
  name: string;
  title: string;
}

export const PHYSIOTHERAPIST: AboutDataProps = {
  ...SITE_CONFIG.professional,
};
