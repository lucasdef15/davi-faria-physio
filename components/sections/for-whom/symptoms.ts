export interface BreathingProfile {
  breathDepth: number;

  breathRate: number;

  catch: number;

  compression: number;

  flow: number;

  glow: number;

  glowSwell: number;

  particle: number;

  particleSpeed: number;

  primary: RGB;

  secondary: RGB;

  sway: number;

  tilt: number;

  waveAmp: number;
}

export type RGB = readonly [number, number, number];

export interface Symptom {
  description: string;
  icon: SymptomIconName;
  id: string;
  profile: BreathingProfile;
  readout: {
    expansion: string;
    focus: string;
    rhythm: string;
  };
  short: string;
  title: string;
}

export type SymptomIconName = 'breath' | 'cough' | 'limit' | 'recovery' | 'stairs';

const TEAL: RGB = [20, 184, 166];
const SKY: RGB = [56, 189, 248];
const INDIGO: RGB = [129, 140, 248];
const EMERALD: RGB = [52, 211, 153];
const VIOLET: RGB = [167, 139, 250];
const AMBER: RGB = [251, 146, 60];

export const SYMPTOMS: Symptom[] = [
  {
    description:
      'Para quem recebeu alta após uma internação ou passagem pela UTI e precisa recuperar força, mobilidade e segurança para retomar a rotina.',
    icon: 'recovery',
    id: 'post-hospital',
    profile: {
      breathDepth: 0.088,
      breathRate: 3.8,
      catch: 0,
      compression: 0.28,
      flow: 0.66,
      glow: 0.54,
      glowSwell: 1,
      particle: 0.48,
      particleSpeed: 0.7,
      primary: EMERALD,
      secondary: TEAL,
      sway: 0.4,
      tilt: 0,
      waveAmp: 0.62,
    },
    readout: {
      expansion: 'Progressiva',
      focus: 'Retomar a autonomia',
      rhythm: 'Gradual',
    },
    short: 'Pós-hospitalar',
    title: 'Após uma internação ou passagem pela UTI',
  },
  {
    description:
      'Para pacientes que passaram por ventilação mecânica e precisam continuar a recuperação respiratória e funcional após a alta.',
    icon: 'breath',
    id: 'post-ventilation',
    profile: {
      breathDepth: 0.038,
      breathRate: 2.8,
      catch: 0,
      compression: 0.7,
      flow: 0.36,
      glow: 0.42,
      glowSwell: 0,
      particle: 0.4,
      particleSpeed: 0.58,
      primary: TEAL,
      secondary: SKY,
      sway: 0,
      tilt: 0,
      waveAmp: 0.44,
    },
    readout: {
      expansion: 'Reduzida',
      focus: 'Recuperação respiratória',
      rhythm: 'Controlado',
    },
    short: 'Pós-ventilação',
    title: 'Recuperação após ventilação mecânica',
  },
  {
    description:
      'Acompanhamento para pacientes em recuperação após um AVC, com foco na mobilidade, na capacidade funcional e na retomada da independência.',
    icon: 'limit',
    id: 'post-stroke',
    profile: {
      breathDepth: 0.062,
      breathRate: 3.2,
      catch: 0,
      compression: 0.52,
      flow: 0.48,
      glow: 0.48,
      glowSwell: 0,
      particle: 0.4,
      particleSpeed: 0.62,
      primary: INDIGO,
      secondary: SKY,
      sway: 0.7,
      tilt: 1.5,
      waveAmp: 0.52,
    },
    readout: {
      expansion: 'Individual',
      focus: 'Mobilidade e função',
      rhythm: 'Progressivo',
    },
    short: 'Pós-AVC',
    title: 'Reabilitação funcional após um AVC',
  },
  {
    description:
      'Para pessoas com DPOC, asma ou outras condições respiratórias que apresentam limitações para respirar ou realizar atividades da rotina.',
    icon: 'cough',
    id: 'respiratory-conditions',
    profile: {
      breathDepth: 0.048,
      breathRate: 3.5,
      catch: 1,
      compression: 0.78,
      flow: 0.62,
      glow: 0.48,
      glowSwell: 0,
      particle: 0.54,
      particleSpeed: 0.92,
      primary: VIOLET,
      secondary: SKY,
      sway: 0,
      tilt: -1,
      waveAmp: 0.5,
    },
    readout: {
      expansion: 'Limitada',
      focus: 'Controle respiratório',
      rhythm: 'Adaptado',
    },
    short: 'DPOC e asma',
    title: 'Convivência com condições respiratórias',
  },
  {
    description:
      'Para quem precisa continuar a reabilitação em casa, com um acompanhamento adaptado à sua condição, rotina e objetivos.',
    icon: 'stairs',
    id: 'home-care',
    profile: {
      breathDepth: 0.082,
      breathRate: 2.4,
      catch: 0,
      compression: 0.34,
      flow: 0.78,
      glow: 0.58,
      glowSwell: 0,
      particle: 0.7,
      particleSpeed: 1.15,
      primary: AMBER,
      secondary: EMERALD,
      sway: 0.8,
      tilt: 1,
      waveAmp: 0.7,
    },
    readout: {
      expansion: 'Progressiva',
      focus: 'Continuidade do cuidado',
      rhythm: 'Seguro',
    },
    short: 'Em casa',
    title: 'Continuidade da recuperação no domicílio',
  },
];
