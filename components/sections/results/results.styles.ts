export const RESULT_ACCENTS = [
  {
    glow: 'from-teal-400/24 via-cyan-300/10 to-transparent',
    node: 'border-teal-200 bg-teal-600 shadow-[0_0_0_5px_rgba(20,184,166,0.10)]',
    number: 'text-teal-700',
    surface: 'from-teal-50/85 via-white to-white',
  },
  {
    glow: 'from-cyan-400/20 via-sky-300/10 to-transparent',
    node: 'border-cyan-200 bg-cyan-600 shadow-[0_0_0_5px_rgba(6,182,212,0.10)]',
    number: 'text-cyan-700',
    surface: 'from-cyan-50/80 via-white to-white',
  },
  {
    glow: 'from-sky-400/20 via-blue-300/10 to-transparent',
    node: 'border-sky-200 bg-sky-600 shadow-[0_0_0_5px_rgba(14,165,233,0.10)]',
    number: 'text-sky-700',
    surface: 'from-sky-50/80 via-white to-white',
  },
  {
    glow: 'from-blue-400/18 via-teal-300/10 to-transparent',
    node: 'border-blue-200 bg-blue-600 shadow-[0_0_0_5px_rgba(37,99,235,0.10)]',
    number: 'text-blue-700',
    surface: 'from-blue-50/75 via-white to-white',
  },
] as const;

export type ResultAccent = (typeof RESULT_ACCENTS)[number];
