import SignatureFrame from './SignatureFrame';

export default function BreathingSignature() {
  return (
    <SignatureFrame code="RF-01" label="Ritmo e pausas">
      <svg className="h-full w-full" fill="none" viewBox="0 0 320 96">
        <g className="stroke-slate-200/75" data-signature-grid strokeWidth="1">
          <path d="M0 24H320" />
          <path d="M0 48H320" />
          <path d="M0 72H320" />
          <path d="M40 0V96" />
          <path d="M80 0V96" />
          <path d="M120 0V96" />
          <path d="M160 0V96" />
          <path d="M200 0V96" />
          <path d="M240 0V96" />
          <path d="M280 0V96" />
        </g>

        <path
          className="fill-teal-500/10"
          d="M0 60H18C29 60 31 31 45 31C58 31 60 72 76 72C91 72 94 60 108 60H142C154 60 158 38 170 38C183 38 188 68 201 68C216 68 219 60 232 60H320V96H0Z"
          data-signature-fill
        />
        <path
          className="stroke-teal-600"
          d="M0 60H18C29 60 31 31 45 31C58 31 60 72 76 72C91 72 94 60 108 60H142C154 60 158 38 170 38C183 38 188 68 201 68C216 68 219 60 232 60H320"
          data-signature-path
          pathLength="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
        <path
          className="stroke-cyan-400/55"
          d="M108 60H142M232 60H278"
          data-signature-path
          pathLength="1"
          strokeDasharray="3 5"
          strokeLinecap="round"
          strokeWidth="1.5"
        />

        <circle className="fill-teal-600" cx="45" cy="31" data-signature-node r="3.5" />
        <circle className="fill-cyan-500" cx="170" cy="38" data-signature-node r="3.5" />

        <g className="fill-slate-400 font-mono text-[7px] tracking-[0.14em]" data-signature-label>
          <text x="31" y="18">
            IN
          </text>
          <text x="111" y="52">
            PAUSA
          </text>
          <text x="157" y="25">
            EX
          </text>
        </g>
      </svg>
    </SignatureFrame>
  );
}

