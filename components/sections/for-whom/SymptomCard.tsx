import type { Symptom } from './symptoms';

import SymptomIcon from './SymptomIcon';

interface SymptomCardProps {
  index: number;
  symptom: Symptom;
}

export default function SymptomCard({ index, symptom }: SymptomCardProps) {
  const code = `DF-C${String(index + 1).padStart(2, '0')}`;

  return (
    <article className={`care-card min-w-0`}>
      <div aria-hidden="true" className="care-card-grid-pattern" />
      <div aria-hidden="true" className="care-card-accent" />

      <header className="relative z-10 flex items-start justify-between gap-4">
        <span className="care-card-icon-shell">
          <span aria-hidden="true" className="care-card-icon-status" />
          <SymptomIcon className="care-card-icon" name={symptom.icon} />
        </span>

        <div className="flex min-w-0 flex-col items-end gap-[0.45rem]">
          <span className="care-card-system-label">
            <span aria-hidden="true" className="care-card-system-dot" />
            Situação acompanhada
          </span>
          <span className="care-card-code">{code}</span>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col pt-6">
        <span className="care-card-kicker">{symptom.short}</span>

        <h3 className="care-card-title">{symptom.title}</h3>

        <p className="care-card-description">{symptom.description}</p>
      </div>

      <footer className="relative z-10 mt-5 flex items-center justify-between gap-4 border-t border-slate-300/40 pt-4">
        <div className="min-w-0">
          <span className="care-card-footer-label">Foco do cuidado</span>
          <strong className="care-card-footer-value">{symptom.readout.focus}</strong>
        </div>

        <span aria-hidden="true" className="care-card-footer-signal">
          <span />
        </span>
      </footer>
    </article>
  );
}
