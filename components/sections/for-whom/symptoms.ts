export interface Symptom {
  description: string;
  icon: SymptomIconName;
  id: string;
  readout: {
    focus: string;
  };
  short: string;
  title: string;
}

export type SymptomIconName = 'breath' | 'cough' | 'limit' | 'recovery' | 'stairs';

export const SYMPTOMS: Symptom[] = [
  {
    description:
      'Para quem recebeu alta após uma internação ou passagem pela UTI e precisa recuperar força, mobilidade e segurança para retomar a rotina.',
    icon: 'recovery',
    id: 'post-hospital',
    readout: {
      focus: 'Retomar a autonomia',
    },
    short: 'Pós-hospitalar',
    title: 'Após uma internação ou passagem pela UTI',
  },
  {
    description:
      'Para pacientes que passaram por ventilação mecânica e precisam continuar a recuperação respiratória e funcional após a alta.',
    icon: 'breath',
    id: 'post-ventilation',
    readout: {
      focus: 'Recuperação respiratória',
    },
    short: 'Pós-ventilação',
    title: 'Recuperação após ventilação mecânica',
  },
  {
    description:
      'Acompanhamento para pacientes em recuperação após um AVC, com foco na mobilidade, na capacidade funcional e na retomada da independência.',
    icon: 'limit',
    id: 'post-stroke',
    readout: {
      focus: 'Mobilidade e função',
    },
    short: 'Pós-AVC',
    title: 'Reabilitação funcional após um AVC',
  },
  {
    description:
      'Para pessoas com DPOC, asma ou outras condições respiratórias que apresentam limitações para respirar ou realizar atividades da rotina.',
    icon: 'cough',
    id: 'respiratory-conditions',
    readout: {
      focus: 'Controle respiratório',
    },
    short: 'DPOC e asma',
    title: 'Convivência com condições respiratórias',
  },
  {
    description:
      'Para quem precisa continuar a reabilitação em casa, com um acompanhamento adaptado à sua condição, rotina e objetivos.',
    icon: 'stairs',
    id: 'home-care',
    readout: {
      focus: 'Continuidade do cuidado',
    },
    short: 'Em casa',
    title: 'Continuidade da recuperação no domicílio',
  },
  {
    description:
      'Para pacientes em recuperação de cirurgias ortopédicas ou gerais, focando no alívio, ganho de força e retorno seguro aos movimentos do dia a dia.',
    icon: 'recovery',
    id: 'post-surgery',
    readout: {
      focus: 'Restauração motora',
    },
    short: 'Pós-operatório',
    title: 'Recuperação pós-cirúrgica',
  },
];
