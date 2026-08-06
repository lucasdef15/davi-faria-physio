import SignatureFrame from './SignatureFrame';

export default function RoutineSignature() {
  const tiles = [
    { className: 'fill-blue-500/12 stroke-blue-500/30', x: 18, y: 18 },
    { className: 'fill-blue-500/16 stroke-blue-500/36', x: 64, y: 18 },
    { className: 'fill-cyan-500/18 stroke-cyan-500/40', x: 110, y: 18 },
    { className: 'fill-cyan-500/22 stroke-cyan-500/45', x: 156, y: 18 },
    { className: 'fill-teal-500/25 stroke-teal-500/50', x: 202, y: 18 },
    { className: 'fill-teal-500/30 stroke-teal-500/55', x: 248, y: 18 },
    { className: 'fill-blue-500/8 stroke-blue-500/22', x: 18, y: 57 },
    { className: 'fill-sky-500/12 stroke-sky-500/28', x: 64, y: 57 },
    { className: 'fill-sky-500/16 stroke-sky-500/34', x: 110, y: 57 },
    { className: 'fill-cyan-500/20 stroke-cyan-500/40', x: 156, y: 57 },
    { className: 'fill-teal-500/24 stroke-teal-500/46', x: 202, y: 57 },
    { className: 'fill-teal-600/85 stroke-teal-600', x: 248, y: 57 },
  ] as const;

  return (
    <SignatureFrame code="RF-04" label="Rotina em expansão">
      <svg className="h-full w-full" fill="none" viewBox="0 0 320 96">
        <path
          className="stroke-slate-200"
          d="M18 48H294"
          data-signature-path
          pathLength="1"
          strokeDasharray="3 6"
          strokeLinecap="round"
          strokeWidth="1"
        />

        {tiles.map((tile, tileIndex) => (
          <rect
            className={tile.className}
            data-signature-node
            height="25"
            key={`${tile.x}-${tile.y}-${tileIndex}`}
            rx="7"
            strokeWidth="1.2"
            width="34"
            x={tile.x}
            y={tile.y}
          />
        ))}

        <path
          className="stroke-teal-600"
          d="M260 69L265 74L276 62"
          data-signature-path
          pathLength="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />

        <g className="fill-slate-400 font-mono text-[7px] tracking-[0.12em]" data-signature-label>
          <text x="18" y="92">
            AUTOCUIDADO
          </text>
          <text x="121" y="92">
            TAREFAS
          </text>
          <text x="237" y="92">
            PARTICIPAÇÃO
          </text>
        </g>
      </svg>
    </SignatureFrame>
  );
}

