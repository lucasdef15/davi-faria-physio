import { SymptomIconName } from './symptoms';

const PATHS: Record<SymptomIconName, React.ReactNode> = {
  breath: (
    <>
      <path d="M3 8h9a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h13a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h7" />
    </>
  ),
  cough: (
    <>
      <path d="M4 15a4 4 0 0 1 4-4h1a3 3 0 0 0 3-3V7" />
      <path d="M8 11v6" />
      <path d="M16 7.5l2.5-1M16 11l2.8 0M16 14.5l2.5 1" />
    </>
  ),
  limit: (
    <>
      <path d="M12 21a9 9 0 1 1 9-9" />
      <path d="M12 12l4-2.5" />
      <path d="M7.5 16.5l-2 2" />
    </>
  ),
  recovery: (
    <>
      <path d="M3 12h4l2-5 3 10 2-5h5" />
    </>
  ),
  stairs: (
    <>
      <path d="M4 19h4v-4h4v-4h4V7h4" />
    </>
  ),
};

interface SymptomIconProps {
  className?: string;
  name: SymptomIconName;
}

export default function SymptomIcon({ className, name }: SymptomIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
    >
      {PATHS[name]}
    </svg>
  );
}
