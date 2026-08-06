import type { ReactNode } from 'react';

export default function SignatureFrame({
  children,
  code,
  label,
}: {
  children: ReactNode;
  code: string;
  label: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative mt-8 overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white/72 px-4 py-4 lg:mt-7 lg:rounded-[1.15rem] lg:bg-white/60"
      data-result-signature
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[0.54rem] font-semibold tracking-[0.16em] text-slate-400 uppercase">
          {label}
        </span>
        <span className="font-mono text-[0.52rem] tracking-[0.14em] text-slate-300 uppercase">
          {code}
        </span>
      </div>

      <div className="h-24 w-full lg:h-20">{children}</div>
    </div>
  );
}
