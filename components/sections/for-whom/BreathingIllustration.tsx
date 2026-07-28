import type { CSSProperties, RefObject } from 'react';

interface BreathingIllustrationProps {
  className?: string;
  stageRef: RefObject<HTMLDivElement | null>;
}

const c1 = (alpha: number) => `rgba(var(--c1r), var(--c1g), var(--c1b), ${alpha})`;

const c2 = (alpha: number) => `rgba(var(--c2r), var(--c2g), var(--c2b), ${alpha})`;

const RIGHT_LOBE =
  'M300 232 C338 224 380 244 406 280 C432 316 442 360 434 402 C428 436 408 466 378 476 ' +
  'C360 482 344 476 336 460 C328 444 326 424 322 398 C316 356 314 300 312 262 ' +
  'C310 250 304 238 300 232 Z';

const RIGHT_BRONCHI =
  'M300 206 L300 236 M300 236 C314 250 326 268 334 292 M330 284 C346 296 356 312 360 332 ' +
  'M332 300 C338 322 340 346 339 368 M348 320 C356 328 362 338 365 350';

const PARTICLES = [
  { cx: 150, cy: 300, delay: 0, duration: 7.5, radius: 2.4 },
  { cx: 470, cy: 250, delay: 1.2, duration: 9, radius: 1.8 },
  { cx: 120, cy: 420, delay: 2.1, duration: 8, radius: 2 },
  { cx: 500, cy: 400, delay: 0.6, duration: 10, radius: 2.6 },
  { cx: 210, cy: 190, delay: 1.8, duration: 7, radius: 1.6 },
  { cx: 420, cy: 500, delay: 2.6, duration: 9.5, radius: 2.2 },
  { cx: 300, cy: 150, delay: 0.9, duration: 8.5, radius: 1.7 },
  { cx: 540, cy: 320, delay: 1.5, duration: 11, radius: 2 },
  { cx: 95, cy: 350, delay: 3, duration: 9, radius: 1.5 },
  { cx: 380, cy: 200, delay: 2.3, duration: 8, radius: 1.9 },
] as const;

const RIPPLES = [0, 1, 2] as const;

const DEFAULT_VARS = {
  '--breath': 0.5,
  '--c1b': 166,
  '--c1g': 184,
  '--c1r': 20,
  '--c2b': 248,
  '--c2g': 189,
  '--c2r': 56,
  '--compression': 0.72,
  '--cough': 0,
  '--flow': 0.34,
  '--glow': 0.5,
  '--lung-scale': 1,
  '--particle': 0.45,
  '--particle-dur': '8s',
  '--ripple-dur': '4s',
  '--tilt': '0deg',
  '--wave-amp': 0.5,
} as CSSProperties;

export default function BreathingIllustration({ className, stageRef }: BreathingIllustrationProps) {
  return (
    <div className={className} ref={stageRef} style={DEFAULT_VARS}>
      <div className="relative isolate h-full w-full overflow-hidden">
        <svg
          aria-hidden="true"
          className={[
            'absolute inset-0 h-full w-full origin-center overflow-visible',
            '-translate-y-[5%] scale-[1.36]',
            'min-[390px]:-translate-y-[4%] min-[390px]:scale-[1.26]',
            'sm:-translate-y-[2%] sm:scale-[1.1]',
            'lg:translate-y-0 lg:scale-100',
            'transition-transform duration-700 ease-out',
          ].join(' ')}
          fill="none"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
          viewBox="0 0 600 640"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fw-lung" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0"
                style={{
                  stopColor: c1(0.72),
                }}
              />

              <stop
                offset="0.55"
                style={{
                  stopColor: c2(0.38),
                }}
              />

              <stop
                offset="1"
                style={{
                  stopColor: c2(0.14),
                }}
              />
            </linearGradient>

            <radialGradient cx="0.5" cy="0.46" id="fw-halo" r="0.55">
              <stop
                offset="0"
                style={{
                  stopColor: c1(0.68),
                }}
              />

              <stop
                offset="0.5"
                style={{
                  stopColor: c2(0.25),
                }}
              />

              <stop
                offset="1"
                style={{
                  stopColor: 'rgba(255,255,255,0)',
                }}
              />
            </radialGradient>

            <radialGradient cx="0.5" cy="0.5" id="fw-blob" r="0.5">
              <stop
                offset="0"
                style={{
                  stopColor: c2(0.38),
                }}
              />

              <stop
                offset="1"
                style={{
                  stopColor: 'rgba(255,255,255,0)',
                }}
              />
            </radialGradient>

            <linearGradient id="fw-figure" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0"
                style={{
                  stopColor: c1(0.16),
                }}
              />

              <stop
                offset="1"
                style={{
                  stopColor: c2(0.035),
                }}
              />
            </linearGradient>

            <radialGradient cx="0.4" cy="0.32" id="fw-highlight" r="0.5">
              <stop
                offset="0"
                style={{
                  stopColor: 'rgba(255,255,255,0.6)',
                }}
              />

              <stop
                offset="1"
                style={{
                  stopColor: 'rgba(255,255,255,0)',
                }}
              />
            </radialGradient>

            <filter height="200%" id="fw-lung-glow" width="200%" x="-50%" y="-50%">
              <feGaussianBlur result="blur" stdDeviation="5" />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Guias técnicas de fundo */}
          <g fill="none" stroke="rgba(148,163,184,.13)" strokeWidth="1">
            <circle cx="300" cy="352" r="238" strokeDasharray="2 11" />

            <circle cx="300" cy="352" r="190" strokeDasharray="1 9" />

            <path d="M62 352H538M300 112V592" strokeDasharray="2 16" />
          </g>

          <g fill="rgba(148,163,184,.5)">
            <circle cx="300" cy="114" r="2" />

            <circle cx="538" cy="352" r="2" />

            <circle cx="300" cy="590" r="2" />

            <circle cx="62" cy="352" r="2" />
          </g>

          {/* Névoa orgânica */}
          <g
            style={{
              opacity: 'calc(0.5 + var(--glow, 0.5) * 0.5)',
            }}
          >
            <ellipse
              className="fw-drift-a"
              cx="200"
              cy="250"
              fill="url(#fw-blob)"
              rx="180"
              ry="150"
            />

            <ellipse
              className="fw-drift-b"
              cx="410"
              cy="420"
              fill="url(#fw-blob)"
              rx="170"
              ry="160"
            />
          </g>

          {/* Halo respiratório */}
          <ellipse
            cx="300"
            cy="352"
            fill="url(#fw-halo)"
            rx="230"
            ry="230"
            style={{
              opacity: 'var(--glow, 0.5)',
            }}
          />

          {/* Fluxo de ar */}
          <g
            style={{
              opacity: 'calc(.18 + var(--flow, .4) * .82)',
            }}
          >
            <path
              className="fw-airflow"
              d="M300 112 C286 146 314 174 300 210 L300 244"
              stroke={c2(0.9)}
              strokeDasharray="4 11"
              strokeLinecap="round"
              strokeWidth="2.4"
            />

            <path
              d="M300 238 C280 256 266 274 254 298"
              stroke={c1(0.65)}
              strokeLinecap="round"
              strokeWidth="1.5"
            />

            <path
              d="M300 238 C320 256 334 274 346 298"
              stroke={c1(0.65)}
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </g>

          {/* Ondas respiratórias */}
          <g
            style={{
              opacity: 'calc(var(--wave-amp, 0.5) * (1 - var(--cough, 0)))',
            }}
          >
            {RIPPLES.map((rippleIndex) => (
              <ellipse
                className="fw-ripple"
                cx="300"
                cy="352"
                fill="none"
                key={rippleIndex}
                rx="150"
                ry="142"
                stroke={rippleIndex % 2 === 0 ? c1(0.85) : c2(0.7)}
                strokeWidth={1.6 - rippleIndex * 0.35}
                style={{
                  animationDelay: `calc(
                    var(--ripple-dur, 4s) *
                    ${(-rippleIndex / 3).toFixed(3)}
                  )`,
                }}
              />
            ))}
          </g>

          {/* Figura e pulmões */}
          <g
            style={{
              transform: 'rotate(var(--tilt, 0deg))',
              transformBox: 'view-box',
              transformOrigin: '300px 600px',
            }}
          >
            <path
              d="
                M300 150
                C332 150 356 176 356 208
                C356 230 344 248 326 258
                C372 268 402 300 414 352
                C426 404 430 470 430 560
                L170 560
                C170 470 174 404 186 352
                C198 300 228 268 274 258
                C256 248 244 230 244 208
                C244 176 268 150 300 150
                Z
              "
              fill="url(#fw-figure)"
              stroke={c1(0.16)}
              strokeWidth="1"
              transform="translate(0, -45)"
            />

            <g
              style={{
                filter: 'url(#fw-lung-glow)',
                transform: 'scale(var(--lung-scale, 1))',
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            >
              <path d={RIGHT_LOBE} fill="url(#fw-lung)" stroke={c1(0.5)} strokeWidth="1.4" />

              <path
                d={RIGHT_LOBE}
                fill="url(#fw-lung)"
                stroke={c1(0.5)}
                strokeWidth="1.4"
                transform="translate(600 0) scale(-1 1)"
              />

              <path
                d={RIGHT_BRONCHI}
                stroke={c1(0.55)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />

              <path
                d={RIGHT_BRONCHI}
                stroke={c1(0.55)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                transform="translate(600 0) scale(-1 1)"
              />

              <ellipse cx="256" cy="322" fill="url(#fw-highlight)" rx="66" ry="58" />

              <ellipse cx="344" cy="322" fill="url(#fw-highlight)" rx="66" ry="58" />

              <g
                fill="none"
                stroke={c2(0.78)}
                strokeDasharray="3 8"
                strokeWidth="1.35"
                style={{
                  opacity: 'calc(var(--compression, .5) * .82)',
                }}
              >
                <ellipse className="fw-restriction" cx="242" cy="356" rx="83" ry="136" />

                <ellipse className="fw-restriction" cx="358" cy="356" rx="83" ry="136" />
              </g>
            </g>
          </g>

          {/* Resposta relacionada à tosse */}
          <g
            fill="none"
            stroke={c2(0.95)}
            strokeLinecap="round"
            style={{
              opacity: 'calc(var(--cough, 0) * .95)',
            }}
          >
            <path d="M184 330 132 314M416 330 468 314" strokeWidth="3" />

            <path d="M174 354 112 354M426 354 488 354" strokeWidth="2" />

            <path d="M184 378 132 394M416 378 468 394" strokeWidth="3" />
          </g>

          {/* Partículas */}
          <g
            style={{
              opacity: 'calc(var(--particle, 0.5) * (1 - var(--cough, 0) * 0.6))',
            }}
          >
            {PARTICLES.map(({ cx, cy, delay, duration, radius }, particleIndex) => (
              <circle
                className="fw-particle"
                cx={cx}
                cy={cy}
                fill={c2(0.85)}
                key={`${cx}-${cy}-${particleIndex}`}
                r={radius}
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `calc(
                      var(--particle-dur, 8s) *
                      ${(duration / 8).toFixed(2)}
                    )`,
                }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
