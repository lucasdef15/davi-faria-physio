import { PILLARS } from './works.data';

type Pillar = (typeof PILLARS)[number];

interface ApproachItemProps {
  number: string;
  pillar: Pillar;
}

export default function ApproachItem({ number, pillar }: ApproachItemProps) {
  return (
    <li className="group relative border-b border-slate-200/80 last:border-b-0">
      <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-6 sm:py-9 lg:grid-cols-[3.5rem_minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-x-7 lg:py-10">
        <span className="row-span-2 pt-1 font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-slate-300 transition-colors group-hover:text-teal-600/70 lg:row-span-1">
          {number}
        </span>

        <h3 className="font-space-grotesk max-w-sm text-lg leading-[1.2] font-semibold tracking-[-0.025em] text-slate-950 sm:text-xl">
          {pillar.title}
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 lg:mt-0 lg:pr-5">
          {pillar.description}
        </p>
      </div>

      <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-0 bg-teal-500 transition-[width] duration-500 group-hover:w-24" />
    </li>
  );
}
