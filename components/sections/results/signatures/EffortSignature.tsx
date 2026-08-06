import SignatureFrame from './SignatureFrame';

export default function EffortSignature() {
  return (
    <SignatureFrame code="RF-02" label="Esforço e recuperação">
      <svg className="h-full w-full" fill="none" viewBox="0 0 320 96">
        <g className="stroke-slate-200/70" data-signature-grid strokeWidth="1">
          <path d="M0 76H320" />
          <path d="M0 48H320" strokeDasharray="2 6" />
        </g>

        <g>
          <path
            className="stroke-cyan-500/25"
            d="M26 72C26 49 39 32 58 32C77 32 90 49 90 72"
            data-signature-path
            pathLength="1"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            className="stroke-cyan-600"
            d="M26 72C26 49 39 32 58 32C77 32 90 49 90 72"
            data-signature-path
            pathLength="1"
            strokeLinecap="round"
            strokeWidth="2.4"
          />

          <path
            className="stroke-sky-500/22"
            d="M104 72C104 39 121 19 144 19C167 19 184 39 184 72"
            data-signature-path
            pathLength="1"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            className="stroke-sky-600"
            d="M104 72C104 39 121 19 144 19C167 19 184 39 184 72"
            data-signature-path
            pathLength="1"
            strokeLinecap="round"
            strokeWidth="2.4"
          />

          <path
            className="stroke-blue-500/18"
            d="M198 72C198 46 213 29 234 29C255 29 270 46 270 72"
            data-signature-path
            pathLength="1"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            className="stroke-blue-600"
            d="M198 72C198 46 213 29 234 29C255 29 270 46 270 72"
            data-signature-path
            pathLength="1"
            strokeLinecap="round"
            strokeWidth="2.4"
          />
        </g>

        <path
          className="stroke-slate-300"
          d="M90 72H104M184 72H198M270 72H302"
          data-signature-path
          pathLength="1"
          strokeDasharray="3 5"
          strokeLinecap="round"
          strokeWidth="1.5"
        />

        <g className="fill-white stroke-2">
          <circle className="stroke-cyan-600" cx="58" cy="32" data-signature-node r="4" />
          <circle className="stroke-sky-600" cx="144" cy="19" data-signature-node r="4" />
          <circle className="stroke-blue-600" cx="234" cy="29" data-signature-node r="4" />
        </g>

        <g className="fill-slate-400 font-mono text-[7px] tracking-[0.12em]" data-signature-label>
          <text x="42" y="89">
            CICLO 1
          </text>
          <text x="127" y="89">
            CICLO 2
          </text>
          <text x="216" y="89">
            RECUP.
          </text>
        </g>
      </svg>
    </SignatureFrame>
  );
}

