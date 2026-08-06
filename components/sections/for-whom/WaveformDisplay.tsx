interface Wave {
  accent: string;
  label: string;
  path: string;
  unit: string;
  value: string;
}

const WAVES: readonly Wave[] = [
  {
    accent: '#2DD4BF',
    label: 'Pressão',
    path: 'M0 48C18 48 28 48 36 45C46 41 49 26 56 13C63 1 72 3 79 17C87 33 92 44 105 47C117 50 130 48 150 48C168 48 178 48 186 45C196 41 199 26 206 13C213 1 222 3 229 17C237 33 242 44 255 47C267 50 280 48 300 48C318 48 328 48 336 45C346 41 349 26 356 13C363 1 372 3 379 17C387 33 392 44 405 47C417 50 430 48 450 48C468 48 478 48 486 45C496 41 499 26 506 13C513 1 522 3 529 17C537 33 542 44 555 47C567 50 580 48 600 48',
    unit: 'cmH₂O',
    value: 'Ciclo assistido',
  },
  {
    accent: '#38BDF8',
    label: 'Fluxo',
    path: 'M0 31C20 31 31 30 41 26C51 22 56 8 65 6C75 4 81 17 88 28C95 40 103 50 116 51C130 52 141 41 148 33C149 32 150 31 150 31C170 31 181 30 191 26C201 22 206 8 215 6C225 4 231 17 238 28C245 40 253 50 266 51C280 52 291 41 298 33C299 32 300 31 300 31C320 31 331 30 341 26C351 22 356 8 365 6C375 4 381 17 388 28C395 40 403 50 416 51C430 52 441 41 448 33C449 32 450 31 450 31C470 31 481 30 491 26C501 22 506 8 515 6C525 4 531 17 538 28C545 40 553 50 566 51C580 52 591 41 598 33C599 32 600 31 600 31',
    unit: 'L/min',
    value: 'Inspiração / expiração',
  },
  {
    accent: '#A7F3D0',
    label: 'Volume',
    path: 'M0 51C18 51 29 49 41 43C53 37 66 21 78 14C90 8 103 12 115 25C128 39 138 49 150 51C168 51 179 49 191 43C203 37 216 21 228 14C240 8 253 12 265 25C278 39 288 49 300 51C318 51 329 49 341 43C353 37 366 21 378 14C390 8 403 12 415 25C428 39 438 49 450 51C468 51 479 49 491 43C503 37 516 21 528 14C540 8 553 12 565 25C578 39 588 49 600 51',
    unit: 'mL',
    value: 'Amplitude funcional',
  },
] as const;

function WaveSvg({ accent, path }: Pick<Wave, 'accent' | 'path'>) {
  return (
    <svg aria-hidden="true" className="monitor-wave-svg" fill="none" preserveAspectRatio="none" viewBox="0 0 600 60">
      <path d={path} opacity="0.18" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" vectorEffect="non-scaling-stroke" />
      <path d={path} stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Waveform({ accent, label, path, unit, value }: Wave) {
  return (
    <div className="monitor-wave-row" data-wave={label.toLowerCase()} data-wave-row>
      <div className="monitor-wave-label">
        <span>{label}</span>
        <small>{unit}</small>
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[0.54rem] font-medium tracking-[0.12em] text-slate-600 uppercase">{value}</span>
          <span className="flex items-center gap-1.5 text-[0.5rem] font-semibold tracking-[0.14em] text-slate-600 uppercase">
            <span className="size-1 rounded-full" style={{ backgroundColor: accent }} />
            Estável
          </span>
        </div>

        <div className="monitor-wave-viewport" data-wave-viewport>
          <svg aria-hidden="true" className="monitor-wave-guides" fill="none" preserveAspectRatio="none" viewBox="0 0 600 60">
            <path d="M0 15H600M0 30H600M0 45H600" />
            <path d="M75 0V60M150 0V60M225 0V60M300 0V60M375 0V60M450 0V60M525 0V60" />
          </svg>

          <div className="monitor-wave-track" data-wave-track>
            <WaveSvg accent={accent} path={path} />
            <WaveSvg accent={accent} path={path} />
          </div>

          <span aria-hidden="true" className="monitor-wave-fade monitor-wave-fade-left" />
          <span aria-hidden="true" className="monitor-wave-fade monitor-wave-fade-right" />
          <span aria-hidden="true" className="monitor-cursor" data-wave-cursor>
            <span />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WaveformDisplay() {
  return (
    <div className="space-y-1 px-4 py-4 sm:px-6 sm:py-5" data-wave-display>
      {WAVES.map((wave) => (
        <Waveform {...wave} key={wave.label} />
      ))}
    </div>
  );
}
