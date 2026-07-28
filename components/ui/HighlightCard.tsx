import type { ReactNode } from 'react';

interface HighlightCardProps {
  className?: string;
  description: string;
  eyebrow: string;
  icon: ReactNode;
  title: string;
}
export function HighlightCard({
  className = '',
  description,
  eyebrow,
  icon,
  title,
}: HighlightCardProps) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.12),0_20px_40px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-600 shadow-inner"
      >
        {icon}
      </div>

      <div className="space-y-0.5">
        <span className="block text-[10px] font-bold tracking-[0.16em] text-teal-700/80 uppercase">
          {eyebrow}
        </span>
        <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="text-xs leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}
