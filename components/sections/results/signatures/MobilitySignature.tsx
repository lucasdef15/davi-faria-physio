import SignatureFrame from './SignatureFrame';

export default function MobilitySignature() {
  return (
    <SignatureFrame code="RF-03" label="Trajetória funcional">
      <svg className="h-full w-full" fill="none" viewBox="0 0 320 96">
        <g
          className="stroke-slate-200/75"
          data-signature-grid
          strokeDasharray="2 6"
          strokeWidth="1"
        >
          <path d="M18 20H302" />
          <path d="M18 48H302" />
          <path d="M18 76H302" />
          <path d="M60 8V88" />
          <path d="M120 8V88" />
          <path d="M180 8V88" />
          <path d="M240 8V88" />
        </g>

        <path
          className="stroke-sky-500/20"
          d="M24 74C65 74 70 58 105 58C141 58 145 69 177 53C210 37 221 39 250 25C269 16 283 17 300 17"
          data-signature-path
          pathLength="1"
          strokeLinecap="round"
          strokeWidth="9"
        />
        <path
          className="stroke-sky-600"
          d="M24 74C65 74 70 58 105 58C141 58 145 69 177 53C210 37 221 39 250 25C269 16 283 17 300 17"
          data-signature-path
          pathLength="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />

        <g className="fill-white stroke-sky-600" strokeWidth="2.2">
          <circle cx="24" cy="74" data-signature-node r="4.5" />
          <circle cx="105" cy="58" data-signature-node r="4.5" />
          <circle cx="177" cy="53" data-signature-node r="4.5" />
          <circle cx="250" cy="25" data-signature-node r="4.5" />
        </g>
        <circle className="fill-sky-600" cx="300" cy="17" data-signature-node r="5" />

        <path
          className="stroke-blue-400"
          d="M289 11L300 17L291 24"
          data-signature-path
          pathLength="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />

        <g className="fill-slate-400 font-mono text-[7px] tracking-[0.12em]" data-signature-label>
          <text x="17" y="91">
            APOIO
          </text>
          <text x="92" y="51">
            CONTROLE
          </text>
          <text x="232" y="46">
            DESLOC.
          </text>
        </g>
      </svg>
    </SignatureFrame>
  );
}

